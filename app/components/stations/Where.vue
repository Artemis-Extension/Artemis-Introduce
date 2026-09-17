<template>
  <section id="where" class="station station--rise" data-stamp="흩어짐" data-band="dark" style="--ground: var(--st-where)">
    <div class="shell">
      <div class="station__head">
        <div data-in>
          <p class="stamp"><span class="stamp__t inst">흩어짐</span></p>
          <h2 class="h2">프롬프트가 없어서가 아니에요.<br />있는 자리가 다를 뿐이에요.</h2>
        </div>
        <p class="body" data-in>
          잘 쓰는 사람의 프롬프트는 슬랙 스레드와 개인 메모, 코드의 문자열 안에 있어요. 그걸 필요로 하는 사람은 IDE 앞에 있고, 사내 서비스는 배포된 서버
          안에 있어요. ARTEMIS가 하는 일은 프롬프트를 새로 만드는 게 아니라 <strong>이 거리를 좁히는 것</strong>이에요.
        </p>
      </div>

      <div class="gap">
        <div class="gap__side" data-in>
          <h3 class="h3">프롬프트가 사는 자리</h3>
          <dl>
            <div class="gap__row"><dt>위치</dt><dd>슬랙 스레드 · 노션 · 개인 메모 · 코드 문자열</dd></div>
            <div class="gap__row"><dt>형태</dt><dd>복사해 붙인 글 한 덩어리</dd></div>
            <div class="gap__row"><dt>변경</dt><dd>누가 언제 고쳤는지 모름</dd></div>
            <div class="gap__row"><dt>품질</dt><dd>“잘 되더라”는 기억</dd></div>
          </dl>
        </div>
        <div class="gap__vs"><span>거리</span></div>
        <div class="gap__side" data-in>
          <h3 class="h3">프롬프트가 필요한 자리</h3>
          <dl>
            <div class="gap__row"><dt>위치</dt><dd>웹 · IDE · 사내 서비스 런타임</dd></div>
            <div class="gap__row"><dt>형태</dt><dd>역할별 메시지와 입력 변수</dd></div>
            <div class="gap__row"><dt>변경</dt><dd>버전과 감사 기록</dd></div>
            <div class="gap__row"><dt>품질</dt><dd>골든 테스트셋 점수</dd></div>
          </dl>
        </div>
      </div>

      <p class="fine" style="margin-top: var(--s5)">
        가장 위험한 자리가 하나 더 있어요. 버전 없이 저장되는 프롬프트는 누군가 저장하는 순간 운영 서비스의 동작이 바뀌어요. 리뷰도, 롤백도, 원인 추적도 할
        수 없어요.
      </p>
    </div>
  </section>
</template>
