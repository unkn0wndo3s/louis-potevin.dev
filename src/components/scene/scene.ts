/**
 * Space scene - ambient starfield + nebula, plus a scroll-reactive asteroid belt.
 *
 * Behavior contract:
 *  - Scrolling DOWN injects energy: asteroids drift apart, collide elastically
 *    and emit spark bursts on impact.
 *  - Scrolling UP does NOT rewind: a gravity vortex wakes up and pulls the
 *    belt into a slow spiral until it settles back into formation.
 *  - No WebGL, `prefers-reduced-motion`, or a lost context -> the canvas is
 *    removed and the site remains fully readable.
 *
 * Everything runs on a single fixed canvas, capped at DPR 2, paused when the
 * tab is hidden.
 */
import * as THREE from 'three';

const ASTEROID_COUNT = 90;
const BELT_RADIUS = 26;
const BELT_THICKNESS = 9;
const ASTEROID_MIN_R = 0.28;
const ASTEROID_MAX_R = 1.15;
const SPARK_POOL = 240;

interface AsteroidState {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  spin: THREE.Vector3;
  rotation: THREE.Euler;
  radius: number;
  /** Slot in the resting formation, used by the vortex to settle back. */
  home: THREE.Vector3;
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function mountSpaceScene(canvas: HTMLCanvasElement): (() => void) | null {
  if (prefersReducedMotion()) {
    canvas.remove();
    return null;
  }

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch {
    canvas.remove();
    return null;
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight, false);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 400);
  camera.position.set(0, 0, 46);

  scene.add(new THREE.AmbientLight(0x9fdadd, 0.35));
  const key = new THREE.DirectionalLight(0x7ff5f5, 1.4);
  key.position.set(18, 22, 30);
  scene.add(key);

  /* ── Starfield ─────────────────────────────────────────────────────────── */
  const starGeometry = new THREE.BufferGeometry();
  const starCount = 1400;
  const starPositions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    const r = 90 + Math.random() * 220;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    starPositions[i * 3 + 2] = r * Math.cos(phi);
  }
  starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  const stars = new THREE.Points(
    starGeometry,
    new THREE.PointsMaterial({ color: 0xbfeeee, size: 0.55, sizeAttenuation: true, transparent: true, opacity: 0.8 }),
  );
  scene.add(stars);

  /* ── Nebula (two soft additive sprites) ────────────────────────────────── */
  const nebulaTexture = makeGlowTexture();
  for (const [x, y, s, o] of [
    [-34, 14, 120, 0.10],
    [30, -20, 150, 0.07],
  ] as const) {
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: nebulaTexture,
        color: 0x1fa6ad,
        transparent: true,
        opacity: o,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    sprite.position.set(x, y, -60);
    sprite.scale.setScalar(s);
    scene.add(sprite);
  }

  /* ── Asteroid belt (instanced) ─────────────────────────────────────────── */
  const rockGeometry = makeRockGeometry();
  const rockMaterial = new THREE.MeshStandardMaterial({
    color: 0x2a4040,
    roughness: 0.92,
    metalness: 0.12,
    flatShading: true,
  });
  const belt = new THREE.InstancedMesh(rockGeometry, rockMaterial, ASTEROID_COUNT);
  belt.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  scene.add(belt);

  const asteroids: AsteroidState[] = [];
  for (let i = 0; i < ASTEROID_COUNT; i++) {
    const angle = (i / ASTEROID_COUNT) * Math.PI * 2 + Math.random() * 0.35;
    const radius = BELT_RADIUS + (Math.random() - 0.5) * BELT_THICKNESS;
    const home = new THREE.Vector3(
      Math.cos(angle) * radius,
      (Math.random() - 0.5) * 10,
      -8 + Math.sin(angle) * 10,
    );
    asteroids.push({
      position: home.clone(),
      velocity: new THREE.Vector3(),
      spin: new THREE.Vector3(Math.random(), Math.random(), Math.random()).multiplyScalar(0.4),
      rotation: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, 0),
      radius: ASTEROID_MIN_R + Math.random() * (ASTEROID_MAX_R - ASTEROID_MIN_R),
      home,
    });
  }

  /* ── Spark pool for collision impacts ──────────────────────────────────── */
  const sparkGeometry = new THREE.BufferGeometry();
  const sparkPositions = new Float32Array(SPARK_POOL * 3);
  sparkGeometry.setAttribute('position', new THREE.BufferAttribute(sparkPositions, 3));
  const sparkMaterial = new THREE.PointsMaterial({
    color: 0x2efafa,
    size: 0.5,
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const sparks = new THREE.Points(sparkGeometry, sparkMaterial);
  scene.add(sparks);
  const sparkVel: THREE.Vector3[] = [];
  const sparkLife: number[] = [];
  for (let i = 0; i < SPARK_POOL; i++) {
    sparkVel.push(new THREE.Vector3());
    sparkLife.push(0);
    sparkPositions.set([0, -999, 0], i * 3);
  }
  let sparkCursor = 0;

  function burst(at: THREE.Vector3, strength: number) {
    const n = 10 + Math.floor(strength * 8);
    for (let i = 0; i < n; i++) {
      const idx = sparkCursor;
      sparkCursor = (sparkCursor + 1) % SPARK_POOL;
      sparkPositions.set([at.x, at.y, at.z], idx * 3);
      sparkVel[idx]!
        .set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
        .normalize()
        .multiplyScalar(3 + Math.random() * 5 * strength);
      sparkLife[idx] = 0.9;
    }
  }

  /* ── Scroll energy model ───────────────────────────────────────────────── */
  let lastScrollY = window.scrollY;
  let downEnergy = 0; // fuels drift + collisions
  let upEnergy = 0; // fuels the vortex
  let beltVisible = true;

  const beltAnchor = document.querySelector<HTMLElement>('[data-belt-anchor]');
  if (beltAnchor) {
    beltVisible = false;
    new IntersectionObserver(
      (entries) => {
        beltVisible = entries[0]?.isIntersecting ?? true;
      },
      { rootMargin: '20% 0px' },
    ).observe(beltAnchor);
  }

  function onScroll() {
    const delta = window.scrollY - lastScrollY;
    lastScrollY = window.scrollY;
    if (!beltVisible) return;
    if (delta > 0) downEnergy = Math.min(1.6, downEnergy + delta * 0.004);
    else if (delta < 0) upEnergy = Math.min(1.6, upEnergy - delta * 0.004);
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── Simulation ────────────────────────────────────────────────────────── */
  const matrix = new THREE.Matrix4();
  const quaternion = new THREE.Quaternion();
  const scaleVec = new THREE.Vector3();
  const tmp = new THREE.Vector3();
  // Manual timing (THREE.Clock is deprecated).
  let lastTime = performance.now();
  let elapsed = 0;
  let raf = 0;
  let running = true;

  function step() {
    raf = requestAnimationFrame(step);
    if (!running) return;
    const now = performance.now();
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;
    elapsed += dt;
    const t = elapsed;

    stars.rotation.y = t * 0.004;
    downEnergy = Math.max(0, downEnergy - dt * 0.55);
    upEnergy = Math.max(0, upEnergy - dt * 0.4);

    for (const a of asteroids) {
      // Scroll down: outward drift + slight chaos -> collisions happen.
      if (downEnergy > 0.01) {
        tmp.copy(a.position).sub(new THREE.Vector3(0, 0, -8)).normalize();
        a.velocity.addScaledVector(tmp, downEnergy * dt * 2.2);
        a.velocity.x += (Math.random() - 0.5) * downEnergy * dt * 3;
        a.velocity.y += (Math.random() - 0.5) * downEnergy * dt * 3;
      }

      // Scroll up: vortex - tangential pull + gentle fall toward home orbit.
      if (upEnergy > 0.01) {
        tmp.set(-(a.position.y - a.home.y) - a.position.x * 0.3, a.position.x - a.home.x, 0);
        a.velocity.addScaledVector(tmp.normalize(), upEnergy * dt * 3.4);
        tmp.copy(a.home).sub(a.position);
        a.velocity.addScaledVector(tmp, upEnergy * dt * 0.9);
      }

      // Always: soft spring back to formation + drag.
      tmp.copy(a.home).sub(a.position);
      a.velocity.addScaledVector(tmp, dt * 0.25);
      a.velocity.multiplyScalar(1 - dt * 0.8);
      a.position.addScaledVector(a.velocity, dt);

      a.rotation.x += a.spin.x * dt;
      a.rotation.y += a.spin.y * dt;
    }

    // Elastic collisions (spatially naive is fine at N=90).
    if (downEnergy > 0.05) {
      for (let i = 0; i < asteroids.length; i++) {
        const a = asteroids[i]!;
        for (let j = i + 1; j < asteroids.length; j++) {
          const b = asteroids[j]!;
          tmp.copy(b.position).sub(a.position);
          const dist = tmp.length();
          const minDist = a.radius + b.radius;
          if (dist > 0.0001 && dist < minDist) {
            tmp.normalize();
            const relative = tmp.dot(b.velocity.clone().sub(a.velocity));
            if (relative < 0) {
              const impulse = -relative;
              a.velocity.addScaledVector(tmp, -impulse * 0.5);
              b.velocity.addScaledVector(tmp, impulse * 0.5);
              const overlap = minDist - dist;
              a.position.addScaledVector(tmp, -overlap / 2);
              b.position.addScaledVector(tmp, overlap / 2);
              if (impulse > 1.2) {
                burst(a.position.clone().addScaledVector(tmp, a.radius), Math.min(impulse / 4, 1));
              }
            }
          }
        }
      }
    }

    for (let i = 0; i < asteroids.length; i++) {
      const a = asteroids[i]!;
      quaternion.setFromEuler(a.rotation);
      scaleVec.setScalar(a.radius);
      matrix.compose(a.position, quaternion, scaleVec);
      belt.setMatrixAt(i, matrix);
    }
    belt.instanceMatrix.needsUpdate = true;

    for (let i = 0; i < SPARK_POOL; i++) {
      if (sparkLife[i]! <= 0) continue;
      sparkLife[i]! -= dt;
      sparkVel[i]!.multiplyScalar(1 - dt * 2);
      sparkPositions[i * 3] += sparkVel[i]!.x * dt;
      sparkPositions[i * 3 + 1] += sparkVel[i]!.y * dt;
      sparkPositions[i * 3 + 2] += sparkVel[i]!.z * dt;
      if (sparkLife[i]! <= 0) sparkPositions[i * 3 + 1] = -999;
    }
    sparkGeometry.attributes.position!.needsUpdate = true;
    sparkMaterial.opacity = 0.5 + downEnergy * 0.3;

    camera.position.x = Math.sin(t * 0.05) * 1.2;
    camera.position.y = Math.cos(t * 0.04) * 0.8;
    camera.lookAt(0, 0, -8);

    renderer.render(scene, camera);
  }

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight, false);
  }
  window.addEventListener('resize', onResize);

  function onVisibility() {
    running = document.visibilityState === 'visible';
    if (running) lastTime = performance.now(); // swallow the pause
  }
  document.addEventListener('visibilitychange', onVisibility);

  step();

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
    document.removeEventListener('visibilitychange', onVisibility);
    renderer.dispose();
    rockGeometry.dispose();
    starGeometry.dispose();
    sparkGeometry.dispose();
  };
}

/* ── Helpers ─────────────────────────────────────────────────────────────── */

/** Irregular rock: a dodecahedron with jittered vertices. */
function makeRockGeometry(): THREE.BufferGeometry {
  const geometry = new THREE.DodecahedronGeometry(1, 0);
  const pos = geometry.attributes.position!;
  for (let i = 0; i < pos.count; i++) {
    const jitter = 0.78 + Math.random() * 0.44;
    pos.setXYZ(i, pos.getX(i) * jitter, pos.getY(i) * jitter, pos.getZ(i) * jitter);
  }
  geometry.computeVertexNormals();
  return geometry;
}

/** Radial-gradient sprite texture used for the nebula glow. */
function makeGlowTexture(): THREE.Texture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
