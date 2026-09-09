import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {clone} from 'three/addons/utils/SkeletonUtils.js';
import {SKIN} from './profiles.js';

const loader = new GLTFLoader();
const kits = {};
const TARGET_HEIGHT = 1.7;
const SIMPLE_BODIES = new Set(['tripo','shirt']);

function normalizeHeight(model) {
  model.updateMatrixWorld(true);
  model.traverse(node => { if (node.isSkinnedMesh) node.skeleton.update(); });
  const box = new THREE.Box3().setFromObject(model, true);
  const size = box.getSize(new THREE.Vector3());
  const scale = TARGET_HEIGHT / Math.max(size.y, 0.001);
  model.scale.multiplyScalar(scale);
  model.updateMatrixWorld(true);
  model.traverse(node => { if (node.isSkinnedMesh) node.skeleton.update(); });
  box.setFromObject(model, true);
  model.position.y -= box.min.y;
  return scale;
}

function bindClips(model, animations) {
  const mixer = new THREE.AnimationMixer(model);
  const clips = {};
  for (const clip of animations) {
    const name = /walk/i.test(clip.name) ? 'walk' : 'idle';
    clips[name] = mixer.clipAction(clip);
  }
  if (!clips.idle && clips.walk) {
    const walk = animations.find(clip => /walk/i.test(clip.name));
    const tracks = walk.tracks.map(track => new track.constructor(
      track.name, [0], Array.from(track.values.slice(0, track.getValueSize()))
    ));
    clips.idle = mixer.clipAction(new THREE.AnimationClip('idle', 1, tracks));
  }
  if (clips.idle) clips.idle.play();
  let motion = 'idle';
  return {
    mixer,
    clips,
    setWalking(value) {
      const next = value ? 'walk' : 'idle';
      if (motion === next) return;
      clips[next]?.reset().fadeIn(0.18).play();
      clips[motion]?.fadeOut(0.18);
      motion = next;
    },
    update(dt) {
      mixer.update(dt * (motion === 'walk' ? 1.8 : 1));
    },
    disposeMixer() {
      mixer.stopAllAction();
      mixer.uncacheRoot(model);
    }
  };
}

const kitLoads = new Map();
export const hasCharacterKit = body => Boolean(kits[body]);
export function loadCharacterKit(body) {
  if (!['a', 'b', ...SIMPLE_BODIES].includes(body)) return Promise.reject(new Error('Unknown avatar body'));
  if (!kitLoads.has(body)) {
    const url = body === 'tripo' ? './assets/player-tripo-20260908.glb'
      : body === 'shirt' ? './assets/player-uniform-shirt-20260908.glb'
      : `./assets/avatar-${body}.glb`;
    kitLoads.set(body, loader.loadAsync(url).then(kit => (kits[body] = kit)).catch(error => {
      kitLoads.delete(body); // A failed download can be retried from the picker.
      throw error;
    }));
  }
  return kitLoads.get(body);
}

function createModularCharacter(profile) {
  const kit = kits[profile.body];
  const model = clone(kit.scene);
  const materialCopies = new Map();
  const materialSlots = {
    Skin: 'skin', Hair: 'hair', Eye: 'eye', Top: 'top', Bottom: 'bottom',
    Outer: 'outer', Jumper: 'jumper', Shoe: 'shoes'
  };
  model.traverse(node => {
    if (!node.isMesh) return;
    node.castShadow = true;
    node.receiveShadow = true;
    const copy = source => {
      if (!materialCopies.has(source)) materialCopies.set(source, source.clone());
      const m = materialCopies.get(source);
      const semantic = m.name.replace(/\.\d+$/, '');
      const key = materialSlots[semantic];
      if (key) m.color.set(key === 'skin' ? SKIN[profile.skin] : profile.colours[key]);
      return m;
    };
    node.material = Array.isArray(node.material) ? node.material.map(copy) : copy(node.material);
    const {slot, variant} = node.userData;
    if (slot === 'hair') node.visible = variant === profile.hair;
    if (slot === 'top') node.visible = variant === profile.top;
    if (slot === 'bottom') node.visible = variant === profile.bottom;
    if (slot === 'outer') node.visible = variant === profile.outer;
    if (slot === 'accessory') node.visible = variant === profile.accessory;
    if (slot === 'jumper') node.visible = profile.jumper;
    const coveredSleeve = /^Sleeve/.test(node.name) && ['blazer', 'labcoat'].includes(profile.outer);
    if (coveredSleeve && (slot === 'top' || slot === 'jumper')) node.visible = false;
    if (slot === 'top' && /^Sleeve/.test(node.name) && profile.jumper) node.visible = false;
    if (/^Leg(?:[._\d]|$)/.test(node.name) && profile.bottom !== 'skirt') node.visible = false;
  });
  const head = model.getObjectByName('head');
  if (head) {
    head.scale.set(
      profile.face === 'round' ? 1.08 : profile.face === 'defined' ? 0.94 : 1,
      profile.face === 'defined' ? 1.025 : 1,
      1
    );
  }
  const anim = bindClips(model, kit.animations);
  return {
    model,
    mixer: anim.mixer,
    profile,
    clips: anim.clips,
    simple: false,
    setWalking: anim.setWalking,
    update: anim.update,
    dispose() {
      anim.disposeMixer();
      for (const m of materialCopies.values()) m.dispose();
      model.removeFromParent();
    }
  };
}

/** Reference players using their original walk rig. */
function createSimpleTripoCharacter(profile) {
  const kit = kits[profile.body];
  const model = clone(kit.scene);
  model.traverse(node => {
    if (!node.isMesh) return;
    node.castShadow = true;
    node.receiveShadow = true;
  });
  const anim = bindClips(model, kit.animations || []);
  anim.mixer.update(0);
  normalizeHeight(model);
  const positioned = new THREE.Group();
  positioned.add(model);
  return {
    model: positioned,
    mixer: anim.mixer,
    profile,
    clips: anim.clips,
    simple: true,
    setWalking: anim.setWalking,
    update: anim.update,
    dispose() {
      anim.disposeMixer();
      model.removeFromParent();
    }
  };
}

export function createCharacter(profile) {
  if (SIMPLE_BODIES.has(profile.body)) return createSimpleTripoCharacter(profile);
  return createModularCharacter(profile);
}

export function isSimpleBody(body) {
  return SIMPLE_BODIES.has(body);
}
