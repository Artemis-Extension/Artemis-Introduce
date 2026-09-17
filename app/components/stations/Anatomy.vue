<!-- 기획서 5장 · 8-1 · 공식 프롬프트(seed_prompts.py) -->
<script setup lang="ts">
const VARIABLES = [
  { name: "PRODUCT_CONTEXT", required: true, max: "2,000" },
  { name: "PROBLEM", required: true, max: "4,000" },
  { name: "TARGET_USERS", required: true, max: "2,000" },
  { name: "CONSTRAINTS", required: true, max: "3,000" },
  { name: "REFERENCE_MATERIALS", required: false, max: "8,000" },
];

const CATALOG = [
  { slug: "prd-writer", area: "프로덕트", io: "문제 · 대상 · 제약 → 가설 · 범위 · 인수 조건 · 지표가 담긴 PRD" },
  { slug: "user-research-synthesis", area: "프로덕트", io: "인터뷰 · VOC 원문 → 인용 근거가 붙은 인사이트와 기회 영역" },
  { slug: "ux-flow-spec", area: "디자인", io: "기능 요구사항 → 사용자 흐름 · 화면별 상태 · 엣지 케이스" },
  { slug: "design-review", area: "디자인", io: "화면 설명 → WCAG 2.2 AA 기준의 심각도별 이슈와 개선안" },
  { slug: "meeting-to-actions", area: "전사 공통", io: "회의록 → 결정 · 액션 아이템 · 미결 쟁점 · 공유용 요약" },
  { slug: "business-writing", area: "전사 공통", io: "목적 · 독자 · 핵심 내용 → 두괄식 보고서 · 이메일 · 공지" },
  { slug: "backend-bootstrap", area: "백엔드", io: "서비스 요구사항 → 스택 결정부터 검증 체크리스트까지" },
  { slug: "frontend-bootstrap", area: "프론트엔드", io: "앱 요구사항 → 렌더링 전략 · 인증(BFF) · 성능 예산" },
  { slug: "mobile-bootstrap", area: "모바일", io: "앱 요구사항 → 아키텍처 · 오프라인 · 푸시 · 배포" },
];
</script>

<template>
  <section
    id="anatomy"
    class="station"
    data-stamp="v1"
    data-band="light"
    data-from
    style="--ground: var(--st-anatomy); --from: var(--st-wedge)"
  >
    <div class="shell">
      <div class="station__head">
        <div data-in>
          <p class="stamp"><span class="stamp__t inst">v1</span></p>
          <h2 class="h2">글 한 덩어리가 아니라<br />구조로 저장해요</h2>
        </div>
        <p class="body" data-in>
          프롬프트는 역할별 메시지, 입력 변수의 규격, 모델 설정으로 나뉘어 저장돼요. 복사할 때 빠뜨릴 것이 없고, 실행하기 전에 <strong>서버가 검사할 수 있어요.</strong>
        </p>
      </div>

      <div class="anatomy">
        <ol class="parts">
          <li class="part" data-in>
            <span class="part__code inst">messages</span>
            <div>
              <h3 class="h4">역할별 메시지</h3>
              <p>system · user · assistant 를 나눠 저장해요. 시스템 지시와 사용자 입력이 한 문자열에 섞이지 않아요.</p>
            </div>
          </li>
          <li class="part" data-in>
            <span class="part__code inst">variables_schema</span>
            <div>
              <h3 class="h4">입력 변수 규격</h3>
              <p>이름 · 형식 · 필수 여부 · 최대 길이를 적어 둬요. 빠진 필수값, 정의 안 된 변수, 길이 초과는 실행 전에 막혀요.</p>
            </div>
          </li>
          <li class="part" data-in>
            <span class="part__code inst">&lt;user_input:NAME&gt;</span>
            <div>
              <h3 class="h4">구분자로 감싼 주입</h3>
              <p>사용자 입력은 원문 그대로 끼워 넣지 않고 구분자로 감싸요. 입력 안에 닫는 태그를 흉내 내면 그 부분을 지워요.</p>
            </div>
          </li>
          <li class="part" data-in>
            <span class="part__code inst">model_config</span>
            <div>
              <h3 class="h4">모델 클래스와 effort</h3>
              <p>특정 모델 이름이 아니라 고성능 · 균형 · 경량 클래스에 묶어요. 실제 모델은 레지스트리가 정해요.</p>
            </div>
          </li>
        </ol>

        <!-- 콘솔 화면 목업 — 콘솔의 라이트 토큰을 그대로 쓴다. 값은 공식 프롬프트 prd-writer 원문 -->
        <figure class="mock" data-in aria-label="콘솔의 프롬프트 상세 화면 (공식 프롬프트 prd-writer)">
          <div class="mock__bar">
            <span class="mock__chip">Product / PRD</span>
            <span class="mock__label">staging · v1</span>
          </div>
          <p class="mock__title">PRD 작성</p>
          <p class="mock__slug">prd-writer</p>

          <p class="mock__h">메시지</p>
          <div class="mock__msg">
            <span class="mock__role">system</span>
            <p>당신은 10년차 프로덕트 매니저입니다. 흩어진 문제 인식과 요구를 개발·디자인·QA가 추가 회의 없이 바로 착수할 수 있는 PRD로 만드는 것이 임무입니다. …</p>
          </div>
          <div class="mock__msg">
            <span class="mock__role">user</span>
            <p>&lt;제품_맥락&gt; <b v-pre>{{PRODUCT_CONTEXT}}</b> &lt;/제품_맥락&gt; &lt;문제&gt; <b v-pre>{{PROBLEM}}</b> &lt;/문제&gt; …</p>
          </div>

          <p class="mock__h">변수</p>
          <ul class="mock__vars">
            <li v-for="v in VARIABLES" :key="v.name">
              <code>{{ v.name }}</code>
              <span>string</span>
              <span :class="v.required ? 'is-req' : ''">{{ v.required ? "필수" : "선택" }}</span>
              <span>최대 {{ v.max }}자</span>
            </li>
          </ul>

          <p class="mock__h">모델</p>
          <p class="mock__model">고성능 클래스 · effort high · max_tokens 24,000</p>
        </figure>
      </div>

      <div class="catalog">
        <div class="catalog__head" data-in>
          <h3 class="h3">공식 프롬프트 9개</h3>
          <p class="fine">저장소의 <code>seed_prompts.py</code> 원문이 그대로 들어가고, 전부 staging 에 배포된 상태로 시작해요.</p>
        </div>
        <div class="catalog__rows" role="table" aria-label="공식 프롬프트 목록">
          <div v-for="p in CATALOG" :key="p.slug" class="catalog__row" role="row" data-in>
            <code class="catalog__slug" role="cell">{{ p.slug }}</code>
            <span class="catalog__area" role="cell">{{ p.area }}</span>
            <span class="catalog__io" role="cell">{{ p.io }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
