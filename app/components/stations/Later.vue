<!-- 본 저장소 README "아직 구현되지 않은 것" -->
<template>
  <section id="later" class="station station--fade" data-stamp="아직" data-band="dark" style="--ground: var(--st-later)">
    <div class="shell">
      <div class="station__head">
        <div data-in>
          <p class="stamp"><span class="stamp__t inst">아직</span></p>
          <h2 class="h2">아직 못 하는 것도<br />같은 무게로 적어요</h2>
        </div>
        <p class="body" data-in>
          소개 페이지가 코드보다 앞서 나가면 안 돼요. 아래는 기획서에는 있지만 <strong>저장소에는 아직 없는 것</strong>들이에요.
        </p>
      </div>

      <ul class="cannots">
        <li class="cannot" data-in>
          <b>LLM-as-judge 채점</b>
          <p>채점 작업(<code>evals/tasks.run_single_eval</code>)이 아직 비어 있어요. Judge 점수 게이트의 규칙은 있지만, 채울 점수가 아직 만들어지지 않아요.</p>
        </li>
        <li class="cannot" data-in>
          <b>테스트셋 관리 화면 · “이 실행을 테스트케이스로 저장”</b>
          <p>백과사전과 Eval 을 잇는 유일한 다리예요. 이게 없어서 지금은 production 게이트가 항상 막혀요.</p>
        </li>
        <li class="cannot" data-in>
          <b>MCP 서버 · CLI · Slack 앱</b>
          <p>Phase 2 예요. 사용자가 ARTEMIS 에 찾아오지 않고도 ARTEMIS 를 쓰게 만드는 길이라 다음 순서예요.</p>
        </li>
        <li class="cannot" data-in>
          <b>SDK — Python · Java 우선</b>
          <p>Phase 4 예요. 로컬 캐시와 빌드타임 폴백이 필수 계약이에요. ARTEMIS 가 멈춰도 서비스는 마지막 정상 버전으로 계속 돌아야 하니까요.</p>
        </li>
        <li class="cannot" data-in>
          <b>임베딩 기반 하이브리드 검색</b>
          <p>지금 검색은 trigram 유사도와 태그 필터예요. 임베딩 생성과 중복 탐지는 구현돼 있지만 검색에는 아직 쓰지 않아요.</p>
        </li>
        <li class="cannot" data-in>
          <b>Eval 결과 화면 · A/B 비교 · 2인 승인</b>
          <p>점수를 모아 보는 화면, 버전 두 개를 나란히 돌리는 화면, 승인 요청 워크플로가 남아 있어요.</p>
        </li>
      </ul>
    </div>
  </section>
</template>
