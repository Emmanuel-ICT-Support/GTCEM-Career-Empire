import * as T from 'three';

// Source pixels are retained verbatim. The uploaded PNG contains an opaque grey
// transparency checker outside the crest; mask only that exterior at render time.
function crestMaterial(map) {
  const material = new T.MeshStandardMaterial({map, transparent:true, alphaTest:.12, roughness:.52, metalness:.02});
  material.onBeforeCompile = shader => {
    shader.fragmentShader = shader.fragmentShader.replace('#include <map_fragment>', `
      #include <map_fragment>
      vec2 sourcePixel = vec2(vMapUv.x, 1.0-vMapUv.y) * vec2(1052.0,1494.0);
      float shieldBottom = 1323.0 - 190.0 * pow(abs((sourcePixel.x-526.0)/468.0),1.4);
      bool withinShield = sourcePixel.x > 59.0 && sourcePixel.x < 994.0 && sourcePixel.y > 72.0 && sourcePixel.y < shieldBottom;
      float chroma = max(sampledDiffuseColor.r,max(sampledDiffuseColor.g,sampledDiffuseColor.b))-min(sampledDiffuseColor.r,min(sampledDiffuseColor.g,sampledDiffuseColor.b));
      if (!withinShield && chroma < .015) discard;
    `);
  };
  material.customProgramCacheKey = () => 'ecc-supplied-crest-exterior-mask-v1';
  return material;
}

export async function addAdminSignage(root, reflections, welcome) {
  const texture = await new T.TextureLoader().loadAsync(new URL('./assets/admin-signage/cleaned-ecc-crest-source.png',import.meta.url).href);
  texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=8;
  const crest = new T.Mesh(new T.PlaneGeometry(.71,1.01),crestMaterial(texture));
  crest.name='Admin gable — supplied cleaned ECC crest';crest.position.set(0,4.08,-1.685);root.add(crest);

  const sign = new T.Group();sign.name='Admin architectural glass sign';sign.position.set(0,3.16,-.995);
  // Alpha-blended physical glass avoids a second full-campus transmission pass.
  // Laminated glass stands clear of the original structural fascia. Its existing
  // navy support and the building shell are deliberately retained.
  const glass = new T.MeshPhysicalMaterial({color:0x91d9dd,roughness:.12,metalness:.04,transparent:true,opacity:.42,depthWrite:false,transmission:0,thickness:.038,ior:1.48,iridescence:.28,iridescenceIOR:1.3,iridescenceThicknessRange:[180,310],clearcoat:1,clearcoatRoughness:.08,envMap:reflections,envMapIntensity:.65,attenuationColor:0x58adb8,attenuationDistance:1.2});
  const pane = new T.Mesh(new T.BoxGeometry(3.94,.39,.038),glass);pane.name='Laminated teal glass face';pane.castShadow=false;sign.add(pane);
  const edgeMaterial = new T.MeshStandardMaterial({color:0x9de1e1,roughness:.23,metalness:.28,envMap:reflections,envMapIntensity:.55});
  for (const y of [-.19,.19]) {const edge=new T.Mesh(new T.BoxGeometry(3.94,.009,.041),edgeMaterial);edge.position.y=y;sign.add(edge);}
  for (const x of [-1.965,1.965]) {const edge=new T.Mesh(new T.BoxGeometry(.009,.39,.041),edgeMaterial);edge.position.x=x;sign.add(edge);}
  const steel = new T.MeshStandardMaterial({color:0xbcced0,metalness:.85,roughness:.23,envMap:reflections,envMapIntensity:.6});
  for (const x of [-1.84,1.84])for(const y of [-.115,.115]) {const fixing=new T.Mesh(new T.CylinderGeometry(.019,.019,.085,10),steel);fixing.rotation.x=Math.PI/2;fixing.position.set(x,y,-.014);fixing.name='Brushed stainless glass standoff';sign.add(fixing);}
  const canvas=document.createElement('canvas');canvas.width=2048;canvas.height=200;
  const ctx=canvas.getContext('2d');ctx.textBaseline='middle';ctx.textAlign='center';ctx.fillStyle='#f1faf7';ctx.font='500 92px Arial';ctx.fillText('ADMINISTRATION',1024,105,1880);
  const lettering=new T.CanvasTexture(canvas);lettering.colorSpace=T.SRGBColorSpace;lettering.anisotropy=8;
  const text=new T.Mesh(new T.PlaneGeometry(3.47,.30),new T.MeshStandardMaterial({map:lettering,transparent:true,alphaTest:.06,roughness:.42,emissive:0xb7d8d9,emissiveIntensity:.12}));text.position.z=.024;text.name='Pale ceramic-frit Admin lettering';sign.add(text);
  root.add(sign);
  // The front Emmanuel banner becomes a glass panel in its existing frame.
  const welcomeGlass=glass.clone();welcomeGlass.color.setHex(0xc2eeee);welcomeGlass.opacity=.24;welcomeGlass.iridescence=.22;welcomeGlass.envMapIntensity=.42;
  const front=new T.Group();front.name='Front Emmanuel glass sign';front.position.set(welcome.x,1.73,welcome.z+.045);
  const frontPane=new T.Mesh(new T.BoxGeometry(1.44,1.76,.045),welcomeGlass);frontPane.name='Translucent Emmanuel sign glass';front.add(frontPane);
  for(const x of [-.716,.716]){const edge=new T.Mesh(new T.BoxGeometry(.009,1.76,.048),edgeMaterial);edge.position.x=x;front.add(edge);}
  for(const y of [-.875,.875]){const edge=new T.Mesh(new T.BoxGeometry(1.44,.009,.048),edgeMaterial);edge.position.y=y;front.add(edge);}
  for(const x of [-.64,.64])for(const y of [-.79,.79]){const fixing=new T.Mesh(new T.CylinderGeometry(.024,.024,.08,12),steel);fixing.rotation.x=Math.PI/2;fixing.position.set(x,y,.006);front.add(fixing);}
  const frontCrest=new T.Mesh(new T.PlaneGeometry(1.04,1.477),crestMaterial(texture));frontCrest.name='Emmanuel crest printed on glass';frontCrest.position.z=.028;front.add(frontCrest);root.add(front);
  root.userData.adminSignage={revision:'20260913-glass1',crestSource:'cleaned-ecc-crest-source.png',originalFasciaRetained:true};
}
