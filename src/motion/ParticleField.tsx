/**
 * ParticleField — the 3D shapes that fly out of the name on ignite.
 *
 * Ported from `/src/components/ParticleField.tsx`. The production site
 * mounts this as a fixed full-viewport canvas that listens for an
 * `intro-ignite` window event from `CinematicIntro` at the spark moment.
 * Here in the library the Canvas is sized to its parent (e.g. a 16:9
 * storybook stage) and an `autoIgnite` prop lets the story fire the
 * event on mount.
 *
 * Interactions
 * ------------
 *   - Move the pointer → parent rotates for parallax.
 *   - Click a shape    → it bumps away from the camera and emits sparks.
 *   - Click 3x within ~2s → it dissolves in a burst of particles and
 *                           respawns off-screen shortly after.
 *   - Shape-on-shape collisions → sparks, and ~8% of the time one of the
 *                                  colliding shapes dissolves instead.
 *
 * Shapes start at the origin hidden, wait for `intro-ignite`, then fly
 * outward on randomized spherical vectors and decelerate into an idle
 * drift. Edge color lerps from white (for the dark intro background)
 * to a per-layer gray over 2.2s — matching the CSS burst timing.
 */
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const SHAPE_COUNT = 22;
const MAX_SPEED = 0.016;
const BUMP_MAX_SPEED = 0.06;
const BUMP_COOLDOWN = 30;
const SEPARATION_FORCE = 0.005;
const DAMPING = 0.025;
const SPARK_COUNT = 6;
const SPARK_LIFE = 60;
const DISSOLVE_CHANCE = 0.08;
const DISSOLVE_PARTICLE_COUNT = 40;
const DISSOLVE_LIFE = 90;
const COLOR_TRANSITION_FRAMES = 132;

type ShapeType = "tetrahedron" | "box" | "dodecahedron" | "icosahedron";

interface Spark {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number;
  maxLife: number;
}

function createGeometry(type: ShapeType, size: number): THREE.BufferGeometry {
  switch (type) {
    case "tetrahedron":  return new THREE.TetrahedronGeometry(size, 0);
    case "box":          return new THREE.BoxGeometry(size, size, size);
    case "dodecahedron": return new THREE.DodecahedronGeometry(size, 0);
    case "icosahedron":  return new THREE.IcosahedronGeometry(size, 0);
  }
}

interface ShapeState {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  targetVelocity: THREE.Vector3;
  radius: number;
  rotSpeed: THREE.Vector3;
  group: THREE.Group;
  burstPhase: number;
  lineMat: THREE.LineBasicMaterial;
  fillMat: THREE.MeshBasicMaterial;
  dissolved: boolean;
  dissolveTimer: number;
  bumpCooldown: number;
  targetEdgeColor: THREE.Color;
  _burstVel: THREE.Vector3;
}

function spawnOffScreen(baseSize: number) {
  const method = Math.random();
  const buf = baseSize + 1.5;
  const speed = 0.006 + Math.random() * 0.006;
  let px: number, py: number, pz: number, vx: number, vy: number, vz: number;

  if (method < 0.3) {
    const edge = Math.floor(Math.random() * 4);
    pz = (Math.random() - 0.5) * 6;
    switch (edge) {
      case 0: px = -6 - buf; py = (Math.random() - 0.5) * 8; break;
      case 1: px = 6 + buf;  py = (Math.random() - 0.5) * 8; break;
      case 2: px = (Math.random() - 0.5) * 12; py = 5 + buf; break;
      default: px = (Math.random() - 0.5) * 12; py = -5 - buf; break;
    }
    const targetX = (Math.random() - 0.5) * 3;
    const targetY = (Math.random() - 0.5) * 2;
    const dx = targetX - px;
    const dy = targetY - py;
    const len = Math.sqrt(dx * dx + dy * dy);
    vx = (dx / len) * speed;
    vy = (dy / len) * speed;
    vz = (Math.random() - 0.5) * speed * 0.5;
  } else if (method < 0.6) {
    px = (Math.random() - 0.5) * 5;
    py = (Math.random() - 0.5) * 3;
    pz = -10 - Math.random() * 4;
    const slow = speed * 0.5;
    vx = (Math.random() - 0.5) * slow * 0.2;
    vy = (Math.random() - 0.5) * slow * 0.2;
    vz = slow * (0.9 + Math.random() * 0.3);
  } else {
    px = (Math.random() - 0.5) * 3;
    py = (Math.random() - 0.5) * 2;
    pz = 8 + Math.random() * 4;
    const slow = speed * 0.4;
    vx = (Math.random() - 0.5) * slow * 0.2;
    vy = (Math.random() - 0.5) * slow * 0.2;
    vz = -slow * (0.7 + Math.random() * 0.4);
  }

  return { px, py, pz, vx, vy, vz };
}

function Shapes({ introComplete }: { introComplete: boolean }) {
  const parentRef = useRef<THREE.Group>(null);
  const sparksRef = useRef<Spark[]>([]);
  const sparkPointsRef = useRef<THREE.Points | null>(null);
  const burstTriggered = useRef(false);
  const frameCount = useRef(0);
  const revealedCount = useRef(0);
  const { camera, gl } = useThree();
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const clickTracker = useRef<Map<number, { count: number; timer: number }>>(new Map());
  const colorTransitionRef = useRef(0);

  const shapes = useMemo(() => {
    const types: ShapeType[] = ["tetrahedron", "box", "dodecahedron", "icosahedron"];
    const states: ShapeState[] = [];

    for (let i = 0; i < SHAPE_COUNT; i++) {
      const type = types[i % types.length];
      const layer = i % 3;

      const baseSize =
        layer === 0 ? 0.25 + Math.random() * 0.3 :
        layer === 1 ? 0.35 + Math.random() * 0.4 :
                      0.5 + Math.random() * 0.55;

      const geo = createGeometry(type, baseSize);
      const edgesGeo = new THREE.EdgesGeometry(geo);

      const fillMat = new THREE.MeshBasicMaterial({
        color: "#f9f9f9",
        depthWrite: false,
        side: THREE.FrontSide,
        toneMapped: false,
        transparent: true,
        opacity: 0,
      });

      const edgeColor = layer === 0 ? "#c0c0c0" : layer === 1 ? "#999999" : "#777777";
      const lineMat = new THREE.LineBasicMaterial({ color: "#ffffff", linewidth: 1 });

      const group = new THREE.Group();
      group.add(new THREE.Mesh(geo, fillMat));
      group.add(new THREE.LineSegments(edgesGeo, lineMat));
      group.position.set(0, 0, 0);
      group.visible = false;

      const theta = Math.random() * Math.PI * 2;
      const phi = (0.3 + Math.random() * 0.4) * Math.PI;
      const burstSpeed = 0.06 + Math.random() * 0.06;

      const driftAngle = (i / SHAPE_COUNT) * Math.PI * 2 + (Math.random() - 0.5) * 1.2;
      const driftSpeed = 0.006 + Math.random() * 0.005;

      const state: ShapeState = {
        position: new THREE.Vector3(0, 0, 0),
        velocity: new THREE.Vector3(0, 0, 0),
        targetVelocity: new THREE.Vector3(
          Math.cos(driftAngle) * driftSpeed * 0.7,
          Math.sin(driftAngle) * driftSpeed * 0.7,
          (Math.random() - 0.5) * driftSpeed * 1.2,
        ),
        radius: baseSize,
        rotSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.003,
          (Math.random() - 0.5) * 0.003,
          (Math.random() - 0.5) * 0.003,
        ),
        group,
        burstPhase: 0,
        lineMat,
        fillMat,
        dissolved: false,
        dissolveTimer: 0,
        bumpCooldown: 0,
        targetEdgeColor: new THREE.Color(edgeColor),
        _burstVel: new THREE.Vector3(
          Math.sin(phi) * Math.cos(theta) * burstSpeed,
          Math.sin(phi) * Math.sin(theta) * burstSpeed * 0.7,
          Math.cos(phi) * burstSpeed * 0.8 + (Math.random() - 0.5) * burstSpeed * 0.4,
        ),
      };
      states.push(state);
    }

    return states;
  }, []);

  useEffect(() => {
    if (!introComplete) return;
    if (burstTriggered.current) return;

    burstTriggered.current = true;
    colorTransitionRef.current = COLOR_TRANSITION_FRAMES;
    revealedCount.current = shapes.length;

    shapes.forEach((s) => {
      const spread = 5;
      s.group.position.set(
        (Math.random() - 0.5) * spread * 2,
        (Math.random() - 0.5) * spread * 1.5,
        (Math.random() - 0.5) * spread * 0.8,
      );
      s.position.copy(s.group.position);
      s.lineMat.color.copy(s.targetEdgeColor);
      s.fillMat.opacity = 1;
      s.fillMat.transparent = false;
      s.fillMat.depthWrite = true;
      s.group.visible = true;
      s.burstPhase = 0;
      s.velocity.copy(s.targetVelocity);
      s.rotSpeed.set(
        (Math.random() - 0.5) * 0.003,
        (Math.random() - 0.5) * 0.003,
        (Math.random() - 0.5) * 0.003,
      );
    });
  }, [introComplete, shapes]);

  useEffect(() => {
    const handleIgnite = () => {
      if (burstTriggered.current) return;
      burstTriggered.current = true;
      colorTransitionRef.current = 0;
      revealedCount.current = 0;
      frameCount.current = 0;

      shapes.forEach((s) => {
        s.burstPhase = 1;
        s.lineMat.color.set("#ffffff");
        s.fillMat.opacity = 0;
        s.fillMat.transparent = true;
        s.fillMat.depthWrite = false;
        s.velocity.copy(s._burstVel);
        s.rotSpeed.set(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
        );
      });
    };

    window.addEventListener("intro-ignite", handleIgnite);
    return () => window.removeEventListener("intro-ignite", handleIgnite);
  }, [shapes]);

  const maxSparks = 300;
  const sparkGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(maxSparks * 3);
    const opacities = new Float32Array(maxSparks);
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("opacity", new THREE.BufferAttribute(opacities, 1));
    geo.setDrawRange(0, 0);
    return geo;
  }, []);

  const sparkMat = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: "#999999",
        size: 0.07,
        transparent: true,
        opacity: 1,
        depthWrite: false,
        sizeAttenuation: true,
      }),
    [],
  );

  const addedRef = useRef(false);
  const tempVec = useMemo(() => new THREE.Vector3(), []);

  const emitSparks = (contactPoint: THREE.Vector3) => {
    for (let i = 0; i < SPARK_COUNT; i++) {
      const dir = new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5,
      )
        .normalize()
        .multiplyScalar(0.02 + Math.random() * 0.03);
      sparksRef.current.push({
        position: contactPoint.clone(),
        velocity: dir,
        life: SPARK_LIFE,
        maxLife: SPARK_LIFE,
      });
    }
    if (sparksRef.current.length > maxSparks) {
      sparksRef.current = sparksRef.current.slice(-maxSparks);
    }
  };

  const dissolveShape = (s: ShapeState) => {
    if (s.dissolved) return;
    s.dissolved = true;
    s.dissolveTimer = 180;
    s.group.visible = false;

    for (let i = 0; i < DISSOLVE_PARTICLE_COUNT; i++) {
      const dir = new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5,
      )
        .normalize()
        .multiplyScalar(0.02 + Math.random() * 0.04);

      sparksRef.current.push({
        position: s.position.clone().add(
          new THREE.Vector3(
            (Math.random() - 0.5) * s.radius,
            (Math.random() - 0.5) * s.radius,
            (Math.random() - 0.5) * s.radius,
          ),
        ),
        velocity: dir,
        life: DISSOLVE_LIFE,
        maxLife: DISSOLVE_LIFE,
      });
    }
    if (sparksRef.current.length > maxSparks) {
      sparksRef.current = sparksRef.current.slice(-maxSparks);
    }
  };

  useEffect(() => {
    const canvas = gl.domElement;

    const handlePointerDown = (event: PointerEvent) => {
      if (!burstTriggered.current) return;

      const rect = canvas.getBoundingClientRect();
      // Only respond to clicks inside this canvas.
      if (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      ) {
        return;
      }

      const mouse = new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1,
      );

      raycaster.setFromCamera(mouse, camera);
      const ray = raycaster.ray;

      let bestIdx = -1;
      let bestDist = Infinity;
      const worldPos = new THREE.Vector3();

      for (let i = 0; i < shapes.length; i++) {
        const s = shapes[i];
        if (s.dissolved || !s.group.visible) continue;
        s.group.getWorldPosition(worldPos);
        const dist = ray.distanceToPoint(worldPos);
        const hitRadius = Math.max(s.radius * 2.5, 1.0);
        if (dist < hitRadius && dist < bestDist) {
          bestDist = dist;
          bestIdx = i;
        }
      }

      if (bestIdx >= 0) {
        const s = shapes[bestIdx];
        const entry = clickTracker.current.get(bestIdx) || { count: 0, timer: 0 };
        entry.count++;
        entry.timer = 120;
        clickTracker.current.set(bestIdx, entry);

        if (entry.count >= 3) {
          dissolveShape(s);
          clickTracker.current.delete(bestIdx);
        } else {
          const dir = s.position.clone().sub(camera.position).normalize();
          dir.x += (Math.random() - 0.5) * 0.6;
          dir.y += (Math.random() - 0.5) * 0.6;
          dir.z += (Math.random() - 0.5) * 0.3;
          dir.normalize();
          const bumpSpeed = 0.04 + Math.random() * 0.02;
          s.velocity.copy(dir.multiplyScalar(bumpSpeed));
          s.bumpCooldown = BUMP_COOLDOWN;
          s.rotSpeed.set(
            (Math.random() - 0.5) * 0.025,
            (Math.random() - 0.5) * 0.025,
            (Math.random() - 0.5) * 0.025,
          );
          emitSparks(s.position.clone());
        }
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);
    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, [camera, gl, shapes, raycaster]);

  useFrame(({ pointer }) => {
    const parent = parentRef.current;
    if (!parent) return;

    if (!addedRef.current) {
      shapes.forEach((s) => parent.add(s.group));
      const points = new THREE.Points(sparkGeo, sparkMat);
      parent.add(points);
      sparkPointsRef.current = points;
      addedRef.current = true;
    }

    frameCount.current++;

    if (burstTriggered.current && revealedCount.current < shapes.length) {
      const toReveal = Math.min(shapes.length, Math.floor(frameCount.current * 6));
      while (revealedCount.current < toReveal) {
        const s = shapes[revealedCount.current];
        s.group.visible = true;
        revealedCount.current++;
      }
    }

    if (burstTriggered.current && colorTransitionRef.current < COLOR_TRANSITION_FRAMES) {
      colorTransitionRef.current++;
      const t = colorTransitionRef.current / COLOR_TRANSITION_FRAMES;
      const ease = 1 - Math.pow(1 - t, 2);

      shapes.forEach((s) => {
        if (s.dissolved) return;
        s.lineMat.color.copy(new THREE.Color("#ffffff")).lerp(s.targetEdgeColor, ease);
        const fillT = Math.max(0, (t - 0.4) / 0.6);
        s.fillMat.opacity = fillT;
        s.fillMat.transparent = fillT < 1;
        s.fillMat.depthWrite = fillT >= 1;
      });
    }

    if (burstTriggered.current) {
      shapes.forEach((s) => {
        if (s.burstPhase === 1) {
          s.velocity.lerp(s.targetVelocity, 0.012);
          const speed = s.velocity.length();
          if (speed < 0.015) {
            s.burstPhase = 2;
            s.rotSpeed.set(
              (Math.random() - 0.5) * 0.003,
              (Math.random() - 0.5) * 0.003,
              (Math.random() - 0.5) * 0.003,
            );
          }
        }
      });
    }

    clickTracker.current.forEach((entry, key) => {
      entry.timer--;
      if (entry.timer <= 0) clickTracker.current.delete(key);
    });

    const uSpeed = 0.008;
    parent.rotation.y += (pointer.x * 0.08 - parent.rotation.y) * uSpeed;
    parent.rotation.x += (-pointer.y * 0.05 - parent.rotation.x) * uSpeed;

    if (!burstTriggered.current) return;

    const collisionsEnabled = frameCount.current > 60;
    for (let i = 0; collisionsEnabled && i < shapes.length; i++) {
      for (let j = i + 1; j < shapes.length; j++) {
        const a = shapes[i];
        const b = shapes[j];
        if (a.dissolved || b.dissolved) continue;

        tempVec.copy(a.position).sub(b.position);
        const dist = tempVec.length();
        const minDist = a.radius + b.radius;

        if (dist < minDist && dist > 0.01) {
          const overlap = minDist - dist;
          tempVec.normalize().multiplyScalar(overlap * SEPARATION_FORCE);
          a.velocity.add(tempVec);
          b.velocity.sub(tempVec);

          if (overlap > minDist * 0.05) {
            if (Math.random() < DISSOLVE_CHANCE) {
              const victim = a.radius <= b.radius ? a : b;
              dissolveShape(victim);
            } else {
              const contactPoint = new THREE.Vector3()
                .addVectors(a.position, b.position)
                .multiplyScalar(0.5);
              emitSparks(contactPoint);
            }
          }
        }
      }
    }

    shapes.forEach((s) => {
      if (s.dissolved) {
        s.dissolveTimer--;
        if (s.dissolveTimer <= 0) {
          s.dissolved = false;
          const spawn = spawnOffScreen(s.radius);
          s.position.set(spawn.px, spawn.py, spawn.pz);
          s.velocity.set(spawn.vx, spawn.vy, spawn.vz);
          s.lineMat.color.copy(s.targetEdgeColor);
          s.fillMat.opacity = 1;
          s.fillMat.transparent = false;
          s.group.visible = true;
        }
        return;
      }

      if (s.bumpCooldown > 0) s.bumpCooldown--;
      const cap =
        s.burstPhase === 1
          ? BUMP_MAX_SPEED * 2
          : s.bumpCooldown > 0
          ? BUMP_MAX_SPEED
          : MAX_SPEED;
      const speed = s.velocity.length();
      if (speed > cap) s.velocity.multiplyScalar(cap / speed);

      const xyDist = Math.sqrt(s.position.x * s.position.x + s.position.y * s.position.y);
      if (xyDist > 3.5) {
        const pullStrength = 0.00004 * (xyDist - 3.5);
        tempVec.set(s.position.x, s.position.y, 0).normalize().multiplyScalar(-pullStrength);
        s.velocity.add(tempVec);
      }

      const currentSpeed = s.velocity.length();
      if (currentSpeed > 0.008) s.velocity.multiplyScalar(1 - DAMPING * 0.08);

      s.position.add(s.velocity);

      const buf = s.radius + 1.5;
      const xBound = 6 + buf;
      const yBound = 5 + buf;
      const zNear = 12 + buf;
      const zFar = 14 + buf;

      if (
        s.position.x > xBound ||
        s.position.x < -xBound ||
        s.position.y > yBound ||
        s.position.y < -yBound ||
        s.position.z > zNear ||
        s.position.z < -zFar
      ) {
        const spawn = spawnOffScreen(s.radius);
        s.position.set(spawn.px, spawn.py, spawn.pz);
        s.velocity.set(spawn.vx, spawn.vy, spawn.vz);
      }

      s.group.position.copy(s.position);
      s.group.rotation.x += s.rotSpeed.x;
      s.group.rotation.y += s.rotSpeed.y;
      s.group.rotation.z += s.rotSpeed.z;
    });

    const sparks = sparksRef.current;
    const posAttr = sparkGeo.getAttribute("position") as THREE.BufferAttribute;
    const posArr = posAttr.array as Float32Array;

    let alive = 0;
    for (let i = sparks.length - 1; i >= 0; i--) {
      const sp = sparks[i];
      sp.life--;
      if (sp.life <= 0) {
        sparks.splice(i, 1);
        continue;
      }
      sp.position.add(sp.velocity);
      sp.velocity.multiplyScalar(0.96);
    }

    for (let i = 0; i < sparks.length && i < maxSparks; i++) {
      const sp = sparks[i];
      posArr[i * 3] = sp.position.x;
      posArr[i * 3 + 1] = sp.position.y;
      posArr[i * 3 + 2] = sp.position.z;
      alive++;
    }

    sparkGeo.setDrawRange(0, alive);
    posAttr.needsUpdate = true;
    sparkMat.opacity = alive > 0 ? 0.7 : 0;
  });

  return <group ref={parentRef} />;
}

export interface ParticleFieldProps {
  /** Skip the intro and show shapes already scattered in their idle drift. */
  introComplete?: boolean;
  /**
   * Fire `intro-ignite` as soon as the canvas mounts. Useful for isolated
   * stories; in the real hero the `CinematicIntro` fires it at the spark
   * moment instead.
   */
  autoIgnite?: boolean;
  /** Autoplay delay in ms (default 400) — only applies when `autoIgnite`. */
  autoIgniteDelay?: number;
  /** Background color behind the canvas — defaults to ink/foreground. */
  background?: string;
  className?: string;
}

export const ParticleField = ({
  introComplete = false,
  autoIgnite = false,
  autoIgniteDelay = 400,
  background = "hsl(var(--foreground))",
  className,
}: ParticleFieldProps) => {
  const [runId, setRunId] = useState(0);

  useEffect(() => {
    if (!autoIgnite) return;
    const t = window.setTimeout(() => {
      window.dispatchEvent(new CustomEvent("intro-ignite"));
    }, autoIgniteDelay);
    return () => window.clearTimeout(t);
  }, [autoIgnite, autoIgniteDelay, runId]);

  return (
    <div
      className={["relative w-full h-full", className].filter(Boolean).join(" ")}
      style={{ background, cursor: "pointer" }}
    >
      <Canvas
        key={runId}
        camera={{ position: [0, 0, 8], fov: 45, near: 0.1, far: 100 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Shapes introComplete={introComplete} />
      </Canvas>

      {autoIgnite && (
        <button
          onClick={() => setRunId((k) => k + 1)}
          className="absolute bottom-3 right-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/70 hover:text-white border border-white/20 hover:border-white/60 px-3 py-1.5 transition-colors"
          style={{ background: "rgba(0,0,0,0.35)" }}
        >
          Replay
        </button>
      )}
    </div>
  );
};

export default ParticleField;
