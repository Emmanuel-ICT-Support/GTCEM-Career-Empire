(function () {
  "use strict";

  const CONFIG = {
    layoutUrl: "../data/world/town-layout.stage1-corrected.json",
    assetRoot: "../Assets/Images and Animations/Career Empire World/",
    player: { width: 96, height: 144, originX: 0.5, originY: 0.9375, walk: 185, run: 275 },
    camera: { walk: 1, travel: 0.94, approach: 1.045, sidePadding: 160, topPadding: 230, bottomPadding: 0, aerialPreferredTop: -190, aerialProtectedBottom: 1060 },
    path: { main: 104, mainVisualScale: 0.9, foot: 58 },
    entry: { cinematicDestinationId: "town-hall", transitionMs: 900, transitionHoldRatio: 0.55, approachSpeedRatio: 0.72, promptDistanceRatio: 0.46, approachProgressStart: 0.18 }
  };

  const ASSETS = {
    grass: "terrain/CE-TERRAIN-001-base-grass.png",
    grassFlowers: "terrain/CE-TERRAIN-002-grass-flowers.png",
    grassWorn: "terrain/CE-TERRAIN-003-grass-worn.png",
    plaza: "paths/CE-PATH-001-plaza-stone-base.png",
    plazaGlow: "paths/CE-PATH-002-plaza-stone-glow.png",
    water: "water/CE-WATER-001-base-water.png",
    shore: "water/CE-WATER-002-shore-edge.png",
    bridge: "water/CE-WATER-004-bridge.png",
    homeBase: "buildings/CE-BLDG-001-home-base.png",
    skillsCentre: "buildings/CE-BLDG-005-initiative-workshop.png",
    estPrep: "buildings/CE-BLDG-002-est-prep-lab.png",
    megatrends: "buildings/CE-BLDG-003-megatrends-centre.png",
    townHall: "buildings/CE-BLDG-008-town-hall.png",
    shop: "buildings/CE-BLDG-007-global-shop.png",
    lamp: "props/CE-PROP-001-street-lamp.png",
    sign: "props/CE-PROP-002-wayfinding-sign.png",
    bench: "props/CE-PROP-004-campus-bench.png",
    planter: "props/CE-PROP-005-planter.png",
    treeSmall: "props/CE-PROP-006-tree-small.png",
    treeLarge: "props/CE-PROP-007-tree-large.png",
    bin: "props/CE-PROP-008-campus-bin.png",
    bikeRack: "props/CE-PROP-009-bike-rack.png",
    banner: "props/CE-PROP-011-community-banner.png"
  };

  const POSES = {
    idleBack: "avatars/CE-CHAR-B01/runtime/CE-CHAR-B01-idle-back-3q.png",
    walkBackA: "avatars/CE-CHAR-B01/runtime/CE-CHAR-B01-walk-back-3q-a.png",
    walkBackB: "avatars/CE-CHAR-B01/runtime/CE-CHAR-B01-walk-back-3q-b.png",
    idleFront: "avatars/CE-CHAR-B01/runtime/CE-CHAR-B01-idle-front-3q.png",
    idleLeft: "avatars/CE-CHAR-B01/runtime/CE-CHAR-B01-idle-left-3q.png",
    idleRight: "avatars/CE-CHAR-B01/runtime/CE-CHAR-B01-idle-right-3q.png",
    walkLeftA: "avatars/CE-CHAR-B01/runtime/CE-CHAR-B01-walk-left-3q-a.png",
    walkRightA: "avatars/CE-CHAR-B01/runtime/CE-CHAR-B01-walk-right-3q-a.png"
  };

  const BOUNDS = {
    homeBase: { sw: 1024, sh: 1024, x: 2, y: 207, w: 1020, h: 609 },
    skillsCentre: { sw: 1024, sh: 1024, x: 2, y: 196, w: 1020, h: 632 },
    estPrep: { sw: 1024, sh: 1024, x: 1, y: 182, w: 1022, h: 659 },
    megatrends: { sw: 1024, sh: 1024, x: 2, y: 153, w: 1020, h: 718 },
    townHall: { sw: 1024, sh: 1024, x: 22, y: 200, w: 982, h: 632 },
    shop: { sw: 1024, sh: 1024, x: 2, y: 167, w: 1021, h: 690 },
    lamp: { sw: 512, sh: 512, x: 190, y: 16, w: 132, h: 484 },
    sign: { sw: 512, sh: 512, x: 88, y: 16, w: 335, h: 484 },
    bench: { sw: 512, sh: 512, x: 12, y: 143, w: 488, h: 357 },
    planter: { sw: 512, sh: 512, x: 19, y: 34, w: 474, h: 466 },
    treeSmall: { sw: 512, sh: 512, x: 94, y: 16, w: 323, h: 484 },
    treeLarge: { sw: 512, sh: 512, x: 19, y: 16, w: 473, h: 483 },
    bin: { sw: 512, sh: 512, x: 50, y: 16, w: 412, h: 484 },
    bikeRack: { sw: 512, sh: 512, x: 15, y: 128, w: 481, h: 372 },
    banner: { sw: 512, sh: 512, x: 28, y: 16, w: 456, h: 484 }
  };

  function hex(value) {
    return Phaser.Display.Color.HexStringToColor(value).color;
  }

  class CorrectedTownScene extends Phaser.Scene {
    constructor() {
      super("CorrectedTownScene");
      this.layout = null;
      this.player = null;
      this.keys = null;
      this.direction = "back";
      this.walkDistance = 0;
      this.routeGraph = new Map();
      this.routePath = [];
      this.colliders = [];
      this.destinations = [];
      this.currentDestination = null;
      this.portalPlaceholders = new Map();
      this.activeApproach = null;
      this.approachCooldownUntil = 0;
      this.moduleOpen = false;
      this.moduleDestination = null;
      this.entryPrompt = null;
      this.cinematic = null;
      this.aerial = false;
      this.zoomTarget = CONFIG.camera.walk;
    }

    preload() {
      this.load.json("correctedLayout", CONFIG.layoutUrl);
      Object.entries(ASSETS).forEach(([key, path]) => this.load.image(key, CONFIG.assetRoot + path));
      Object.entries(POSES).forEach(([key, path]) => this.load.image(key, CONFIG.assetRoot + path));
    }

    create() {
      this.layout = this.cache.json.get("correctedLayout");
      document.querySelector(".corrected-loading")?.remove();
      this.cameras.main.setBackgroundColor("#173c2a");
      const bounds = this.cameraBounds();
      this.cameras.main.setBounds(bounds.x, bounds.y, bounds.width, bounds.height);
      this.buildRouteGraph();
      this.drawGround();
      this.drawPrecincts();
      this.drawWaterEdge();
      this.drawRoutes();
      this.drawCivicHeart();
      this.drawDestinations();
      this.drawProps();
      this.createPortalPlaceholders();
      this.createPlayer();
      this.createMinimap();
      this.setupCinematicPresentation();
      this.setupInput();
      this.scale.on("resize", this.handleResize, this);
      this.updatePanel(null);
      this.cameras.main.startFollow(this.player, true, 0.1, 0.1, 0, 20);
      this.cameras.main.setZoom(CONFIG.camera.walk);
    }

    buildRouteGraph() {
      this.layout.routeNodes.forEach((node) => this.routeGraph.set(node.id, { ...node, links: [] }));
      this.layout.routeLinks.forEach(([a, b]) => {
        this.routeGraph.get(a)?.links.push(b);
        this.routeGraph.get(b)?.links.push(a);
      });
    }

    drawGround() {
      const bounds = this.cameraBounds();
      this.add.rectangle(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2, bounds.width, bounds.height, 0x2f6742).setDepth(-300);
      for (let x = bounds.x; x < bounds.x + bounds.width; x += 256) {
        for (let y = bounds.y; y < bounds.y + bounds.height; y += 256) {
          const n = (x / 256) + (y / 256) * 3;
          const key = n % 7 === 0 ? "grassFlowers" : n % 9 === 0 ? "grassWorn" : "grass";
          this.add.image(x + 128, y + 128, key).setDisplaySize(258, 258).setAlpha(0.73).setDepth(-295);
        }
      }
    }

    cameraBounds() {
      return {
        x: -CONFIG.camera.sidePadding,
        y: -CONFIG.camera.topPadding,
        width: this.layout.world.width + CONFIG.camera.sidePadding * 2,
        height: this.layout.world.height + CONFIG.camera.topPadding + CONFIG.camera.bottomPadding
      };
    }

    drawPrecincts() {
      const g = this.add.graphics().setDepth(-260);
      this.layout.precincts.forEach((p) => {
        g.fillStyle(hex(p.color), 0.15);
        g.fillRoundedRect(p.x, p.y, p.width, p.height, 76);
        g.lineStyle(3, hex(p.color), 0.38);
        g.strokeRoundedRect(p.x, p.y, p.width, p.height, 76);
      });
    }

    drawWaterEdge() {
      const g = this.add.graphics().setDepth(-270);
      g.fillStyle(0x075170, 0.92);
      g.fillEllipse(960, -45, 1220, 270);
      g.lineStyle(14, 0x69d9df, 0.2);
      g.strokeEllipse(960, -45, 1220, 270);
    }

    routePoints(route) {
      const points = route.points.map(([x, y]) => new Phaser.Math.Vector2(x, y));
      if (route.closed) points.push(points[0].clone(), points[1].clone());
      return new Phaser.Curves.Spline(points).getSpacedPoints(route.closed ? 170 : Math.max(24, route.points.length * 22));
    }

    drawRoutes() {
      const connectorRoads = this.layout.routes.filter((route) => route.type === "main" && !route.closed);
      const footpaths = this.layout.routes.filter((route) => route.type !== "main");
      const loop = this.layout.routes.find((route) => route.type === "main" && route.closed);
      const road = this.add.graphics().setDepth(-190);
      footpaths.forEach((route) => this.fillRouteStrip(road, route, CONFIG.path.foot, 0x2a3f3f, 0x6f8580, 18));
      connectorRoads.forEach((route) => this.fillRouteStrip(road, route, CONFIG.path.foot, 0x1b3438, 0x627873, 14, false));
      if (loop) this.strokeRoute(road, loop, this.routeVisualWidth(loop), 0x0b202c, 0x314957, 18);
    }

    routeVisualWidth(route) {
      return route.type === "main" ? CONFIG.path.main * CONFIG.path.mainVisualScale : CONFIG.path.foot;
    }

    strokeRoute(graphics, route, width, edgeColor, fillColor, edgePad) {
      const points = this.routePoints(route);
      graphics.lineStyle(width + edgePad, edgeColor, 1);
      graphics.strokePoints(points, false);
      graphics.lineStyle(width, fillColor, 1);
      graphics.strokePoints(points, false);
    }

    fillRouteStrip(graphics, route, width, edgeColor, fillColor, edgePad, capDestination = true) {
      const points = this.routePoints(route);
      this.fillStripLayer(graphics, points, width + edgePad, edgeColor, capDestination);
      this.fillStripLayer(graphics, points, width, fillColor, capDestination);
    }

    fillStripLayer(graphics, points, width, color, capDestination) {
      graphics.fillStyle(color, 1);
      points.forEach((point, index) => {
        if (!index) return;
        this.fillSegment(graphics, points[index - 1], point, width);
      });
      points.slice(1, -1).forEach((point) => graphics.fillCircle(point.x, point.y, width / 2));
      if (capDestination && points.length) {
        const end = points[points.length - 1];
        graphics.fillCircle(end.x, end.y, width / 2);
      }
    }

    fillSegment(graphics, start, end, width) {
      const length = Phaser.Math.Distance.Between(start.x, start.y, end.x, end.y);
      if (!length) return;
      const nx = -(end.y - start.y) / length * width / 2;
      const ny = (end.x - start.x) / length * width / 2;
      graphics.beginPath();
      graphics.moveTo(start.x + nx, start.y + ny);
      graphics.lineTo(end.x + nx, end.y + ny);
      graphics.lineTo(end.x - nx, end.y - ny);
      graphics.lineTo(start.x - nx, start.y - ny);
      graphics.closePath();
      graphics.fillPath();
    }

    drawCivicHeart() {
      this.add.ellipse(960, 805, 350, 240, 0x293b43, 1).setStrokeStyle(8, 0x6bd7ed, 0.4).setDepth(-175);
      const forecourtMask = this.add.graphics().setVisible(false);
      forecourtMask.fillStyle(0xffffff, 1).fillRoundedRect(805, 795, 310, 226, 58);
      const forecourt = forecourtMask.createGeometryMask();
      this.add.tileSprite(960, 908, 310, 226, "plaza").setAlpha(0.72).setDepth(-172).setMask(forecourt);
      this.add.tileSprite(960, 908, 310, 226, "plazaGlow").setAlpha(0.16).setDepth(-171).setMask(forecourt);
      const plazaMask = this.add.graphics().setVisible(false);
      plazaMask.fillStyle(0xffffff, 1).fillEllipse(960, 805, 250, 165);
      const mask = plazaMask.createGeometryMask();
      this.add.tileSprite(960, 805, 250, 165, "plaza").setAlpha(0.86).setDepth(-170).setMask(mask);
      this.add.tileSprite(960, 805, 250, 165, "plazaGlow").setAlpha(0.22).setDepth(-169).setMask(mask);
      this.add.ellipse(960, 805, 250, 165, 0x59604d, 0.2).setStrokeStyle(3, 0xffd166, 0.48).setDepth(-168);
      this.add.text(960, 735, "TOWN SQUARE", {
        fontFamily: "Outfit, sans-serif", fontSize: "21px", fontStyle: "800", color: "#f3fbff",
        stroke: "#071622", strokeThickness: 5
      }).setOrigin(0.5).setDepth(-25);
    }

    addBoundedImage(key, x, baseY, objectHeight) {
      const b = BOUNDS[key];
      const scale = objectHeight / b.h;
      const occupiedBottom = b.y + b.h;
      const imageY = baseY - (occupiedBottom - b.sh / 2) * scale;
      return this.add.image(x, imageY, key)
        .setDisplaySize(b.sw * scale, b.sh * scale)
        .setDepth(baseY);
    }

    drawDestinations() {
      this.layout.destinations.forEach((d) => {
        const destination = this.normalizeDestination(d);
        if (d.asset) this.addBoundedImage(d.asset, d.x, d.baseY, d.objectHeight);
        if (d.collision) {
          const [x, y, width, height] = d.collision;
          this.colliders.push({ type: "rect", x, y, width, height });
        }
        this.destinations.push(destination);
      });
    }

    normalizeDestination(d) {
      const entrancePoint = this.pointFrom(d.entrancePoint || d.entrance);
      const approachStart = this.pointFrom(d.approachStart, entrancePoint);
      return {
        ...d,
        entrance: entrancePoint,
        entrancePoint,
        approachStart,
        cameraTarget: this.cameraTargetFrom(d.cameraTarget, entrancePoint),
        interactionRadius: d.interactionRadius || 92,
        moduleRoute: d.moduleRoute || d.href || null
      };
    }

    pointFrom(value, fallback = { x: 0, y: 0 }) {
      if (Array.isArray(value)) return { x: value[0], y: value[1] };
      if (value && typeof value === "object") return { x: value.x, y: value.y };
      return { x: fallback.x, y: fallback.y };
    }

    cameraTargetFrom(value, fallback) {
      const point = this.pointFrom(value, fallback);
      return { ...point, zoom: value?.zoom || CONFIG.camera.approach };
    }

    drawProps() {
      this.layout.props.forEach((p) => {
        const image = this.addBoundedImage(p.asset, p.x, p.y, p.objectHeight);
        image.setDepth(p.y + (p.asset.includes("tree") ? 8 : 0));
        if (p.collision) {
          const [x, y, radius] = p.collision;
          this.colliders.push({ type: "circle", x, y, radius });
        }
        if (p.collisionRect) {
          const [x, y, width, height] = p.collisionRect;
          this.colliders.push({ type: "rect", x, y, width, height });
        }
      });
    }

    createPortalPlaceholders() {
      const destination = this.destinations.find((d) => d.id === CONFIG.entry.cinematicDestinationId);
      if (!destination?.portalAsset) return;
      this.portalPlaceholders.set(destination.id, this.createPortalPlaceholder(destination));
    }

    createPortalPlaceholder(destination) {
      const portal = this.add.container(destination.entrancePoint.x, destination.entrancePoint.y - 34)
        .setDepth((destination.baseY || destination.entrancePoint.y) + 4)
        .setVisible(false);
      const shape = this.add.graphics();
      shape.fillStyle(0x69e9ff, 0.18);
      shape.fillRoundedRect(-36, -48, 72, 92, 16);
      shape.lineStyle(3, 0x69e9ff, 0.72);
      shape.strokeRoundedRect(-36, -48, 72, 92, 16);
      shape.lineStyle(1, 0xffffff, 0.55);
      shape.strokeRoundedRect(-24, -34, 48, 64, 12);
      const label = this.add.text(0, -62, "PORTAL PLACEHOLDER", {
        fontFamily: "Outfit, sans-serif",
        fontSize: "10px",
        fontStyle: "800",
        color: "#f5fdff",
        stroke: "#06202a",
        strokeThickness: 4
      }).setOrigin(0.5);
      portal.add([shape, label]);
      return portal;
    }

    setPortalVisible(destination, visible) {
      this.portalPlaceholders.get(destination?.id)?.setVisible(false);
      if (destination?.id === CONFIG.entry.cinematicDestinationId && this.cinematic?.portal) {
        this.cinematic.portal.hidden = !visible;
      }
    }

    createPlayer() {
      this.player = this.add.sprite(365, 1260, "idleBack")
        .setDisplaySize(CONFIG.player.width, CONFIG.player.height)
        .setOrigin(CONFIG.player.originX, CONFIG.player.originY)
        .setDepth(1300);
      this.shadow = this.add.ellipse(this.player.x, this.player.y + 3, 64, 11, 0x06131b, 0.38).setDepth(this.player.y - 2);
    }

    setupCinematicPresentation() {
      const root = document.getElementById("corrected-cinematic");
      const hall = document.getElementById("corrected-cinematic-hall");
      const portal = document.getElementById("corrected-cinematic-portal");
      const player = document.getElementById("corrected-cinematic-player");
      if (!root || !hall || !portal || !player) return;
      hall.src = CONFIG.assetRoot + ASSETS.townHall;
      player.src = CONFIG.assetRoot + POSES.idleBack;
      this.cinematic = { root, hall, portal, player };
    }

    showCinematicApproach(destination) {
      if (!this.cinematic) return;
      this.player.setVisible(false);
      this.shadow.setVisible(false);
      this.cinematic.root.hidden = false;
      this.cinematic.root.setAttribute("aria-hidden", "false");
      this.updateCinematicProgress(destination);
      requestAnimationFrame(() => this.cinematic?.root.classList.add("is-active"));
    }

    hideCinematicApproach(showPlayer = true) {
      if (this.cinematic) {
        this.cinematic.root.classList.remove("is-active");
        this.cinematic.root.hidden = true;
        this.cinematic.root.setAttribute("aria-hidden", "true");
        this.cinematic.root.style.setProperty("--approach-progress", "0");
        this.cinematic.portal.hidden = true;
      }
      this.player?.setVisible(showPlayer);
      this.shadow?.setVisible(showPlayer);
    }

    updateCinematicProgress(destination) {
      if (!this.cinematic || !destination) return;
      const progress = Phaser.Math.Clamp(this.approachProgress(destination), 0, 1);
      this.cinematic.root.style.setProperty("--approach-progress", progress.toFixed(3));
    }

    setupInput() {
      this.entryPrompt = document.getElementById("corrected-entry-prompt");
      this.keys = this.input.keyboard.addKeys({
        up: "UP", down: "DOWN", left: "LEFT", right: "RIGHT",
        w: "W", a: "A", s: "S", d: "D", shift: "SHIFT", m: "M", enter: "ENTER"
      });
      this.input.on("pointerdown", (pointer) => {
        if (this.moduleOpen) return;
        if (this.activeApproach) {
          this.routePath = [this.activeApproach.destination.entrancePoint];
          return;
        }
        const point = pointer.positionToCamera(this.cameras.main);
        const clickedDestination = this.destinations.reduce((best, d) => {
          const distance = Phaser.Math.Distance.Between(point.x, point.y, d.x || d.entrance.x, d.baseY || d.entrance.y);
          return !best || distance < best.distance ? { d, distance } : best;
        }, null);
        const target = clickedDestination?.distance < 220 ? clickedDestination.d.entrance : point;
        this.routePath = this.findRoute({ x: this.player.x, y: this.player.y }, target);
        if (this.aerial) this.exitAerial();
      });
      this.input.keyboard.on("keydown-M", () => this.toggleAerial());
      this.input.keyboard.on("keydown-ENTER", () => this.enterDestination());
      document.getElementById("corrected-aerial")?.addEventListener("click", () => this.toggleAerial());
      document.getElementById("corrected-enter")?.addEventListener("click", () => this.enterDestination());
      this.entryPrompt?.addEventListener("click", () => this.enterDestination());
      document.getElementById("corrected-exit-module")?.addEventListener("click", () => this.exitModulePlaceholder());
    }

    update(_time, delta) {
      if (!this.player || !this.keys) return;
      if (this.moduleOpen) return;
      const manual = this.manualVector();
      const running = this.keys.shift.isDown;
      let velocity = new Phaser.Math.Vector2();
      if (this.activeApproach) {
        velocity = this.approachVelocity(manual, running);
      } else if (manual.lengthSq()) {
        if (this.aerial) this.exitAerial();
        this.routePath = [];
        velocity = manual.normalize().scale(running ? CONFIG.player.run : CONFIG.player.walk);
      } else if (this.routePath.length) {
        velocity = this.routeVelocity(running ? CONFIG.player.run : CONFIG.player.walk);
      }
      this.move(velocity, delta);
      if (this.activeApproach) this.constrainApproachPosition();
      this.animatePlayer(velocity, delta);
      if (this.activeApproach) {
        this.updateApproachInteraction();
      } else {
        this.directCamera(velocity, running);
        this.updateInteraction();
        this.updateApproachZone();
      }
      this.updateMinimap();
    }

    manualVector() {
      const x = (this.keys.right.isDown || this.keys.d.isDown ? 1 : 0) - (this.keys.left.isDown || this.keys.a.isDown ? 1 : 0);
      const y = (this.keys.down.isDown || this.keys.s.isDown ? 1 : 0) - (this.keys.up.isDown || this.keys.w.isDown ? 1 : 0);
      return new Phaser.Math.Vector2(x, y);
    }

    routeVelocity(speed) {
      const target = this.routePath[0];
      const vector = new Phaser.Math.Vector2(target.x - this.player.x, target.y - this.player.y);
      if (vector.length() < 14) { this.routePath.shift(); return new Phaser.Math.Vector2(); }
      return vector.normalize().scale(speed);
    }

    approachVelocity(manual, running) {
      const destination = this.activeApproach?.destination;
      if (!destination) return new Phaser.Math.Vector2();
      if (this.time.now < this.activeApproach.readyAt) return new Phaser.Math.Vector2();
      const axis = this.directionVector(destination.approachDirection, destination);
      const speed = CONFIG.player.walk * CONFIG.entry.approachSpeedRatio;
      if (this.routePath.length) {
        const target = this.routePath[0];
        const vector = new Phaser.Math.Vector2(target.x - this.player.x, target.y - this.player.y);
        if (vector.length() < 10) { this.routePath.shift(); return new Phaser.Math.Vector2(); }
        return axis.scale(Math.max(0, vector.normalize().dot(axis)) * speed);
      }
      const forward = manual.dot(axis);
      if (Math.abs(forward) < 0.15) return new Phaser.Math.Vector2();
      return axis.scale(forward * speed);
    }

    constrainApproachPosition() {
      const destination = this.activeApproach?.destination;
      if (!destination) return;
      const start = destination.approachStart;
      const end = destination.entrancePoint;
      const route = new Phaser.Math.Vector2(end.x - start.x, end.y - start.y);
      const lengthSq = route.lengthSq();
      if (!lengthSq) return;
      const fromStart = new Phaser.Math.Vector2(this.player.x - start.x, this.player.y - start.y);
      const progress = Phaser.Math.Clamp(fromStart.dot(route) / lengthSq, 0, 1);
      this.player.setPosition(start.x + route.x * progress, start.y + route.y * progress);
      this.player.setDepth(this.player.y + 32);
      this.shadow.setPosition(this.player.x, this.player.y + 3).setDepth(this.player.y - 2);
    }

    updateApproachZone() {
      if (this.time.now < this.approachCooldownUntil) return;
      const destination = this.destinations.find((d) => d.id === CONFIG.entry.cinematicDestinationId);
      if (destination && this.isInApproachZone(destination)) this.beginApproach(destination);
    }

    isInApproachZone(destination) {
      const progress = this.approachProgress(destination);
      if (progress < CONFIG.entry.approachProgressStart || progress > 1.05) return false;
      const start = destination.approachStart;
      const end = destination.entrancePoint;
      const route = new Phaser.Math.Vector2(end.x - start.x, end.y - start.y);
      const closest = new Phaser.Math.Vector2(start.x + route.x * Phaser.Math.Clamp(progress, 0, 1), start.y + route.y * Phaser.Math.Clamp(progress, 0, 1));
      const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, closest.x, closest.y);
      return distance <= Math.min(destination.interactionRadius, 70);
    }

    approachProgress(destination) {
      const start = destination.approachStart;
      const end = destination.entrancePoint;
      const route = new Phaser.Math.Vector2(end.x - start.x, end.y - start.y);
      const lengthSq = route.lengthSq();
      if (!lengthSq) return 0;
      const fromStart = new Phaser.Math.Vector2(this.player.x - start.x, this.player.y - start.y);
      return fromStart.dot(route) / lengthSq;
    }

    beginApproach(destination) {
      if (this.activeApproach || this.moduleOpen || destination.id !== CONFIG.entry.cinematicDestinationId) return;
      this.aerial = false;
      this.routePath = [destination.entrancePoint];
      this.activeApproach = { destination, promptVisible: false, readyAt: this.time.now + CONFIG.entry.transitionMs * CONFIG.entry.transitionHoldRatio };
      this.currentDestination = destination;
      this.showCinematicApproach(destination);
      this.setPortalVisible(destination, true);
      this.updateEntryPrompt(false, destination);
      this.updatePanel(destination, "approaching");
      this.applyApproachCamera(destination, CONFIG.entry.transitionMs);
    }

    updateApproachInteraction() {
      const destination = this.activeApproach?.destination;
      if (!destination) return;
      this.updateCinematicProgress(destination);
      if (this.approachProgress(destination) < CONFIG.entry.approachProgressStart - 0.12) {
        this.cancelApproach();
        return;
      }
      const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, destination.entrancePoint.x, destination.entrancePoint.y);
      const visible = distance <= this.promptDistance(destination);
      if (visible !== this.activeApproach.promptVisible) {
        this.activeApproach.promptVisible = visible;
        this.updateEntryPrompt(visible, destination);
        this.updatePanel(destination, visible ? "portal" : "approaching");
      }
    }

    promptDistance(destination) {
      return Math.max(42, destination.interactionRadius * CONFIG.entry.promptDistanceRatio);
    }

    applyApproachCamera(destination, duration) {
      const camera = this.cameras.main;
      camera.stopFollow();
      camera.panEffect?.reset();
      camera.zoomEffect?.reset();
      camera.setZoom(CONFIG.camera.walk);
      camera.centerOn(destination.approachStart.x, destination.approachStart.y);
    }

    cancelApproach() {
      const destination = this.activeApproach?.destination;
      this.activeApproach = null;
      this.routePath = [];
      this.setPortalVisible(destination, false);
      this.hideCinematicApproach();
      this.updateEntryPrompt(false, destination);
      this.currentDestination = null;
      this.updatePanel(null);
      this.restoreNormalCamera();
      this.approachCooldownUntil = this.time.now + 700;
    }

    directionVector(direction, destination) {
      const values = {
        north: [0, -1],
        south: [0, 1],
        east: [1, 0],
        west: [-1, 0],
        northeast: [1, -1],
        northwest: [-1, -1],
        southeast: [1, 1],
        southwest: [-1, 1]
      };
      const value = values[direction];
      const vector = value
        ? new Phaser.Math.Vector2(value[0], value[1])
        : new Phaser.Math.Vector2(destination.entrancePoint.x - destination.approachStart.x, destination.entrancePoint.y - destination.approachStart.y);
      return vector.lengthSq() ? vector.normalize() : new Phaser.Math.Vector2(0, 1);
    }

    move(velocity, delta) {
      const step = velocity.clone().scale(delta / 1000);
      const nx = { x: Phaser.Math.Clamp(this.player.x + step.x, 35, this.layout.world.width - 35), y: this.player.y };
      const ny = { x: this.player.x, y: Phaser.Math.Clamp(this.player.y + step.y, 70, this.layout.world.height - 30) };
      if (!this.blocked(nx)) this.player.x = nx.x;
      if (!this.blocked(ny)) this.player.y = ny.y;
      this.player.setDepth(this.player.y + 32);
      this.shadow.setPosition(this.player.x, this.player.y + 3).setDepth(this.player.y - 2);
    }

    blocked(point) {
      const r = 11;
      return this.colliders.some((c) => c.type === "circle"
        ? Phaser.Math.Distance.Between(point.x, point.y, c.x, c.y) < c.radius + r
        : point.x > c.x - c.width / 2 - r && point.x < c.x + c.width / 2 + r && point.y > c.y - c.height / 2 - r && point.y < c.y + c.height / 2 + r);
    }

    animatePlayer(v, delta) {
      const moving = v.lengthSq() > 10;
      if (moving) {
        this.walkDistance += v.length() * delta / 1000;
        if (Math.abs(v.x) > Math.abs(v.y) * 0.9) this.direction = v.x < 0 ? "left" : "right";
        else this.direction = v.y < 0 ? "back" : "front";
      }
      let pose = this.direction === "back" ? "idleBack" : this.direction === "left" ? "idleLeft" : this.direction === "right" ? "idleRight" : "idleFront";
      if (moving) {
        const phase = Math.floor(this.walkDistance / 28) % 3;
        if (this.direction === "back") pose = phase === 0 ? "idleBack" : phase === 1 ? "walkBackA" : "walkBackB";
        if (this.direction === "left") pose = phase % 2 ? "walkLeftA" : "idleLeft";
        if (this.direction === "right") pose = phase % 2 ? "walkRightA" : "idleRight";
      }
      this.player.setTexture(pose).setDisplaySize(CONFIG.player.width, CONFIG.player.height);
    }

    directCamera(v, running) {
      if (this.aerial) return;
      const near = this.nearestDestination(155);
      const target = near ? CONFIG.camera.approach : running || this.routePath.length ? CONFIG.camera.travel : CONFIG.camera.walk;
      if (Math.abs(target - this.zoomTarget) > 0.01) { this.zoomTarget = target; this.cameras.main.zoomTo(target, 380, "Sine.easeOut"); }
      const lookX = Phaser.Math.Clamp(v.x * 0.2, -46, 46);
      const lookY = Phaser.Math.Clamp(v.y * 0.12, -25, 32);
      const focusX = near ? Phaser.Math.Clamp((near.entrance.x - this.player.x) * 0.25, -70, 70) : lookX;
      const focusY = near ? Phaser.Math.Clamp((near.entrance.y - this.player.y) * 0.18, -40, 45) : lookY;
      this.cameras.main.setFollowOffset(-focusX, 20 - focusY);
    }

    updateInteraction() {
      const d = this.nearestDestination(92);
      if (d?.id !== this.currentDestination?.id) { this.currentDestination = d; this.updatePanel(d); }
    }

    nearestDestination(radius) {
      let best = null;
      this.destinations.forEach((d) => {
        const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, d.entrance.x, d.entrance.y);
        if (distance <= (d.id === "town-square" ? 145 : radius) && (!best || distance < best.distance)) best = { ...d, distance };
      });
      return best;
    }

    updatePanel(d, state = "normal") {
      const type = document.getElementById("corrected-type");
      const title = document.getElementById("corrected-title");
      const detail = document.getElementById("corrected-detail");
      const button = document.getElementById("corrected-enter");
      if (!d) {
        type.textContent = "Current area"; title.textContent = "Career Empire Town";
        detail.textContent = "Follow the connected streets. Each short journey should reveal the next destination or landmark.";
        button.textContent = "Move near an entrance"; button.disabled = true; return;
      }
      if (state === "approaching") {
        type.textContent = "Town Hall approach"; title.textContent = d.title;
        detail.textContent = "The camera is moving into the doorway composition.";
        button.textContent = "Approach portal"; button.disabled = true; return;
      }
      if (state === "portal") {
        type.textContent = d.type; title.textContent = d.title; detail.textContent = d.detail;
        button.textContent = `Enter ${d.title}`; button.disabled = false; return;
      }
      if (state === "module") {
        type.textContent = "Placeholder module"; title.textContent = d.title;
        detail.textContent = "Prototype entry state only. Exit returns to the approved town foundation.";
        button.textContent = "Inside module"; button.disabled = true; return;
      }
      type.textContent = d.type; title.textContent = d.title; detail.textContent = d.detail;
      button.textContent = d.href ? `Enter ${d.title}` : "Exterior preview"; button.disabled = !d.href;
    }

    updateEntryPrompt(visible, destination) {
      if (!this.entryPrompt) return;
      this.entryPrompt.hidden = !visible;
      if (visible) this.entryPrompt.textContent = `Enter ${destination.title}`;
    }

    enterDestination() {
      const destination = this.activeApproach?.destination || this.currentDestination;
      if (!destination || this.moduleOpen) return;
      if (destination.id === CONFIG.entry.cinematicDestinationId) {
        if (!this.activeApproach) {
          this.beginApproach(destination);
          return;
        }
        if (this.activeApproach.promptVisible) this.openModulePlaceholder(destination);
        return;
      }
      if (destination.href) window.location.href = destination.href;
    }

    openModulePlaceholder(destination) {
      if (!destination?.moduleRoute?.startsWith("placeholder:")) return;
      this.moduleOpen = true;
      this.moduleDestination = destination;
      this.routePath = [];
      this.updateEntryPrompt(false, destination);
      this.setPortalVisible(destination, false);
      this.hideCinematicApproach();
      const module = document.getElementById("corrected-module");
      const type = document.getElementById("corrected-module-type");
      const title = document.getElementById("corrected-module-title");
      const detail = document.getElementById("corrected-module-detail");
      if (type) type.textContent = destination.type;
      if (title) title.textContent = `${destination.title} Placeholder`;
      if (detail) detail.textContent = "This is the temporary Stage 2 building-entry destination. Real module content and supplied portal art will be connected after this cinematic path is approved.";
      if (module) module.hidden = false;
      this.updatePanel(destination, "module");
    }

    exitModulePlaceholder() {
      const destination = this.moduleDestination || this.activeApproach?.destination;
      const module = document.getElementById("corrected-module");
      if (module) module.hidden = true;
      this.moduleOpen = false;
      this.moduleDestination = null;
      this.activeApproach = null;
      this.routePath = [];
      this.setPortalVisible(destination, false);
      this.hideCinematicApproach();
      this.updateEntryPrompt(false, destination);
      if (destination) {
        this.player.setPosition(destination.approachStart.x, destination.approachStart.y);
        this.player.setDepth(this.player.y + 32);
        this.shadow.setPosition(this.player.x, this.player.y + 3).setDepth(this.player.y - 2);
        this.direction = "front";
        this.player.setTexture("idleFront").setDisplaySize(CONFIG.player.width, CONFIG.player.height);
      }
      this.currentDestination = null;
      this.updatePanel(null);
      this.restoreNormalCamera();
      this.approachCooldownUntil = this.time.now + 1200;
    }

    toggleAerial() {
      if (this.activeApproach || this.moduleOpen) return;
      if (this.aerial) this.exitAerial(); else this.enterAerial();
    }
    enterAerial() {
      this.aerial = true; this.routePath = []; this.cameras.main.stopFollow();
      this.applyAerialCamera(0);
    }
    exitAerial() {
      this.aerial = false; this.zoomTarget = CONFIG.camera.walk;
      this.restoreNormalCamera();
    }

    restoreNormalCamera() {
      this.cameras.main.panEffect?.reset();
      this.cameras.main.zoomEffect?.reset();
      this.cameras.main.startFollow(this.player, true, 0.1, 0.1, 0, 20);
      this.cameras.main.setFollowOffset(0, 20);
      this.zoomTarget = CONFIG.camera.walk;
      this.cameras.main.zoomTo(CONFIG.camera.walk, 340, "Sine.easeInOut");
    }

    aerialZoom() {
      const camera = this.cameras.main;
      const bounds = this.cameraBounds();
      return Math.max(camera.width / bounds.width, camera.height / bounds.height);
    }

    aerialCenterY(zoom) {
      const camera = this.cameras.main;
      const bounds = this.cameraBounds();
      const visibleHeight = camera.height / zoom;
      const top = Phaser.Math.Clamp(
        Math.max(CONFIG.camera.aerialPreferredTop, CONFIG.camera.aerialProtectedBottom - visibleHeight),
        bounds.y,
        bounds.y + bounds.height - visibleHeight
      );
      return top + visibleHeight / 2;
    }

    applyAerialCamera(duration) {
      const camera = this.cameras.main;
      const zoom = this.aerialZoom();
      const bounds = this.cameraBounds();
      const x = bounds.x + bounds.width / 2;
      const y = this.aerialCenterY(zoom);
      camera.panEffect?.reset();
      camera.zoomEffect?.reset();
      if (duration) {
        camera.pan(x, y, duration, "Sine.easeInOut");
        camera.zoomTo(zoom, duration, "Sine.easeInOut");
        this.time.delayedCall(duration + 40, () => {
          if (!this.aerial) return;
          camera.setZoom(zoom);
          camera.centerOn(x, y);
        });
      } else {
        camera.setZoom(zoom);
        camera.centerOn(x, y);
      }
    }

    handleResize() {
      if (this.aerial) this.applyAerialCamera(0);
    }

    findRoute(from, to) {
      const start = this.closestNode(from); const end = this.closestNode(to);
      if (!start || !end) return [to];
      const open = [start.id], came = new Map(), score = new Map([[start.id, 0]]);
      while (open.length) {
        open.sort((a, b) => score.get(a) - score.get(b));
        const id = open.shift(); if (id === end.id) break;
        const node = this.routeGraph.get(id);
        node.links.forEach((nextId) => {
          const next = this.routeGraph.get(nextId);
          const value = score.get(id) + Phaser.Math.Distance.Between(node.x, node.y, next.x, next.y);
          if (!score.has(nextId) || value < score.get(nextId)) { came.set(nextId, id); score.set(nextId, value); if (!open.includes(nextId)) open.push(nextId); }
        });
      }
      const ids = [end.id]; let id = end.id;
      while (came.has(id)) { id = came.get(id); ids.unshift(id); }
      return ids.slice(1).map((nodeId) => { const n = this.routeGraph.get(nodeId); return { x: n.x, y: n.y }; });
    }

    closestNode(point) {
      let best = null;
      this.routeGraph.forEach((n) => { const d = Phaser.Math.Distance.Between(point.x, point.y, n.x, n.y); if (!best || d < best.distance) best = { ...n, distance: d }; });
      return best;
    }

    createMinimap() {
      this.minimap = null;
    }

    updateMinimap() {
      if (!this.minimap) return;
      const w = 112, h = 84, m = 14, x = m, y = m;
      const sx = w / this.layout.world.width, sy = h / this.layout.world.height;
      this.minimap.base.clear().fillStyle(0x061622, 0.72).fillRoundedRect(x, y, w, h, 8).lineStyle(1, 0x67d8ff, 0.35).strokeRoundedRect(x, y, w, h, 8);
      this.minimap.lines.clear();
      this.layout.routeLinks.forEach(([a, b]) => { const na = this.routeGraph.get(a), nb = this.routeGraph.get(b); this.minimap.lines.lineStyle(1, 0x67d8ff, 0.45).lineBetween(x + na.x * sx, y + na.y * sy, x + nb.x * sx, y + nb.y * sy); });
      this.destinations.forEach((d) => this.minimap.lines.fillStyle(0x9cf0b9, 0.9).fillCircle(x + d.entrance.x * sx, y + d.entrance.y * sy, 2));
      this.minimap.player.clear().fillStyle(0xffd166, 1).fillCircle(x + this.player.x * sx, y + this.player.y * sy, 3);
    }
  }

  window.addEventListener("load", () => {
    const container = document.getElementById("corrected-game");
    if (!container || !window.Phaser) return;
    new Phaser.Game({
      type: Phaser.AUTO, parent: "corrected-game", width: container.clientWidth, height: container.clientHeight,
      backgroundColor: "#173c2a", scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH }, scene: CorrectedTownScene
    });
  });
})();
