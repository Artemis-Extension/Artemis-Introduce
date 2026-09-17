<!-- 기획서 6-1 · 6-2 — 라벨 해석은 services.resolve() -->
<template>
  <section
    id="deploy"
    class="station station--rise"
    data-stamp="production"
    data-band="dark"
    style="--ground: var(--st-deploy)"
  >
    <div class="shell">
      <div class="station__head">
        <div data-in>
          <p class="stamp"><span class="stamp__t inst">production</span></p>
          <h2 class="h2">라벨을 옮기는 것이<br />곧 배포예요</h2>
        </div>
        <p class="body" data-in>
          운영 서비스는 버전 번호를 모른 채 라벨로 프롬프트를 받아요. 응답에는 실제로 해석된 버전이 늘 들어 있어요. 문제가 생기면
          <strong>라벨을 이전 버전으로 되돌리면 끝</strong>이고, 누가 언제 옮겼는지는 감사 로그에 남아요.
        </p>
      </div>

      <div class="exchange">
        <ul class="routes" aria-label="프롬프트를 받아 가는 경로">
          <li class="route" data-state="fail" data-in>
            <svg aria-hidden="true"><use href="#i-fail" /></svg>
            <div>
              <code>GET /api/v1/prompts/{id}</code>
              <p>어떤 버전인지 알 수 없어요. 누군가 저장하는 순간 운영이 바뀌어요.</p>
            </div>
          </li>
          <li class="route" data-state="pass" data-in>
            <svg aria-hidden="true"><use href="#i-pass" /></svg>
            <div>
              <code>GET /api/v1/prompts/{slug}?label=production</code>
              <p>운영 서비스의 표준 경로예요. 라벨이 가리키는 버전을 받아요.</p>
            </div>
          </li>
          <li class="route" data-state="pass" data-in>
            <svg aria-hidden="true"><use href="#i-pass" /></svg>
            <div>
              <code>GET /api/v1/prompts/{slug}/versions/12</code>
              <p>완전히 고정해야 할 때만 버전을 직접 지정해요. 라벨과 버전을 함께 주면 거부해요.</p>
            </div>
          </li>
        </ul>

        <pre class="json" data-in aria-label="라벨 해석 응답 (기획서 6-1의 예시)"><code>{
  <span class="k">"slug"</span>: <span class="s">"sql-optimize"</span>,
  <span class="k">"resolved_version"</span>: <span class="n">12</span>,
  <span class="k">"label"</span>: <span class="s">"production"</span>,
  <span class="k">"content_hash"</span>: <span class="s">"a9f3…"</span>,
  <span class="k">"messages"</span>: [ … ],
  <span class="k">"model_config"</span>: { … }
}</code></pre>
      </div>

      <div class="tiers" role="table" aria-label="2-Tier 거버넌스 (기획서 6-2)">
        <div class="tiers__row tiers__head" role="row">
          <span role="columnheader"><span class="sr">항목</span></span>
          <span role="columnheader">Community Tier</span>
          <span role="columnheader">Production Tier</span>
        </div>
        <div class="tiers__row" role="row" data-in>
          <span class="tiers__k" role="rowheader">대상</span>
          <span role="cell">개인 생산성용 프롬프트 — 대부분</span>
          <span role="cell">사내 서비스가 받아 가는 프롬프트</span>
        </div>
        <div class="tiers__row" role="row" data-in>
          <span class="tiers__k" role="rowheader">운영에 내보내는 사람</span>
          <span role="cell">에디터 — staging 까지</span>
          <span role="cell">승인자 · 기획서는 코드 소유자 + PR 리뷰</span>
        </div>
        <div class="tiers__row" role="row" data-in>
          <span class="tiers__k" role="rowheader">배포 승인</span>
          <span role="cell">필요 없음</span>
          <span role="cell">승격 게이트 통과 · 기획서는 2인 승인까지</span>
        </div>
        <div class="tiers__row" role="row" data-in>
          <span class="tiers__k" role="rowheader">품질 신호</span>
          <span role="cell">사용량 · 검증 배지</span>
          <span role="cell">Eval 점수 · 운영 에러율 · 회귀 테스트</span>
        </div>
      </div>

      <p class="fine" style="margin-top: var(--s5)">
        프롬프트는 production 라벨을 처음 받는 순간 Production Tier 로 바뀌어요. 기획서의 2인 승인과 Git PR 워크플로는 아직 코드에 없어요 — 지금은 승인자 한 명과
        승격 게이트로 배포해요.
      </p>
    </div>
  </section>
</template>
