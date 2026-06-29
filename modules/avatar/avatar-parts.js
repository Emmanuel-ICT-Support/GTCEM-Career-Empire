(function () {
  window.CareerEmpireAvatarParts = {
    schemaVersion: 9,
    rig: {
      id: "ecc-student-take-2-layered-rig-v1",
      canvas: { width: 1280, height: 720 },
      slots: [
        "body",
        "skinTone",
        "faceStyle",
        "hairStyle",
        "hairColour",
        "uniform",
        "shirt",
        "pants",
        "shoes",
        "blazer",
        "accessory",
        "animationState"
      ],
      anchorNotes: {
        head: "Take 2 boy head is centered near x640 on the 1280 x 720 canvas",
        neck: "shirt, tie, blazer, and hair layers use the same full-canvas registration as the neutral base",
        shoes: "shoes sit on the y676 baseline and intentionally cover the trouser hems"
      }
    },
    sourceSheets: [
      {
        id: "ecc-boy-avatar-sheet-v1",
        label: "Boy avatar model sheet",
        sourcePath: "../../Assets/Images and Animations/Emmanuel Student Characters/Boy avatar.png",
        productionPath: "../../Assets/Images and Animations/Avatar Studio/model-sheets/ecc-avatar-model-sheet-v1.png",
        dimensions: { width: 1536, height: 1024 },
        selectedBasePose: "top-left neutral full body",
        selectedExpressionRow: "bottom expression strip",
        role: "base avatar A, proportions, hair, blazer, trousers, shoes, expression swaps"
      },
      {
        id: "ecc-girl-avatar-sheet-v1",
        label: "Girl avatar model sheet",
        sourcePath: "../../Assets/Images and Animations/Emmanuel Student Characters/Girl Avatar 1.png",
        productionPath: "../../Assets/Images and Animations/Avatar Studio/model-sheets/ecc-avatar-model-sheet-v2-female.png",
        dimensions: { width: 1536, height: 1024 },
        selectedBasePose: "top-left neutral full body",
        selectedExpressionRow: "bottom expression strip",
        role: "base avatar B, proportions, hair, blazer, jumper, skirt, tights, shoes, expression swaps"
      }
    ],
    productionPlan: {
      documentationPath: "../../docs/avatar-production-plan.md",
      masterCanvas: { width: 1024, height: 1536, format: "transparent png/webp" },
      runtimeCanvas: { width: 280, height: 520, format: "svg/html preview" },
      firstBaseAvatars: ["ecc-boy-base-neutral", "ecc-girl-base-neutral"],
      anchorPoints: {
        root: { x: 0.5, y: 0.94 },
        feetBaseline: { x: 0.5, y: 0.93 },
        hips: { x: 0.5, y: 0.61 },
        torso: { x: 0.5, y: 0.46 },
        neck: { x: 0.5, y: 0.34 },
        headCenter: { x: 0.5, y: 0.22 },
        leftShoulder: { x: 0.35, y: 0.39 },
        rightShoulder: { x: 0.65, y: 0.39 },
        leftHandRest: { x: 0.29, y: 0.67 },
        rightHandRest: { x: 0.71, y: 0.67 }
      },
      layerSlots: [
        "body/base",
        "body/skin-neck",
        "head/base",
        "hair/back",
        "hair/front",
        "face/eyes",
        "face/brows",
        "face/mouth-expression",
        "uniform/blazer",
        "uniform/jumper",
        "uniform/shirt",
        "uniform/tie",
        "uniform/lower",
        "arms/upper",
        "arms/forearms-hands",
        "legs/upper",
        "legs/lower",
        "shoes",
        "accessories"
      ],
      expressionSwaps: ["neutral", "smile", "thinking", "surprised", "excited", "wink"],
      uniformSwaps: [
        "winter blazer with trousers",
        "winter blazer with plaid skirt",
        "summer dress",
        "summer shirt and shorts",
        "sports kit"
      ],
      remotionPrototype: {
        compositionId: "ECCAvatarRigPrototype",
        targetFile: "../../remotion-est-scenes/src/scenes/ECCAvatarRigPrototype.tsx",
        animationStates: ["idle", "blink", "wave", "think", "celebrate"]
      }
    },
    productionRigs: {
      manifestPath: null,
      sourceVectorPath: "../../Assets/Images and Animations/Avatar Studio/Layered Dressed Boy svg.svg",
      basePath: "../../Assets/Images and Animations/Avatar Studio",
      canvas: { width: 1280, height: 720 },
      starterPackId: "ecc-boy-take-2-layered-v1",
      note: "Take 2 boy starter rig. Runtime starts with the neutral base and layers the selected clothing, shoes, blazer, and hair on top.",
      usePreviewBase: true,
      useFeatureOverlays: false,
      renderHairStyleLayersWithPreviewBase: true,
      baseImage: "Neutral Boy Smooth Transparent background.png",
      skinMask: null,
      hairMask: null,
      layerContracts: [
        { id: "base/neutral-boy", order: 10, slot: "body", canvas: "1280x720", anchor: "root", overlap: "neutral base remains underneath all wardrobe pieces" },
        { id: "uniform/pants", order: 30, slot: "bottoms", canvas: "1280x720", anchor: "waistLine", overlap: "top sits under shirt and blazer" },
        { id: "uniform/shirt-and-tie", order: 40, slot: "shirt", canvas: "1280x720", anchor: "neckOpening", overlap: "collar and tie sit under blazer lapels" },
        { id: "shoes", order: 50, slot: "shoes", canvas: "1280x720", anchor: "feetBaseline", overlap: "shoes cover trouser hems" },
        { id: "uniform/blazer", order: 60, slot: "outerwear", canvas: "1280x720", anchor: "shoulderLine", overlap: "blazer covers shirt, sleeves, and waist joins" },
        { id: "hair/front", order: 70, slot: "hair", canvas: "1280x720", anchor: "headCenter", overlap: "hair covers the bald neutral base head" }
      ],
      hairStyleLayerSets: {
        none: {
          back: null,
          front: null
        },
        waves: {
          back: null,
          front: "Boy Hair.png",
          colourVariants: {
            brown: { front: "Boy Hair.png" },
            black: { front: "Black hair.png" },
            auburn: { front: "Boy Hair Auburn.png" },
            blonde: { front: "Boy Hair Blonde.png" }
          }
        }
      },
      accessoryLayers: {},
      eyeColourLayers: {},
      layerOrder: [
        "Neutral Boy Smooth Transparent background.png",
        "Boy Pants.png",
        "Boy Shirt and tie.png",
        "Shoes Corrected.png",
        "Boy Blazer.png",
        "Boy Hair.png"
      ],
      expressionPlates: [],
      rigs: {
        "ecc-boy-take-2-layered": {
          id: "ecc-boy-take-2-layered",
          label: "ECC boy Take 2 layered",
          fileRoot: "",
          previewPath: "../../Assets/Images and Animations/Avatar Studio/Neutral Boy Smooth Transparent background.png",
          defaultExpression: "neutral",
          compatibleBodyRig: "ecc-boy-standard",
          compatibleFaceRig: "ecc-boy-take-2-face",
          previewFit: {
            width: "min(765px, 190vw)"
          },
          anchors: {
            root: { x: 640, y: 676 },
            feetBaseline: { x: 640, y: 676 },
            leftFoot: { x: 590, y: 670 },
            rightFoot: { x: 690, y: 670 },
            hips: { x: 640, y: 390 },
            waistLine: { x: 640, y: 354 },
            torso: { x: 640, y: 266 },
            chest: { x: 640, y: 246 },
            neckCenter: { x: 640, y: 184 },
            neckOpening: { x: 640, y: 194 },
            headCenter: { x: 640, y: 122 },
            faceCenter: { x: 640, y: 134 },
            leftEye: { x: 616, y: 128 },
            rightEye: { x: 665, y: 128 },
            browLine: { x: 640, y: 103 },
            noseBridge: { x: 640, y: 137 },
            mouthCenter: { x: 640, y: 160 },
            leftCheek: { x: 612, y: 151 },
            rightCheek: { x: 668, y: 151 },
            leftEar: { x: 591, y: 133 },
            rightEar: { x: 689, y: 133 },
            leftShoulder: { x: 560, y: 204 },
            rightShoulder: { x: 720, y: 204 },
            leftElbow: { x: 554, y: 308 },
            rightElbow: { x: 725, y: 308 },
            leftHandRest: { x: 565, y: 417 },
            rightHandRest: { x: 713, y: 417 }
          },
          requiredStarterLayers: [
            "Neutral Boy Smooth Transparent background.png",
            "Boy Pants.png",
            "Boy Shirt and tie.png",
            "Shoes Corrected.png",
            "Boy Blazer.png",
            "Boy Hair.png"
          ]
        }
      }
    },
    skinTones: [
      { id: "porcelain", label: "Porcelain", color: "#f4d6c5", shadow: "#d79f82", plannedOnly: true, note: "Needs neutral-base recolour" },
      { id: "sand", label: "Sand", color: "#dba77c", shadow: "#b57952" },
      { id: "warm", label: "Warm", color: "#b8734f", shadow: "#8d4e36", plannedOnly: true, note: "Needs neutral-base recolour" },
      { id: "copper", label: "Copper", color: "#935a3c", shadow: "#6f3d29", plannedOnly: true, note: "Needs neutral-base recolour" },
      { id: "mahogany", label: "Mahogany", color: "#66402f", shadow: "#43271c", plannedOnly: true, note: "Needs neutral-base recolour" },
      { id: "deep", label: "Deep", color: "#38251f", shadow: "#211514", plannedOnly: true, note: "Needs neutral-base recolour" }
    ],
    faceStyles: [
      { id: "soft", label: "Soft", token: "S" },
      { id: "round", label: "Round", token: "R", plannedOnly: true, note: "Needs face layer" },
      { id: "sharp", label: "Sharp", token: "A", plannedOnly: true, note: "Needs face layer" },
      { id: "freckled", label: "Freckles", token: "F", plannedOnly: true, note: "Needs face layer" },
      { id: "bright", label: "Bright", token: "B", plannedOnly: true, note: "Needs face layer" },
      { id: "calm", label: "Calm", token: "C", plannedOnly: true, note: "Needs face layer" }
    ],
    eyeColours: [
      { id: "blue", label: "Blue", color: "#238fcc", highlight: "#8bd8ff", source: "take-2-baked-base", note: "Active baked eye colour" },
      { id: "brown", label: "Brown", color: "#6f3b18", highlight: "#c77b33", source: "planned-take-2-mask", plannedOnly: true, note: "Needs 1280x720 eye variant" },
      { id: "amber", label: "Amber", color: "#bd841f", highlight: "#f0c45f", source: "planned-take-2-mask", plannedOnly: true, note: "Needs 1280x720 eye variant" },
      { id: "green", label: "Green", color: "#3f9b4a", highlight: "#8de26f", source: "planned-take-2-mask", plannedOnly: true, note: "Needs 1280x720 eye variant" },
      { id: "grey", label: "Grey", color: "#788995", highlight: "#d4dde4", source: "planned-take-2-mask", plannedOnly: true, note: "Needs 1280x720 eye variant" }
    ],
    hairStyles: [
      { id: "none", label: "No hair", token: "-", slot: "hair/none", source: "take-2-baked-base", note: "Uses neutral base head" },
      { id: "waves", label: "Take 2 hair", token: "W", slot: "hair/take-2-front" },
      { id: "crop", label: "Crop", token: "C", slot: "hair/crop", plannedOnly: true, note: "Needs clean art" },
      { id: "curls", label: "Curls", token: "R", slot: "hair/curly", plannedOnly: true, note: "Needs art" },
      { id: "long", label: "Long", token: "L", slot: "hair/long-back", plannedOnly: true, note: "Needs art" },
      { id: "bun", label: "Bun", token: "B", slot: "hair/bun", plannedOnly: true, note: "Needs art" },
      { id: "wrap", label: "Wrap", token: "H", slot: "hair/head-wrap", plannedOnly: true, note: "Needs art" }
    ],
    hairColours: [
      { id: "brown", label: "Brown", color: "#5a3524" },
      { id: "black", label: "Black", color: "#050505", source: "avatar-take-2-layered-png", note: "Active Take 2 hair layer" },
      { id: "auburn", label: "Auburn", color: "#9b3f24", source: "avatar-take-2-layered-png", note: "Active Take 2 hair layer" },
      { id: "blonde", label: "Blonde", color: "#d9b85d", source: "avatar-take-2-layered-png", note: "Active Take 2 hair layer" },
      { id: "silver", label: "Silver", color: "#c8ced4", plannedOnly: true, note: "Needs clean hair mask" },
      { id: "teal", label: "Teal", color: "#0f8f8c", plannedOnly: true, note: "Needs clean hair mask" }
    ],
    shirtOptions: [
      { id: "none", label: "Neutral base", token: "-", layer: null, note: "No shirt layer" },
      { id: "ecc-shirt-tie", label: "Shirt and tie", token: "S", layer: "Boy Shirt and tie.png", source: "avatar-take-2-layered-png" }
    ],
    pantsOptions: [
      { id: "none", label: "Neutral base", token: "-", layer: null, note: "No pants layer" },
      { id: "ecc-navy-pants", label: "Navy pants", token: "P", layer: "Boy Pants.png", source: "avatar-take-2-layered-png" }
    ],
    shoeOptions: [
      { id: "none", label: "Bare feet", color: "#dba77c", layer: null, note: "Neutral base feet" },
      { id: "black-school-shoes", label: "Black", color: "#151515", layer: "Shoes Corrected.png", source: "avatar-take-2-layered-png" },
      { id: "brown-school-shoes", label: "Brown", color: "#8b5b10", layer: "Brown Shoes.png", source: "avatar-take-2-layered-png" }
    ],
    blazerOptions: [
      { id: "none", label: "No blazer", token: "-", layer: null, note: "Base and shirt only" },
      { id: "ecc-navy-blazer", label: "ECC blazer", token: "B", layer: "Boy Blazer.png", source: "avatar-take-2-layered-png" },
      { id: "hivis-vest", label: "Hi-vis vest", token: "HV", layer: "Boy Hi Vis Vest.png", source: "avatar-take-2-layered-png" },
      { id: "lab-coat", label: "Lab coat", token: "LC", layer: "Boy Lab Coat.png", source: "avatar-take-2-layered-png" }
    ],
    outfits: [
      {
        id: "ecc-current-uniform",
        label: "Current ECC uniform",
        token: "ECC",
        family: "ecc-uniform",
        source: "avatar-take-2-layered-png",
        lower: "baked-base",
        fill: "#123a5d",
        lowerFill: "#1a2436",
        accent: "#f6b73c",
        shirt: "#f4f7fb",
        tie: "#0f8f8c",
        note: "Active Take 2 layer stack",
        rigLayers: {
          "ecc-boy-take-2-layered": [
            "Boy Pants.png",
            "Boy Shirt and tie.png",
            "Shoes Corrected.png",
            "Boy Blazer.png"
          ]
        }
      },
      {
        id: "neutral-base",
        label: "Neutral base",
        token: "-",
        family: "rig",
        source: "avatar-take-2-neutral-base",
        lower: "underwear",
        fill: "#dba77c",
        lowerFill: "#f4f4f2",
        accent: "#f6b73c",
        shirt: "#f4f4f2",
        tie: "#0f8f8c",
        note: "Active base layer only"
      },
      {
        id: "ecc-winter-trousers-blazer",
        label: "Winter blazer",
        token: "WB",
        family: "ecc-uniform",
        source: "uniform-lookbook",
        plannedOnly: true,
        note: "Needs wardrobe layer",
        lower: "trousers",
        fill: "#123a5d",
        lowerFill: "#1a2436",
        accent: "#f6b73c",
        shirt: "#f4f7fb",
        tie: "#0f8f8c"
      },
      {
        id: "ecc-boy-photoshop-blazer-poc",
        label: "Photoshop blazer POC",
        token: "PS",
        family: "ecc-uniform",
        source: "photoshop-manual-cut",
        plannedOnly: true,
        note: "Proof layer is not aligned",
        lower: "trousers",
        fill: "#123a5d",
        lowerFill: "#1a2436",
        accent: "#f6b73c",
        shirt: "#f4f7fb",
        tie: "#0f8f8c",
        rigLayers: {
          "ecc-boy-base-neutral": "uniform/blazer-poc-full-uniform.png"
        }
      },
      {
        id: "ecc-winter-skirt-jumper",
        label: "Winter skirt",
        token: "WS",
        family: "ecc-uniform",
        source: "uniform-lookbook",
        plannedOnly: true,
        note: "Needs wardrobe layer",
        lower: "plaid-skirt",
        fill: "#0f8f8c",
        lowerFill: "#1c426b",
        accent: "#f6b73c",
        shirt: "#f4f7fb",
        tie: "#0f8f8c"
      },
      {
        id: "ecc-summer-dress",
        label: "Summer dress",
        token: "SD",
        family: "ecc-uniform",
        source: "uniform-lookbook",
        plannedOnly: true,
        note: "Needs wardrobe layer",
        lower: "dress",
        fill: "#0f8f8c",
        lowerFill: "#0f8f8c",
        accent: "#f6b73c",
        shirt: "#f4f7fb",
        tie: "#0f8f8c"
      },
      {
        id: "ecc-summer-shirt-shorts",
        label: "Shirt & shorts",
        token: "SS",
        family: "ecc-uniform",
        source: "uniform-lookbook",
        plannedOnly: true,
        note: "Needs wardrobe layer",
        lower: "shorts",
        fill: "#f7fbff",
        lowerFill: "#16243c",
        accent: "#0f8f8c",
        shirt: "#f7fbff",
        tie: "#0f8f8c"
      },
      {
        id: "ecc-sports",
        label: "Sports kit",
        token: "SP",
        family: "ecc-uniform",
        source: "uniform-lookbook",
        plannedOnly: true,
        note: "Needs wardrobe layer",
        lower: "sports-shorts",
        fill: "#0f63b6",
        lowerFill: "#16243c",
        accent: "#f6b73c",
        shirt: "#0f63b6",
        tie: "#f6b73c"
      },
      {
        id: "blazer",
        label: "ECC blazer",
        token: "EB",
        family: "legacy",
        plannedOnly: true,
        note: "Replaced by current uniform",
        lower: "trousers",
        fill: "#123a5d",
        lowerFill: "#1a2436",
        accent: "#f6b73c",
        shirt: "#f4f7fb",
        tie: "#0f8f8c"
      },
      {
        id: "interview",
        label: "Interview blazer",
        token: "I",
        family: "career",
        plannedOnly: true,
        note: "Needs wardrobe layer",
        lower: "trousers",
        fill: "#17202a",
        lowerFill: "#17202a",
        accent: "#f6b73c",
        shirt: "#ffffff",
        tie: "#3859c7"
      },
      {
        id: "scrubs",
        label: "Health scrubs",
        token: "S",
        family: "career",
        plannedOnly: true,
        note: "Needs wardrobe layer",
        lower: "trousers",
        fill: "#0f8f8c",
        lowerFill: "#0d7775",
        accent: "#ffffff",
        shirt: "#dff9f6",
        tie: "#0f8f8c"
      },
      {
        id: "hivis",
        label: "Hi-vis gear",
        token: "V",
        family: "career",
        plannedOnly: true,
        note: "Needs wardrobe layer",
        lower: "trousers",
        fill: "#f6b73c",
        lowerFill: "#17202a",
        accent: "#17202a",
        shirt: "#fff7d7",
        tie: "#17202a"
      },
      {
        id: "apron",
        label: "Creative apron",
        token: "A",
        family: "career",
        plannedOnly: true,
        note: "Needs wardrobe layer",
        lower: "trousers",
        fill: "#6c4bd2",
        lowerFill: "#17202a",
        accent: "#a3d95b",
        shirt: "#ffffff",
        tie: "#6c4bd2"
      }
    ],
    accessories: [
      { id: "none", label: "None", token: "-" },
      { id: "earrings", label: "Small earrings", token: "E", plannedOnly: true, note: "Needs aligned ear layer" },
      { id: "badge", label: "Name badge", token: "N", plannedOnly: true, note: "Needs name-badge art" },
      { id: "glasses", label: "Glasses", token: "G", plannedOnly: true, note: "Needs better art" },
      { id: "headphones", label: "Headphones", token: "O", plannedOnly: true, note: "Needs art" },
      { id: "scarf", label: "Scarf", token: "S", plannedOnly: true, note: "Needs art" },
      { id: "backpack", label: "Backpack", token: "B", plannedOnly: true, note: "Needs art" }
    ],
    characterBases: [
      {
        id: "custom-trousers",
        label: "Custom trousers",
        token: "CT",
        partMode: "layered",
        internalOnly: true,
        migratesTo: "ecc-boy-rig-source",
        defaultOutfit: "ecc-winter-trousers-blazer",
        defaultHairStyle: "waves",
        note: "Legacy SVG fallback"
      },
      {
        id: "custom-skirt",
        label: "Custom skirt",
        token: "CS",
        partMode: "layered",
        internalOnly: true,
        migratesTo: "ecc-boy-rig-source",
        defaultOutfit: "ecc-winter-skirt-jumper",
        defaultHairStyle: "long",
        note: "Legacy SVG fallback"
      },
      {
        id: "ecc-boy-rig-source",
        label: "ECC boy Take 2",
        token: "BR",
        partMode: "production-png-rig",
        assetRigId: "ecc-boy-take-2-layered",
        imagePath: "../../Assets/Images and Animations/Avatar Studio/Neutral Boy Smooth Transparent background.png",
        defaultSkinTone: "sand",
        defaultFaceStyle: "soft",
        defaultEyeColour: "blue",
        defaultOutfit: "ecc-current-uniform",
        defaultHairStyle: "waves",
        defaultHairColour: "brown",
        defaultShirt: "ecc-shirt-tie",
        defaultPants: "ecc-navy-pants",
        defaultShoes: "black-school-shoes",
        defaultBlazer: "ecc-navy-blazer",
        defaultAccessory: "none",
        note: "Active Take 2 layered art"
      },
      {
        id: "ecc-girl-rig-source",
        label: "ECC girl preset",
        token: "GR",
        partMode: "production-png-rig",
        assetRigId: "ecc-boy-take-2-layered",
        imagePath: "../../Assets/Images and Animations/Avatar Studio/Neutral Boy Smooth Transparent background.png",
        defaultOutfit: "ecc-current-uniform",
        defaultHairStyle: "waves",
        defaultAccessory: "none",
        plannedOnly: true,
        note: "Girl art pending"
      },
      {
        id: "mackillop",
        label: "MacKillop welcome",
        token: "M",
        imagePath: "../../Assets/Images and Animations/Emmanuel Student Characters/MacKillop/MacKillop Welcome.png",
        referenceOnly: true,
        note: "ECC reference"
      },
      {
        id: "mackillop-thinking",
        label: "MacKillop thinking",
        token: "T",
        imagePath: "../../Assets/Images and Animations/Emmanuel Student Characters/MacKillop/MacKillop Thinking.png",
        referenceOnly: true,
        note: "ECC reference"
      },
      {
        id: "mackillop-pointing",
        label: "MacKillop pointing",
        token: "P",
        imagePath: "../../Assets/Images and Animations/Emmanuel Student Characters/MacKillop/MacKillop Pointing.png",
        referenceOnly: true,
        note: "ECC reference"
      },
      {
        id: "romero",
        label: "Romero welcome",
        token: "R",
        imagePath: "../../Assets/Images and Animations/Emmanuel Student Characters/Romero/Romero Welcoming.png",
        referenceOnly: true,
        note: "ECC reference"
      },
      {
        id: "romero-thinking",
        label: "Romero thinking",
        token: "T",
        imagePath: "../../Assets/Images and Animations/Emmanuel Student Characters/Romero/Romero Thinking.png",
        referenceOnly: true,
        note: "ECC reference"
      },
      {
        id: "romero-celebrating",
        label: "Romero celebrating",
        token: "C",
        imagePath: "../../Assets/Images and Animations/Emmanuel Student Characters/Romero/Romero Celebrating.png",
        referenceOnly: true,
        note: "ECC reference"
      },
      {
        id: "modular-student",
        label: "Modular rig prototype",
        token: "MR",
        partMode: "layered",
        internalOnly: true,
        migratesTo: "custom-trousers",
        note: "Schema test only"
      }
    ],
    unlocks: [
      { name: "Interview outfit", state: "Starter", color: "#17202a", token: "IO" },
      { name: "Work boots", state: "Shop stage 2", color: "#935a3c", token: "WB" },
      { name: "Health kit", state: "Career gear", color: "#0f8f8c", token: "HK" },
      { name: "Tool belt", state: "Apprenticeship", color: "#f6b73c", token: "TB" },
      { name: "Laptop bag", state: "Study upgrade", color: "#3859c7", token: "LB" },
      { name: "Transport fund", state: "Life goal", color: "#e85d4f", token: "TF" }
    ],
    defaults: {
      characterBase: "ecc-boy-rig-source",
      skinTone: "sand",
      faceStyle: "soft",
      eyeColour: "blue",
      hairStyle: "waves",
      hairColour: "brown",
      outfit: "ecc-current-uniform",
      shirt: "ecc-shirt-tie",
      pants: "ecc-navy-pants",
      shoes: "black-school-shoes",
      blazer: "ecc-navy-blazer",
      accessory: "none",
      animationState: "idle",
      occupation: "",
      training: "",
      strength: ""
    }
  };
})();
