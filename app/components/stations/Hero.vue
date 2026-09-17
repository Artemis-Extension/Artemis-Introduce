<script setup lang="ts">
const { consoleUrl } = useRuntimeConfig().public;
</script>

<template>
  <section id="top" class="hero" data-stamp="복사본" data-band="dark">
    <div class="hero__grid">
      <div class="hero__copy">
        <h1 class="display">좋은 프롬프트는 이미<br />회사 안에 있어요.<br /><em>다시 찾을 수 없을</em> 뿐이에요.</h1>
        <p class="lede">
          ARTEMIS는 검증된 프롬프트를 찾아 바로 실행하는 사내 백과사전이에요. 동시에 사내 서비스가 코드 대신 레지스트리에서 프롬프트를 받아 가게 하는
          배포 경로이기도 해요.
        </p>
        <p class="hero__cta">
          <a class="btn btn--primary" href="#where">
            한 프롬프트의 일생 따라가기
            <svg aria-hidden="true"><use href="#i-down" /></svg>
          </a>
          <a class="btn btn--ghost" :href="consoleUrl" rel="noopener">
            콘솔 열기
            <svg aria-hidden="true"><use href="#i-out" /></svg>
          </a>
        </p>
        <p class="hero__hint">
          <svg aria-hidden="true"><use href="#i-down" /></svg>
          스크롤이 곧 한 프롬프트의 일생이에요 — 복사본에서 production 까지
        </p>
      </div>

      <!-- 계기 판독 — 운영 서비스가 실제로 받는 응답의 필드 이름을 그대로 쓴다 -->
      <div class="readout" role="group" aria-label="운영 서비스가 받는 응답 (기획서 6-1의 예시)">
        <p class="readout__req inst">GET /api/v1/prompts/sql-optimize?label=production</p>
        <div class="readout__row">
          <span class="inst-label">resolved_version</span><span class="readout__v inst">12</span>
        </div>
        <div class="readout__row">
          <span class="inst-label">label</span><span class="readout__v inst">production</span>
        </div>
        <div class="readout__row">
          <span class="inst-label">content_hash</span><span class="readout__v inst">a9f3…</span>
        </div>
        <p class="readout__note">버전 번호가 아니라 라벨로 묻고, 응답이 어느 버전인지 밝혀요. 기획서 6-1의 응답 예시예요.</p>
      </div>
    </div>
  </section>
</template>
