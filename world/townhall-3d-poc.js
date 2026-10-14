import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const MODEL_URL = "../Assets/Images and Animations/Career Empire World/buildings/3d/CE-BLDG-008-town-hall-test.glb";

const CAMERA_START = new THREE.Vector3(1.35, 2.32, -18.2);
const CAMERA_END = new THREE.Vector3(0.78, 2.58, -11.15);
const FALLBACK_LOOK_TARGET = new THREE.Vector3(0, 5.1, -2.65);
const SAFE_PORTAL_DISTANCE = 6.25;

const container = document.getElementById("townhall-3d-canvas");
const loading = document.getElementById("townhall-3d-loading");
const statusEl = document.getElementById("townhall-3d-status");
const reportEl = document.getElementById("townhall-report");
const playButton = document.getElementById("townhall-play");
const recordButton = document.getElementById("townhall-record");
const shoulderCharacter = document.getElementById("townhall-shoulder-character");

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x8fd1ff);
scene.fog = new THREE.FogExp2(0x9edbff, 0.008);

const camera = new THREE.PerspectiveCamera(48, 16 / 9, 0.1, 80);
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);

const clock = new THREE.Clock();
const loader = new GLTFLoader();
const modelRoot = new THREE.Group();
const portalMarker = new THREE.Group();
const lookTarget = new THREE.Vector3().copy(FALLBACK_LOOK_TARGET);
const cameraRig = {
  progress: 0,
  playing: true,
  startTime: performance.now(),
  duration: 7600,
  manualOffset: 0,
  manualMode: false
};

let portalAnchor = null;
let cameraLookTarget = null;
let frameSamples = [];
let report = {
  modelUrl: MODEL_URL,
  visualTarget: "../Assets/Images and Animations/Career Empire World/buildings/3d/CE-TOWNHALL-3D-approach-target.png",
  portalAnchorFound: false,
  cameraLookTargetFound: false,
  loadMs: null,
  meshes: 0,
  triangles: 0,
  bounds: null,
  portalAnchorWorld: null,
  cameraLookTargetWorld: null,
  approximateFps: null,
  composition: "Targeting over-left-shoulder foreground character, dominant Town Hall facade, centred arched doorway, gentle upward angle.",
  recording: null
};

scene.add(modelRoot);
scene.add(portalMarker);

setupLights();
setupGroundAndSky();
setupPortalMarker();
setupInput();
resize();
window.addEventListener("resize", resize);

loadModel();
animate();

function setupLights() {
  scene.add(new THREE.HemisphereLight(0xf5fbff, 0x8ac176, 3.1));

  const sun = new THREE.DirectionalLight(0xfff3cf, 3.65);
  sun.position.set(-5.5, 9, -9);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.near = 0.5;
  sun.shadow.camera.far = 42;
  sun.shadow.camera.left = -12;
  sun.shadow.camera.right = 12;
  sun.shadow.camera.top = 10;
  sun.shadow.camera.bottom = -10;
  scene.add(sun);

  const warmDoorLight = new THREE.PointLight(0xffdfa1, 1.3, 9);
  warmDoorLight.position.set(0, 2.45, -5.2);
  scene.add(warmDoorLight);

  const cyanSignLight = new THREE.PointLight(0x67d8ff, 1.35, 12);
  cyanSignLight.position.set(0, 4.7, -3.3);
  scene.add(cyanSignLight);

  const facadeFill = new THREE.PointLight(0xffffff, 2.2, 18);
  facadeFill.position.set(0, 4.2, -11.8);
  scene.add(facadeFill);
}

function setupGroundAndSky() {
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(38, 32, 16),
    new THREE.MeshBasicMaterial({
      color: 0x8fd1ff,
      side: THREE.BackSide,
      fog: false
    })
  );
  sky.position.y = 6;
  scene.add(sky);

  const forecourt = new THREE.Mesh(
    new THREE.PlaneGeometry(16, 18, 1, 1),
    new THREE.MeshStandardMaterial({ color: 0x8a9aa2, roughness: 0.68, metalness: 0.03 })
  );
  forecourt.rotation.x = -Math.PI / 2;
  forecourt.position.set(0, -0.02, -7.1);
  forecourt.receiveShadow = true;
  scene.add(forecourt);

  const lane = new THREE.Mesh(
    new THREE.PlaneGeometry(4.9, 13.2, 1, 1),
    new THREE.MeshStandardMaterial({ color: 0xaeb8ba, roughness: 0.64, metalness: 0.03 })
  );
  lane.rotation.x = -Math.PI / 2;
  lane.position.set(0, 0.012, -8.65);
  lane.receiveShadow = true;
  scene.add(lane);

  const grassMaterial = new THREE.MeshStandardMaterial({ color: 0x4a9e40, roughness: 0.82 });
  [-4.8, 4.8].forEach((x) => {
    const grass = new THREE.Mesh(new THREE.PlaneGeometry(5.8, 12.8, 1, 1), grassMaterial);
    grass.rotation.x = -Math.PI / 2;
    grass.position.set(x, 0.006, -8.7);
    grass.receiveShadow = true;
    scene.add(grass);
  });

  const lineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.38 });
  for (let i = -5; i <= 5; i += 1) {
    const seam = new THREE.Mesh(new THREE.PlaneGeometry(4.7, 0.025), lineMaterial);
    seam.rotation.x = -Math.PI / 2;
    seam.position.set(0, 0.026, -8.8 + i * 1.12);
    scene.add(seam);
  }
  [-2.35, 0, 2.35].forEach((x) => {
    const seam = new THREE.Mesh(new THREE.PlaneGeometry(0.025, 12.8), lineMaterial);
    seam.rotation.x = -Math.PI / 2;
    seam.position.set(x, 0.027, -8.7);
    scene.add(seam);
  });
}

function setupPortalMarker() {
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.38, 0.018, 12, 52),
    new THREE.MeshBasicMaterial({ color: 0x67d8ff, transparent: true, opacity: 0.74 })
  );
  ring.rotation.x = Math.PI / 2;
  portalMarker.add(ring);

  const glow = new THREE.Mesh(
    new THREE.CircleGeometry(0.44, 52),
    new THREE.MeshBasicMaterial({ color: 0x67d8ff, transparent: true, opacity: 0.16, side: THREE.DoubleSide })
  );
  glow.rotation.x = Math.PI / 2;
  portalMarker.add(glow);
  portalMarker.visible = false;
}

function setupInput() {
  playButton.addEventListener("click", replayApproach);
  recordButton.addEventListener("click", () => recordApproach());

  window.addEventListener("keydown", (event) => {
    if (["ArrowUp", "KeyW"].includes(event.code)) {
      cameraRig.manualMode = true;
      cameraRig.manualOffset = Math.min(cameraRig.manualOffset + 0.035, 1);
    }
    if (["ArrowDown", "KeyS"].includes(event.code)) {
      cameraRig.manualMode = true;
      cameraRig.manualOffset = Math.max(cameraRig.manualOffset - 0.035, 0);
    }
  });
}

function loadModel() {
  const started = performance.now();
  loader.load(
    MODEL_URL,
    (gltf) => {
      const raw = gltf.scene;
      portalAnchor = raw.getObjectByName("PortalAnchor");
      cameraLookTarget = raw.getObjectByName("CameraLookTarget");

      raw.traverse((object) => {
        if (!object.isMesh) return;
        object.castShadow = true;
        object.receiveShadow = true;
        report.meshes += 1;
        report.triangles += estimateTriangles(object.geometry);
        if (object.material) object.material.needsUpdate = true;
      });

      modelRoot.add(raw);
      modelRoot.updateMatrixWorld(true);

      if (portalAnchor) {
        const portalWorld = new THREE.Vector3();
        portalAnchor.getWorldPosition(portalWorld);
        portalMarker.position.copy(portalWorld);
        portalMarker.position.y = 0.08;
        portalMarker.visible = true;
        report.portalAnchorFound = true;
        report.portalAnchorWorld = roundVec(portalWorld);
      }

      if (cameraLookTarget) {
        cameraLookTarget.getWorldPosition(lookTarget);
        report.cameraLookTargetFound = true;
        report.cameraLookTargetWorld = roundVec(lookTarget);
      }

      const fittedBox = new THREE.Box3().setFromObject(modelRoot);
      report.bounds = roundVec(fittedBox.getSize(new THREE.Vector3()));
      report.loadMs = Math.round(performance.now() - started);
      loading.classList.add("is-hidden");
      setStatus("Loaded. Transitioning to shoulder approach.");
      replayApproach();
      updateReport();
    },
    undefined,
    (error) => {
      report.error = error.message || String(error);
      setStatus("Model failed to load");
      updateReport();
    }
  );
}

function estimateTriangles(geometry) {
  if (!geometry) return 0;
  if (geometry.index) return Math.round(geometry.index.count / 3);
  const position = geometry.getAttribute("position");
  return position ? Math.round(position.count / 3) : 0;
}

function replayApproach() {
  cameraRig.startTime = performance.now();
  cameraRig.progress = 0;
  cameraRig.manualOffset = 0;
  cameraRig.manualMode = false;
  cameraRig.playing = true;
  shoulderCharacter.classList.remove("is-approaching");
  setStatus("Map transition into 3D approach");
}

async function recordApproach() {
  if (!renderer.domElement.captureStream || typeof MediaRecorder === "undefined") {
    report.recording = "MediaRecorder unavailable in this browser.";
    updateReport();
    return null;
  }

  recordButton.disabled = true;
  recordButton.textContent = "Recording...";
  replayApproach();

  const chunks = [];
  const stream = renderer.domElement.captureStream(30);
  const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
  recorder.ondataavailable = (event) => {
    if (event.data.size) chunks.push(event.data);
  };
  const stopped = new Promise((resolve) => {
    recorder.onstop = resolve;
  });

  recorder.start();
  await wait(cameraRig.duration + 650);
  recorder.stop();
  await stopped;

  const blob = new Blob(chunks, { type: "video/webm" });
  const bytes = Math.round(blob.size / 1024);
  report.recording = `Recorded ${bytes} KB WebM in browser.`;
  recordButton.disabled = false;
  recordButton.textContent = "Record Approach";
  updateReport();
  return blob;
}

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  if (delta > 0 && delta < 0.2) {
    frameSamples.push(1 / delta);
    if (frameSamples.length > 90) frameSamples.shift();
    report.approximateFps = Math.round(frameSamples.reduce((total, sample) => total + sample, 0) / frameSamples.length);
  }
  updateApproach();
  portalMarker.rotation.z = clock.elapsedTime * 0.95;
  renderer.render(scene, camera);
}

function updateApproach() {
  if (cameraRig.playing && !cameraRig.manualMode) {
    cameraRig.progress = THREE.MathUtils.clamp((performance.now() - cameraRig.startTime) / cameraRig.duration, 0, 1);
    if (cameraRig.progress >= 1) {
      cameraRig.playing = false;
      setStatus("At Town Hall portal interaction position");
    }
  }

  if (cameraRig.manualMode) cameraRig.progress = cameraRig.manualOffset;

  const eased = easeInOutCubic(cameraRig.progress);
  const position = new THREE.Vector3().lerpVectors(CAMERA_START, CAMERA_END, eased);
  const breathingX = Math.sin(clock.elapsedTime * 1.3) * 0.018;
  const breathingY = Math.sin(clock.elapsedTime * 1.05) * 0.012;
  camera.position.set(position.x + breathingX, position.y + breathingY, position.z);

  const look = new THREE.Vector3().lerpVectors(
    new THREE.Vector3(lookTarget.x - 0.16, lookTarget.y - 1.04, lookTarget.z),
    new THREE.Vector3(lookTarget.x, lookTarget.y - 0.52, lookTarget.z),
    eased
  );
  camera.lookAt(look);

  if (shoulderCharacter) {
    shoulderCharacter.classList.toggle("is-approaching", eased > 0.58);
  }

  if (portalAnchor) {
    const distance = camera.position.distanceTo(portalMarker.position);
    if (distance < SAFE_PORTAL_DISTANCE) {
      camera.position.z = portalMarker.position.z - SAFE_PORTAL_DISTANCE;
    }
  }
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function resize() {
  const rect = container.getBoundingClientRect();
  const width = Math.max(320, Math.round(rect.width));
  const targetHeight = Math.round(width * 9 / 16);
  const height = Math.min(Math.round(rect.height), targetHeight);
  renderer.setSize(width, height, false);
  camera.aspect = renderer.domElement.width / Math.max(renderer.domElement.height, 1);
  camera.updateProjectionMatrix();
}

function setStatus(text) {
  statusEl.textContent = text;
}

function updateReport() {
  reportEl.textContent = JSON.stringify(report, null, 2);
  window.CE_TOWNHALL_3D_POC = {
    report,
    replayApproach,
    recordApproach,
    captureState,
    getPixelProbe
  };
}

function captureState(progress) {
  const previous = {
    progress: cameraRig.progress,
    playing: cameraRig.playing,
    manualMode: cameraRig.manualMode
  };
  cameraRig.progress = progress;
  cameraRig.manualOffset = progress;
  cameraRig.manualMode = true;
  cameraRig.playing = false;
  updateApproach();
  renderer.render(scene, camera);
  const state = {
    progress,
    camera: roundVec(camera.position),
    portalAnchorWorld: report.portalAnchorWorld,
    cameraLookTargetWorld: report.cameraLookTargetWorld,
    status: statusEl.textContent
  };
  cameraRig.progress = previous.progress;
  cameraRig.manualMode = previous.manualMode;
  cameraRig.playing = previous.playing;
  return state;
}

function getPixelProbe() {
  const gl = renderer.getContext();
  const width = renderer.domElement.width;
  const height = renderer.domElement.height;
  const samples = new Uint8Array(4 * 9);
  const points = [
    [0.18, 0.2], [0.5, 0.2], [0.82, 0.2],
    [0.18, 0.5], [0.5, 0.5], [0.82, 0.5],
    [0.18, 0.8], [0.5, 0.8], [0.82, 0.8]
  ];
  points.forEach(([px, py], index) => {
    gl.readPixels(Math.round(width * px), Math.round(height * py), 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, samples, index * 4);
  });
  const colors = Array.from({ length: 9 }, (_, index) => Array.from(samples.slice(index * 4, index * 4 + 4)));
  return {
    width,
    height,
    colors,
    varied: new Set(colors.map((color) => color.slice(0, 3).join(","))).size > 3
  };
}

function roundVec(vector) {
  return {
    x: Number(vector.x.toFixed(3)),
    y: Number(vector.y.toFixed(3)),
    z: Number(vector.z.toFixed(3))
  };
}
