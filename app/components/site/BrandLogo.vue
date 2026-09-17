<script setup lang="ts">
/** ARTEMIS 로고. 워드마크는 currentColor 라 지면 색을 따르고, 아이콘은 브랜드 색을 유지한다. */
import { BRAND_LOGO as L } from "~/lib/brand-logo";

const props = withDefaults(defineProps<{ height?: number }>(), { height: 24 });
const width = computed(() => Math.round((props.height * L.width) / L.height));
</script>

<template>
  <svg :viewBox="L.viewBox" :width="width" :height="height" role="img" aria-label="ARTEMIS">
    <rect :width="L.iconSize" :height="L.iconSize" :rx="L.iconRadius" fill="#3182F6" />
    <path v-for="(d, i) in L.icon" :key="`s${i}`" :d="d" fill="#fff" />
    <g fill="currentColor">
      <path v-for="(d, i) in L.wordmark" :key="`w${i}`" :d="d" />
    </g>
  </svg>
</template>
