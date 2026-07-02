/**
 * The home "voyage" engine.
 *
 * One fixed WebGL canvas + fixed HTML overlays. The page's scroll height is a
 * timeline: scrolling never moves content - it advances a camera along a 3D
 * path (nebulae, asteroid belt, one beacon per project, a final portal) and
 * cross-fades the matching overlay. Scroll velocity feeds the belt physics:
 * scrolling down shakes asteroids into collisions (sparks), scrolling up pulls
 * them into a gravitational vortex back to formation.
 *
 * Progressive enhancement: without WebGL or with prefers-reduced-motion the
 * `cinema` class is never added and the sections render as a normal page.
 */
import * as THREE from 'three';
import type Lenis from 'lenis';

interface Segment {
  id: string;
  el: HTMLElement;
  weight: number;
  side: 'left' | 'right' | 'center';
  isProject: boolean;
  /** Global progress window [start, end] (0..1). */
  start: number;
  end: number;
}

export interface VoyageHandle {
  seek(id: string, immediate?: boolean): void;
  dispose(): void;
}

const DEPTH = 44; // world units per weight unit of scroll
const BG = 0x040b0b;
const CYAN = 0x2efafa;
const TEAL = 0x34c2c9;
const DEEP = 0x155e75;

function glowTexture(hex: string): THREE.Texture {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, `${hex}ff`);
  g.addColorStop(0.35, `${hex}66`);
  g.addColorStop(1, `${hex}00`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function mountVoyage(opts: {
  canvas: HTMLCanvasElement;
  container: HTMLElement;
  lenis: Lenis;
}): VoyageHandle | null {
  const { canvas, container, lenis } = opts;

  // --- Capability gate -----------------------------------------------------
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  } catch {
    return null;
  }

  const isMobile = window.matchMedia('(max-width: 840px)').matches;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.75 : 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(BG, 1);

  // --- Timeline from the DOM ----------------------------------------------
  const els = Array.from(container.querySelectorAll<HTMLElement>('[data-seg]'));
  if (!els.length) return null;

  const segments: Segment[] = els.map((el) => ({
    id: el.dataset.seg!,
    el,
    weight: Number(el.dataset.weight ?? 1),
    side: (el.dataset.side as Segment['side']) ?? 'center',
    isProject: 'project' in el.dataset,
    start: 0,
    end: 0,
  }));
  const totalWeight = segments.reduce((s, x) => s + x.weight, 0);
  let acc = 0;
  for (const s of segments) {
    s.start = acc / totalWeight;
    acc += s.weight;
    s.end = acc / totalWeight;
  }

  // Cinema mode on: sections become fixed overlays, the container becomes the timeline.
  document.documentElement.classList.add('cinema');
  container.style.height = `${totalWeight * 100 + 60}vh`;

  // --- Scene ---------------------------------------------------------------
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(BG, 0.0072);
  const camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 400);

  // Flight path: one control point per segment boundary, gently weaving.
  const points: THREE.Vector3[] = [];
  let cum = 0;
  for (let i = 0; i <= segments.length; i++) {
    points.push(new THREE.Vector3(7 * Math.sin(i * 1.9), 2.4 * Math.sin(i * 1.3 + 1), -cum * DEPTH));
    cum += segments[i]?.weight ?? 1;
  }
  const path = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.35);
  const END_Z = points[points.length - 1]!.z;

  // Starfield: a long tube of stars around the whole path.
  {
    const count = isMobile ? 900 : 2000;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const cCyan = new THREE.Color(CYAN);
    const cWhite = new THREE.Color(0xdfffff);
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 16 + Math.random() * 85;
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = Math.sin(a) * r * 0.7;
      pos[i * 3 + 2] = 30 + Math.random() * (END_Z - 90);
      const c = Math.random() < 0.25 ? cCyan : cWhite;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    scene.add(
      new THREE.Points(
        geo,
        new THREE.PointsMaterial({
          size: 0.55,
          vertexColors: true,
          transparent: true,
          opacity: 0.9,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      ),
    );
  }

  // Nebulae: big soft sprites drifting near the path.
  const nebulae: THREE.Sprite[] = [];
  {
    const colors = ['#2EFAFA', '#34C2C9', '#155E75', '#2EFAFA', '#0E7490'];
    for (let i = 0; i < 5; i++) {
      const mat = new THREE.SpriteMaterial({
        map: glowTexture(colors[i]!),
        transparent: true,
        opacity: 0.14 + (i % 2) * 0.08,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const sp = new THREE.Sprite(mat);
      const u = (i + 0.5) / 5;
      const p = path.getPointAt(u);
      sp.position.set(p.x + (i % 2 ? -1 : 1) * (40 + i * 8), p.y + (i % 2 ? 14 : -10), p.z - 30);
      const s = 150 + i * 30;
      sp.scale.set(s, s, 1);
      nebulae.push(sp);
      scene.add(sp);
    }
  }

  // --- Asteroid belt across the project segments ---------------------------
  const projectSegs = segments.filter((s) => s.isProject);
  const beltZ0 = -((projectSegs[0]?.start ?? 0.3) * totalWeight) * DEPTH + 10;
  const beltZ1 = -((projectSegs[projectSegs.length - 1]?.end ?? 0.7) * totalWeight) * DEPTH - 10;

  const AST = isMobile ? 48 : 110;
  const belt = new THREE.InstancedMesh(
    new THREE.DodecahedronGeometry(1, 0),
    new THREE.MeshBasicMaterial({ color: 0x0d3b3f, wireframe: false }),
    AST,
  );
  const beltWire = new THREE.InstancedMesh(
    new THREE.DodecahedronGeometry(1.001, 0),
    new THREE.MeshBasicMaterial({ color: TEAL, wireframe: true, transparent: true, opacity: 0.45 }),
    AST,
  );
  interface Rock {
    base: THREE.Vector3;
    pos: THREE.Vector3;
    vel: THREE.Vector3;
    r: number;
    spin: THREE.Vector3;
    rot: THREE.Euler;
  }
  const rocks: Rock[] = [];
  for (let i = 0; i < AST; i++) {
    const a = Math.random() * Math.PI * 2;
    const rad = 10 + Math.random() * 17;
    const base = new THREE.Vector3(
      Math.cos(a) * rad,
      Math.sin(a) * rad * 0.55,
      beltZ0 + Math.random() * (beltZ1 - beltZ0),
    );
    rocks.push({
      base,
      pos: base.clone(),
      vel: new THREE.Vector3((Math.random() - 0.5), (Math.random() - 0.5), (Math.random() - 0.5)).multiplyScalar(2.2),
      r: 0.45 + Math.random() * 1.3,
      spin: new THREE.Vector3(Math.random(), Math.random(), Math.random()).multiplyScalar(0.8),
      rot: new THREE.Euler(Math.random() * 3, Math.random() * 3, Math.random() * 3),
    });
  }
  scene.add(belt, beltWire);

  // Spark pool for collisions.
  const SPARKS = 300;
  const sparkPos = new Float32Array(SPARKS * 3);
  const sparkVel: THREE.Vector3[] = [];
  const sparkLife = new Float32Array(SPARKS);
  for (let i = 0; i < SPARKS; i++) sparkVel.push(new THREE.Vector3());
  const sparkGeo = new THREE.BufferGeometry();
  sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3));
  const sparks = new THREE.Points(
    sparkGeo,
    new THREE.PointsMaterial({
      color: CYAN,
      size: 0.5,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  scene.add(sparks);
  let sparkCursor = 0;
  const burst = (at: THREE.Vector3, n: number) => {
    for (let k = 0; k < n; k++) {
      const i = sparkCursor++ % SPARKS;
      sparkPos[i * 3] = at.x;
      sparkPos[i * 3 + 1] = at.y;
      sparkPos[i * 3 + 2] = at.z;
      sparkVel[i]!.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).multiplyScalar(9);
      sparkLife[i] = 1;
    }
  };

  // --- Beacons (one per project) + final portal -----------------------------
  interface Beacon {
    group: THREE.Group;
    ring: THREE.Mesh;
    glow: THREE.Sprite;
    seg: Segment;
  }
  const beacons: Beacon[] = [];
  const beaconGlowTex = glowTexture('#2EFAFA');
  for (const seg of projectSegs) {
    const mid = (seg.start + seg.end) / 2;
    const p = path.getPointAt(mid);
    const dir = seg.side === 'left' ? 1 : -1; // beacon opposite to the text card
    const group = new THREE.Group();
    group.position.set(p.x + dir * 7.5, p.y + 0.5, p.z - 6);

    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.1, 1),
      new THREE.MeshBasicMaterial({ color: CYAN, wireframe: true, transparent: true, opacity: 0.9 }),
    );
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(2.2, 0.045, 10, 72),
      new THREE.MeshBasicMaterial({ color: TEAL, transparent: true, opacity: 0.7 }),
    );
    ring.rotation.x = Math.PI / 2.4;
    const glow = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: beaconGlowTex,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    glow.scale.set(9, 9, 1);
    group.add(core, ring, glow);
    scene.add(group);
    beacons.push({ group, ring, glow, seg });
  }

  const portal = new THREE.Group();
  {
    const g1 = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: glowTexture('#2EFAFA'),
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    g1.scale.set(46, 46, 1);
    const r1 = new THREE.Mesh(
      new THREE.TorusGeometry(9, 0.12, 12, 96),
      new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0.8 }),
    );
    const r2 = new THREE.Mesh(
      new THREE.TorusGeometry(12.5, 0.06, 12, 96),
      new THREE.MeshBasicMaterial({ color: DEEP, transparent: true, opacity: 0.7 }),
    );
    portal.add(g1, r1, r2);
    portal.position.set(0, 0, END_Z - 46);
    scene.add(portal);
  }

  // --- Overlay + progress UI ------------------------------------------------
  const progressBar = document.querySelector<HTMLElement>('[data-voyage-progress]');
  const dots = Array.from(document.querySelectorAll<HTMLElement>('[data-voyage-dot]'));

  const applyOverlay = (p: number) => {
    for (const s of segments) {
      const span = s.end - s.start;
      const local = (p - s.start) / span;
      const first = s === segments[0];
      const last = s === segments[segments.length - 1];
      const inV = first ? 1 : smoothstep(0.04, 0.22, local);
      const outV = last ? 1 : 1 - smoothstep(0.8, 0.97, local);
      const vis = Math.max(0, Math.min(inV, outV));
      const el = s.el;
      if (local < -0.25 || local > 1.25) {
        if (el.style.visibility !== 'hidden') el.style.visibility = 'hidden';
        continue;
      }
      el.style.visibility = 'visible';
      el.style.opacity = String(vis);
      const y = (1 - inV) * 52 - (1 - outV) * 52;
      el.style.transform = `translateY(${y.toFixed(1)}px) scale(${(0.985 + 0.015 * vis).toFixed(3)})`;
      el.classList.toggle('is-active', vis > 0.45);
    }
    if (progressBar) progressBar.style.transform = `scaleX(${p.toFixed(4)})`;
    const active = segments.findIndex((s) => p >= s.start && p < s.end);
    dots.forEach((d, i) => d.classList.toggle('is-active', i === Math.max(0, active)));
  };

  // --- Frame loop ------------------------------------------------------------
  let progress = 0;
  let downEnergy = 0;
  let upEnergy = 0;
  let elapsed = 0;
  let last = performance.now();
  let running = true;
  let frame = 0;

  const camTarget = new THREE.Vector3();
  const tmp = new THREE.Vector3();
  const mat4 = new THREE.Matrix4();
  const quat = new THREE.Quaternion();
  const scl = new THREE.Vector3();

  const maxScroll = () => Math.max(1, document.documentElement.scrollHeight - window.innerHeight);

  const tick = () => {
    if (!running) {
      frame = requestAnimationFrame(tick);
      return;
    }
    const now = performance.now();
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    elapsed += dt;

    // Scroll → timeline progress + belt energies (Lenis keeps this smooth).
    const raw = lenis.scroll / maxScroll();
    progress = Math.min(1, Math.max(0, raw));
    const v = lenis.velocity; // px per frame, signed
    downEnergy = lerp(downEnergy, Math.min(1, Math.max(0, v / 55)), 0.08);
    upEnergy = lerp(upEnergy, Math.min(1, Math.max(0, -v / 55)), 0.08);

    // Camera along the path.
    const u = progress;
    path.getPointAt(u, camera.position);
    path.getPointAt(Math.min(1, u + 0.045), camTarget);
    // Ease the gaze toward the active beacon.
    for (const b of beacons) {
      const mid = (b.seg.start + b.seg.end) / 2;
      const w = 1 - Math.min(1, Math.abs(u - mid) / (b.seg.end - b.seg.start));
      if (w > 0) camTarget.lerp(b.group.position, w * 0.35);
    }
    camera.lookAt(camTarget);
    camera.position.y += Math.sin(elapsed * 0.7) * 0.12; // idle breathing

    // Nebulae drift.
    for (let i = 0; i < nebulae.length; i++) {
      nebulae[i]!.material.rotation = elapsed * 0.02 * (i % 2 ? 1 : -1);
    }

    // Belt physics.
    const agitated = downEnergy > 0.04;
    for (let i = 0; i < AST; i++) {
      const r = rocks[i]!;
      if (agitated) {
        r.pos.addScaledVector(r.vel, dt * (0.4 + downEnergy * 2.6));
      }
      if (upEnergy > 0.04) {
        // Vortex: tangential pull around the path axis + spring home.
        tmp.set(-r.pos.y, r.pos.x, 0).normalize();
        r.pos.addScaledVector(tmp, dt * upEnergy * 14);
        r.pos.lerp(r.base, dt * upEnergy * 1.6);
      } else if (!agitated) {
        r.pos.lerp(r.base, dt * 0.5);
      }
      r.rot.x += r.spin.x * dt * (1 + downEnergy * 3);
      r.rot.y += r.spin.y * dt;
      quat.setFromEuler(r.rot);
      scl.setScalar(r.r);
      mat4.compose(r.pos, quat, scl);
      belt.setMatrixAt(i, mat4);
      beltWire.setMatrixAt(i, mat4);
    }
    // Collisions only while agitated, only near the camera (cheap N² slice).
    if (agitated) {
      for (let i = 0; i < AST; i++) {
        const a = rocks[i]!;
        if (Math.abs(a.pos.z - camera.position.z) > 60) continue;
        for (let j = i + 1; j < AST; j++) {
          const b = rocks[j]!;
          const dz = a.pos.z - b.pos.z;
          if (dz > 6 || dz < -6) continue;
          const d2 = a.pos.distanceToSquared(b.pos);
          const rr = a.r + b.r;
          if (d2 < rr * rr) {
            tmp.subVectors(a.pos, b.pos).normalize();
            const va = a.vel.dot(tmp);
            const vb = b.vel.dot(tmp);
            a.vel.addScaledVector(tmp, vb - va);
            b.vel.addScaledVector(tmp, va - vb);
            a.pos.addScaledVector(tmp, rr - Math.sqrt(d2));
            burst(tmp.copy(a.pos).lerp(b.pos, 0.5), 7);
          }
        }
      }
    }
    belt.instanceMatrix.needsUpdate = true;
    beltWire.instanceMatrix.needsUpdate = true;

    // Sparks.
    for (let i = 0; i < SPARKS; i++) {
      if (sparkLife[i]! <= 0) continue;
      sparkLife[i]! -= dt * 1.4;
      sparkPos[i * 3] += sparkVel[i]!.x * dt;
      sparkPos[i * 3 + 1] += sparkVel[i]!.y * dt;
      sparkPos[i * 3 + 2] += sparkVel[i]!.z * dt;
      if (sparkLife[i]! <= 0) sparkPos[i * 3 + 1] = 9999;
    }
    sparkGeo.attributes.position!.needsUpdate = true;

    // Beacons pulse; the active one lights up.
    for (const b of beacons) {
      const mid = (b.seg.start + b.seg.end) / 2;
      const w = Math.max(0, 1 - Math.abs(u - mid) / ((b.seg.end - b.seg.start) * 0.9));
      const pulse = 1 + Math.sin(elapsed * 2.2) * 0.05;
      b.group.scale.setScalar((0.7 + w * 0.5) * pulse);
      b.ring.rotation.z = elapsed * 0.6;
      (b.glow.material as THREE.SpriteMaterial).opacity = 0.25 + w * 0.55;
      b.group.rotation.y = elapsed * 0.35;
    }

    // Portal breathes and brightens on approach.
    const arrive = smoothstep(0.82, 1, u);
    portal.rotation.z = elapsed * 0.25;
    portal.scale.setScalar(0.85 + arrive * 0.35 + Math.sin(elapsed * 1.4) * 0.02);

    applyOverlay(progress);
    renderer.render(scene, camera);
    frame = requestAnimationFrame(tick);
  };

  // --- Wiring ----------------------------------------------------------------
  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  const onVisibility = () => {
    running = !document.hidden;
    if (running) last = performance.now();
  };
  window.addEventListener('resize', onResize);
  document.addEventListener('visibilitychange', onVisibility);

  const seek = (id: string, immediate = false) => {
    const s = segments.find((x) => x.id === id);
    if (!s) return;
    const target = (s.start + (s.end - s.start) * 0.45) * maxScroll();
    lenis.scrollTo(target, immediate ? { immediate: true } : { duration: 1.8 });
  };

  dots.forEach((d) => d.addEventListener('click', () => seek(d.dataset.voyageDot!)));

  applyOverlay(0);
  frame = requestAnimationFrame(tick);

  return {
    seek,
    dispose() {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      renderer.dispose();
      document.documentElement.classList.remove('cinema');
    },
  };
}
