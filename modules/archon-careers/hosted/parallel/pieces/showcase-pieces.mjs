import * as T from '../../vendor/three.module.js';

const boxGeometry = new T.BoxGeometry(1, 1, 1);
const ovalGeometry = new T.SphereGeometry(1, 20, 12);
const rimGeometry = new T.CylinderGeometry(1, 1, 1, 48);
const footGeometry = new T.CylinderGeometry(.91, 1, 1, 48);
const materials = new Map();
const leather = 0x69442d;
const graphite = 0x233540;
const brass = 0xe7bd69;
const ivory = 0xfff1d1;

function mesh(parent, geometry, color, size, position, metalness = 0) {
  const key = color + ':' + metalness;
  if (!materials.has(key)) {
    materials.set(key, new T.MeshStandardMaterial({color, metalness, roughness: metalness ? .43 : .66}));
  }
  const object = new T.Mesh(geometry, materials.get(key));
  object.scale.set(...size);
  object.position.set(...position);
  object.castShadow = true;
  object.receiveShadow = true;
  parent.add(object);
  return object;
}

const box = (parent, color, size, position) => mesh(parent, boxGeometry, color, size, position);
const oval = (parent, color, size, position) => mesh(parent, ovalGeometry, color, size, position);

export function addShowcaseBase(root, team) {
  const [foot, top] = team === 'A' ? [0x174c4a, 0x2acdb4] : [0x8b501a, 0xefaa42];
  mesh(root, footGeometry, foot, [.29, .125, .29], [0, .0625, 0]);
  mesh(root, rimGeometry, brass, [.278, .015, .278], [0, .124, 0], .45);
  mesh(root, rimGeometry, top, [.265, .020, .265], [0, .139, 0]);
  return .079;
}

function grip(body, bone, name) {
  const anchor = new T.Group();
  anchor.name = name;
  anchor.position.copy(body.worldToLocal(bone.getWorldPosition(new T.Vector3())));
  body.add(anchor);
  bone.attach(anchor);
  return anchor;
}

function caseHandle(parent, width, height, y, color) {
  for (const side of [-1, 1]) {
    box(parent, color, [.02, height, .027], [side * width / 2, y - height / 2, 0]);
  }
  box(parent, color, [width + .02, .023, .035], [0, y, 0]);
}

function cross(parent, color, size, z) {
  box(parent, color, [size, size / 3, .009], [0, 0, z]);
  box(parent, color, [size / 3, size, .009], [0, 0, z]);
}

function carpenter(hand, chest) {
  box(hand, leather, [.04, .21, .043], [0, -.035, 0]);
  box(hand, brass, [.045, .026, .049], [0, -.132, 0]);
  mesh(hand, boxGeometry, 0x9eb1b5, [.143, .048, .055], [0, .071, 0], .6);
  box(hand, graphite, [.038, .05, .057], [.055, .071, 0]);
  box(chest, leather, [.29, .045, .183], [0, .62, 0]);
  box(chest, brass, [.048, .036, .014], [0, .62, .099]);
  for (const side of [-1, 1]) {
    box(chest, 0xa36a3b, [.092, .105, .055], [side * .103, .57, .09]);
    box(chest, leather, [.093, .02, .059], [side * .103, .61, .095]);
  }
  box(chest, 0xf9c449, [.048, .055, .035], [.106, .585, .129]);
}

function nurse(hand, chest) {
  caseHandle(hand, .10, .058, .011, graphite);
  const kit = new T.Group();
  kit.position.y = -.144;
  hand.add(kit);
  box(kit, 0x486b76, [.193, .19, .122], [0, 0, 0]);
  box(kit, ivory, [.182, .169, .128], [0, 0, 0]);
  cross(kit, 0xb02d45, .088, .067);
  cross(kit, 0xb02d45, .088, -.067);
  box(chest, ivory, [.057, .046, .014], [-.061, .825, .10]);
  box(chest, 0x367986, [.038, .011, .015], [-.061, .832, .106]);
}

function electrician(hand) {
  caseHandle(hand, .098, .057, .008, graphite);
  box(hand, 0xea9d29, [.174, .227, .108], [0, -.156, 0]);
  box(hand, graphite, [.124, .163, .012], [0, -.154, .057]);
  box(hand, 0xa9ded4, [.099, .053, .012], [0, -.111, .065]);
  oval(hand, brass, [.028, .028, .008], [0, -.18, .066]);
  for (const x of [-.035, .035]) box(hand, ivory, [.018, .014, .014], [x, -.226, .065]);
}

function developer(hand, chest) {
  caseHandle(hand, .11, .045, .008, graphite);
  box(hand, graphite, [.198, .232, .049], [0, -.15, 0]);
  box(hand, 0x6566a4, [.183, .213, .012], [0, -.15, .025]);
  for (const side of [-1, 1]) {
    const chevron = box(hand, 0x9de9e3, [.043, .011, .009], [side * .027, -.143, .034]);
    chevron.rotation.z = side * .58;
    const lower = box(hand, 0x9de9e3, [.043, .011, .009], [side * .027, -.164, .034]);
    lower.rotation.z = -side * .58;
  }
  oval(chest, 0x53517b, [.114, .163, .059], [0, .756, -.106]);
  box(chest, graphite, [.118, .053, .034], [0, .689, -.148]);
}

function renewable(hand) {
  caseHandle(hand, .113, .048, .008, graphite);
  box(hand, 0x9db8bd, [.233, .246, .042], [0, -.154, 0]);
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      box(hand, (row + col) % 2 ? 0x2e5d8b : 0x183c64, [.067, .067, .014],
        [(col - 1) * .074, -.154 + (row - 1) * .075, .023]);
    }
  }
}

function educator(hand, chest) {
  caseHandle(hand, .108, .051, .008, leather);
  box(hand, 0xae4163, [.196, .215, .096], [0, -.143, 0]);
  box(hand, 0xef8d92, [.189, .077, .017], [0, -.1, .05]);
  for (const [x, y, color] of [[-.051, -.11, brass], [.043, -.117, 0x78d8bc], [0, -.151, ivory]]) {
    box(hand, color, [.042, .042, .016], [x, y, .063]).rotation.z = x * 5;
  }
  box(chest, 0x8e3c5b, [.196, .225, .024], [0, .719, .092]);
  box(chest, 0xf2a2af, [.13, .059, .026], [0, .668, .107]);
}

const dress = {CP: carpenter, NS: nurse, EL: electrician, SD: developer, RE: renewable, EC: educator};

export function attachShowcaseDetails(body, model, code) {
  const right = model.getObjectByName('R_Hand');
  const left = model.getObjectByName('L_Hand');
  const head = model.getObjectByName('Head');
  const spine = model.getObjectByName('Spine02');
  if (!dress[code] || !right || !left || !head || !spine) return false;

  const hand = grip(body, right, 'Occupation equipment');
  const chest = new T.Group();
  chest.name = 'Occupation uniform details';
  body.add(chest);
  dress[code](hand, chest);

  if (code === 'CP') {
    const timber = grip(body, left, 'Timber sample');
    timber.rotation.set(-.61, 0, -.12);
    box(timber, 0xc9915d, [.094, .48, .061], [-.024, .018, .011]);
    for (const x of [-.044, -.013]) {
      box(timber, 0xe4b982, [.009, .454, .004], [x, .018, .043]);
    }
  }
  if (code === 'EL' || code === 'RE') {
    for (const x of [-.078, .078]) {
      for (const z of [-.094, .094]) {
        box(chest, ivory, [.026, .205, .016], [x, .789, z]);
      }
    }
    box(chest, ivory, [.244, .025, .193], [0, .684, 0]);
    const helmet = new T.Group();
    helmet.name = 'Site helmet';
    body.add(helmet);
    const color = code === 'EL' ? 0xf4bf47 : ivory;
    oval(helmet, color, [.117, .068, .112], [0, 1.13, 0]);
    mesh(helmet, rimGeometry, color, [.124, .018, .128], [0, 1.108, .011]);
    oval(helmet, color, [.021, .072, .105], [0, 1.137, 0]);
    head.attach(helmet);
  }
  spine.attach(chest);
  return true;
}
