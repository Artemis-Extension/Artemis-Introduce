<!-- 기획서 1장 · DECISION 01 -->
<template>
  <section id="wedge" class="station station--fade" data-stamp="draft" data-band="dark" style="--ground: var(--st-wedge)">
    <div class="shell">
      <div class="station__head">
        <div data-in>
          <p class="stamp"><span class="stamp__t inst">draft</span></p>
          <h2 class="h2">같은 이름 아래서<br />서로 부딪히는 두 제품</h2>
        </div>
        <p class="body" data-in>
          사람이 쓰는 백과사전은 누구나 쉽게 고칠 수 있어야 살아요. 서비스가 받아 가는 레지스트리는 아무나 고칠 수 없어야 안전해요. 둘을 한 제품으로 뭉뚱그리면
          <strong>한쪽이 죽어요.</strong>
        </p>
      </div>

      <div class="split" role="table" aria-label="백과사전과 레지스트리의 요구사항 비교">
        <div class="split__row split__head" role="row">
          <span role="columnheader"><span class="sr">항목</span></span>
          <span role="columnheader">A · 백과사전</span>
          <span role="columnheader">B · 레지스트리</span>
        </div>
        <div class="split__row" role="row" data-in>
          <span class="split__k" role="rowheader">쓰는 사람</span>
          <span role="cell">전 직군 구성원</span>
          <span role="cell">사내 서비스 런타임과 담당 개발자</span>
        </div>
        <div class="split__row" role="row" data-in>
          <span class="split__k" role="rowheader">지켜야 할 것</span>
          <span role="cell">발견 · 학습 · 복사 · 공유</span>
          <span role="cell">버전 고정 · 롤백 · 회귀 방지</span>
        </div>
        <div class="split__row" role="row" data-in>
          <span class="split__k" role="rowheader">고치는 방식</span>
          <span role="cell">누구나 마찰 없이</span>
          <span role="cell">불변 · 리뷰 필수 · 승인 후 배포</span>
        </div>
        <div class="split__row split__row--fail" role="row" data-in>
          <span class="split__k" role="rowheader">실패하면</span>
          <span role="cell">아무도 안 여는 죽은 위키</span>
          <span role="cell">고객 앞 서비스 장애</span>
        </div>
      </div>

      <div class="decision" data-in>
        <p class="inst-label">그래서 정한 순서</p>
        <p class="decision__t">사람이 먼저 쓰게 만들되, 데이터 모델은 첫날부터 레지스트리 기준으로 깔았어요.</p>
        <p class="body">
          백과사전으로 사람을 모으지 못하면 레지스트리에 공급할 프롬프트가 없어요. 반대로 고쳐 쓰는 기록(가변 레코드)으로 시작하면, 레지스트리로 넓힐 때 데이터를
          전부 옮겨야 해요. 그래서 스키마와 API 계약은 처음부터 <strong>불변 버전 + 라벨</strong>로 만들고, 승인·SDK·트레이싱만 뒤로 미뤘어요.
        </p>
      </div>
    </div>
  </section>
</template>
