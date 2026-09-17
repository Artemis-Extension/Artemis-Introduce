<!-- 기획서 6-1 · 11-2 · 12-1 — 판정 규칙은 app/lib/gates.ts (services.py 이식) -->
<template>
  <section id="gate" class="station station--fade" data-stamp="staging" data-band="light" style="--ground: var(--st-gate)">
    <div class="shell">
      <div class="station__head">
        <div data-in>
          <p class="stamp"><span class="stamp__t inst">staging</span></p>
          <h2 class="h2">production 라벨은<br />조건을 통과해야 움직여요</h2>
        </div>
        <p class="body" data-in>
          staging 으로 옮기는 건 에디터면 돼요. production 으로 옮기려면 승인자 권한에 더해 <strong>승격 게이트를 전부 통과</strong>해야 해요. 아래 판정기는 서버의
          판정 함수를 그대로 옮겼어요. 값을 바꿔 보세요.
        </p>
      </div>

      <GatePlayground />
    </div>
  </section>
</template>
