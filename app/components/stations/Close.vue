<script setup lang="ts">
const { consoleUrl } = useRuntimeConfig().public;
</script>

<template>
  <section class="close" data-close data-band="dark">
    <div class="shell">
      <div class="close__grid">
        <div data-in>
          <h2 class="display close__title">버전은 남고, 라벨만 움직여요.<br />다음 버전은 이 기록에서 시작해요.</h2>
          <p class="lede" style="margin-top: var(--s5); max-width: 46ch">
            ARTEMIS 가 쌓는 자산은 프롬프트 원문보다, 그 원문을 고쳐 온 기록이에요. 판단의 근거는 전부 저장소에 있어요.
          </p>
          <p class="hero__cta">
            <a class="btn btn--primary" :href="consoleUrl" rel="noopener">
              콘솔 열기
              <svg aria-hidden="true"><use href="#i-out" /></svg>
            </a>
          </p>
        </div>

        <div class="docs" data-in aria-label="판단의 근거가 있는 곳">
          <div class="doc"><span>기획 및 UI/UX 명세서 v2.1</span><code>docs/기획서.html</code></div>
          <div class="doc"><span>라벨 해석 · 변수 바인딩 · 승격 게이트</span><code>prompts/services.py</code></div>
          <div class="doc"><span>버전 불변 DB 트리거</span><code>prompts/migrations/0002</code></div>
          <div class="doc"><span>공식 프롬프트 원문</span><code>seed_prompts.py</code></div>
          <div class="doc"><span>자격증명 · 개인정보 탐지</span><code>common/scanning.py</code></div>
        </div>
      </div>
    </div>
  </section>
</template>
