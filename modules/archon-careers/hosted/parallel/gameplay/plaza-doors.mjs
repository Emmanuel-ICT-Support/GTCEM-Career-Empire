export function plazaDoorLayout(wide) {
  return { depth: wide ? 4.24 : 4.32, centre: wide ? -.18 : 0,
    width: wide ? 4.67 : 3.75, height: 3.04, thickness: .15 };
}

// The two full-height leaves meet in the centre and pivot from the jambs.
export function buildPlazaDoors({ Group, scene, box, sign, wide = false }) {
  const { depth, centre, width, height, thickness } = plazaDoorLayout(wide);
  const brass = 0xc79954;
  const trim = 0x6d8768;
  const green = 0x294d42;

  return [-1, 1].map(side => {
    const leaf = new Group();
    leaf.position.set(centre + side * width, 0, depth);
    scene.add(leaf);
    const part = (color, size, distance, y, z = .105) =>
      box(leaf, color, size, [-side * distance, y, z]);
    const middle = width / 2;
    part(green, [width, height, thickness], middle, height / 2, 0);
    for (const distance of [.10, width - .10]) {
      part(trim, [.16, 2.96, .15], distance, 1.52);
      part(brass, [.028, 2.80, .048], distance, 1.52, .19);
    }
    for (const y of [.13, .92, 2.07, 2.91]) {
      part(trim, [width - .22, .12, .14], middle, y);
      part(brass, [width - .34, .024, .034], middle, y + .06, .183);
    }
    part(0x203c34, [width - .43, .59, .046], middle, .52, .09);
    part(0x203c34, [width - .43, .61, .046], middle, 2.49, .09);
    for (const offset of [-.30, 0, .30]) {
      const centre = middle + offset * width;
      const panel = part(0x416b59, [width * .24, .91, .049], centre, 1.50, .088);
      panel.castShadow = true;
      for (const angle of [-1, 1]) {
        const diagonal = part(brass, [.030, .84, .038], centre, 1.50, .139);
        diagonal.rotation.z = angle * .74;
      }
      const medallion = part(0xdab371, [.15, .15, .045], centre, 1.50, .168);
      medallion.rotation.z = Math.PI / 4;
      for (const y of [.52, 2.49]) {
        const inset = part(brass, [.095, .095, .031], centre, y, .132);
        inset.rotation.z = Math.PI / 4;
      }
    }
    const plaque = sign(side < 0 ? 'MARKET' : 'ARCADE', 1.34, .27, true);
    plaque.position.set(-side * (width - .96), 2.52, .155);
    leaf.add(plaque);
    part(brass, [.12, .34, .06], width - .26, 1.30, .146);
    part(0xecd095, [.045, .22, .08], width - .26, 1.30, .197);
    for (const y of [.45, 2.64]) {
      part(brass, [.26, .105, .10], .16, y, .17);
    }
    return leaf;
  });
}

export function posePlazaDoors(leaves, progress) {
  leaves.forEach((leaf, index) => {
    leaf.rotation.y = (index === 0 ? 1 : -1) * progress * Math.PI * .52;
    leaf.visible = progress < 1;
  });
}
