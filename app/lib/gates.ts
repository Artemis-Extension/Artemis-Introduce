/**
 * 라벨 이동 판정기 — 서버 규칙을 그대로 옮겼다.
 *
 *   권한      apps/api/artemis/prompts/services.py  move_label()
 *   게이트    apps/api/artemis/prompts/services.py  evaluate_promotion_gates()
 *   EOL      apps/api/artemis/registry/models.py   ModelRegistry.blocks_promotion
 *
 * 문구도 서버가 돌려주는 원문이다(합니다체). 페이지의 다른 문장과 말투가 다른 이유다.
 * 서버 규칙이 바뀌면 이 파일도 함께 바꾼다 — 소개 페이지가 코드와 다른 말을 하면 안 된다.
 *
 * 기획서 11-2 에 있는 "비용 증가율 +20%" · "P95 지연" 경고는 아직 서버에 없어서 여기에도 없다.
 */

// services.py 의 상수와 같다
export const MIN_TEST_CASES = 10;
export const MAX_SCORE_REGRESSION_PCT = 3.0;

/** 공식 프롬프트 prd-writer 의 모델 클래스(high)를 레지스트리가 해석한 값 — seed_models.py */
export const MODEL_ID = "claude-opus-5";

export type Role = "viewer" | "editor" | "approver" | "admin";
export type LabelName = "staging" | "production";
export type ModelStatus = "active" | "deprecated" | "retired";
/** 현재 production 버전의 Judge 평균 점수 대비 이 버전의 점수 변화(%). null 이면 기준선 없음(첫 배포) */
export type ScoreDelta = number | null;

export type GateInput = {
  role: Role;
  label: LabelName;
  testCases: number;
  hasRuns: boolean;
  assertionsPassed: boolean;
  scoreDelta: ScoreDelta;
  model: ModelStatus;
};

export type CheckState = "pass" | "fail" | "skip";

export type Check = {
  key: string;
  label: string;
  state: CheckState;
  /** 실패하면 서버가 돌려주는 문구, 건너뛰면 건너뛴 이유 */
  detail: string;
};

export type Verdict =
  | { kind: "moved"; checks: Check[] }
  | { kind: "denied"; status: 403; message: string; checks: Check[] }
  | { kind: "blocked"; status: 400; errors: string[]; checks: Check[] };

const canEdit = (role: Role) => role === "editor" || role === "approver" || role === "admin";
const canApprove = (role: Role) => role === "approver" || role === "admin";

/** Python f"{x:.1f}" 과 같은 모양 */
const fixed1 = (n: number) => n.toFixed(1);

export function evaluateGates(input: GateInput): Check[] {
  const checks: Check[] = [];

  checks.push({
    key: "test_cases",
    label: `골든 테스트셋 ${MIN_TEST_CASES}건 이상`,
    state: input.testCases >= MIN_TEST_CASES ? "pass" : "fail",
    detail: `골든 테스트셋이 ${MIN_TEST_CASES}건 이상 필요합니다. (현재 ${input.testCases}건)`,
  });

  checks.push({
    key: "eval_runs",
    label: "이 버전의 Eval 실행",
    state: input.hasRuns ? "pass" : "fail",
    detail: "이 버전에 대한 Eval 실행 기록이 없습니다.",
  });

  // 서버는 실행 기록이 있을 때만 아래 두 줄을 만든다
  if (input.hasRuns) {
    checks.push({
      key: "assertions",
      label: "규칙 assertion 100% 통과",
      state: input.assertionsPassed ? "pass" : "fail",
      detail: "규칙 assertion 통과율이 100%가 아닙니다.",
    });

    if (input.scoreDelta === null) {
      checks.push({
        key: "regression",
        label: `Judge 점수 회귀 -${fixed1(MAX_SCORE_REGRESSION_PCT)}% 이내`,
        state: "skip",
        detail: "지금 production 버전이 없어 비교할 기준선이 없어요. 서버도 이 줄을 만들지 않아요.",
      });
    } else {
      checks.push({
        key: "regression",
        label: `Judge 점수 회귀 -${fixed1(MAX_SCORE_REGRESSION_PCT)}% 이내`,
        state: input.scoreDelta >= -MAX_SCORE_REGRESSION_PCT ? "pass" : "fail",
        detail:
          `Judge 점수가 기준선 대비 ${fixed1(input.scoreDelta)}% 회귀했습니다 ` +
          `(허용 -${fixed1(MAX_SCORE_REGRESSION_PCT)}%).`,
      });
    }
  } else {
    for (const [key, label] of [
      ["assertions", "규칙 assertion 100% 통과"],
      ["regression", `Judge 점수 회귀 -${fixed1(MAX_SCORE_REGRESSION_PCT)}% 이내`],
    ] as const) {
      checks.push({
        key,
        label,
        state: "skip",
        detail: "실행 기록이 없으면 잴 수 없어서, 서버는 이 줄을 만들지 않아요.",
      });
    }
  }

  // deprecated 는 배지만 붙고 막지 않는다. retired(또는 EOL 날짜 경과)만 막는다
  checks.push({
    key: "model_eol",
    label: "EOL 이 지나지 않은 모델",
    state: input.model === "retired" ? "fail" : "pass",
    detail: `'${MODEL_ID}'는 EOL 도달 모델입니다. 마이그레이션이 필요합니다. (7-2)`,
  });

  return checks;
}

export function judge(input: GateInput): Verdict {
  // move_label() 순서 그대로 — 권한에서 막히면 게이트까지 가지 않는다
  if (!canEdit(input.role)) {
    return { kind: "denied", status: 403, message: "라벨 이동에는 editor 이상의 권한이 필요합니다. (12장)", checks: [] };
  }

  if (input.label === "staging") {
    return { kind: "moved", checks: [] };
  }

  if (!canApprove(input.role)) {
    return { kind: "denied", status: 403, message: "production 라벨 이동은 approver 권한이 필요합니다. (12장)", checks: [] };
  }

  const checks = evaluateGates(input);
  const errors = checks.filter((c) => c.state === "fail").map((c) => c.detail);
  return errors.length ? { kind: "blocked", status: 400, errors, checks } : { kind: "moved", checks };
}

/** 지금 저장소의 실제 상태 — 테스트셋을 만드는 화면이 없어 production 이 항상 막힌다 */
export const TODAY: GateInput = {
  role: "approver",
  label: "production",
  testCases: 0,
  hasRuns: false,
  assertionsPassed: true,
  scoreDelta: null,
  model: "active",
};
