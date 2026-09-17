<script setup lang="ts">
const { consoleUrl } = useRuntimeConfig().public;
</script>

<template>
  <header class="top" data-band="dark">
    <a class="brand" href="#top" aria-label="ARTEMIS 처음으로">
      <SiteBrandLogo :height="22" />
    </a>
    <nav class="top__links" aria-label="페이지 안내">
      <a href="#anatomy">구조</a>
      <a href="#gate">배포 규칙</a>
      <a href="#eval">검증</a>
      <a href="#later">한계</a>
      <a class="top__console" :href="consoleUrl" rel="noopener">
        콘솔
        <svg aria-hidden="true"><use href="#i-out" /></svg>
      </a>
    </nav>
  </header>
</template>
