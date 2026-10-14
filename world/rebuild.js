(function () {
  "use strict";

  const WORLD = {
    width: 2560,
    height: 2304,
    playerSpeed: 190,
    runSpeed: 285,
    playerDisplay: { width: 96, height: 144 },
    playerOrigin: { x: 0.5, y: 0.9375 },
    playerFootRadius: 12,
    walkZoom: 0.96,
    runZoom: 0.9,
    approachZoom: 1.06,
    aerialZoom: 0.31,
    assetRoot: "../Assets/Images and Animations/Career Empire World/"
  };

  const ASSETS = {
    grass: "terrain/CE-TERRAIN-001-base-grass.png",
    grassFlowers: "terrain/CE-TERRAIN-002-grass-flowers.png",
    grassWorn: "terrain/CE-TERRAIN-003-grass-worn.png",
    plaza: "paths/CE-PATH-001-plaza-stone-base.png",
    plazaGlow: "paths/CE-PATH-002-plaza-stone-glow.png",
    roadStraight: "paths/CE-PATH-003-road-straight.png",
    roadCorner: "paths/CE-PATH-004-road-corner.png",
    roadT: "paths/CE-PATH-005-road-t-junction.png",
    roadCrossing: "paths/CE-PATH-006-road-crossing.png",
    gardenEdge: "terrain/CE-TERRAIN-004-garden-edge.png",
    water: "water/CE-WATER-001-base-water.png",
    shore: "water/CE-WATER-002-shore-edge.png",
    homeBase: "buildings/CE-BLDG-001-home-base.png",
    skillsCentre: "buildings/CE-BLDG-005-initiative-workshop.png",
    townHall: "buildings/CE-BLDG-008-town-hall.png",
    estPrep: "buildings/CE-BLDG-002-est-prep-lab.png",
    lamp: "props/CE-PROP-001-street-lamp.png",
    sign: "props/CE-PROP-002-wayfinding-sign.png",
    marker: "props/CE-PROP-003-hologram-marker.png",
    bench: "props/CE-PROP-004-campus-bench.png",
    planter: "props/CE-PROP-005-planter.png",
    treeSmall: "props/CE-PROP-006-tree-small.png",
    treeLarge: "props/CE-PROP-007-tree-large.png",
    bin: "props/CE-PROP-008-campus-bin.png",
    bikeRack: "props/CE-PROP-009-bike-rack.png",
    banner: "props/CE-PROP-011-community-banner.png",
    canopy: "props/CE-PROP-012-solar-canopy.png"
  };

  const CHARACTER_POSES = {
    idleBack: "avatars/CE-CHAR-B01/runtime/CE-CHAR-B01-idle-back-3q.png",
    walkBackA: "avatars/CE-CHAR-B01/runtime/CE-CHAR-B01-walk-back-3q-a.png",
    walkBackB: "avatars/CE-CHAR-B01/runtime/CE-CHAR-B01-walk-back-3q-b.png",
    idleFront: "avatars/CE-CHAR-B01/runtime/CE-CHAR-B01-idle-front-3q.png",
    idleLeft: "avatars/CE-CHAR-B01/runtime/CE-CHAR-B01-idle-left-3q.png",
    idleRight: "avatars/CE-CHAR-B01/runtime/CE-CHAR-B01-idle-right-3q.png",
    walkLeftA: "avatars/CE-CHAR-B01/runtime/CE-CHAR-B01-walk-left-3q-a.png",
    walkRightA: "avatars/CE-CHAR-B01/runtime/CE-CHAR-B01-walk-right-3q-a.png",
    jumpBack: "avatars/CE-CHAR-B01/runtime/CE-CHAR-B01-jump-back-3q.png",
    pointFront: "avatars/CE-CHAR-B01/runtime/CE-CHAR-B01-point-front-3q.png",
    celebrateFront: "avatars/CE-CHAR-B01/runtime/CE-CHAR-B01-celebrate-front-3q.png"
  };

  // Occupied alpha bounds copied from asset-manifest.stage0.json. Display targets
  // describe the visible object, not the transparent source canvas around it.
  const ASSET_BOUNDS = {
    homeBase: { sourceWidth: 1024, sourceHeight: 1024, occupiedY: 208, occupiedWidth: 1020, occupiedHeight: 607 },
    skillsCentre: { sourceWidth: 1024, sourceHeight: 1024, occupiedY: 196, occupiedWidth: 1020, occupiedHeight: 632 },
    estPrep: { sourceWidth: 1024, sourceHeight: 1024, occupiedY: 183, occupiedWidth: 1020, occupiedHeight: 657 },
    townHall: { sourceWidth: 1024, sourceHeight: 1024, occupiedY: 200, occupiedWidth: 982, occupiedHeight: 632 },
    lamp: { sourceWidth: 512, sourceHeight: 512, occupiedWidth: 132, occupiedHeight: 484 },
    sign: { sourceWidth: 512, sourceHeight: 512, occupiedWidth: 335, occupiedHeight: 484 },
    marker: { sourceWidth: 512, sourceHeight: 512, occupiedWidth: 353, occupiedHeight: 483 },
    bench: { sourceWidth: 512, sourceHeight: 512, occupiedWidth: 488, occupiedHeight: 357 },
    planter: { sourceWidth: 512, sourceHeight: 512, occupiedWidth: 474, occupiedHeight: 466 },
    treeSmall: { sourceWidth: 512, sourceHeight: 512, occupiedWidth: 323, occupiedHeight: 484 },
    treeLarge: { sourceWidth: 512, sourceHeight: 512, occupiedWidth: 473, occupiedHeight: 483 },
    bin: { sourceWidth: 512, sourceHeight: 512, occupiedWidth: 412, occupiedHeight: 484 },
    bikeRack: { sourceWidth: 512, sourceHeight: 512, occupiedWidth: 481, occupiedHeight: 372 },
    banner: { sourceWidth: 512, sourceHeight: 512, occupiedWidth: 456, occupiedHeight: 484 }
  };

  const DESTINATIONS = [
    {
      id: "home-base",
      title: "Home Base",
      type: "Home and Identity Quarter",
      detail: "Arrival, identity, goals and your personal career story.",
      href: "../dashboards/student.html?from=world-rebuild",
      asset: "homeBase",
      x: 600,
      baseY: 2070,
      occupiedHeight: 390,
      entrance: { x: 512, y: 1792 },
      collision: { x: 600, y: 2032, width: 470, height: 76 }
    },
    {
      id: "town-square",
      title: "Town Square",
      type: "Civic Heart",
      detail: "The shared class space for community progress, votes and chapter events.",
      x: 1280,
      y: 1280,
      occupiedHeight: 0,
      entrance: { x: 1280, y: 1280 },
      collision: null
    },
    {
      id: "skills-centre",
      title: "Skills Centre",
      type: "Careers and Learning Quarter",
      detail: "Earn capability badges here. Initiative is the first live skill path.",
      href: "../modules/initiative/index.html?from=world-rebuild",
      asset: "skillsCentre",
      x: 760,
      baseY: 650,
      occupiedHeight: 410,
      entrance: { x: 768, y: 768 },
      collision: { x: 760, y: 612, width: 500, height: 76 }
    },
    {
      id: "est-prep",
      title: "EST Prep Lab",
      type: "Careers and Learning Quarter",
      detail: "A smaller academic support stop for Week 9 preparation.",
      href: "../modules/est-prep/index.html?from=world-rebuild",
      asset: "estPrep",
      x: 310,
      baseY: 700,
      occupiedHeight: 250,
      entrance: { x: 512, y: 768 },
      collision: { x: 310, y: 670, width: 285, height: 60 }
    },
    {
      id: "first-workplace",
      title: "First Workplace",
      type: "Work and Enterprise Quarter",
      detail: "Placeholder entrance for first job, income and workplace expectations. Dedicated art is still missing.",
      x: 2180,
      y: 940,
      occupiedHeight: 0,
      entrance: { x: 2048, y: 1024 },
      collision: { x: 2180, y: 920, width: 330, height: 150 },
      placeholder: true
    },
    {
      id: "town-hall",
      title: "Town Hall",
      type: "Civic Heart",
      detail: "Community fund, class votes and town upgrade decisions.",
      href: "../dashboards/community.html?from=world-rebuild",
      asset: "townHall",
      x: 1280,
      baseY: 2180,
      occupiedHeight: 400,
      entrance: { x: 1280, y: 1792 },
      collision: { x: 1280, y: 2142, width: 470, height: 76 }
    }
  ];

  const ROUTE_NODES = [
    { id: "loop-nw", x: 512, y: 768 },
    { id: "loop-north", x: 1280, y: 768 },
    { id: "loop-ne", x: 2048, y: 768 },
    { id: "loop-east", x: 2048, y: 1280 },
    { id: "loop-se", x: 2048, y: 1792 },
    { id: "loop-south", x: 1280, y: 1792 },
    { id: "loop-sw", x: 512, y: 1792 },
    { id: "loop-west", x: 512, y: 1280 },
    { id: "town-square-centre", x: 1280, y: 1280 },
    { id: "skills-entry", x: 768, y: 768 },
    { id: "est-entry", x: 512, y: 768 },
    { id: "home-entry", x: 512, y: 1792 },
    { id: "workplace-entry", x: 2048, y: 1024 },
    { id: "town-hall-entry", x: 1280, y: 1792 }
  ];

  const ROUTE_LINKS = [
    ["loop-nw", "loop-north"], ["loop-north", "loop-ne"],
    ["loop-ne", "loop-east"], ["loop-east", "loop-se"],
    ["loop-se", "loop-south"], ["loop-south", "loop-sw"],
    ["loop-sw", "loop-west"], ["loop-west", "loop-nw"],
    ["loop-west", "town-square-centre"], ["town-square-centre", "loop-east"],
    ["loop-north", "town-square-centre"], ["town-square-centre", "loop-south"],
    ["skills-entry", "loop-north"], ["est-entry", "loop-nw"],
    ["workplace-entry", "loop-east"], ["home-entry", "loop-south"],
    ["town-hall-entry", "loop-south"]
  ];

  const LANDSCAPE = [
    { key: "treeLarge", x: 355, y: 1460, occupiedHeight: 520, collision: { type: "circle", radius: 34 } },
    { key: "treeLarge", x: 2180, y: 1510, occupiedHeight: 500, collision: { type: "circle", radius: 34 } },
    { key: "treeSmall", x: 930, y: 1030, occupiedHeight: 335, collision: { type: "circle", radius: 24 } },
    { key: "treeSmall", x: 1630, y: 1510, occupiedHeight: 330, collision: { type: "circle", radius: 24 } },
    { key: "lamp", x: 895, y: 1160, occupiedHeight: 325, collision: { type: "circle", radius: 16 } },
    { key: "lamp", x: 1665, y: 1160, occupiedHeight: 325, collision: { type: "circle", radius: 16 } },
    { key: "lamp", x: 1055, y: 1640, occupiedHeight: 320, collision: { type: "circle", radius: 16 } },
    { key: "bench", x: 1060, y: 1435, occupiedHeight: 70, collision: { type: "rect", width: 96, height: 24 } },
    { key: "bench", x: 1500, y: 1090, occupiedHeight: 70, collision: { type: "rect", width: 96, height: 24 } },
    { key: "planter", x: 1010, y: 1110, occupiedHeight: 88, collision: { type: "rect", width: 78, height: 24 } },
    { key: "planter", x: 1550, y: 1435, occupiedHeight: 88, collision: { type: "rect", width: 78, height: 24 } },
    { key: "sign", x: 970, y: 1290, occupiedHeight: 180, collision: { type: "circle", radius: 14 } },
    { key: "banner", x: 1280, y: 1010, occupiedHeight: 285, collision: { type: "circle", radius: 16 } },
    { key: "bikeRack", x: 780, y: 650, occupiedHeight: 76, collision: { type: "rect", width: 82, height: 28 } },
    { key: "bin", x: 1470, y: 1720, occupiedHeight: 76, collision: { type: "circle", radius: 15 } },
    { key: "marker", x: 512, y: 1792, occupiedHeight: 150, collision: null, interactionOnly: true },
    { key: "marker", x: 768, y: 768, occupiedHeight: 150, collision: null, interactionOnly: true },
    { key: "marker", x: 2048, y: 1024, occupiedHeight: 150, collision: null, interactionOnly: true }
  ];

  const WATER_BODIES = [
    { x: 270, y: 1110, rx: 150, ry: 78 },
    { x: 2250, y: 1210, rx: 170, ry: 82 }
  ];

  const ROAD_TILES = [
    // Main ring: corners, straights, and cross-street junctions align on the
    // native 256 px tile grid so kerbs and dashed centre lines meet exactly.
    { key: "roadCorner", x: 512, y: 768, rotation: 180 },
    { key: "roadStraight", x: 768, y: 768, rotation: 90 },
    { key: "roadStraight", x: 1024, y: 768, rotation: 90 },
    { key: "roadT", x: 1280, y: 768, rotation: 0 },
    { key: "roadStraight", x: 1536, y: 768, rotation: 90 },
    { key: "roadStraight", x: 1792, y: 768, rotation: 90 },
    { key: "roadCorner", x: 2048, y: 768, rotation: 270 },
    { key: "roadStraight", x: 2048, y: 1024, rotation: 0 },
    { key: "roadT", x: 2048, y: 1280, rotation: 90 },
    { key: "roadStraight", x: 2048, y: 1536, rotation: 0 },
    { key: "roadCorner", x: 2048, y: 1792, rotation: 0 },
    { key: "roadStraight", x: 1792, y: 1792, rotation: 90 },
    { key: "roadStraight", x: 1536, y: 1792, rotation: 90 },
    { key: "roadT", x: 1280, y: 1792, rotation: 180 },
    { key: "roadStraight", x: 1024, y: 1792, rotation: 90 },
    { key: "roadStraight", x: 768, y: 1792, rotation: 90 },
    { key: "roadCorner", x: 512, y: 1792, rotation: 90 },
    { key: "roadStraight", x: 512, y: 1536, rotation: 0 },
    { key: "roadT", x: 512, y: 1280, rotation: 270 },
    { key: "roadStraight", x: 512, y: 1024, rotation: 0 },
    // Two short streets cross in Town Square and terminate at the loop.
    { key: "roadStraight", x: 768, y: 1280, rotation: 90 },
    { key: "roadStraight", x: 1024, y: 1280, rotation: 90 },
    { key: "roadCrossing", x: 1280, y: 1280, rotation: 0 },
    { key: "roadStraight", x: 1536, y: 1280, rotation: 90 },
    { key: "roadStraight", x: 1792, y: 1280, rotation: 90 },
    { key: "roadStraight", x: 1280, y: 1024, rotation: 0 },
    { key: "roadStraight", x: 1280, y: 1536, rotation: 0 }
  ];

  class RebuildScene extends Phaser.Scene {
    constructor() {
      super("RebuildScene");
      this.keys = null;
      this.player = null;
      this.currentDirection = "front";
      this.walkTimer = 0;
      this.walkDistance = 0;
      this.routePath = [];
      this.colliders = [];
      this.destinationZones = [];
      this.currentDestination = null;
      this.isAerial = false;
      this.oneShotUntil = 0;
      this.lastToast = "";
      this.routeGraph = new Map();
    }

    preload() {
      Object.entries(ASSETS).forEach(([key, path]) => {
        this.load.image(key, WORLD.assetRoot + path);
      });
      Object.entries(CHARACTER_POSES).forEach(([key, path]) => {
        this.load.image(key, WORLD.assetRoot + path);
      });
    }

    create() {
      document.querySelector(".rebuild-loading")?.remove();
      this.cameras.main.setBounds(0, 0, WORLD.width, WORLD.height);
      this.physics.world.setBounds(0, 0, WORLD.width, WORLD.height);

      this.buildRouteGraph();
      this.drawGround();
      this.drawWater();
      this.drawRoutes();
      this.drawTownSquare();
      this.drawDestinations();
      this.drawLandscape();
      this.createPlayer();
      this.createMiniMap();
      this.setupInput();
      this.setPanel(null);

      this.cameras.main.startFollow(this.player, true, 0.12, 0.12, 0, 42);
      this.cameras.main.setZoom(WORLD.walkZoom);
      this.cameras.main.centerOn(this.player.x, this.player.y);
      this.showToast("Stage 1 rebuild slice: walk to Town Square, Skills Centre, or First Workplace.");
    }

    buildRouteGraph() {
      ROUTE_NODES.forEach((node) => {
        this.routeGraph.set(node.id, { ...node, links: [] });
      });
      ROUTE_LINKS.forEach(([a, b]) => {
        this.routeGraph.get(a)?.links.push(b);
        this.routeGraph.get(b)?.links.push(a);
      });
    }

    drawGround() {
      const base = this.add.graphics().setDepth(-205);
      base.fillStyle(0x315f3e, 1);
      base.fillRect(0, 0, WORLD.width, WORLD.height);

      for (let x = 0; x < WORLD.width; x += 256) {
        for (let y = 0; y < WORLD.height; y += 256) {
          const key = (x + y) % 768 === 0 ? "grassFlowers" : (x / 256 + y / 256) % 5 === 0 ? "grassWorn" : "grass";
          this.add.image(x + 128, y + 128, key)
            .setDisplaySize(258, 258)
            .setAlpha(0.68)
            .setDepth(-200);
        }
      }

      const shade = this.add.graphics().setDepth(-150);
      shade.fillStyle(0x0a2c2d, 0.08);
      shade.fillEllipse(1200, 1260, 1180, 840);
      shade.fillStyle(0x1e6f44, 0.08);
      shade.fillEllipse(720, 1340, 930, 730);

      [
        { x: 420, y: 900, rotation: 0 }, { x: 2140, y: 920, rotation: 90 },
        { x: 410, y: 1650, rotation: 270 }, { x: 2140, y: 1640, rotation: 180 }
      ].forEach((edge) => {
        this.add.image(edge.x, edge.y, "gardenEdge")
          .setRotation(Phaser.Math.DegToRad(edge.rotation))
          .setAlpha(0.52)
          .setDepth(-145);
      });
    }

    drawWater() {
      const water = this.add.graphics().setDepth(-120);
      WATER_BODIES.forEach((body) => {
        water.fillStyle(0x0a5f83, 0.86);
        water.fillEllipse(body.x, body.y, body.rx * 2, body.ry * 2);
        water.lineStyle(14, 0x7fd7cc, 0.24);
        water.strokeEllipse(body.x, body.y, body.rx * 2.08, body.ry * 2.08);
        this.colliders.push({ type: "ellipse", x: body.x, y: body.y, rx: body.rx * 0.92, ry: body.ry * 0.82 });
      });
    }

    drawRoutes() {
      // A 3 x 3 stone civic plaza sits below the road crossing. The centre glow
      // marks Town Square without drawing synthetic road or debug geometry.
      for (let x = 1024; x <= 1536; x += 256) {
        for (let y = 1024; y <= 1536; y += 256) {
          const key = x === 1280 && y === 1280 ? "plazaGlow" : "plaza";
          this.add.image(x, y, key).setDepth(-92).setAlpha(key === "plazaGlow" ? 0.92 : 0.78);
        }
      }

      ROAD_TILES.forEach((tile) => {
        this.add.image(tile.x, tile.y, tile.key)
          .setRotation(Phaser.Math.DegToRad(tile.rotation))
          .setDepth(-80);
      });
    }

    drawTownSquare() {
      this.add.text(1280, 1160, "TOWN SQUARE", {
        fontFamily: "Outfit, sans-serif",
        fontSize: "24px",
        fontStyle: "800",
        color: "#eaf3ff",
        stroke: "#07111f",
        strokeThickness: 5
      }).setOrigin(0.5).setDepth(1000);
    }

    drawDestinations() {
      DESTINATIONS.forEach((destination) => {
        if (destination.asset) {
          const bounds = ASSET_BOUNDS[destination.asset];
          const scale = destination.occupiedHeight / bounds.occupiedHeight;
          const occupiedBottomFromCentre = bounds.occupiedY + bounds.occupiedHeight - bounds.sourceHeight / 2;
          const imageY = destination.baseY - occupiedBottomFromCentre * scale;
          const image = this.add.image(destination.x, imageY, destination.asset)
            .setDisplaySize(bounds.sourceWidth * scale, bounds.sourceHeight * scale)
            .setOrigin(0.5, 0.5);
          image.setDepth(destination.baseY);
        }

        if (destination.placeholder) {
          this.drawWorkplacePlaceholder(destination);
        }

        if (destination.collision) {
          this.colliders.push({ type: "rect", ...destination.collision });
        }

        const zone = {
          ...destination,
          radius: destination.id === "town-square" ? 170 : 92
        };
        this.destinationZones.push(zone);

        if (destination.id !== "town-square") {
          const markerBounds = ASSET_BOUNDS.marker;
          const markerScale = 150 / markerBounds.occupiedHeight;
          this.add.image(destination.entrance.x, destination.entrance.y, "marker")
            .setDisplaySize(markerBounds.sourceWidth * markerScale, markerBounds.sourceHeight * markerScale)
            .setAlpha(0.72)
            .setDepth(destination.entrance.y - 20);
        }

        this.add.text(destination.entrance.x, destination.entrance.y + 54, destination.title.toUpperCase(), {
          fontFamily: "Outfit, sans-serif",
          fontSize: destination.id === "est-prep" ? "15px" : "17px",
          fontStyle: "800",
          color: "#eaf3ff",
          align: "center",
          stroke: "#07111f",
          strokeThickness: 5
        }).setOrigin(0.5, 0).setDepth(2000);
      });
    }

    drawWorkplacePlaceholder(destination) {
      const g = this.add.graphics().setDepth(destination.y);
      g.fillStyle(0x253344, 0.96);
      g.fillRoundedRect(destination.x - 165, destination.y - 130, 330, 195, 12);
      g.fillStyle(0x9aaab7, 0.96);
      g.fillRoundedRect(destination.x - 142, destination.y - 105, 284, 142, 8);
      g.fillStyle(0x123247, 0.92);
      g.fillRoundedRect(destination.x - 112, destination.y - 76, 224, 91, 6);
      g.fillStyle(0x67d8ff, 0.92);
      g.fillRoundedRect(destination.x - 36, destination.y - 4, 72, 65, 4);
      g.fillStyle(0x07111f, 0.85);
      g.fillRect(destination.x - 145, destination.y + 63, 290, 16);
      this.add.text(destination.x, destination.y - 26, "FIRST\nWORKPLACE", {
        fontFamily: "Outfit, sans-serif",
        fontSize: "21px",
        fontStyle: "800",
        color: "#eaf3ff",
        align: "center",
        stroke: "#07111f",
        strokeThickness: 5
      }).setOrigin(0.5).setDepth(destination.y + 1);
    }

    drawLandscape() {
      LANDSCAPE.forEach((item) => {
        const bounds = ASSET_BOUNDS[item.key];
        const scale = item.occupiedHeight / bounds.occupiedHeight;
        const sprite = this.add.image(item.x, item.y, item.key)
          .setDisplaySize(bounds.sourceWidth * scale, bounds.sourceHeight * scale)
          .setOrigin(0.5, item.key.includes("tree") || item.key === "lamp" ? 0.98 : 0.78)
          .setDepth(item.y + (item.key.includes("tree") ? 8 : 0));

        if (item.interactionOnly) {
          sprite.setAlpha(0.74);
        }

        if (item.collision) {
          if (item.collision.type === "circle") {
            this.colliders.push({ type: "circle", x: item.x, y: item.y - 8, radius: item.collision.radius });
          } else {
            this.colliders.push({ type: "rect", x: item.x, y: item.y, width: item.collision.width, height: item.collision.height });
          }
        }
      });
    }

    createPlayer() {
      this.player = this.physics.add.sprite(512, 1660, "idleBack")
        .setDisplaySize(WORLD.playerDisplay.width, WORLD.playerDisplay.height)
        .setOrigin(WORLD.playerOrigin.x, WORLD.playerOrigin.y)
        .setCollideWorldBounds(true)
        .setDepth(1855);
      this.player.body.setSize(32, 18);
      this.player.body.setOffset(112, 342);
    }

    setupInput() {
      this.keys = this.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.UP,
        down: Phaser.Input.Keyboard.KeyCodes.DOWN,
        left: Phaser.Input.Keyboard.KeyCodes.LEFT,
        right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
        w: Phaser.Input.Keyboard.KeyCodes.W,
        a: Phaser.Input.Keyboard.KeyCodes.A,
        s: Phaser.Input.Keyboard.KeyCodes.S,
        d: Phaser.Input.Keyboard.KeyCodes.D,
        shift: Phaser.Input.Keyboard.KeyCodes.SHIFT,
        space: Phaser.Input.Keyboard.KeyCodes.SPACE,
        p: Phaser.Input.Keyboard.KeyCodes.P,
        c: Phaser.Input.Keyboard.KeyCodes.C,
        m: Phaser.Input.Keyboard.KeyCodes.M,
        enter: Phaser.Input.Keyboard.KeyCodes.ENTER
      });

      this.input.on("pointerdown", (pointer) => {
        const worldPoint = pointer.positionToCamera(this.cameras.main);
        this.routePath = this.findRoutePath({ x: this.player.x, y: this.player.y }, worldPoint);
        this.isAerial = false;
      });

      this.input.keyboard.on("keydown-M", () => this.toggleAerial());
      this.input.keyboard.on("keydown-SPACE", () => this.playOneShot("jumpBack", 520, -34));
      this.input.keyboard.on("keydown-P", () => this.playOneShot("pointFront", 820, 0));
      this.input.keyboard.on("keydown-C", () => this.playOneShot("celebrateFront", 900, 0));
      this.input.keyboard.on("keydown-ENTER", () => this.enterCurrentDestination());

      document.getElementById("rebuild-aerial-button")?.addEventListener("click", () => this.toggleAerial());
      document.getElementById("rebuild-enter-button")?.addEventListener("click", () => this.enterCurrentDestination());
    }

    playOneShot(textureKey, duration, hop) {
      this.routePath = [];
      this.player.setVelocity(0, 0);
      this.player.setTexture(textureKey);
      this.oneShotUntil = this.time.now + duration;
      if (hop) {
        this.tweens.add({
          targets: this.player,
          y: this.player.y + hop,
          yoyo: true,
          ease: "Sine.easeOut",
          duration: duration / 2
        });
      }
    }

    toggleAerial() {
      this.isAerial = !this.isAerial;
      this.routePath = [];
      if (this.isAerial) {
        this.cameras.main.stopFollow();
        this.cameras.main.pan(WORLD.width / 2, WORLD.height / 2, 420, "Sine.easeInOut");
        this.cameras.main.zoomTo(WORLD.aerialZoom, 420, "Sine.easeInOut");
        this.showToast("Aerial view. Press a movement key to return to walking camera.");
      } else {
        this.cameras.main.startFollow(this.player, true, 0.12, 0.12, 0, 42);
      }
    }

    update(time, delta) {
      const manualVector = this.getManualVector();
      const isManual = manualVector.lengthSq() > 0;
      if (isManual && this.isAerial) {
        this.isAerial = false;
        this.cameras.main.startFollow(this.player, true, 0.12, 0.12, 0, 42);
      }

      const running = this.keys.shift.isDown;
      let velocity = new Phaser.Math.Vector2(0, 0);
      if (isManual) {
        this.routePath = [];
        velocity = manualVector.normalize().scale(running ? WORLD.runSpeed : WORLD.playerSpeed);
      } else if (this.routePath.length) {
        velocity = this.getRouteVelocity(running);
      }

      this.movePlayer(velocity, delta);
      this.updatePose(velocity, running, time, delta);
      this.updateCamera(velocity, running);
      this.updateInteractions();
      this.updateMiniMap();
    }

    getManualVector() {
      const left = this.keys.left.isDown || this.keys.a.isDown;
      const right = this.keys.right.isDown || this.keys.d.isDown;
      const up = this.keys.up.isDown || this.keys.w.isDown;
      const down = this.keys.down.isDown || this.keys.s.isDown;
      return new Phaser.Math.Vector2((right ? 1 : 0) - (left ? 1 : 0), (down ? 1 : 0) - (up ? 1 : 0));
    }

    getRouteVelocity(running) {
      const target = this.routePath[0];
      const toTarget = new Phaser.Math.Vector2(target.x - this.player.x, target.y - this.player.y);
      if (toTarget.length() < 18) {
        this.routePath.shift();
        return new Phaser.Math.Vector2(0, 0);
      }
      return toTarget.normalize().scale(running ? WORLD.runSpeed : WORLD.playerSpeed);
    }

    movePlayer(velocity, delta) {
      if (!velocity.lengthSq()) {
        this.player.setVelocity(0, 0);
        return;
      }

      const step = velocity.clone().scale(delta / 1000);
      const current = { x: this.player.x, y: this.player.y };
      const nextX = { x: current.x + step.x, y: current.y };
      const nextY = { x: current.x, y: current.y + step.y };

      if (!this.isBlocked(nextX)) this.player.x = nextX.x;
      if (!this.isBlocked(nextY)) this.player.y = nextY.y;
      this.player.setDepth(this.player.y + 40);
    }

    isBlocked(point) {
      if (point.x < 80 || point.y < 180 || point.x > WORLD.width - 80 || point.y > WORLD.height - 90) {
        return true;
      }
      if (!this.isWalkable(point)) return true;

      const footRadius = WORLD.playerFootRadius;
      return this.colliders.some((collider) => {
        if (collider.type === "rect") {
          return point.x > collider.x - collider.width / 2 - footRadius &&
            point.x < collider.x + collider.width / 2 + footRadius &&
            point.y > collider.y - collider.height / 2 - footRadius &&
            point.y < collider.y + collider.height / 2 + footRadius;
        }
        if (collider.type === "circle") {
          return Phaser.Math.Distance.Between(point.x, point.y, collider.x, collider.y) < collider.radius + footRadius;
        }
        if (collider.type === "ellipse") {
          const dx = (point.x - collider.x) / (collider.rx + footRadius);
          const dy = (point.y - collider.y) / (collider.ry + footRadius);
          return dx * dx + dy * dy <= 1;
        }
        return false;
      });
    }

    isWalkable(point) {
      // Roads communicate the preferred route, but Stage 1 grass remains
      // exploratory space. Only visible bases and the world boundary block feet.
      return point.x >= 80 && point.y >= 180 && point.x <= WORLD.width - 80 && point.y <= WORLD.height - 90;
    }

    updatePose(velocity, running, time, delta) {
      if (time < this.oneShotUntil) return;

      const moving = velocity.lengthSq() > 8;
      if (moving) {
        this.currentDirection = this.directionFromVelocity(velocity);
        this.walkTimer += delta * (running ? 1.7 : 1);
        this.walkDistance += velocity.length() * delta / 1000;
      } else {
        this.walkTimer = 0;
        this.walkDistance = 0;
      }

      const texture = this.pickPose(moving);
      this.player.setTexture(texture);
      this.player.setRotation(0);
      this.player.setDisplaySize(WORLD.playerDisplay.width, WORLD.playerDisplay.height);
    }

    directionFromVelocity(velocity) {
      if (Math.abs(velocity.x) > Math.abs(velocity.y) * 0.75) {
        return velocity.x < 0 ? "left" : "right";
      }
      return velocity.y < 0 ? "back" : "front";
    }

    pickPose(moving) {
      if (!moving) {
        if (this.currentDirection === "back") return "idleBack";
        if (this.currentDirection === "left") return "idleLeft";
        if (this.currentDirection === "right") return "idleRight";
        return "idleFront";
      }

      const phase = Math.floor(this.walkDistance / 34) % 3;
      if (this.currentDirection === "back") {
        return phase === 0 ? "idleBack" : phase === 1 ? "walkBackA" : "walkBackB";
      }
      if (this.currentDirection === "left") return phase % 2 === 0 ? "idleLeft" : "walkLeftA";
      if (this.currentDirection === "right") return phase % 2 === 0 ? "idleRight" : "walkRightA";
      return phase % 2 === 0 ? "idleFront" : "walkBackA";
    }

    updateCamera(velocity, running) {
      if (this.isAerial) return;
      const nearDestination = this.nearestDestination(175);
      const targetZoom = nearDestination ? WORLD.approachZoom : running || this.routePath.length ? WORLD.runZoom : WORLD.walkZoom;
      this.cameras.main.zoomTo(targetZoom, 260, "Sine.easeOut");

      const lookAheadX = Phaser.Math.Clamp(velocity.x * 0.34, -72, 72);
      const lookAheadY = Phaser.Math.Clamp(velocity.y * 0.18, -42, 64);
      const destinationX = nearDestination ? nearDestination.x - this.player.x : 0;
      const destinationY = nearDestination ? nearDestination.y - this.player.y : 0;
      const frameX = nearDestination ? Phaser.Math.Clamp(destinationX * 0.38, -118, 118) : lookAheadX;
      const frameY = nearDestination ? Phaser.Math.Clamp(destinationY * 0.3, -92, 72) : lookAheadY;
      this.cameras.main.setFollowOffset(-frameX, 42 - frameY);
    }

    updateInteractions() {
      const destination = this.nearestDestination(105);
      if (destination?.id !== this.currentDestination?.id) {
        this.currentDestination = destination;
        this.setPanel(destination);
        if (destination) {
          this.showToast(destination.href
            ? `${destination.title}: press Enter to enter.`
            : `${destination.title}: Stage 1 exterior preview.`);
        }
      }
    }

    nearestDestination(radius) {
      let nearest = null;
      let best = Infinity;
      this.destinationZones.forEach((destination) => {
        const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, destination.entrance.x, destination.entrance.y);
        const threshold = destination.radius || radius;
        if (d < threshold && d < best) {
          nearest = destination;
          best = d;
        }
      });
      return nearest;
    }

    setPanel(destination) {
      const type = document.getElementById("rebuild-location-type");
      const title = document.getElementById("rebuild-location-title");
      const detail = document.getElementById("rebuild-location-detail");
      const button = document.getElementById("rebuild-enter-button");
      if (!type || !title || !detail || !button) return;

      if (!destination) {
        type.textContent = "Current area";
        title.textContent = "Arrival Street";
        detail.textContent = "Walk from Home Base to Town Square, then out to Skills Centre or First Workplace.";
        button.textContent = "Move near an entrance";
        button.disabled = true;
        return;
      }

      type.textContent = destination.type;
      title.textContent = destination.title;
      detail.textContent = destination.detail;
      button.textContent = destination.href ? `Enter ${destination.title}` : "Stage 1 preview - no interior";
      button.disabled = !destination.href;
    }

    enterCurrentDestination() {
      if (this.currentDestination?.href) {
        window.location.href = this.currentDestination.href;
      }
    }

    showToast(message) {
      if (!message || message === this.lastToast) return;
      this.lastToast = message;
      const toast = document.getElementById("rebuild-toast");
      if (!toast) return;
      toast.textContent = message;
      toast.classList.add("is-visible");
      window.clearTimeout(this.toastTimer);
      this.toastTimer = window.setTimeout(() => {
        toast.classList.remove("is-visible");
        this.lastToast = "";
      }, 2600);
    }

    findRoutePath(from, to) {
      const start = this.closestNode(from);
      const end = this.closestNode(to);
      if (!start || !end) return [{ x: to.x, y: to.y }];

      const open = [start.id];
      const cameFrom = new Map();
      const scores = new Map([[start.id, 0]]);

      while (open.length) {
        open.sort((a, b) => {
          const an = this.routeGraph.get(a);
          const bn = this.routeGraph.get(b);
          return (scores.get(a) || 0) + Phaser.Math.Distance.Between(an.x, an.y, end.x, end.y) -
            ((scores.get(b) || 0) + Phaser.Math.Distance.Between(bn.x, bn.y, end.x, end.y));
        });
        const current = open.shift();
        if (current === end.id) break;

        const node = this.routeGraph.get(current);
        node.links.forEach((nextId) => {
          const next = this.routeGraph.get(nextId);
          const score = (scores.get(current) || 0) + Phaser.Math.Distance.Between(node.x, node.y, next.x, next.y);
          if (!scores.has(nextId) || score < scores.get(nextId)) {
            cameFrom.set(nextId, current);
            scores.set(nextId, score);
            if (!open.includes(nextId)) open.push(nextId);
          }
        });
      }

      const ids = [end.id];
      let current = end.id;
      while (cameFrom.has(current)) {
        current = cameFrom.get(current);
        ids.unshift(current);
      }
      return ids.map((id) => {
        const node = this.routeGraph.get(id);
        return { x: node.x, y: node.y };
      });
    }

    closestNode(point) {
      let closest = null;
      let best = Infinity;
      this.routeGraph.forEach((node) => {
        const d = Phaser.Math.Distance.Between(point.x, point.y, node.x, node.y);
        if (d < best) {
          closest = node;
          best = d;
        }
      });
      return closest;
    }

    createMiniMap() {
      this.minimap = {
        box: this.add.graphics().setScrollFactor(0).setDepth(10000),
        player: this.add.graphics().setScrollFactor(0).setDepth(10001),
        dots: this.add.graphics().setScrollFactor(0).setDepth(10000)
      };
    }

    updateMiniMap() {
      const width = 190;
      const height = 146;
      const margin = 22;
      const cam = this.cameras.main;
      const x = cam.width - width - margin;
      const y = cam.height - height - margin;
      const sx = width / WORLD.width;
      const sy = height / WORLD.height;

      const box = this.minimap.box;
      box.clear();
      box.fillStyle(0x07111f, 0.78);
      box.fillRoundedRect(x, y, width, height, 10);
      box.lineStyle(1, 0xffd166, 0.55);
      box.strokeRoundedRect(x, y, width, height, 10);
      box.fillStyle(0x17364b, 0.8);
      box.fillEllipse(x + width / 2, y + height / 2 + 8, width - 28, height - 42);
      box.fillStyle(0xffd166, 0.85);
      box.fillCircle(x + width / 2, y + 26, 13);

      const dots = this.minimap.dots;
      dots.clear();
      ROUTE_LINKS.forEach(([a, b]) => {
        const from = this.routeGraph.get(a);
        const to = this.routeGraph.get(b);
        dots.lineStyle(2, 0x67d8ff, 0.34);
        dots.lineBetween(x + from.x * sx, y + from.y * sy, x + to.x * sx, y + to.y * sy);
      });
      DESTINATIONS.forEach((destination) => {
        dots.fillStyle(destination.placeholder ? 0xffd166 : 0x80ed99, 0.92);
        dots.fillCircle(x + destination.entrance.x * sx, y + destination.entrance.y * sy, 4);
      });

      const p = this.minimap.player;
      p.clear();
      p.fillStyle(0xff6b6b, 1);
      p.fillCircle(x + this.player.x * sx, y + this.player.y * sy, 5);
    }
  }

  function boot() {
    const container = document.getElementById("rebuild-game");
    if (!container || !window.Phaser) return;
    new Phaser.Game({
      type: Phaser.AUTO,
      parent: "rebuild-game",
      width: container.clientWidth,
      height: container.clientHeight,
      backgroundColor: "#071827",
      physics: {
        default: "arcade",
        arcade: { debug: false }
      },
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
      },
      scene: RebuildScene
    });
  }

  window.addEventListener("load", boot);
})();
