<!-- 기획서 2장 원칙 4 · 11장 — 코드 열은 services.evaluate_promotion_gates() -->
<template>
  <section id="eval" class="station" data-stamp="eval" data-band="dark" style="--ground: var(--st-eval)">
    <div class="shell">
      <div class="station__head">
        <div data-in>
          <p class="stamp"><span class="stamp__t inst">eval</span></p>
          <h2 class="h2">별점이 아니라<br />점수로 말해요</h2>
        </div>
        <p class="body" data-in>
          별점은 인기 투표예요. 프롬프트를 고쳤을 때 좋아졌는지 나빠졌는지는 알려 주지 않아요. ARTEMIS 는 버전마다 골든 테스트셋으로 채점하고,
          <strong>지금 운영 중인 버전보다 나빠지면 배포를 막아요.</strong>
        </p>
      </div>

      <ol class="loop" aria-label="평가가 다음 버전으로 이어지는 길">
        <li class="loop__step" data-in>플레이그라운드에서 실행</li>
        <li class="loop__step loop__step--missing" data-in>
          “이 실행을 테스트케이스로 저장”
          <span class="loop__tag">아직</span>
        </li>
        <li class="loop__step" data-in>골든 테스트셋</li>
        <li class="loop__step" data-in>새 버전 Eval</li>
        <li class="loop__step" data-in>기준선 대비 점수</li>
        <li class="loop__step loop__step--end" data-in>승격 게이트</li>
      </ol>

      <div class="ledger">
        <div class="ledger__row ledger__head" aria-hidden="true">
          <span>기준</span><span>기획서 11-2</span><span>코드</span><span>읽는 법</span>
        </div>
        <div class="ledger__row" data-in>
          <span class="ledger__n">골든 테스트셋</span>
          <span class="ledger__a inst">10건 이상</span>
          <span class="ledger__b">막음</span>
          <span class="ledger__d">테스트셋이 없는 버전은 점수를 낼 수 없어요.</span>
        </div>
        <div class="ledger__row" data-in>
          <span class="ledger__n">이 버전의 Eval 실행</span>
          <span class="ledger__a">없던 줄</span>
          <span class="ledger__b">막음</span>
          <span class="ledger__d">실행 기록이 없으면 아래 두 기준을 잴 수 없어서, 코드에서 따로 한 줄을 더했어요.</span>
        </div>
        <div class="ledger__row" data-in>
          <span class="ledger__n">규칙 assertion</span>
          <span class="ledger__a inst">100%</span>
          <span class="ledger__b">막음</span>
          <span class="ledger__d">포함 · 정규식 · JSON 스키마처럼 기계로 판정하는 규칙은 하나도 틀리면 안 돼요.</span>
        </div>
        <div class="ledger__row" data-in>
          <span class="ledger__n">Judge 점수</span>
          <span class="ledger__a inst">기준선 −3% 이내</span>
          <span class="ledger__b">막음</span>
          <span class="ledger__d">기준선은 지금 production 버전의 평균 점수예요. 첫 배포에는 기준선이 없어 건너뛰어요.</span>
        </div>
        <div class="ledger__row" data-in>
          <span class="ledger__n">모델 EOL</span>
          <span class="ledger__a">7-2 승격 차단</span>
          <span class="ledger__b">막음</span>
          <span class="ledger__d">retired 이거나 EOL 날짜가 지난 모델이에요. deprecated 는 막지 않아요.</span>
        </div>
        <div class="ledger__row" data-in data-planned="1">
          <span class="ledger__n">비용 증가율</span>
          <span class="ledger__a inst">+20% 이내 · 경고</span>
          <span class="ledger__b">아직 없음</span>
          <span class="ledger__d">기획서에는 있지만 코드에는 없어요.</span>
        </div>
        <div class="ledger__row" data-in data-planned="1">
          <span class="ledger__n">P95 지연</span>
          <span class="ledger__a">SLO 이내 · 경고</span>
          <span class="ledger__b">아직 없음</span>
          <span class="ledger__d">기획서에는 있지만 코드에는 없어요. <strong>안 만든 줄도 지우지 않고 여기 적어요.</strong></span>
        </div>
      </div>
    </div>
  </section>
</template>
