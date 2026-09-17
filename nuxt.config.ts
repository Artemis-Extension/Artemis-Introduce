/**
 * ARTEMIS 소개 사이트 (Nuxt 정적 생성).
 *
 * 서버 런타임이 없다. `nuxt generate` 가 .output/public 에 HTML·CSS·JS 를 떨구고, 그대로 GitHub Pages 에 올린다.
 * 콘솔(apps/web)과 같은 Nuxt · Vue 버전을 쓰되, 콘솔 저장소와는 독립된 패키지다.
 */
export default defineNuxtConfig({
  compatibilityDate: "2026-09-01",
  devtools: { enabled: false },
  telemetry: false,

  typescript: { strict: true },

  /* GitHub Pages 프로젝트 사이트는 https://<org>.github.io/<저장소명>/ 아래에서 서빙된다.
     빌드할 때 NUXT_APP_BASE_URL 로 그 서브경로를 알려 준다(워크플로가 넣는다). 로컬은 "/" 그대로다. */
  app: {
    head: {
      htmlAttrs: { lang: "ko" },
      title: "ARTEMIS — 사내 AI 프롬프트 백과사전",
      meta: [
        {
          name: "description",
          content:
            "흩어진 프롬프트를 구조로 저장하고, 고치면 새 버전을 만들고, 조건을 통과해야 운영에 나가게 합니다. 사내 서비스는 코드 대신 라벨로 프롬프트를 받아 갑니다.",
        },
        { name: "theme-color", content: "#0a0e14" },
        { name: "format-detection", content: "telephone=no, address=no, email=no, date=no" },
        { property: "og:type", content: "website" },
        { property: "og:locale", content: "ko_KR" },
        { property: "og:site_name", content: "ARTEMIS" },
        { property: "og:title", content: "ARTEMIS — 사내 AI 프롬프트 백과사전" },
        { property: "og:description", content: "버전은 남고, 라벨만 움직여요." },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    },
  },

  runtimeConfig: {
    public: {
      // 링크 미리보기(og:image)의 절대 주소 기준. 워크플로가 Pages 주소를 넣는다
      siteUrl: "",
      consoleUrl: "https://artemis-ai.duckdns.org",
    },
  },

  nitro: {
    prerender: { routes: ["/"], failOnError: true },
  },
});
