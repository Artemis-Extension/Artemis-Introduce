<script setup lang="ts">
/**
 * 라벨 이동 판정기.
 *
 * 이 페이지에서 유일하게 진짜 상태가 있는 자리다. 입력 7개를 바꾸면 서버와 같은 순서로
 * 권한 → 게이트를 판정하고, 서버가 돌려줄 상태 코드와 문구를 그대로 보여 준다.
 * 판정 자체는 app/lib/gates.ts 에 있다 — 여기는 그리기만 한다.
 */
import {
  MIN_TEST_CASES,
  TODAY,
  judge,
  type Check,
  type GateInput,
  type LabelName,
  type ModelStatus,
  type Role,
  type ScoreDelta,
} from "~/lib/gates";

type Option<T> = { v: T; label: string };

const ROLES: Option<Role>[] = [
  { v: "viewer", label: "viewer" },
  { v: "editor", label: "editor" },
  { v: "approver", label: "approver" },
  { v: "admin", label: "admin" },
];
const LABELS: Option<LabelName>[] = [
  { v: "staging", label: "staging" },
  { v: "production", label: "production" },
];
const CASES: Option<number>[] = [0, MIN_TEST_CASES - 1, MIN_TEST_CASES, 24].map((v) => ({ v, label: `${v}건` }));
const RUNS: Option<boolean>[] = [
  { v: false, label: "없음" },
  { v: true, label: "있음" },
];
const ASSERTIONS: Option<boolean>[] = [
  { v: true, label: "전부 통과" },
  { v: false, label: "1건 실패" },
];
const DELTAS: Option<ScoreDelta>[] = [
  { v: null, label: "기준선 없음" },
  { v: 1.2, label: "+1.2%" },
  { v: -2.4, label: "−2.4%" },
  { v: -4.8, label: "−4.8%" },
];
const MODELS: Option<ModelStatus>[] = [
  { v: "active", label: "active" },
  { v: "deprecated", label: "deprecated" },
  { v: "retired", label: "retired" },
];

const PASSING: GateInput = {
  role: "approver",
  label: "production",
  testCases: 24,
  hasRuns: true,
  assertionsPassed: true,
  scoreDelta: 1.2,
  model: "active",
};

const state = reactive<GateInput>({ ...TODAY });
const verdict = computed(() => judge(state));

const isToday = computed(() => (Object.keys(TODAY) as Array<keyof GateInput>).every((k) => state[k] === TODAY[k]));
const gatesApply = computed(() => state.label === "production");

/** 권한에서 멈추면 게이트 줄은 '판정 안 함'으로 그린다 — 서버도 거기서 멈춘다 */
const rows = computed<Check[]>(() => {
  if (!gatesApply.value) return [];
  if (verdict.value.kind === "denied") {
    return [
      "골든 테스트셋 10건 이상",
      "이 버전의 Eval 실행",
      "규칙 assertion 100% 통과",
      "Judge 점수 회귀 -3.0% 이내",
      "EOL 이 지나지 않은 모델",
    ].map((label, i) => ({ key: `denied-${i}`, label, state: "skip", detail: "권한에서 먼저 멈춰서 판정하지 않아요." }));
  }
  return verdict.value.checks;
});

const permission = computed(() => {
  const v = verdict.value;
  if (v.kind === "denied") return { state: "fail" as const, detail: v.message };
  return {
    state: "pass" as const,
    detail: state.label === "production" ? "approver 이상이라 production 을 옮길 수 있어요." : "editor 이상이라 staging 을 옮길 수 있어요.",
  };
});

const permissionLabel = computed(() => (state.label === "production" ? "approver 이상" : "editor 이상"));

function set<K extends keyof GateInput>(key: K, value: GateInput[K]) {
  state[key] = value;
}

function load(preset: GateInput) {
  Object.assign(state, preset);
}

const ICON = { pass: "#i-pass", fail: "#i-fail", skip: "#i-skip" } as const;
const STATE_TEXT = { pass: "통과", fail: "막힘", skip: "판정 안 함" } as const;
</script>

<template>
  <div class="play">
    <div class="play__controls">
      <div class="ctl">
        <div class="ctl__top"><span class="ctl__name">누가 옮기나</span><span class="ctl__code inst">role</span></div>
        <div class="seg" role="group" aria-label="역할">
          <button v-for="o in ROLES" :key="o.v" type="button" :aria-pressed="state.role === o.v" @click="set('role', o.v)">{{ o.label }}</button>
        </div>
      </div>

      <div class="ctl">
        <div class="ctl__top"><span class="ctl__name">어느 라벨로</span><span class="ctl__code inst">label</span></div>
        <div class="seg" role="group" aria-label="옮길 라벨">
          <button v-for="o in LABELS" :key="o.v" type="button" :aria-pressed="state.label === o.v" @click="set('label', o.v)">{{ o.label }}</button>
        </div>
      </div>

      <fieldset class="ctl-group" :disabled="!gatesApply">
        <legend class="ctl-group__legend">
          승격 게이트 입력
          <span v-if="!gatesApply">— staging 은 게이트를 보지 않아요</span>
        </legend>

        <div class="ctl">
          <div class="ctl__top"><span class="ctl__name">골든 테스트셋</span><span class="ctl__code inst">test_cases</span></div>
          <div class="seg" role="group" aria-label="골든 테스트셋 건수">
            <button v-for="o in CASES" :key="o.v" type="button" :aria-pressed="state.testCases === o.v" @click="set('testCases', o.v)">{{ o.label }}</button>
          </div>
        </div>

        <div class="ctl">
          <div class="ctl__top"><span class="ctl__name">이 버전의 Eval 실행</span><span class="ctl__code inst">eval_runs</span></div>
          <div class="seg" role="group" aria-label="Eval 실행 기록">
            <button v-for="o in RUNS" :key="String(o.v)" type="button" :aria-pressed="state.hasRuns === o.v" @click="set('hasRuns', o.v)">{{ o.label }}</button>
          </div>
        </div>

        <div class="ctl" :class="{ 'ctl--off': !state.hasRuns }">
          <div class="ctl__top"><span class="ctl__name">규칙 assertion</span><span class="ctl__code inst">assertions</span></div>
          <div class="seg" role="group" aria-label="규칙 assertion 결과">
            <button
              v-for="o in ASSERTIONS"
              :key="String(o.v)"
              type="button"
              :disabled="!state.hasRuns"
              :aria-pressed="state.assertionsPassed === o.v"
              @click="set('assertionsPassed', o.v)"
            >
              {{ o.label }}
            </button>
          </div>
        </div>

        <div class="ctl" :class="{ 'ctl--off': !state.hasRuns }">
          <div class="ctl__top"><span class="ctl__name">Judge 점수 · 기준선 대비</span><span class="ctl__code inst">regression</span></div>
          <div class="seg seg--4" role="group" aria-label="Judge 점수 변화">
            <button
              v-for="o in DELTAS"
              :key="String(o.v)"
              type="button"
              :disabled="!state.hasRuns"
              :aria-pressed="state.scoreDelta === o.v"
              @click="set('scoreDelta', o.v)"
            >
              {{ o.label }}
            </button>
          </div>
        </div>

        <div class="ctl">
          <div class="ctl__top"><span class="ctl__name">모델 상태</span><span class="ctl__code inst">model_eol</span></div>
          <div class="seg" role="group" aria-label="모델 상태">
            <button v-for="o in MODELS" :key="o.v" type="button" :aria-pressed="state.model === o.v" @click="set('model', o.v)">{{ o.label }}</button>
          </div>
        </div>
      </fieldset>

      <div class="play__presets">
        <button type="button" class="play__reset" @click="load(TODAY)">지금 저장소 상태로</button>
        <button type="button" class="play__reset" @click="load(PASSING)">전부 통과하는 조합</button>
      </div>
    </div>

    <div class="play__out">
      <p class="req inst">
        <span class="req__m">PUT</span> /api/v1/prompts/prd-writer/labels/<b>{{ state.label }}</b>
      </p>

      <div class="board" role="table" aria-label="라벨 이동 판정">
        <div class="check" role="row" :data-state="permission.state">
          <svg class="check__i" aria-hidden="true"><use :href="ICON[permission.state]" /></svg>
          <div class="check__body" role="cell">
            <span class="check__label">권한 · {{ permissionLabel }}</span>
            <span class="check__detail">{{ permission.detail }}</span>
          </div>
          <span class="check__state" role="cell">{{ STATE_TEXT[permission.state] }}</span>
        </div>
        <div v-for="c in rows" :key="c.key" class="check" role="row" :data-state="c.state">
          <svg class="check__i" aria-hidden="true"><use :href="ICON[c.state]" /></svg>
          <div class="check__body" role="cell">
            <span class="check__label">{{ c.label }}</span>
            <span v-if="c.state !== 'pass'" class="check__detail">{{ c.detail }}</span>
          </div>
          <span class="check__state" role="cell">{{ STATE_TEXT[c.state] }}</span>
        </div>
      </div>

      <div class="verdict" :data-kind="verdict.kind" aria-live="polite">
        <template v-if="verdict.kind === 'moved'">
          <p class="verdict__code inst">200</p>
          <div>
            <p class="verdict__t">{{ state.label }} 라벨이 v3 을 가리켜요.</p>
            <p class="verdict__d">
              감사 로그에 <code>LABEL_MOVED</code> 가 이전 버전과 함께 남아요.<template v-if="state.label === 'production'">
                프롬프트는 Production Tier 로 바뀌어요.</template
              >
            </p>
          </div>
        </template>
        <template v-else-if="verdict.kind === 'denied'">
          <p class="verdict__code inst">403</p>
          <div>
            <p class="verdict__t">라벨이 움직이지 않아요.</p>
            <p class="verdict__d">{{ verdict.message }}</p>
          </div>
        </template>
        <template v-else>
          <p class="verdict__code inst">400</p>
          <div>
            <p class="verdict__t">배포가 막혔어요 — 서버가 돌려주는 사유 {{ verdict.errors.length }}개</p>
            <ul class="verdict__errors">
              <li v-for="e in verdict.errors" :key="e">{{ e }}</li>
            </ul>
          </div>
        </template>
      </div>

      <p class="fine" style="margin-top: var(--s3)">
        <template v-if="isToday">
          지금 이 조합이 저장소의 실제 모습이에요. 테스트셋을 만드는 화면이 아직 없어서 production 은 항상 막혀요 — 버그가 아니라 의도한 동작이에요.
        </template>
        <template v-else>
          입력값은 시연용이에요. 판정 순서와 서버 문구는 <code>apps/api/artemis/prompts/services.py</code> 와 같아요.
        </template>
      </p>
    </div>
  </div>
</template>
