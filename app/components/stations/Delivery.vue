<!-- 기획서 2장 원칙 3 · 4-3 · 9장 · 12장 -->
<script setup lang="ts">
const CHANNELS = [
  { name: "웹 콘솔 · 백오피스", who: "전 직군 · 운영자", status: "배포됨", ready: true },
  { name: "플레이그라운드 · SSE 스트리밍", who: "전 직군", status: "구현됨", ready: true },
  { name: "MCP 서버", who: "Claude Code · Cursor 를 쓰는 개발자", status: "Phase 2 · 아직", ready: false },
  { name: "CLI · artemis pull", who: "레포 단위로 표준화할 팀", status: "Phase 2 · 아직", ready: false },
  { name: "Slack 앱 · /artemis", who: "비개발 직군 · 전사", status: "Phase 2 · 아직", ready: false },
  { name: "SDK · Python · Java", who: "사내 서비스 런타임", status: "Phase 4 · 아직", ready: false },
];
</script>

<template>
  <section id="delivery" class="station" data-stamp="run" data-band="dark" style="--ground: var(--st-delivery)">
    <div class="shell">
      <div class="station__head">
        <div data-in>
          <p class="stamp"><span class="stamp__t inst">run</span></p>
          <h2 class="h2">웹은 목적지가 아니라<br />관리 콘솔이에요</h2>
        </div>
        <p class="body" data-in>
          어디에 저장하느냐보다 <strong>작업하는 자리까지 어떻게 배달하느냐</strong>가 승부처예요. 웹만 있는 사내 도구는 몇 주 안에 잊혀요. 그래서 배포 채널이
          시맨틱 검색보다 앞 순서에 있어요.
        </p>
      </div>

      <ol class="pipe" aria-label="실행 경로">
        <li class="step" data-in>
          <span class="inst-label">브라우저</span>
          <p>쿠키에는 추측할 수 없는 세션 ID 만 있어요.</p>
        </li>
        <li class="step" data-in>
          <span class="inst-label">Nuxt BFF</span>
          <p>토큰은 Redis 에만 두고, 허용한 경로만 통과시켜요.</p>
        </li>
        <li class="step" data-in>
          <span class="inst-label">Django API</span>
          <p>발급자 공개키로 토큰을 검증하고, 권한은 끝까지 여기서 판단해요.</p>
        </li>
        <li class="step" data-in>
          <span class="inst-label">LiteLLM Proxy</span>
          <p>팀별 예산 · 레이트리밋 · 비용 추적을 맡아요. 앱은 Provider 키를 몰라요.</p>
        </li>
        <li class="step" data-in>
          <span class="inst-label">모델</span>
          <p>응답은 SSE 로 한 조각씩 흘러 돌아와요.</p>
        </li>
      </ol>

      <div class="channels" role="table" aria-label="배포 채널과 구현 상태">
        <div class="channels__row channels__head" role="row">
          <span role="columnheader">채널</span>
          <span role="columnheader">누가 쓰나</span>
          <span role="columnheader">상태</span>
        </div>
        <div v-for="c in CHANNELS" :key="c.name" class="channels__row" role="row" :data-ready="c.ready ? '1' : '0'" data-in>
          <span class="channels__name" role="rowheader"><i class="dot" aria-hidden="true" />{{ c.name }}</span>
          <span role="cell">{{ c.who }}</span>
          <span class="channels__status" role="cell">{{ c.status }}</span>
        </div>
      </div>

      <div class="guards guards--dark" role="table" aria-label="실행 경로에서 지키는 것">
        <div class="guards__row" role="row" data-in>
          <span class="guards__where" role="rowheader">쓰기 · 배포</span>
          <span role="cell">로그인 세션으로만 해요. 서비스 토큰으로는 프롬프트를 고치거나 라벨을 옮길 수 없어요.</span>
        </div>
        <div class="guards__row" role="row" data-in>
          <span class="guards__where" role="rowheader">자격증명</span>
          <span role="cell">버전 본문이나 실행 입력에서 API 키 · 토큰 · 개인키를 찾으면 멈추고 감사 로그에 남겨요.</span>
        </div>
        <div class="guards__row" role="row" data-in>
          <span class="guards__where" role="rowheader">개인정보</span>
          <span role="cell">주민등록번호 · 휴대전화번호 · 이메일 · 카드번호는 막지 않고, 저장되는 기록에서 가려요.</span>
        </div>
      </div>

      <p class="fine" style="margin-top: var(--s5)">
        모바일 앱은 ARTEMIS 를 직접 부르지 않아요. 디바이스에 키가 내려가기 때문에 반드시 사내 BFF 를 거쳐요.
      </p>
    </div>
  </section>
</template>
