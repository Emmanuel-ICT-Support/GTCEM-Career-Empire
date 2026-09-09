import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {DRACOLoader} from 'three/addons/loaders/DRACOLoader.js';
import {clone} from 'three/addons/utils/SkeletonUtils.js';
import {SKIN} from './profiles.js';

const loader = new GLTFLoader();
const draco = new DRACOLoader();
draco.setDecoderPath('./vendor/draco/');
loader.setDRACOLoader(draco);
const kits = {};
const TARGET_HEIGHT = 1.7;
const SIMPLE_BODIES = new Set(['tripo','shirt','schoolboy','jackettest']);

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

function bindClips(model, animations, walkSpeed = 1.8) {
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
      mixer.update(dt * (motion === 'walk' ? walkSpeed : 1));
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
    const url = body === 'jackettest' ? './assets/player-jacket-test-20260909.glb'
      : body === 'tripo' ? './assets/player-tripo-20260908.glb'
      : body === 'shirt' ? './assets/player-uniform-shirt-20260908.glb'
      : body === 'schoolboy' ? './assets/player-schoolboy-20260909.glb?v=draco2'
      : `./assets/avatar-${body}.glb`;
    kitLoads.set(body, loader.loadAsync(url).then(kit => {
      if (body === 'jackettest') {
        const source = kit.animations[0];
        if (!source) throw new Error('Jacket test animation is missing');
        // Exported frame 1 starts at t=0. Keep stress poses out of the walk.
        const walk = THREE.AnimationUtils.subclip(source, 'walk', 89, 149, 30);
        const tracks = source.tracks.map(track => new track.constructor(
          track.name, [0], Array.from(track.values.slice(0, track.getValueSize()))
        ));
        kit.animations = [new THREE.AnimationClip('idle', 1, tracks), walk];
      }
      return (kits[body] = kit);
    }).catch(error => {
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
  const materialCopies = new Map();
  const schoolUniformParts = new Set([1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16, 17, 22, 23, 28, 29]);
  model.traverse(node => {
    if (!node.isMesh) return;
    node.castShadow = true;
    node.receiveShadow = true;
    // The school model arrives as many separately textured parts. Its source
    // normal maps make the joins read as harsher than they do in Tripo under
    // the brighter town lighting, so use private material copies and soften
    // their relief without changing the downloaded source asset.
    if (profile.body === 'schoolboy') {
      const copyMaterial = source => {
        if (!materialCopies.has(source)) materialCopies.set(source, source.clone());
        return materialCopies.get(source);
      };
      node.material = Array.isArray(node.material) ? node.material.map(copyMaterial) : copyMaterial(node.material);
      const materials = Array.isArray(node.material) ? node.material : [node.material];
      for (const material of materials) {
        material.normalScale?.setScalar(0.42);
        const part = Number(material.name.match(/tripo_part_(\d+)_material/)?.[1]);
        if (schoolUniformParts.has(part) && material.emissive) {
          material.emissive.set(0x17284a);
          material.emissiveIntensity = 0.22;
        }
      }
    }
  });
  const anim = bindClips(model, kit.animations || [], profile.body === 'jackettest' ? 1 : 1.8);
  anim.mixer.update(0);
  normalizeHeight(model);
  // Normalize the complete outfit first so jacket-off never changes avatar size.
  if (profile.body === 'jackettest') model.traverse(node => {
    if (node.isMesh && node.userData.clothingSlot === 'jacket') node.visible = profile.outer !== 'none';
  });
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
      for (const material of materialCopies.values()) material.dispose();
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
