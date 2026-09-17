<script setup lang="ts">
/**
 * 한 프롬프트의 일생 — 복사본에서 production 까지.
 *
 * 이 파일은 구성만 한다. 각 구간이 자기 카피를 소유한다(구간 하나 = 파일 하나).
 * 상태가 있는 곳은 스크롤 엔진(FlowScene)과 라벨 이동 판정기(GatePlayground) 둘뿐이다.
 */
const { app } = useRuntimeConfig();
const { siteUrl } = useRuntimeConfig().public;
const base = app.baseURL;

useHead({
  link: [
    { rel: "icon", href: `${base}favicon.ico`, sizes: "48x48" },
    { rel: "icon", href: `${base}favicon.svg`, type: "image/svg+xml" },
    { rel: "apple-touch-icon", href: `${base}apple-touch-icon.png` },
  ],
  // og:image 는 절대 주소여야 한다. 배포 주소를 모르면(로컬) 넣지 않는다
  meta: siteUrl ? [{ property: "og:image", content: new URL("og-image.png", siteUrl.replace(/\/?$/, "/")).href }] : [],
});
</script>

<template>
  <a class="skip" href="#where">본문으로 건너뛰기</a>
  <SiteIconSprite />
  <FlowScene />
  <SiteHeader />
  <main id="main">
    <StationsHero />
    <StationsWhere />
    <StationsWedge />
    <StationsAnatomy />
    <StationsImmutable />
    <StationsGate />
    <StationsDeploy />
    <StationsDelivery />
    <StationsEval />
    <StationsLater />
    <StationsClose />
  </main>
  <SiteFooter />
</template>
