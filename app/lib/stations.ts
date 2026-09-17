/**
 * 한 프롬프트의 일생 — 복사본에서 운영까지.
 *
 * 시각 레일의 눈금과 3D 장면의 단계가 이 목록에서 나온다. 페이지의 [data-stamp] 구간과
 * 순서·개수가 같아야 한다 — 레일이 런타임에 [data-stamp] 를 다시 질의해 짝을 맞추므로,
 * 여기가 어긋나면 눈금이 남거나 모자란다.
 *
 * stamp 는 그 구간에서 프롬프트가 놓인 상태다. draft · v1 · staging · production 은
 * 코드에 있는 값(Lifecycle · PromptVersion · LabelName) 그대로 쓴다.
 */
export type Band = "dark" | "light";

export type Station = {
  id: string;
  stamp: string;
  band: Band;
};

export const STATIONS: Station[] = [
  { id: "top", stamp: "복사본", band: "dark" },
  { id: "where", stamp: "흩어짐", band: "dark" },
  { id: "wedge", stamp: "draft", band: "dark" },
  { id: "anatomy", stamp: "v1", band: "light" },
  { id: "immutable", stamp: "v2", band: "light" },
  { id: "gate", stamp: "staging", band: "light" },
  { id: "deploy", stamp: "production", band: "dark" },
  { id: "delivery", stamp: "run", band: "dark" },
  { id: "eval", stamp: "eval", band: "dark" },
  { id: "later", stamp: "아직", band: "dark" },
];

/** 3D 장면이 단계별로 바뀌는 지점 (STATIONS 의 인덱스) */
export const STAGE = {
  top: 0,
  where: 1,
  wedge: 2,
  anatomy: 3,
  deploy: 6,
  delivery: 7,
  eval: 8,
  later: 9,
  close: 10,
} as const;
