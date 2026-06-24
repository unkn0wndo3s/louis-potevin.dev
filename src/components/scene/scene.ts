import * as THREE from 'three';

// ─────────────────────────────────────────────────────────────────────────────
// Ambient space background: starfield, subtle nebula, and a slow-drifting,
// slow-rotating asteroid. No scroll binding, no engine flames.
// Slight pointer parallax. Respects prefers-reduced-motion.
// ─────────────────────────────────────────────────────────────────────────────

export interface SceneHandle {
  /** Kept for compatibility — no-op (no more impact/flame effect). */
  setImpact(value: number): void;
  destroy(): void;
}

const COLORS = {
  star: 0xecf5f5,
  starCool: 0x34c2c9,
  starAccent: 0x2efafa,
  nebulaA: 0x288181,
  nebulaB: 0x1fa6ad,
  rock: 0x1a2a2a,
  rim: 0x34c2c9,
};

const prefersReduced =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Small reusable radial texture (soft glow). */
function radialTexture(inner: string, outer = 'rgba(0,0,0,0)'): THREE.Texture {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, inner);
  g.addColorStop(0.4, inner);
  g.addColorStop(1, outer);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function initScene(canvas: HTMLCanvasElement): SceneHandle {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x040b0b, 0.012);

  const camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    0.1,
    400,
  );
  camera.position.set(0, 0, 18);

  // ── Lighting (cold, consistent with Nova tokens) ───────────────────────────
  const ambient = new THREE.AmbientLight(0x16323a, 1.0);
  scene.add(ambient);
  const key = new THREE.DirectionalLight(COLORS.starCool, 0.9);
  key.position.set(-6, 5, 9);
  scene.add(key);
  const rimLight = new THREE.DirectionalLight(COLORS.starAccent, 0.4);
  rimLight.position.set(8, -3, 4);
  scene.add(rimLight);

  // ── Starfield ──────────────────────────────────────────────────────────────
  const STAR_COUNT = prefersReduced ? 700 : 1700;
  const starGeo = new THREE.BufferGeometry();
  const starPos = new Float32Array(STAR_COUNT * 3);
  const starCol = new Float32Array(STAR_COUNT * 3);
  const palette = [
    new THREE.Color(COLORS.star),
    new THREE.Color(COLORS.starCool),
    new THREE.Color(COLORS.starAccent),
  ];
  for (let i = 0; i < STAR_COUNT; i++) {
    starPos[i * 3] = (Math.random() - 0.5) * 120;
    starPos[i * 3 + 1] = (Math.random() - 0.5) * 120;
    starPos[i * 3 + 2] = (Math.random() - 0.5) * 120 - 20;
    const col = palette[Math.random() < 0.78 ? 0 : Math.random() < 0.6 ? 1 : 2];
    starCol[i * 3] = col.r;
    starCol[i * 3 + 1] = col.g;
    starCol[i * 3 + 2] = col.b;
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  starGeo.setAttribute('color', new THREE.BufferAttribute(starCol, 3));
  const starMat = new THREE.PointsMaterial({
    size: 0.42,
    map: radialTexture('rgba(255,255,255,0.95)'),
    transparent: true,
    depthWrite: false,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
  });
  const stars = new THREE.Points(starGeo, starMat);
  scene.add(stars);

  // ── Nebula (soft sprites, pushed far into the background) ──────────────────
  const nebula = new THREE.Group();
  const nebTex = radialTexture('rgba(40,129,129,0.55)');
  [
    { x: -14, y: 8, z: -45, s: 60, c: COLORS.nebulaA },
    { x: 16, y: -10, z: -55, s: 72, c: COLORS.nebulaB },
    { x: 4, y: 14, z: -40, s: 46, c: COLORS.nebulaA },
  ].forEach((n) => {
    const mat = new THREE.SpriteMaterial({
      map: nebTex,
      color: n.c,
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const sp = new THREE.Sprite(mat);
    sp.position.set(n.x, n.y, n.z);
    sp.scale.set(n.s, n.s, 1);
    nebula.add(sp);
  });
  scene.add(nebula);

  // ── Asteroid (cold rock, subtle halo) ──────────────────────────────────────
  const asteroid = new THREE.Group();
  const rockGeo = new THREE.IcosahedronGeometry(1.9, 2);
  const pos = rockGeo.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const h = Math.sin(v.x * 4.1) * Math.cos(v.y * 3.7) * Math.sin(v.z * 4.3);
    const d = 1 + h * 0.16;
    v.multiplyScalar(d);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  rockGeo.computeVertexNormals();
  const rockMat = new THREE.MeshStandardMaterial({
    color: COLORS.rock,
    emissive: COLORS.rim,
    emissiveIntensity: 0.12,
    roughness: 0.92,
    metalness: 0.12,
    flatShading: true,
  });
  const rock = new THREE.Mesh(rockGeo, rockMat);
  asteroid.add(rock);

  // very light cold halo, just to separate the rock from the background
  const glow = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: radialTexture('rgba(52,194,201,0.7)'),
      color: COLORS.rim,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  glow.scale.set(7.5, 7.5, 1);
  asteroid.add(glow);

  // ambient position: top right, set back
  asteroid.position.set(6.5, 4.5, -2);
  scene.add(asteroid);

  // ── State & loop ───────────────────────────────────────────────────────────
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  let running = true;

  function onPointer(e: PointerEvent) {
    pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
    pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2;
  }

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function onVisibility() {
    running = document.visibilityState === 'visible';
    if (running) loop();
  }

  window.addEventListener('resize', onResize);
  window.addEventListener('pointermove', onPointer, { passive: true });
  document.addEventListener('visibilitychange', onVisibility);

  const clock = new THREE.Clock();
  let rafId = 0;

  function loop() {
    if (!running) return;
    rafId = requestAnimationFrame(loop);
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;

    // slow background drift
    stars.rotation.y += dt * 0.01;
    nebula.rotation.z += dt * 0.004;

    // asteroid: self-rotation + slight float (no scroll binding)
    if (!prefersReduced) {
      rock.rotation.x += dt * 0.18;
      rock.rotation.y += dt * 0.26;
      asteroid.position.y = 4.5 + Math.sin(t * 0.25) * 0.5;
      asteroid.position.x = 6.5 + Math.cos(t * 0.18) * 0.4;
    }

    // smooth camera parallax via pointer
    pointer.x += (pointer.tx - pointer.x) * dt * 2;
    pointer.y += (pointer.ty - pointer.y) * dt * 2;
    camera.position.x = pointer.x * 1.2;
    camera.position.y = -pointer.y * 0.8 + Math.sin(t * 0.3) * 0.15;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }
  loop();

  return {
    setImpact() {
      /* no-op: kept for API compatibility */
    },
    destroy() {
      running = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointer);
      document.removeEventListener('visibilitychange', onVisibility);
      renderer.dispose();
      starGeo.dispose();
      rockGeo.dispose();
      scene.traverse((o) => {
        const m = (o as THREE.Mesh).material;
        if (Array.isArray(m)) m.forEach((mm) => mm.dispose());
        else if (m) (m as THREE.Material).dispose();
      });
    },
  };
}