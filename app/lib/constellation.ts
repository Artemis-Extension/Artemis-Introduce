/**
 * 페이지 뒤의 3D — "프롬프트 별자리".
 *
 * 콘솔 로그인 화면의 "프롬프트 네트워크"(apps/web/app/lib/login-scene.ts)와 같은 재료(점·선·흐르는 빛)로,
 * 스크롤 단계에 따라 한 프롬프트의 일생을 그린다.
 *
 *   복사본 · 흩어짐   점이 넓게 흩어져 떠다닌다. 셋 중 하나는 다른 점 바로 옆에 붙은 사본이다
 *   draft            점이 직군 6개(Category) 묶음으로 모이고, 가까운 이웃끼리 선이 생긴다
 *   (v1 ~ staging)   밝은 지면이 덮는다 — 렌더 루프를 세운다
 *   production       한 점(공식 프롬프트)이 커지고 라벨 고리가 걸린다. 바깥에 배포 채널 6개가 뜬다
 *   run              빛이 그 점에서 채널로 나간다
 *   eval             빛이 채널에서 그 점으로 돌아온다 — 실행이 테스트케이스가 되어 돌아오는 길
 *   아직             아직 없는 채널이 천천히 깜박인다
 *
 * 채널 6개 중 둘(웹 콘솔 · 플레이그라운드)만 채운 점이고, 넷(MCP · CLI · Slack · SDK)은 속이 빈 고리다.
 * 빛도 채운 점으로만 흐른다. 장식이 아니라 구현 상태를 그대로 옮긴 것이다 — 채널을 만들면 여기도 바꾼다.
 *
 * 글자는 캔버스에 그리지 않는다. 카피는 전부 DOM 이다.
 * Vue 에 의존하지 않는다. three 는 FlowScene 이 이 파일을 동적으로 불러올 때만 내려받는다.
 */
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Group,
  LineSegments,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  Vector3,
  WebGLRenderer,
} from "three";
import { STAGE } from "./stations";

export type FlowHandle = {
  /** STATIONS 인덱스 + 구간 안 진행도(0~1). 닫는 말은 STATIONS.length */
  setStage(stage: number): void;
  /** 밝은 지면이 캔버스를 다 덮으면 false — 렌더 루프를 세운다 */
  setVisible(visible: boolean): void;
  dispose(): void;
};

const BRAND = new Color("#3182f6");
const BRAND_LIGHT = new Color("#7db3fd");
const MOON = new Color("#eef4ff");

const CLUSTERS = 6; // product · design · common · backend · frontend · mobile
const PER_CLUSTER = 34;
const LIT_CHANNELS = 2; // 웹 콘솔 · 플레이그라운드
const CHANNELS = 6; // + MCP · CLI · Slack · SDK

const KIND = { prompt: 0, hub: 1, channelLit: 2, channelDim: 3 } as const;

/** 결정적인 난수 — 새로 고칠 때마다 모양이 달라지지 않게 한다 */
function random(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/* 점과 선이 같은 식으로 움직여야 선 끝이 점에서 떨어지지 않는다 — 한 조각을 둘이 나눠 쓴다 */
const MOTION = /* glsl */ `
  uniform float uTime;
  uniform float uGather;
  attribute vec3 aScatter;
  attribute vec3 aCatalog;
  attribute float aSeed;
  float gatherOf(float seed) {
    // 점마다 조금씩 늦게 모인다. 한꺼번에 움직이면 기계 장치처럼 보인다
    float t = clamp(uGather * 1.35 - seed * 0.35, 0.0, 1.0);
    return t * t * (3.0 - 2.0 * t);
  }
  vec3 placeOf(float g) {
    vec3 drift = vec3(
      sin(uTime * 0.13 + aSeed * 40.0),
      cos(uTime * 0.11 + aSeed * 23.0),
      sin(uTime * 0.09 + aSeed * 57.0)
    ) * 0.4;
    vec3 breathe = vec3(sin(uTime * 0.6 + aSeed * 31.0)) * 0.035;
    return mix(aScatter + drift, aCatalog + breathe, g);
  }
`;

const POINT_VERTEX = /* glsl */ `
  ${MOTION}
  attribute vec3 color;
  attribute float size;
  attribute float aKind;
  uniform float uPixelRatio;
  uniform float uHub;
  uniform float uChannels;
  uniform float uLater;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vKind;
  void main() {
    float g = gatherOf(aSeed);
    vec4 mv = modelViewMatrix * vec4(placeOf(g), 1.0);
    float s = size;
    // 흩어진 사본은 흐리고, 자리를 찾으면 또렷해진다
    float a = mix(0.5, 1.0, g);
    if (aKind > 0.5 && aKind < 1.5) {
      s *= 1.0 + uHub * 1.2;
      a = mix(a, 1.0, uHub);
    }
    if (aKind > 1.5) {
      a = uChannels;
      if (aKind > 2.5) {
        // 아직 없는 채널 — '아직' 구간에서만 천천히 깜박인다
        a *= 0.5 + uLater * 0.4 * sin(uTime * 1.5 + aSeed * 9.0);
      }
    }
    gl_PointSize = s * uPixelRatio * (96.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
    vColor = color;
    vKind = aKind;
    // 멀리 있는 점은 흐리게 — 깊이감
    vAlpha = a * clamp(1.0 - (-mv.z - 24.0) / 24.0, 0.2, 1.0);
  }
`;

const POINT_FRAGMENT = /* glsl */ `
  uniform float uIntensity;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vKind;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float halo = smoothstep(0.5, 0.0, d) * 0.26;
    float shape = smoothstep(0.5, 0.17, d) + halo;
    if (vKind > 2.5) {
      // 속이 빈 고리 — 자리는 있지만 아직 만들지 않았다
      shape = smoothstep(0.075, 0.0, abs(d - 0.33)) + halo * 0.25;
    }
    float a = shape * vAlpha * uIntensity;
    if (a < 0.004) discard;
    gl_FragColor = vec4(vColor, a);
  }
`;

const LINE_VERTEX = /* glsl */ `
  ${MOTION}
  attribute float aKind;
  uniform float uLines;
  uniform float uChannels;
  varying float vAlpha;
  void main() {
    float g = gatherOf(aSeed);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(placeOf(g), 1.0);
    // 0: 같은 직군 이웃 · 1: 채워진 채널로 가는 선 · 2: 아직 없는 채널로 가는 선
    vAlpha = aKind < 0.5 ? uLines * g : (aKind < 1.5 ? uChannels * 0.5 : uChannels * 0.14);
  }
`;

const LINE_FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  uniform float uIntensity;
  varying float vAlpha;
  void main() {
    gl_FragColor = vec4(uColor, vAlpha * 0.26 * uIntensity);
  }
`;

const SPARK_VERTEX = /* glsl */ `
  attribute float aAlpha;
  attribute float size;
  uniform float uPixelRatio;
  varying float vAlpha;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * uPixelRatio * (96.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
    vAlpha = aAlpha;
  }
`;

const SPARK_FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  uniform float uIntensity;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = (smoothstep(0.5, 0.12, d) + smoothstep(0.5, 0.0, d) * 0.4) * vAlpha * uIntensity;
    if (a < 0.004) discard;
    gl_FragColor = vec4(uColor, a);
  }
`;

/* production 라벨 — 공식 프롬프트 점에 걸리는 고리. 한 곳이 트여 있어 '가리키는 표시'로 읽힌다 */
const LABEL_FRAGMENT = /* glsl */ `
  uniform float uHub;
  uniform float uTime;
  uniform float uIntensity;
  uniform vec3 uColor;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    float ring = smoothstep(0.03, 0.0, abs(d - 0.42));
    float ang = atan(c.y, c.x);
    float gap = smoothstep(0.18, 0.32, abs(mod(ang - uTime * 0.35, 6.2832) - 3.1416));
    float a = ring * gap * uHub * uIntensity;
    if (a < 0.004) discard;
    gl_FragColor = vec4(uColor, a);
  }
`;

type Pulse = { a: number; b: number; t: number; speed: number };

export function mountConstellation(host: HTMLElement): FlowHandle | null {
  const canvas = document.createElement("canvas");
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "low-power" });
  } catch {
    return null;
  }
  host.append(canvas);

  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(pixelRatio);
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const camera = new PerspectiveCamera(38, 1, 0.1, 120);
  camera.position.set(0, 0, 30);

  const root = new Group();
  root.rotation.x = 0.26;
  scene.add(root);

  // ---------------------------------------------------------------- 점
  const rand = random(20260917);
  const count = CLUSTERS * PER_CLUSTER + CHANNELS;
  const scatter = new Float32Array(count * 3);
  const catalog = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const seeds = new Float32Array(count);
  const kinds = new Float32Array(count);
  const place: Vector3[] = []; // 모인 자리 — 선과 흐르는 빛이 쓴다
  const clusterOf: number[] = [];

  const golden = Math.PI * (3 - Math.sqrt(5));
  let hub = 0;
  let n = 0;
  for (let c = 0; c < CLUSTERS; c++) {
    const theta = (c / CLUSTERS) * Math.PI * 2;
    const center = new Vector3(Math.cos(theta) * 6.4, (c % 2 ? 1 : -1) * 0.9, Math.sin(theta) * 6.4);
    for (let i = 0; i < PER_CLUSTER; i++, n++) {
      // 첫 직군(product)의 첫 점이 이 페이지가 따라가는 공식 프롬프트(prd-writer)다
      const isHub = c === 0 && i === 0;
      let p: Vector3;
      if (isHub) {
        p = center.clone();
        hub = n;
      } else {
        const y = 1 - (i / (PER_CLUSTER - 1)) * 2;
        const r = Math.sqrt(1 - y * y);
        const dir = new Vector3(Math.cos(golden * i) * r, y, Math.sin(golden * i) * r);
        p = dir.multiplyScalar(1.15 + rand() * 1.25).add(center);
      }
      place.push(p);
      clusterOf.push(c);
      catalog.set([p.x, p.y, p.z], n * 3);

      // 흩어진 자리. 셋 중 하나는 앞선 점 바로 옆 — 여기저기 복사해 붙인 사본이다
      if (n > 0 && rand() < 0.34) {
        const src = Math.floor(rand() * n);
        scatter.set(
          [scatter[src * 3]! + (rand() - 0.5) * 0.7, scatter[src * 3 + 1]! + (rand() - 0.5) * 0.7, scatter[src * 3 + 2]! + (rand() - 0.5) * 0.7],
          n * 3,
        );
      } else {
        scatter.set([(rand() - 0.5) * 34, (rand() - 0.5) * 17, (rand() - 0.5) * 18 - 2], n * 3);
      }

      const roll = rand();
      const color = isHub ? MOON : roll > 0.62 ? BRAND_LIGHT : BRAND;
      colors.set([color.r, color.g, color.b], n * 3);
      sizes[n] = isHub ? 4.2 : 1.7 + rand() * 1.5;
      seeds[n] = rand();
      kinds[n] = isHub ? KIND.hub : KIND.prompt;
    }
  }

  // 배포 채널 — 바깥 고리. 흩어진 자리와 모인 자리가 같다(움직이지 않고 나타나기만 한다)
  const channels: number[] = [];
  for (let k = 0; k < CHANNELS; k++, n++) {
    const theta = (k / CHANNELS) * Math.PI * 2 + 0.5;
    const p = new Vector3(Math.cos(theta) * 12.6, Math.sin(theta * 2) * 1.4, Math.sin(theta) * 12.6);
    place.push(p);
    clusterOf.push(-1);
    catalog.set([p.x, p.y, p.z], n * 3);
    scatter.set([p.x, p.y, p.z], n * 3);
    const lit = k < LIT_CHANNELS;
    const color = lit ? MOON : BRAND_LIGHT;
    colors.set([color.r, color.g, color.b], n * 3);
    sizes[n] = lit ? 5.2 : 6.4;
    seeds[n] = rand();
    kinds[n] = lit ? KIND.channelLit : KIND.channelDim;
    channels.push(n);
  }

  const uniforms = {
    uTime: { value: 0 },
    uPixelRatio: { value: pixelRatio },
    uGather: { value: 0 },
    uLines: { value: 0 },
    uHub: { value: 0 },
    uChannels: { value: 0 },
    uLater: { value: 0 },
    uIntensity: { value: 1 },
    uColor: { value: BRAND },
  };

  const pointGeometry = new BufferGeometry();
  pointGeometry.setAttribute("position", new BufferAttribute(catalog, 3)); // 경계 상자 계산용
  pointGeometry.setAttribute("aScatter", new BufferAttribute(scatter, 3));
  pointGeometry.setAttribute("aCatalog", new BufferAttribute(catalog, 3));
  pointGeometry.setAttribute("color", new BufferAttribute(colors, 3));
  pointGeometry.setAttribute("size", new BufferAttribute(sizes, 1));
  pointGeometry.setAttribute("aSeed", new BufferAttribute(seeds, 1));
  pointGeometry.setAttribute("aKind", new BufferAttribute(kinds, 1));
  const pointMaterial = new ShaderMaterial({
    vertexShader: POINT_VERTEX,
    fragmentShader: POINT_FRAGMENT,
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  });
  const points = new Points(pointGeometry, pointMaterial);
  points.frustumCulled = false; // 흩어진 자리는 경계 상자 밖에 있다
  root.add(points);

  // ---------------------------------------------------------------- 선
  // 같은 직군 안에서 가까운 이웃 둘과만 잇는다. 모두 이으면 털뭉치가 된다
  const edges: Array<[number, number, number]> = [];
  const neighbors: number[][] = place.map(() => []);
  const seen = new Set<string>();
  const link = (a: number, b: number, kind: number) => {
    const key = a < b ? `${a}-${b}` : `${b}-${a}`;
    if (seen.has(key)) return;
    seen.add(key);
    edges.push([a, b, kind]);
    if (kind === 0) {
      neighbors[a]!.push(b);
      neighbors[b]!.push(a);
    }
  };
  for (let i = 0; i < CLUSTERS * PER_CLUSTER; i++) {
    place
      .map((q, j) => ({ j, d: i === j || clusterOf[j] !== clusterOf[i] ? Infinity : place[i]!.distanceToSquared(q) }))
      .sort((a, b) => a.d - b.d)
      .slice(0, 2)
      .filter((x) => x.d < 2.6)
      .forEach(({ j }) => link(i, j, 0));
  }
  // 직군끼리는 가장 가까운 두 점으로 한 줄씩만 — 별자리가 한 장의 지도로 읽히게
  for (let c = 0; c < CLUSTERS; c++) {
    const next = (c + 1) % CLUSTERS;
    let best: [number, number, number] = [0, 0, Infinity];
    for (let i = 0; i < CLUSTERS * PER_CLUSTER; i++) {
      if (clusterOf[i] !== c) continue;
      for (let j = 0; j < CLUSTERS * PER_CLUSTER; j++) {
        if (clusterOf[j] !== next) continue;
        const d = place[i]!.distanceToSquared(place[j]!);
        if (d < best[2]) best = [i, j, d];
      }
    }
    link(best[0], best[1], 0);
  }
  channels.forEach((ch, k) => link(hub, ch, k < LIT_CHANNELS ? 1 : 2));

  const lineScatter = new Float32Array(edges.length * 6);
  const lineCatalog = new Float32Array(edges.length * 6);
  const lineSeeds = new Float32Array(edges.length * 2);
  const lineKinds = new Float32Array(edges.length * 2);
  edges.forEach(([a, b, kind], e) => {
    for (const [slot, node] of [[0, a], [1, b]] as const) {
      lineScatter.set(scatter.subarray(node * 3, node * 3 + 3), (e * 2 + slot) * 3);
      lineCatalog.set(catalog.subarray(node * 3, node * 3 + 3), (e * 2 + slot) * 3);
      lineSeeds[e * 2 + slot] = seeds[node]!;
      lineKinds[e * 2 + slot] = kind;
    }
  });
  const lineGeometry = new BufferGeometry();
  lineGeometry.setAttribute("position", new BufferAttribute(lineCatalog, 3));
  lineGeometry.setAttribute("aScatter", new BufferAttribute(lineScatter, 3));
  lineGeometry.setAttribute("aCatalog", new BufferAttribute(lineCatalog, 3));
  lineGeometry.setAttribute("aSeed", new BufferAttribute(lineSeeds, 1));
  lineGeometry.setAttribute("aKind", new BufferAttribute(lineKinds, 1));
  const lineMaterial = new ShaderMaterial({
    vertexShader: LINE_VERTEX,
    fragmentShader: LINE_FRAGMENT,
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  });
  const lines = new LineSegments(lineGeometry, lineMaterial);
  lines.frustumCulled = false;
  root.add(lines);

  // ---------------------------------------------------------------- production 라벨
  const labelGeometry = new BufferGeometry();
  labelGeometry.setAttribute("position", new BufferAttribute(Float32Array.from([place[hub]!.x, place[hub]!.y, place[hub]!.z]), 3));
  labelGeometry.setAttribute("aAlpha", new BufferAttribute(Float32Array.of(1), 1));
  labelGeometry.setAttribute("size", new BufferAttribute(Float32Array.of(13), 1));
  const labelMaterial = new ShaderMaterial({
    vertexShader: SPARK_VERTEX,
    fragmentShader: LABEL_FRAGMENT,
    uniforms: { ...uniforms, uColor: { value: MOON } },
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  });
  root.add(new Points(labelGeometry, labelMaterial));

  // ---------------------------------------------------------------- 흐르는 빛
  // 채널 빛: 공식 프롬프트 ↔ 채워진 채널. 방향은 단계가 정한다(run 은 밖으로, eval 은 안으로)
  // 산책 빛: 직군 안 선을 따라 이웃으로 걸어간다 (콘솔 로그인 화면과 같은 움직임)
  const CHANNEL_SPARKS = 12;
  const WALK_SPARKS = 16;
  const sparkCount = CHANNEL_SPARKS + WALK_SPARKS;
  const channelSparks: Pulse[] = Array.from({ length: CHANNEL_SPARKS }, (_, i) => ({
    a: hub,
    b: channels[i % LIT_CHANNELS]!,
    t: i / CHANNEL_SPARKS,
    speed: 0.16 + rand() * 0.1,
  }));
  const walkSparks: Pulse[] = Array.from({ length: WALK_SPARKS }, () => {
    const a = Math.floor(rand() * CLUSTERS * PER_CLUSTER);
    return { a, b: neighbors[a]![0] ?? a, t: rand(), speed: 0.3 + rand() * 0.45 };
  });
  const sparkPositions = new Float32Array(sparkCount * 3);
  const sparkAlpha = new Float32Array(sparkCount);
  const sparkSizes = new Float32Array(sparkCount).fill(5.2);
  const sparkGeometry = new BufferGeometry();
  sparkGeometry.setAttribute("position", new BufferAttribute(sparkPositions, 3));
  sparkGeometry.setAttribute("aAlpha", new BufferAttribute(sparkAlpha, 1));
  sparkGeometry.setAttribute("size", new BufferAttribute(sparkSizes, 1));
  const sparkMaterial = new ShaderMaterial({
    vertexShader: SPARK_VERTEX,
    fragmentShader: SPARK_FRAGMENT,
    uniforms: { ...uniforms, uColor: { value: MOON } },
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  });
  const sparks = new Points(sparkGeometry, sparkMaterial);
  sparks.frustumCulled = false;
  root.add(sparks);

  const scratch = new Vector3();

  // ---------------------------------------------------------------- 단계 → 목표값
  const target = { gather: 0, lines: 0, hub: 0, channels: 0, out: 0, back: 0, walk: 0, later: 0, zoom: 30, lift: 1.2, turn: 0 };
  const now = { ...target };
  function aim(s: number) {
    target.gather = smooth(STAGE.where - 0.4, STAGE.wedge + 0.7, s);
    target.lines = smooth(STAGE.wedge - 0.1, STAGE.wedge + 0.9, s);
    target.hub = smooth(STAGE.deploy - 0.3, STAGE.deploy + 0.5, s);
    target.channels = smooth(STAGE.deploy - 0.2, STAGE.deploy + 0.7, s);
    target.out = smooth(STAGE.delivery - 0.4, STAGE.delivery + 0.2, s) * (1 - smooth(STAGE.eval - 0.4, STAGE.eval, s));
    target.back = smooth(STAGE.eval - 0.4, STAGE.eval + 0.1, s) * (1 - smooth(STAGE.later - 0.3, STAGE.later + 0.2, s));
    target.walk = smooth(STAGE.deploy, STAGE.delivery, s) * (1 - 0.7 * smooth(STAGE.later, STAGE.close, s));
    target.later = smooth(STAGE.later - 0.4, STAGE.later + 0.1, s) * (1 - smooth(STAGE.close - 0.4, STAGE.close + 0.3, s));
    // 흩어질 때는 멀리서, 모일 때는 가까이, 채널이 뜨면 고리가 다 들어오게 물러난다
    target.zoom = s < STAGE.anatomy ? 31 - smooth(STAGE.where, STAGE.wedge + 0.8, s) * 8 : 33 + smooth(STAGE.later, STAGE.close, s) * 3;
    target.lift = 1.2 + smooth(STAGE.deploy - 0.5, STAGE.deploy + 0.3, s) * 1.6;
    target.turn = s * 0.16;
  }
  aim(0);

  // ---------------------------------------------------------------- 크기
  const narrowQuery = window.matchMedia("(max-width: 900px)");
  function resize() {
    const w = host.clientWidth;
    const h = host.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    // 넓은 화면에서는 오른쪽으로 비켜 두어 왼쪽 글자(제목)와 겹치지 않게 한다
    root.position.x = narrowQuery.matches ? 0 : 8.5;
    uniforms.uIntensity.value = narrowQuery.matches ? 0.62 : 1;
  }
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  resize();

  // ---------------------------------------------------------------- 그리기
  let last = performance.now();
  let elapsed = 0;
  let visible = true;
  let pageVisible = !document.hidden;

  function stepSparks(dt: number) {
    const outward = now.out >= now.back;
    const flow = Math.max(now.out, now.back) * now.channels;
    channelSparks.forEach((p, i) => {
      p.t = (p.t + dt * p.speed) % 1;
      const t = outward ? p.t : 1 - p.t;
      scratch.lerpVectors(place[p.a]!, place[p.b]!, t);
      sparkPositions.set([scratch.x, scratch.y, scratch.z], i * 3);
      // 양 끝에서는 흐리게 — 점에서 튀어나오는 게 아니라 선을 타고 흐르는 것처럼
      sparkAlpha[i] = flow * Math.sin(p.t * Math.PI);
    });
    walkSparks.forEach((p, k) => {
      p.t += dt * p.speed;
      if (p.t >= 1) {
        const next = neighbors[p.b]!;
        const options = next.length > 1 ? next.filter((x) => x !== p.a) : next;
        p.a = p.b;
        p.b = options.length ? options[Math.floor(rand() * options.length)]! : p.a;
        p.t = 0;
      }
      const i = CHANNEL_SPARKS + k;
      scratch.lerpVectors(place[p.a]!, place[p.b]!, p.t);
      sparkPositions.set([scratch.x, scratch.y, scratch.z], i * 3);
      sparkAlpha[i] = now.walk * now.gather * 0.8;
    });
    sparkGeometry.attributes.position!.needsUpdate = true;
    sparkGeometry.attributes.aAlpha!.needsUpdate = true;
  }

  function frame(time: number) {
    const dt = Math.min((time - last) / 1000, 0.05); // 탭 복귀 직후 한 번에 튀지 않게
    last = time;
    elapsed += dt;

    // 목차 링크로 멀리 건너뛰어도 순간이동하지 않게 목표값을 따라간다
    const k = 1 - Math.exp(-dt * 2.6);
    for (const key of Object.keys(target) as Array<keyof typeof target>) {
      now[key] += (target[key] - now[key]) * k;
    }

    uniforms.uTime.value = elapsed;
    uniforms.uGather.value = now.gather;
    uniforms.uLines.value = now.lines;
    uniforms.uHub.value = now.hub;
    uniforms.uChannels.value = now.channels;
    uniforms.uLater.value = now.later;

    root.rotation.y = elapsed * 0.025 + now.turn;
    camera.position.z = now.zoom;
    camera.position.y = now.lift;
    camera.lookAt(0, 0, 0);

    stepSparks(dt);
    renderer.render(scene, camera);
  }

  function sync() {
    const run = visible && pageVisible;
    if (run) last = performance.now();
    renderer.setAnimationLoop(run ? frame : null);
  }

  function onVisibility() {
    pageVisible = !document.hidden;
    sync();
  }
  document.addEventListener("visibilitychange", onVisibility);
  sync();

  return {
    setStage(s) {
      aim(s);
    },
    setVisible(v) {
      if (v === visible) return;
      visible = v;
      sync();
    },
    dispose() {
      renderer.setAnimationLoop(null);
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      for (const g of [pointGeometry, lineGeometry, labelGeometry, sparkGeometry]) g.dispose();
      for (const m of [pointMaterial, lineMaterial, labelMaterial, sparkMaterial]) m.dispose();
      renderer.dispose();
      canvas.remove();
    },
  };
}
