# ARTEMIS 소개 사이트

사내 AI 프롬프트 백과사전 ARTEMIS 의 소개(랜딩) 페이지.
기능 목록이 아니라 **판단의 근거**를 보여 준다 — 무엇을 막고, 왜 그 순서로 만들었고, 아직 무엇이 없는지.

페이지 전체가 **한 프롬프트의 일생**(복사본 → production)이다. 스크롤 진행이 곧 프롬프트의 상태이고,
그 상태가 지면 색과 배경 3D 별자리(흩어짐 · 모임 · 라벨 · 배포 채널)를 함께 정한다.

**Nuxt 4 · Vue 3.5 · TypeScript · three.js · 정적 생성.**
콘솔(Artemis-History-Interface 의 `apps/web`)과 같은 Nuxt · Vue 버전을 쓰되, 독립된 저장소다.

- 시각 세계 · 토큰 · 컴포넌트 규칙: [`DESIGN.md`](./DESIGN.md)
- 제품 사실의 원본: 본 저장소의 `docs/기획서.html` 과 코드 — 이 페이지는 그것을 옮길 뿐이다

## 실행

```bash
pnpm install

pnpm dev          # 개발 서버 (http://127.0.0.1:3120)
pnpm build        # 정적 생성 → .output/public
pnpm preview      # .output/public 을 정적 서버로 미리보기 (같은 3120)
pnpm typecheck    # vue-tsc
```

> `.output/public/index.html` 을 더블클릭해 열지 마십시오. 스크립트가 `/_nuxt/...` 절대 경로라 `file://` 에서는 전부 깨집니다.
> 정적 사이트 공통 문제이고, `pnpm preview` 로 여십시오.

## 구조

```
app/
  app.vue                      구성만 한다 — 구간 순서
  components/
    stations/*.vue             구간 하나 = 파일 하나. 각 구간이 자기 카피를 소유한다
    gate/GatePlayground.vue    라벨 이동 판정기 — 이 페이지에서 유일하게 상태가 있는 화면
    flow/FlowScene.vue         스크롤 엔진 — 레일 · 캔버스 가시성 · 등장 모션 · 3D 단계
    site/                      헤더 · 푸터 · 로고 · 아이콘
  lib/
    stations.ts                구간 목록 (레일 눈금과 3D 단계가 여기서 나온다)
    gates.ts                   ★ 승격 게이트 판정 — 서버 services.py 이식
    constellation.ts           ★ 배경 3D "프롬프트 별자리"
    brand-logo.ts              로고 도형 (본 저장소 brand/ 산출물 복사본)
  assets/css/main.css          토큰 · 밴드 · 컴포넌트 전부
  assets/fonts/                Pretendard (OFL, 자가호스팅 — 외부 CDN 을 부르지 않는다)
```

## 코드와 어긋나면 안 되는 곳

소개 페이지가 코드와 다른 말을 하면 안 된다. 본 저장소에서 아래가 바뀌면 여기도 함께 고친다.

| 이 저장소 | 본 저장소의 원본 |
|---|---|
| `app/lib/gates.ts` 판정 순서 · 기준 · 문구 | `apps/api/artemis/prompts/services.py` — `move_label()` · `evaluate_promotion_gates()` |
| `Immutable.vue` 모델 클래스 표 | `apps/api/artemis/registry/management/commands/seed_models.py` |
| `Anatomy.vue` 공식 프롬프트 9개 · prd-writer 변수 | `apps/api/artemis/prompts/management/commands/seed_prompts.py` |
| `Delivery.vue` 채널 상태 · `constellation.ts` 채운 점/빈 고리 | README "아직 구현되지 않은 것" |
| `Later.vue` 못 하는 것 | 같은 README 목록 |
| `Eval.vue` 기준 원장 | `docs/기획서.html` 11-2 · `services.py` |

시연용 값(API 응답 예시 · 버전 기록 · 판정기 입력)은 화면과 푸터에 시연용이라고 적어 두었다.

## 배포

`main` 에 푸시하면 [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) 이 타입 검사 · 정적 생성 후 GitHub Pages 에 올린다.
PR 에서는 빌드까지만 돈다.

- **저장소가 public 이어야 한다.** free 플랜 조직은 private 저장소에 Pages 를 쓸 수 없다.
- **서브경로.** 프로젝트 사이트는 `https://<org>.github.io/<저장소명>/` 아래에서 서빙되므로, 워크플로가
  `actions/configure-pages` 의 `base_path` 를 `NUXT_APP_BASE_URL` 로 넘긴다. 로컬은 `/` 그대로다.
- 콘솔 주소는 `nuxt.config.ts` 의 `runtimeConfig.public.consoleUrl` 이다 (`NUXT_PUBLIC_CONSOLE_URL` 로 덮어쓴다).
