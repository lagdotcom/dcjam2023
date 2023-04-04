"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // globalExternal:nearley
  var require_nearley = __commonJS({
    "globalExternal:nearley"(exports, module) {
      module.exports = globalThis.nearley;
    }
  });

  // src/types/events.ts
  var GameEventNames = [
    "onAfterDamage",
    "onBeforeAction",
    "onCalculateDamage",
    "onCalculateDetermination",
    "onCalculateDR",
    "onCanAct",
    "onCombatOver",
    "onKilled",
    "onRoll"
  ];

  // src/tools/wallTags.ts
  function wallToTag(pos, dir) {
    return `${pos.x},${pos.y},${dir}`;
  }

  // src/tools/xyTags.ts
  function xyToTag(pos) {
    return `${pos.x},${pos.y}`;
  }

  // src/types/Dir.ts
  var Dir = /* @__PURE__ */ ((Dir2) => {
    Dir2[Dir2["N"] = 0] = "N";
    Dir2[Dir2["E"] = 1] = "E";
    Dir2[Dir2["S"] = 2] = "S";
    Dir2[Dir2["W"] = 3] = "W";
    return Dir2;
  })(Dir || {});
  var Dir_default = Dir;

  // src/tools/geometry.ts
  var xy = (x, y) => ({ x, y });
  var xyi = (x, y) => ({
    x: Math.floor(x),
    y: Math.floor(y)
  });
  function addXY(a, b) {
    return { x: a.x + b.x, y: a.y + b.y };
  }
  var displacements = [xy(0, -1), xy(1, 0), xy(0, 1), xy(-1, 0)];
  function move(pos, dir) {
    return addXY(pos, displacements[dir]);
  }
  function rotate(dir, clockwise) {
    return (dir + clockwise + 4) % 4;
  }
  function dirFromInitial(initial) {
    switch (initial) {
      case "E":
        return Dir_default.E;
      case "S":
        return Dir_default.S;
      case "W":
        return Dir_default.W;
      case "N":
      default:
        return Dir_default.N;
    }
  }
  function getCardinalOffset(start, destination) {
    const dx = destination.x - start.x;
    const dy = destination.y - start.y;
    if (dx && dy)
      return;
    if (dy < 0)
      return { dir: Dir_default.N, offset: -dy };
    if (dx > 0)
      return { dir: Dir_default.E, offset: dx };
    if (dy > 0)
      return { dir: Dir_default.S, offset: dy };
    if (dx < 0)
      return { dir: Dir_default.W, offset: -dx };
  }
  var dirOffsets = {
    [Dir_default.N]: { [Dir_default.N]: 0, [Dir_default.E]: 1, [Dir_default.S]: 2, [Dir_default.W]: 3 },
    [Dir_default.E]: { [Dir_default.N]: 3, [Dir_default.E]: 0, [Dir_default.S]: 1, [Dir_default.W]: 2 },
    [Dir_default.S]: { [Dir_default.N]: 2, [Dir_default.E]: 3, [Dir_default.S]: 0, [Dir_default.W]: 1 },
    [Dir_default.W]: { [Dir_default.N]: 1, [Dir_default.E]: 2, [Dir_default.S]: 3, [Dir_default.W]: 0 }
  };
  function getDirOffset(start, end) {
    return dirOffsets[start][end];
  }

  // src/tools/rng.ts
  function random(max) {
    return Math.floor(Math.random() * max);
  }
  function oneOf(items) {
    return items[random(items.length)];
  }
  function pickN(items, count) {
    const left = items.slice();
    if (count >= items.length)
      return left;
    const picked = /* @__PURE__ */ new Set();
    for (let i = 0; i < count; i++) {
      const item = oneOf(left);
      picked.add(item);
      left.splice(left.indexOf(item), 1);
    }
    return Array.from(picked);
  }

  // src/actions.ts
  var mild = (g) => g.roll(6) + 2;
  var medium = (g) => g.roll(8) + 3;
  var onlyMe = { type: "self" };
  var ally = (count) => ({ type: "ally", count });
  var allAllies = { type: "ally" };
  var oneOpponent = {
    type: "enemy",
    distance: 1,
    count: 1,
    offsets: [0]
  };
  var opponents = (count, offsets) => ({
    type: "enemy",
    distance: 1,
    count,
    offsets
  });
  var oneEnemy = { type: "enemy", count: 1 };
  var generateAttack = (minDamage, maxDamage, sp = 2) => ({
    name: "Attack",
    tags: ["attack"],
    sp,
    targets: oneOpponent,
    act({ g, targets, me }) {
      const bonus = me.attacksInARow;
      const amount = random(maxDamage - minDamage + bonus) + minDamage;
      g.applyDamage(me, targets, amount, "hp");
    }
  });
  var endTurnAction = {
    name: "End Turn",
    tags: [],
    sp: 0,
    targets: allAllies,
    useMessage: "",
    act({ g }) {
      g.endTurn();
    }
  };

  // src/enemies.ts
  var EnemyObjects = {
    eSage: 100,
    eMonk: 101,
    eRogue: 102
  };
  var enemies = {
    Sage: {
      object: EnemyObjects.eSage,
      name: "Sage",
      maxHp: 20,
      maxSp: 10,
      determination: 3,
      camaraderie: 3,
      spirit: 3,
      dr: 0,
      actions: [
        generateAttack(2, 5),
        {
          name: "Zap",
          tags: ["attack"],
          sp: 3,
          targets: opponents(),
          act({ g, targets, me }) {
            g.applyDamage(me, targets, 3, "hp");
          }
        }
      ]
    },
    Monk: {
      object: EnemyObjects.eMonk,
      name: "Monk",
      maxHp: 20,
      maxSp: 10,
      determination: 3,
      camaraderie: 3,
      spirit: 3,
      dr: 1,
      actions: [generateAttack(9, 16)]
    },
    Rogue: {
      object: EnemyObjects.eRogue,
      name: "Rogue",
      maxHp: 20,
      maxSp: 10,
      determination: 3,
      camaraderie: 3,
      spirit: 3,
      dr: 0,
      actions: [
        generateAttack(4, 9),
        {
          name: "Arrow",
          tags: ["attack"],
          sp: 3,
          targets: oneEnemy,
          act({ g, targets, me }) {
            g.applyDamage(me, targets, random(14) + 1, "hp");
          }
        }
      ]
    }
  };
  var EnemyNames = Object.keys(enemies);
  function isEnemyName(name) {
    return EnemyNames.includes(name);
  }
  var Enemy = class {
    constructor(template) {
      this.template = template;
      this.isPC = false;
      this.name = template.name;
      this.maxHp = template.maxHp;
      this.maxSp = template.maxSp;
      this.hp = this.maxHp;
      this.sp = this.maxSp;
      this.determination = template.determination;
      this.camaraderie = template.camaraderie;
      this.spirit = template.spirit;
      this.dr = template.dr;
      this.actions = template.actions;
      this.equipment = /* @__PURE__ */ new Map();
      this.attacksInARow = 0;
      this.usedThisTurn = /* @__PURE__ */ new Set();
    }
    get alive() {
      return this.hp > 0;
    }
  };
  function spawn(name) {
    return new Enemy(enemies[name]);
  }

  // src/tools/isDefined.ts
  function isDefined(item) {
    return typeof item !== "undefined";
  }

  // src/CombatManager.ts
  var CombatManager = class {
    constructor(g, enemyInitialDelay = 3e3, enemyTurnDelay = 1e3) {
      this.g = g;
      this.enemyInitialDelay = enemyInitialDelay;
      this.enemyTurnDelay = enemyTurnDelay;
      this.end = () => {
        this.resetEnemies();
        this.inCombat = false;
        this.g.draw();
      };
      this.enemyTick = () => {
        if (!this.inCombat) {
          this.timeout = void 0;
          return;
        }
        const moves = this.allEnemies.flatMap(
          (enemy2) => enemy2.actions.map((action2) => {
            if (!this.g.canAct(enemy2, action2))
              return;
            const { amount: amount2, possibilities: possibilities2 } = this.g.getTargetPossibilities(
              enemy2,
              action2
            );
            if (possibilities2.length)
              return { enemy: enemy2, action: action2, amount: amount2, possibilities: possibilities2 };
          }).filter(isDefined)
        );
        if (!moves.length) {
          this.timeout = void 0;
          return this.endTurn();
        }
        const { enemy, action, amount, possibilities } = oneOf(moves);
        const targets = pickN(possibilities, amount);
        this.g.act(enemy, action, targets);
        this.timeout = setTimeout(this.enemyTick, this.enemyTurnDelay);
      };
      this.onKilled = (c) => {
        if (!c.isPC) {
          const { dir, distance } = this.getPosition(c);
          this.enemies[dir].splice(distance, 1);
          this.g.draw();
        }
      };
      this.effects = [];
      this.resetEnemies();
      this.inCombat = false;
      this.index = 0;
      this.side = "player";
      g.eventHandlers.onKilled.add(({ who }) => this.onKilled(who));
      g.eventHandlers.onCombatOver.add(this.end);
    }
    resetEnemies() {
      this.enemies = { 0: [], 1: [], 2: [], 3: [] };
    }
    get aliveCombatants() {
      return [
        ...this.g.party,
        ...this.enemies[0],
        ...this.enemies[1],
        ...this.enemies[2],
        ...this.enemies[3]
      ].filter((c) => c.alive);
    }
    get allEnemies() {
      return [
        ...this.enemies[0],
        ...this.enemies[1],
        ...this.enemies[2],
        ...this.enemies[3]
      ];
    }
    begin(enemies2) {
      for (const e of this.effects.slice())
        this.g.removeEffect(e);
      this.resetEnemies();
      for (const name of enemies2) {
        const enemy = spawn(name);
        const dir = random(4);
        this.enemies[dir].push(enemy);
      }
      for (const c of this.aliveCombatants) {
        c.usedThisTurn.clear();
        c.sp = Math.min(c.spirit, c.maxSp);
      }
      this.inCombat = true;
      this.side = "player";
      this.g.draw();
    }
    getFromOffset(dir, offset) {
      return this.enemies[dir][offset - 1];
    }
    getPosition(c) {
      if (c.isPC)
        return { dir: this.g.party.indexOf(c), distance: -1 };
      for (let dir = 0; dir < 4; dir++) {
        const distance = this.enemies[dir].indexOf(c);
        if (distance >= 0)
          return { dir, distance };
      }
      throw new Error(`${c.name} not found in combat`);
    }
    endTurn() {
      this.side = this.side === "player" ? "enemy" : "player";
      const combatants = this.side === "player" ? this.g.party : this.allEnemies;
      for (const c of combatants) {
        c.usedThisTurn.clear();
        if (!c.alive)
          continue;
        const newSp = c.sp < c.spirit ? c.spirit : c.sp + 1;
        c.sp = Math.min(newSp, c.maxSp);
      }
      for (const e of this.effects.slice()) {
        if (--e.duration < 1)
          this.g.removeEffect(e);
      }
      if (this.side === "enemy")
        this.timeout = setTimeout(this.enemyTick, this.enemyInitialDelay);
      this.g.draw();
    }
  };

  // src/Colours.ts
  var Colours = {
    background: "rgb(32,32,32)",
    logShadow: "rgba(0,0,0,0.4)",
    majorHighlight: "rgb(96,96,64)",
    minorHighlight: "rgb(48,48,32)",
    mapVisited: "rgb(64,64,64)",
    hp: "rgb(223,113,38)",
    sp: "rgb(99,155,255)"
  };
  var Colours_default = Colours;

  // src/tools/withTextStyle.ts
  function withTextStyle(ctx, {
    textAlign,
    textBaseline,
    fillStyle,
    fontSize = 10,
    fontFace = "sans-serif",
    globalAlpha = 1
  }) {
    ctx.textAlign = textAlign;
    ctx.textBaseline = textBaseline;
    ctx.fillStyle = fillStyle;
    ctx.font = `${fontSize}px ${fontFace}`;
    ctx.globalAlpha = globalAlpha;
    return {
      lineHeight: fontSize + 4,
      measure: (text) => ctx.measureText(text),
      draw: (text, x, y, maxWidth) => ctx.fillText(text, x, y, maxWidth)
    };
  }

  // src/CombatRenderer.ts
  var CombatRenderer = class {
    constructor(g, position = xy(60, 0), size = xy(144, 160), padding = xy(2, 2), rowPadding = 5) {
      this.g = g;
      this.position = position;
      this.size = size;
      this.padding = padding;
      this.rowPadding = rowPadding;
    }
    render() {
      const { padding, position, rowPadding, size } = this;
      const { combat, ctx, facing, party } = this.g;
      const active = combat.side === "player" ? party[facing] : void 0;
      if (active == null ? void 0 : active.alive) {
        ctx.fillStyle = Colours_default.logShadow;
        ctx.fillRect(position.x, position.y, size.x, size.y);
        const { draw, lineHeight } = withTextStyle(ctx, {
          textAlign: "left",
          textBaseline: "middle",
          fillStyle: "white"
        });
        const x = position.x;
        let y = position.y + padding.y + lineHeight / 2;
        draw(`${active.name} has ${active.sp}SP:`, x + padding.x, y);
        y += lineHeight;
        const rowHeight = lineHeight + rowPadding * 2;
        const actions = active.actions;
        for (let i = 0; i < actions.length; i++) {
          const action = actions[i];
          const possible = this.g.canAct(active, action);
          if (i === combat.index) {
            ctx.fillStyle = possible ? Colours_default.majorHighlight : Colours_default.minorHighlight;
            ctx.fillRect(x, y, size.x, rowHeight);
          }
          ctx.fillStyle = possible ? "white" : "silver";
          draw(
            `${action.name} (${action.sp})`,
            x + padding.x,
            y + rowHeight / 2,
            void 0
          );
          y += rowHeight;
        }
      }
    }
  };

  // src/DefaultControls.ts
  var DefaultControls = [
    ["ArrowUp", ["Forward", "MenuUp"]],
    ["KeyW", ["Forward", "MenuUp"]],
    ["ArrowRight", ["TurnRight"]],
    ["KeyE", ["TurnRight"]],
    ["ArrowDown", ["Back", "MenuDown"]],
    ["KeyS", ["Back", "MenuDown"]],
    ["ArrowLeft", ["TurnLeft"]],
    ["KeyQ", ["TurnLeft"]],
    ["Shift+ArrowRight", ["SlideRight"]],
    ["KeyD", ["SlideRight"]],
    ["Shift+ArrowLeft", ["SlideLeft"]],
    ["KeyA", ["SlideLeft"]],
    ["Ctrl+ArrowRight", ["RotateRight"]],
    ["Ctrl+KeyD", ["RotateRight"]],
    ["Ctrl+ArrowLeft", ["RotateLeft"]],
    ["Ctrl+KeyA", ["RotateLeft"]],
    ["Alt+ArrowRight", ["SwapRight"]],
    ["Alt+KeyD", ["SwapRight"]],
    ["Alt+ArrowDown", ["SwapBehind"]],
    ["Alt+KeyS", ["SwapBehind"]],
    ["Alt+ArrowLeft", ["SwapLeft"]],
    ["Alt+KeyA", ["SwapLeft"]],
    ["Space", ["ToggleLog"]],
    ["Enter", ["Interact", "MenuChoose"]],
    ["Return", ["Interact", "MenuChoose"]]
  ];
  var DefaultControls_default = DefaultControls;

  // src/tools/getCanvasContext.ts
  function getCanvasContext(canvas, type, options) {
    const ctx = canvas.getContext(type, options);
    if (!ctx)
      throw new Error(`canvas.getContext(${type})`);
    return ctx;
  }

  // src/fov.ts
  var facingDisplacements = {
    [Dir_default.E]: [0, 1, -1, 0],
    [Dir_default.N]: [1, 0, 0, 1],
    [Dir_default.S]: [-1, 0, 0, -1],
    [Dir_default.W]: [0, -1, 1, 0]
  };
  function getDisplacement(from, to, facing) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const [a, b, c, d] = facingDisplacements[facing];
    const x = dx * a + dy * b;
    const y = dx * c + dy * d;
    return [x, y];
  }
  var FovCalculator = class {
    constructor(g) {
      this.g = g;
      this.entries = /* @__PURE__ */ new Map();
    }
    calculate(width, depth) {
      const position = this.g.position;
      this.propagate(position, width, depth);
      return [...this.entries.values()].sort((a, b) => {
        const zd = a.dz - b.dz;
        if (zd)
          return zd;
        const xd = Math.abs(a.dx) - Math.abs(b.dx);
        return -xd;
      });
    }
    displacement(position) {
      return getDisplacement(this.g.position, position, this.g.facing);
    }
    propagate(position, width, depth) {
      if (width <= 0 || depth <= 0)
        return;
      const { g } = this;
      const { facing } = g;
      const tag = xyToTag(position);
      const old = this.entries.get(tag);
      if (old) {
        if (old.width >= width && old.depth >= depth)
          return;
      }
      const { x, y } = position;
      const cell = g.getCell(x, y);
      if (!cell)
        return;
      const [dx, dz] = this.displacement(position);
      this.entries.set(tag, { x, y, dx, dz, width, depth });
      const leftDir = rotate(facing, 3);
      const leftWall = cell.sides[leftDir];
      if (!(leftWall == null ? void 0 : leftWall.wall))
        this.propagate(move(position, leftDir), width - 1, depth);
      const rightDir = rotate(facing, 1);
      const rightWall = cell.sides[rightDir];
      if (!(rightWall == null ? void 0 : rightWall.wall))
        this.propagate(move(position, rightDir), width - 1, depth);
      const forwardWall = cell.sides[facing];
      if (!(forwardWall == null ? void 0 : forwardWall.wall))
        this.propagate(move(position, facing), width, depth - 1);
    }
  };
  function getFieldOfView(g, width, depth) {
    const calc = new FovCalculator(g);
    return calc.calculate(width, depth);
  }

  // src/DungeonRenderer.ts
  var tileTag = (id2, type, tile) => `${type}${id2}:${tile.x},${tile.z}`;
  var DungeonRenderer = class {
    constructor(g, dungeon, atlasImage, offset = xy(91, 21)) {
      this.g = g;
      this.dungeon = dungeon;
      this.atlasImage = atlasImage;
      this.offset = offset;
      this.imageData = /* @__PURE__ */ new Map();
    }
    addAtlas(layers, image) {
      const atlasCanvas = document.createElement("canvas");
      atlasCanvas.width = image.width;
      atlasCanvas.height = image.height;
      const atlasCtx = getCanvasContext(atlasCanvas, "2d", {
        willReadFrequently: true
      });
      atlasCtx.drawImage(image, 0, 0);
      const promises = [];
      for (const layer of layers) {
        for (const entry of layer.tiles) {
          const imageData = atlasCtx.getImageData(
            entry.coords.x,
            entry.coords.y,
            entry.coords.w,
            entry.coords.h
          );
          const tmpCanvas = document.createElement("canvas");
          tmpCanvas.width = entry.coords.w;
          tmpCanvas.height = entry.coords.h;
          const tmpCtx = getCanvasContext(tmpCanvas, "2d");
          if (entry.flipped) {
            const data = this.flipImage(
              entry.coords.w,
              entry.coords.h,
              imageData.data
            );
            imageData.data.set(data);
          }
          tmpCtx.putImageData(imageData, 0, 0);
          this.imageData.set(tileTag(layer.id, entry.type, entry.tile), entry);
          promises.push(
            createImageBitmap(imageData).then((bmp) => {
              entry.image = bmp;
              return entry;
            })
          );
        }
      }
      return Promise.all(promises);
    }
    getImage(id2, type, x, z) {
      const tag = tileTag(id2, type, { x, z });
      return this.imageData.get(tag);
    }
    flipImage(w, h, data) {
      const flippedData = new Uint8Array(w * h * 4);
      for (let col = 0; col < w; col++) {
        for (let row = 0; row < h; row++) {
          const index = (w - 1 - col) * 4 + row * w * 4;
          const index2 = col * 4 + row * w * 4;
          flippedData[index2] = data[index];
          flippedData[index2 + 1] = data[index + 1];
          flippedData[index2 + 2] = data[index + 2];
          flippedData[index2 + 3] = data[index + 3];
        }
      }
      return flippedData;
    }
    getLayersOfType(type) {
      return this.dungeon.layers.filter((layer) => layer.type === type);
    }
    project(x, z) {
      const { facing, position } = this.g;
      switch (facing) {
        case Dir_default.N:
          return [position.x + x, position.y + z];
        case Dir_default.E:
          return [position.x - z, position.y + x];
        case Dir_default.S:
          return [position.x - x, position.y - z];
        case Dir_default.W:
          return [position.x + z, position.y - x];
      }
    }
    draw(result) {
      const dx = result.screen.x - (result.flipped ? result.coords.w : 0);
      const dy = result.screen.y;
      this.g.ctx.drawImage(result.image, dx + this.offset.x, dy + this.offset.y);
    }
    drawFront(result, x) {
      const dx = result.screen.x + x * result.coords.fullWidth;
      const dy = result.screen.y;
      this.g.ctx.drawImage(result.image, dx + this.offset.x, dy + this.offset.y);
    }
    drawImage(id2, type, x, z) {
      const result = this.getImage(id2, type, x, z);
      if (result)
        this.draw(result);
    }
    drawFrontImage(id2, type, x, z) {
      const result = this.getImage(id2, type, 0, z);
      if (result)
        this.drawFront(result, x);
    }
    render() {
      const rightSide = rotate(this.g.facing, 1);
      const leftSide = rotate(this.g.facing, 3);
      const tiles = getFieldOfView(
        this.g,
        this.dungeon.width,
        this.dungeon.depth
      );
      for (const pos of tiles) {
        const cell = this.g.getCell(pos.x, pos.y);
        if (!cell)
          continue;
        const left = cell.sides[leftSide];
        if (left == null ? void 0 : left.wall)
          this.drawImage(left.wall, "side", pos.dx - 1, pos.dz);
        if (left == null ? void 0 : left.decal)
          this.drawImage(left.decal, "side", pos.dx - 1, pos.dz);
        const right = cell.sides[rightSide];
        if (right == null ? void 0 : right.wall)
          this.drawImage(right.wall, "side", pos.dx + 1, pos.dz);
        if (right == null ? void 0 : right.decal)
          this.drawImage(right.decal, "side", pos.dx + 1, pos.dz);
        const front = cell.sides[this.g.facing];
        if (front == null ? void 0 : front.wall)
          this.drawFrontImage(front.wall, "front", pos.dx, pos.dz - 1);
        if (front == null ? void 0 : front.decal)
          this.drawFrontImage(front.decal, "front", pos.dx, pos.dz - 1);
        if (cell.ceiling)
          this.drawImage(cell.ceiling, "ceiling", pos.dx, pos.dz);
        if (cell.floor)
          this.drawImage(cell.floor, "floor", pos.dx, pos.dz);
        if (cell.object)
          this.drawFrontImage(cell.object, "object", pos.dx, pos.dz);
      }
    }
  };

  // src/DScript/logic.ts
  function bool(value, readOnly = false) {
    return { _: "bool", value, readOnly };
  }
  function num(value, readOnly = false) {
    return { _: "number", value, readOnly };
  }
  function str(value, readOnly = false) {
    return { _: "string", value, readOnly };
  }
  function box(value) {
    switch (typeof value) {
      case "undefined":
        return void 0;
      case "boolean":
        return bool(value);
      case "number":
        return num(value);
      case "string":
        return str(value);
      default:
        throw new Error(`Cannot box ${typeof value}`);
    }
  }
  function unbox(value) {
    if (value._ === "function" || value._ === "native")
      return value;
    return value.value;
  }
  function truthy(value) {
    return !!value;
  }
  function unary(op, value) {
    switch (op) {
      case "-":
        if (value._ === "number")
          return num(-value.value);
        throw new Error(`Cannot negate a ${value._}`);
      case "not":
        return bool(!truthy(value.value));
    }
  }
  function binary(op, left, right) {
    switch (op) {
      case "+":
        if (left._ === "string" && right._ === "string")
          return str(left.value + right.value);
        if (left._ === "number" && right._ === "number")
          return num(left.value + right.value);
        throw new Error(`Cannot add ${left._} and ${right._}`);
      case "-":
        if (left._ === "number" && right._ === "number")
          return num(left.value - right.value);
        throw new Error(`Cannot subtract ${left._} and ${right._}`);
      case "*":
        if (left._ === "number" && right._ === "number")
          return num(left.value * right.value);
        throw new Error(`Cannot multiply ${left._} and ${right._}`);
      case "/":
        if (left._ === "number" && right._ === "number")
          return num(left.value / right.value);
        throw new Error(`Cannot divide ${left._} and ${right._}`);
      case "^":
        if (left._ === "number" && right._ === "number")
          return num(Math.pow(left.value, right.value));
        throw new Error(`Cannot exponentiate ${left._} and ${right._}`);
      case "==":
        return bool(left.value === right.value);
      case "!=":
        return bool(left.value !== right.value);
      case ">":
        return bool(left.value > right.value);
      case ">=":
        return bool(left.value >= right.value);
      case "<":
        return bool(left.value < right.value);
      case "<=":
        return bool(left.value <= right.value);
      case "and":
        return truthy(left.value) ? right : left;
      case "or":
        return truthy(left.value) ? left : right;
      case "xor": {
        const lt = truthy(left.value);
        const rt = truthy(right.value);
        return bool(!(lt === rt));
      }
    }
  }
  function convertToFunction(stmt) {
    return {
      _: "function",
      name: stmt.name.value,
      args: stmt.args,
      readOnly: true,
      type: stmt.type === null ? void 0 : stmt.type,
      value: stmt.program
    };
  }
  function run(scope, prg) {
    scope.exited = false;
    scope.returned = void 0;
    return runInScope(scope, prg, true);
  }
  function runInScope(scope, prg, checkReturnValue) {
    var _a, _b, _c, _d;
    for (const stmt of prg) {
      switch (stmt._) {
        case "assignment":
          assignment(scope, stmt);
          break;
        case "call":
          callFunction(
            scope,
            lookup(scope, stmt.fn.value),
            stmt.args.map((arg) => evaluate(scope, arg))
          );
          break;
        case "function":
          scope.env.set(stmt.name.value, convertToFunction(stmt));
          break;
        case "if": {
          if (truthy(evaluate(scope, stmt.expr).value)) {
            runInScope(scope, stmt.positive, false);
          } else if (stmt.negative) {
            runInScope(scope, stmt.negative, false);
          }
          break;
        }
        case "return": {
          const returnValue = stmt.expr ? evaluate(scope, stmt.expr) : void 0;
          if (isTypeMatch(scope.type, returnValue == null ? void 0 : returnValue._)) {
            scope.exited = true;
            scope.returned = returnValue;
            return returnValue;
          }
          throw new Error(
            `trying to return ${(_a = returnValue == null ? void 0 : returnValue._) != null ? _a : "void"} when '${scope.name}' requires ${(_b = scope.type) != null ? _b : "void"}`
          );
        }
      }
      if (scope.exited)
        break;
    }
    if (checkReturnValue && !isTypeMatch(scope.type, (_c = scope.returned) == null ? void 0 : _c._))
      throw new Error(
        `exited '${scope.name}' without returning ${(_d = scope.type) != null ? _d : "void"}`
      );
    return scope.returned;
  }
  function lookup(scope, name, canBeNew = false) {
    let found;
    let current = scope;
    while (current) {
      found = current.env.get(name);
      if (found)
        break;
      current = current.parent;
    }
    if (!found && !canBeNew)
      throw new Error(`Could not resolve: ${name}`);
    return found;
  }
  function evaluate(scope, expr) {
    switch (expr._) {
      case "bool":
      case "number":
      case "string":
        return expr;
      case "id":
        return lookup(scope, expr.value);
      case "unary":
        return unary(expr.op, evaluate(scope, expr.value));
      case "binary":
        return binary(
          expr.op,
          evaluate(scope, expr.left),
          evaluate(scope, expr.right)
        );
      case "call": {
        const value = callFunction(
          scope,
          lookup(scope, expr.fn.value),
          expr.args.map((arg) => evaluate(scope, arg))
        );
        if (!value)
          throw new Error(`${expr.fn.value}() returned no value`);
        return value;
      }
    }
  }
  function isTypeMatch(want, got) {
    if (want === "any")
      return true;
    if (want === got)
      return true;
    if (want === "function" && got === "native")
      return true;
    return false;
  }
  function checkFunctionArgs(fn, got) {
    const argTypes = fn._ === "function" ? fn.args.map((arg) => arg.type) : fn.args;
    const fail = () => {
      throw new Error(
        `${fn.name} wants (${argTypes.join(", ")}) but got (${got.map((arg) => arg._).join(", ")})`
      );
    };
    if (argTypes.length !== got.length)
      fail();
    for (let i = 0; i < argTypes.length; i++) {
      if (!isTypeMatch(argTypes[i], got[i]._))
        fail();
    }
  }
  function callFunction(parent, fn, args) {
    if (fn._ !== "function" && fn._ !== "native")
      throw new Error(`Cannot call a ${fn._}`);
    checkFunctionArgs(fn, args);
    if (fn._ === "native") {
      const result = fn.value.call(void 0, ...args.map(unbox));
      return box(result);
    }
    const scope = {
      parent,
      name: `function ${fn.name}`,
      env: /* @__PURE__ */ new Map(),
      type: fn.type
    };
    for (let i = 0; i < args.length; i++)
      scope.env.set(fn.args[i].name.value, args[i]);
    return run(scope, fn.value);
  }
  var opMapping = {
    "+=": "+",
    "-=": "-",
    "*=": "*",
    "/=": "/",
    "^=": "^"
  };
  function assignment(scope, stmt) {
    const right = evaluate(scope, stmt.expr);
    const left = lookup(scope, stmt.name.value, true);
    if (!left) {
      if (stmt.op === "=") {
        scope.env.set(stmt.name.value, right);
        return;
      }
      throw new Error(`Could not resolve: ${stmt.name.value}`);
    }
    if (left._ !== right._)
      throw new Error(`Cannot assign ${right._} to ${left._}`);
    if (left.readOnly)
      throw new Error(`Cannot assign to ${stmt.name.value}, it is read only`);
    if (stmt.op === "=")
      left.value = right.value;
    else
      left.value = binary(opMapping[stmt.op], left, right).value;
  }

  // src/DScript/host.ts
  var DScriptHost = class {
    constructor() {
      this.env = /* @__PURE__ */ new Map();
      this.name = "<Host>";
    }
    addNative(name, args, type, value) {
      this.env.set(name, {
        _: "native",
        name,
        args,
        readOnly: true,
        type,
        value
      });
    }
  };

  // src/types/Combatant.ts
  var AttackableStats = [
    "hp",
    "sp",
    "determination",
    "camaraderie",
    "spirit"
  ];

  // src/tools/combatants.ts
  function isStat(s) {
    return AttackableStats.includes(s);
  }

  // src/EngineScripting.ts
  var EngineScripting = class extends DScriptHost {
    constructor(g) {
      super();
      this.g = g;
      this.env.set("NORTH", num(Dir_default.N, true));
      this.env.set("EAST", num(Dir_default.E, true));
      this.env.set("SOUTH", num(Dir_default.S, true));
      this.env.set("WEST", num(Dir_default.W, true));
      this.onTagEnter = /* @__PURE__ */ new Map();
      this.onTagInteract = /* @__PURE__ */ new Map();
      const getCell = (x, y) => {
        const cell = g.getCell(x, y);
        if (!cell)
          throw new Error(`Invalid cell: ${x},${y}`);
        return cell;
      };
      const getDir = (dir) => {
        if (dir < 0 || dir > 3)
          throw new Error(`Invalid dir: ${dir}`);
        return dir;
      };
      const getPC = (index) => {
        if (index < 0 || index > 4)
          throw new Error(`Tried to get PC ${index}`);
        return g.party[index];
      };
      const getStat = (stat) => {
        if (!isStat(stat))
          throw new Error(`Invalid stat: ${stat}`);
        return stat;
      };
      const getEnemy = (name) => {
        if (!isEnemyName(name))
          throw new Error(`Invalid enemy: ${name}`);
        return name;
      };
      this.addNative("addEnemy", ["string"], void 0, (name) => {
        const enemy = getEnemy(name);
        g.pendingEnemies.push(enemy);
      });
      this.addNative(
        "damagePC",
        ["number", "string", "number"],
        void 0,
        (index, type, amount) => {
          const pc = getPC(index);
          const stat = getStat(type);
          g.applyDamage(pc, [pc], amount, stat);
        }
      );
      this.addNative(
        "debug",
        ["any"],
        void 0,
        (thing) => console.log("[debug]", thing)
      );
      this.addNative(
        "getPCName",
        ["number"],
        "string",
        (index) => getPC(index).name
      );
      this.addNative(
        "isSolid",
        ["number", "number", "number"],
        "bool",
        (x, y, d) => {
          var _a, _b;
          const dir = getDir(d);
          const cell = getCell(x, y);
          return (_b = (_a = cell.sides[dir]) == null ? void 0 : _a.solid) != null ? _b : false;
        }
      );
      this.addNative("makePartyFace", ["number"], void 0, (d) => {
        const dir = getDir(d);
        g.facing = dir;
        g.draw();
      });
      this.addNative(
        "message",
        ["string"],
        void 0,
        (msg) => g.addToLog(msg)
      );
      this.addNative("movePartyToTag", ["string"], void 0, (tag) => {
        const position = g.findCellWithTag(tag);
        if (position) {
          g.position = position;
          g.markVisited();
          g.draw();
        }
      });
      this.addNative(
        "skillCheck",
        ["string", "number"],
        "bool",
        (type, dc) => {
          const stat = getStat(type);
          this.env.set("pcIndex", num(g.facing, true));
          const pc = g.party[g.facing];
          const roll = g.roll(10) + pc[stat];
          return roll >= dc;
        }
      );
      this.addNative("startArenaFight", [], "bool", () => {
        const count = g.pendingEnemies.length;
        if (!count)
          return false;
        const enemies2 = g.pendingEnemies.splice(0, count);
        g.combat.begin(enemies2);
        return true;
      });
      this.addNative(
        "onTagInteract",
        ["string", "function"],
        void 0,
        (tag, cb) => {
          this.onTagInteract.set(tag, cb);
        }
      );
      this.addNative(
        "onTagEnter",
        ["string", "function"],
        void 0,
        (tag, cb) => {
          this.onTagEnter.set(tag, cb);
        }
      );
      this.addNative("random", ["number"], "number", random);
      this.addNative(
        "removeTag",
        ["number", "number", "string"],
        void 0,
        (x, y, tag) => {
          const cell = getCell(x, y);
          const index = cell.tags.indexOf(tag);
          if (index >= 0)
            cell.tags.splice(index, 1);
          else
            console.warn(
              `script tried to remove tag ${tag} at ${x},${y} -- not present`
            );
        }
      );
      this.addNative(
        "tileHasTag",
        ["number", "number", "string"],
        "bool",
        (x, y, tag) => getCell(x, y).tags.includes(tag)
      );
      this.addNative(
        "unlock",
        ["number", "number", "number"],
        void 0,
        (x, y, d) => {
          const dir = getDir(d);
          const cell = getCell(x, y);
          const side = cell.sides[dir];
          if (side) {
            side.solid = false;
            const otherSide = move({ x, y }, dir);
            const other = getCell(otherSide.x, otherSide.y);
            const opposite = other.sides[rotate(dir, 2)];
            if (opposite)
              opposite.solid = false;
          }
        }
      );
    }
    run(program) {
      return run(this, program);
    }
    runCallback(fn, ...args) {
      this.env.set("partyX", num(this.g.position.x, true));
      this.env.set("partyY", num(this.g.position.y, true));
      this.env.set("partyDir", num(this.g.facing, true));
      if (fn._ === "function")
        return callFunction(this, fn, args.slice(0, fn.args.length));
      else
        return fn.value(...args);
    }
    onEnter(newPos, oldPos) {
      const tile = this.g.getCell(newPos.x, newPos.y);
      if (!tile)
        return;
      for (const tag of tile.tags) {
        const cb = this.onTagEnter.get(tag);
        if (cb)
          this.runCallback(cb, num(oldPos.x), num(oldPos.y));
      }
    }
    onInteract() {
      const tile = this.g.getCell(this.g.position.x, this.g.position.y);
      if (!tile)
        return false;
      let result = false;
      for (const tag of tile.tags) {
        const cb = this.onTagInteract.get(tag);
        if (cb) {
          this.runCallback(cb);
          result = true;
        }
      }
      return result;
    }
  };

  // res/hud/base.png
  var base_default = "./base-CLJU2TVL.png";

  // res/hud/buttons.png
  var buttons_default = "./buttons-KWE5CIYP.png";

  // res/hud/map-border.png
  var map_border_default = "./map-border-OU5SS5IH.png";

  // res/hud/marble.png
  var marble_default = "./marble-ZLZROWLU.png";

  // res/hud/ring.png
  var ring_default = "./ring-H2TENGRF.png";

  // src/StatsRenderer.ts
  var barWidth = 38;
  var coordinates = [
    xy(200, 124),
    xy(260, 166),
    xy(200, 210),
    xy(140, 166)
  ];
  var StatsRenderer = class {
    constructor(g, text = xy(21, 36), hp = xy(22, 43), sp = xy(22, 49)) {
      this.g = g;
      this.text = text;
      this.hp = hp;
      this.sp = sp;
      this.spots = [];
    }
    render(bg) {
      this.spots = [];
      for (let i = 0; i < 4; i++) {
        const xy2 = coordinates[i];
        const pc = this.g.party[i];
        this.renderPC(xy2, pc, bg, i);
      }
    }
    renderPC({ x, y }, pc, bg, index) {
      const { text, hp, sp } = this;
      const { ctx } = this.g;
      this.renderBar(x + hp.x, y + hp.y, pc.hp, pc.maxHp, Colours_default.hp);
      this.renderBar(x + sp.x, y + sp.y, pc.sp, pc.maxSp, Colours_default.sp);
      ctx.globalAlpha = index === this.g.facing ? 1 : 0.7;
      ctx.drawImage(bg, x, y);
      ctx.globalAlpha = 1;
      const { draw } = withTextStyle(ctx, {
        textAlign: "left",
        textBaseline: "middle",
        fillStyle: "white"
      });
      draw(pc.name, x + text.x, y + text.y, barWidth);
      this.spots.push({
        id: index,
        x,
        y,
        ex: x + bg.width,
        ey: y + bg.height,
        cursor: "pointer"
      });
    }
    spotClicked(spot) {
      const pos = spot.id;
      if (this.g.facing !== pos)
        this.g.partySwap(pos - this.g.facing);
    }
    renderBar(x, y, current, max, colour) {
      const width = Math.floor(
        barWidth * Math.max(0, Math.min(1, current / max))
      );
      this.g.ctx.fillStyle = colour;
      this.g.ctx.fillRect(x, y, width, 3);
    }
  };

  // src/MinimapRenderer.ts
  var facingChars = ["^", ">", "v", "<"];
  var sideColours = {
    "": "white",
    d: "silver",
    s: "grey",
    w: "orange",
    ds: "silver",
    dw: "red",
    sw: "black",
    dsw: "silver"
  };
  function rect(ctx, x, y, ox, oy, w, h, tag) {
    ctx.fillStyle = sideColours[tag];
    ctx.fillRect(x + ox, y + oy, w, h);
  }
  var MinimapRenderer = class {
    constructor(g, tileSize = 16, wallSize = 2, size = xy(2, 2), position = xy(375, 170)) {
      this.g = g;
      this.tileSize = tileSize;
      this.wallSize = wallSize;
      this.size = size;
      this.position = position;
    }
    render() {
      const { tileSize, size, position, wallSize } = this;
      const { ctx, facing, position: partyPos } = this.g;
      const startX = position.x;
      const startY = position.y;
      let dx = 0;
      let dy = startY;
      for (let y = -size.y; y <= size.y; y++) {
        const ty = y + partyPos.y;
        dx = startX - tileSize;
        for (let x = -size.x; x <= size.x; x++) {
          const tx = x + partyPos.x;
          dx += tileSize;
          const { cell, north, east, south, west } = this.g.getMinimapData(
            tx,
            ty
          );
          if (cell) {
            ctx.fillStyle = Colours_default.mapVisited;
            ctx.fillRect(dx, dy, tileSize, tileSize);
          }
          const edge = tileSize - wallSize;
          if (north)
            rect(ctx, dx, dy, 0, 0, tileSize, wallSize, north);
          if (east)
            rect(ctx, dx, dy, edge, 0, wallSize, tileSize, east);
          if (south)
            rect(ctx, dx, dy, 0, edge, tileSize, wallSize, south);
          if (west)
            rect(ctx, dx, dy, 0, 0, wallSize, tileSize, west);
          if (cell == null ? void 0 : cell.object) {
            const { draw: draw2 } = withTextStyle(ctx, {
              textAlign: "center",
              textBaseline: "middle",
              fillStyle: "white",
              fontSize: tileSize
            });
            draw2("\u25CF", dx + tileSize / 2, dy + tileSize / 2);
          }
        }
        dy += tileSize;
      }
      const { draw } = withTextStyle(ctx, {
        textAlign: "center",
        textBaseline: "middle",
        fillStyle: "white"
      });
      draw(
        facingChars[facing],
        startX + tileSize * (size.x + 0.5),
        startY + tileSize * (size.y + 0.5)
      );
    }
  };

  // src/HUDRenderer.ts
  var empty = document.createElement("img");
  var zero = xyi(0, 0);
  var RollListener = class {
    constructor(g, position = xyi(g.canvas.width / 2, 212), initialDelay = 2e3, fadeDelay = 500) {
      this.g = g;
      this.position = position;
      this.initialDelay = initialDelay;
      this.fadeDelay = fadeDelay;
      this.tick = () => {
        this.opacity = this.opacity > 0.1 ? this.opacity /= 2 : 0;
        this.g.draw();
        this.timer = this.opacity ? setTimeout(this.tick, this.fadeDelay) : void 0;
      };
      this.value = 0;
      this.colour = "white";
      this.opacity = 0;
      this.g.eventHandlers.onRoll.add(
        ({ value, size }) => this.rolled(
          value,
          value === 1 ? "red" : value === size ? "lime" : "white"
        )
      );
    }
    rolled(value, colour) {
      this.value = value;
      this.colour = colour;
      this.opacity = 1;
      if (this.timer)
        clearTimeout(this.timer);
      this.timer = setTimeout(this.tick, this.initialDelay);
      this.g.draw();
    }
    render() {
      if (this.opacity) {
        const { draw } = withTextStyle(this.g.ctx, {
          textAlign: "center",
          textBaseline: "middle",
          fillStyle: this.colour,
          fontSize: 16,
          globalAlpha: this.opacity
        });
        draw(this.value.toString(), this.position.x, this.position.y);
        this.g.ctx.globalAlpha = 1;
      }
    }
  };
  var HUDRenderer = class {
    constructor(g) {
      this.g = g;
      this.images = {
        base: empty,
        buttons: empty,
        mapBorder: empty,
        marble: empty,
        ring: empty
      };
      this.positions = {
        base: zero,
        buttons: zero,
        mapBorder: zero,
        marble: zero,
        ring: zero
      };
      this.stats = new StatsRenderer(g);
      this.minimap = new MinimapRenderer(g);
      this.roll = new RollListener(g);
    }
    acquireImages() {
      return __async(this, null, function* () {
        const [base, buttons, mapBorder, marble, ring] = yield Promise.all([
          this.g.res.loadImage(base_default),
          this.g.res.loadImage(buttons_default),
          this.g.res.loadImage(map_border_default),
          this.g.res.loadImage(marble_default),
          this.g.res.loadImage(ring_default)
        ]);
        const { width, height } = this.g.canvas;
        this.images = { base, buttons, mapBorder, marble, ring };
        this.positions = {
          base: zero,
          buttons: xyi(32, height - buttons.height),
          mapBorder: xyi(width - mapBorder.width, height - mapBorder.height),
          marble: zero,
          // not used
          ring: xyi((width - ring.width) / 2 - 2, height - ring.height)
        };
        return this.images;
      });
    }
    paste(image) {
      const pos = this.positions[image];
      this.g.ctx.drawImage(this.images[image], pos.x, pos.y);
    }
    render() {
      this.paste("base");
      this.paste("ring");
      this.roll.render();
      this.stats.render(this.images.marble);
      this.minimap.render();
      this.paste("mapBorder");
      this.paste("buttons");
    }
  };

  // src/tools/textWrap.ts
  function textWrap(source, width, measure) {
    const measurement = measure(source);
    if (measurement.width < width)
      return { lines: [source], measurement };
    const words = source.split(" ");
    const lines = [];
    let constructed = "";
    for (const w of words) {
      if (!constructed) {
        constructed += w;
        continue;
      }
      const temp = constructed + " " + w;
      const size = measure(temp);
      if (size.width > width) {
        lines.push(constructed);
        constructed = w;
      } else
        constructed += " " + w;
    }
    if (constructed)
      lines.push(constructed);
    return { lines, measurement: measure(source) };
  }

  // src/LogRenderer.ts
  var LogRenderer = class {
    constructor(g, position = xy(276, 0), size = xy(144, 160), padding = xy(2, 2)) {
      this.g = g;
      this.position = position;
      this.size = size;
      this.padding = padding;
    }
    render() {
      const { padding, position, size } = this;
      const { ctx, log } = this.g;
      ctx.fillStyle = Colours_default.logShadow;
      ctx.fillRect(position.x, position.y, size.x, size.y);
      const width = size.x - padding.x * 2;
      const textX = position.x + padding.x;
      let textY = position.y + size.y - padding.y;
      const { lineHeight, measure, draw } = withTextStyle(ctx, {
        textAlign: "left",
        textBaseline: "bottom",
        fillStyle: "white"
      });
      for (let i = log.length - 1; i >= 0; i--) {
        const { lines } = textWrap(log[i], width, measure);
        for (const line of lines.reverse()) {
          draw(line, textX, textY);
          textY = textY - lineHeight;
          if (textY < position.y)
            return;
        }
      }
    }
  };

  // src/items.ts
  var Penduchaimmer = {
    name: "Penduchaimmer",
    restrict: ["Martialist"],
    slot: "Hand",
    type: "Weapon",
    action: {
      name: "DuoStab",
      tags: ["attack"],
      sp: 3,
      targets: opponents(Infinity, [0, 2]),
      act({ g, me }) {
        const amount = mild(g);
        const front = g.getOpponent(me);
        if (front)
          g.applyDamage(me, [front], amount, "hp");
        const opposite = g.getOpponent(me, 2);
        if (opposite)
          g.applyDamage(me, [opposite], amount / 2, "hp");
      }
    }
  };
  var HaringleeKasaya = {
    name: "Haringlee Kasaya",
    restrict: ["Martialist"],
    slot: "Body",
    type: "Armour",
    action: {
      name: "Parry",
      tags: ["counter", "defence"],
      sp: 3,
      targets: onlyMe,
      act({ g, me }) {
        g.addEffect((destroy) => ({
          name: "Parry",
          duration: Infinity,
          affects: [me],
          onBeforeAction(e) {
            if (e.targets.includes(me) && e.action.tags.includes("attack")) {
              g.addToLog(`${me.name} counters!`);
              const amount = mild(g);
              g.applyDamage(me, [e.attacker], amount, "hp");
              destroy();
              e.cancel = true;
              return;
            }
          }
        }));
      }
    }
  };
  var GorgothilSword = {
    name: "Gorgothil Sword",
    restrict: ["Cleavesman"],
    slot: "Hand",
    type: "Weapon",
    action: {
      name: "Bash",
      tags: ["attack"],
      sp: 1,
      targets: oneOpponent,
      act({ g, me, targets }) {
        const amount = medium(g);
        g.applyDamage(me, targets, amount, "hp");
      }
    }
  };
  var Haringplate = {
    name: "Haringplate",
    restrict: ["Cleavesman"],
    slot: "Body",
    type: "Armour",
    action: {
      name: "Brace",
      tags: ["defence"],
      sp: 3,
      targets: onlyMe,
      act({ g, me }) {
        g.addEffect((destroy) => ({
          name: "Brace",
          duration: Infinity,
          affects: [me],
          onCalculateDamage(e) {
            if (e.target === me) {
              e.amount /= 2;
              destroy();
            }
          }
        }));
      }
    }
  };
  var OwlSkull = {
    name: "Owl's Skull",
    restrict: ["War Caller"],
    slot: "Hand",
    type: "Catalyst",
    action: {
      name: "Defy",
      tags: ["defence"],
      sp: 3,
      targets: onlyMe,
      act({ g, me }) {
        g.addEffect(() => ({
          name: "Defy",
          duration: 2,
          affects: [me],
          onAfterDamage({ target, attacker }) {
            if (target !== me)
              return;
            g.addToLog(`${me.name} stuns ${attacker.name} with their defiance!`);
            g.addEffect(() => ({
              name: "Defied",
              duration: 1,
              affects: [attacker],
              onCanAct(e) {
                if (e.who === attacker)
                  e.cancel = true;
              }
            }));
          }
        }));
      }
    }
  };
  var IronFullcase = {
    name: "Iron Fullcase",
    restrict: ["War Caller"],
    slot: "Body",
    type: "Armour",
    action: {
      name: "Endure",
      tags: ["defence"],
      sp: 2,
      targets: onlyMe,
      act({ g, me }) {
        g.addEffect(() => ({
          name: "Endure",
          duration: 2,
          affects: [me],
          onCalculateDR(e) {
            if (e.who === me)
              e.value += 2;
          }
        }));
        const opposite = g.getOpponent(me);
        if (opposite) {
          g.addToLog(
            `${opposite.name} withers in the face of ${me.name}'s endurance!`
          );
          g.addEffect(() => ({
            name: "Endured",
            duration: 2,
            affects: [opposite],
            onCalculateDetermination(e) {
              if (e.who === opposite)
                e.value -= 2;
            }
          }));
        }
      }
    }
  };
  var Cornucopia = {
    name: "Cornucopia",
    restrict: ["Loam Seer"],
    slot: "Hand",
    type: "Catalyst",
    action: {
      name: "Bless",
      tags: ["heal"],
      sp: 1,
      targets: ally(1),
      targetFilter: (c) => c.hp < c.maxHp,
      act({ g, me, targets }) {
        const amount = mild(g);
        g.heal(me, targets, amount);
      }
    }
  };
  var JacketAndRucksack = {
    name: "Jacket and Rucksack",
    restrict: ["Loam Seer"],
    slot: "Body",
    type: "Armour",
    action: {
      name: "Search",
      tags: [],
      sp: 4,
      targets: oneOpponent,
      act({ g, targets }) {
        g.addEffect(() => ({
          name: "Search",
          duration: Infinity,
          affects: targets
          // TODO: enemy is more likely to drop items
        }));
      }
    }
  };

  // src/classes.ts
  var baseStats = {
    Martialist: { hp: 21, sp: 7, determination: 6, camaraderie: 2, spirit: 3 },
    Cleavesman: { hp: 25, sp: 6, determination: 4, camaraderie: 4, spirit: 3 },
    "Far Scout": { hp: 18, sp: 7, determination: 3, camaraderie: 3, spirit: 5 },
    "War Caller": { hp: 30, sp: 5, determination: 5, camaraderie: 2, spirit: 4 },
    "Flag Singer": { hp: 21, sp: 6, determination: 2, camaraderie: 6, spirit: 3 },
    "Loam Seer": { hp: 18, sp: 5, determination: 2, camaraderie: 5, spirit: 4 }
  };
  var startingItems = {
    Martialist: [Penduchaimmer, HaringleeKasaya],
    Cleavesman: [GorgothilSword, Haringplate],
    "Far Scout": [],
    "War Caller": [OwlSkull, IronFullcase],
    "Flag Singer": [],
    "Loam Seer": [Cornucopia, JacketAndRucksack]
  };

  // src/Player.ts
  function getBaseStat(className, stat, bonusStat, bonusIfTrue = 1) {
    return baseStats[className][stat] + (bonusStat === stat ? bonusIfTrue : 0);
  }
  var Player = class {
    constructor(g, name, className, bonus, items = startingItems[className]) {
      this.g = g;
      this.name = name;
      this.className = className;
      this.isPC = true;
      this.maxHp = getBaseStat(className, "hp", bonus, 5);
      this.hp = this.maxHp;
      this.maxSp = getBaseStat(className, "sp", bonus);
      this.determination = getBaseStat(className, "determination", bonus);
      this.camaraderie = getBaseStat(className, "camaraderie", bonus);
      this.spirit = getBaseStat(className, "spirit", bonus);
      this.sp = Math.min(this.maxSp, this.spirit);
      this.attacksInARow = 0;
      this.equipment = /* @__PURE__ */ new Map();
      this.usedThisTurn = /* @__PURE__ */ new Set();
      for (const item of items) {
        if (item.slot)
          this.equip(item);
        else
          g.inventory.push(item);
      }
    }
    get alive() {
      return this.hp > 0;
    }
    get dr() {
      let value = 0;
      for (const item of this.equipment.values())
        if (item == null ? void 0 : item.dr)
          value += item.dr;
      return value;
    }
    get actions() {
      return Array.from(this.equipment.values()).map((i) => i.action).concat(endTurnAction);
    }
    get canMove() {
      return !this.alive || this.sp > 0;
    }
    move() {
      if (this.alive)
        this.sp--;
    }
    equip(item) {
      if (item.slot)
        this.equipment.set(item.slot, item);
    }
  };

  // src/ResourceManager.ts
  var ResourceManager = class {
    constructor() {
      this.promises = /* @__PURE__ */ new Map();
      this.loaders = [];
      this.atlases = {};
      this.images = {};
      this.maps = {};
      this.scripts = {};
      this.loaded = 0;
      this.loading = 0;
    }
    start(src, promise) {
      this.loading++;
      this.promises.set(src, promise);
      this.loaders.push(
        promise.then((arg) => {
          this.loaded++;
          return arg;
        })
      );
      return promise;
    }
    loadImage(src) {
      const res = this.promises.get(src);
      if (res)
        return res;
      return this.start(
        src,
        new Promise((resolve) => {
          const img = new Image();
          img.src = src;
          img.addEventListener("load", () => {
            this.images[src] = img;
            resolve(img);
          });
        })
      );
    }
    loadAtlas(src) {
      const res = this.promises.get(src);
      if (res)
        return res;
      return this.start(
        src,
        fetch(src).then((r) => r.json()).then((atlas) => {
          this.atlases[src] = atlas;
          return atlas;
        })
      );
    }
    loadGCMap(src) {
      const res = this.promises.get(src);
      if (res)
        return res;
      return this.start(
        src,
        fetch(src).then((r) => r.json()).then((map) => {
          this.maps[src] = map;
          return map;
        })
      );
    }
    loadScript(src) {
      const res = this.promises.get(src);
      if (res)
        return res;
      return this.start(
        src,
        fetch(src).then((r) => r.text()).then((script) => {
          this.scripts[src] = script;
          return script;
        })
      );
    }
  };

  // src/Soon.ts
  var Soon = class {
    constructor(callback) {
      this.callback = callback;
      this.call = () => {
        this.timeout = void 0;
        this.callback();
      };
    }
    schedule() {
      if (!this.timeout)
        this.timeout = requestAnimationFrame(this.call);
    }
  };

  // node_modules/nanoclone/src/index.js
  function clone(src, seen = /* @__PURE__ */ new Map()) {
    if (!src || typeof src !== "object")
      return src;
    if (seen.has(src))
      return seen.get(src);
    let copy;
    if (src.nodeType && "cloneNode" in src) {
      copy = src.cloneNode(true);
      seen.set(src, copy);
    } else if (src instanceof Date) {
      copy = new Date(src.getTime());
      seen.set(src, copy);
    } else if (src instanceof RegExp) {
      copy = new RegExp(src);
      seen.set(src, copy);
    } else if (Array.isArray(src)) {
      copy = new Array(src.length);
      seen.set(src, copy);
      for (let i = 0; i < src.length; i++)
        copy[i] = clone(src[i], seen);
    } else if (src instanceof Map) {
      copy = /* @__PURE__ */ new Map();
      seen.set(src, copy);
      for (const [k, v] of src.entries())
        copy.set(k, clone(v, seen));
    } else if (src instanceof Set) {
      copy = /* @__PURE__ */ new Set();
      seen.set(src, copy);
      for (const v of src)
        copy.add(clone(v, seen));
    } else if (src instanceof Object) {
      copy = {};
      seen.set(src, copy);
      for (const [k, v] of Object.entries(src))
        copy[k] = clone(v, seen);
    } else {
      throw Error(`Unable to clone ${src}`);
    }
    return copy;
  }
  function src_default(src) {
    return clone(src, /* @__PURE__ */ new Map());
  }

  // src/Grid.ts
  var Grid = class {
    constructor(defaultValue, toTag = xyToTag) {
      this.defaultValue = defaultValue;
      this.toTag = toTag;
      this.entries = /* @__PURE__ */ new Map();
      this.width = 0;
      this.height = 0;
    }
    set(xy2, item) {
      const tag = this.toTag(xy2);
      this.entries.set(tag, item);
      this.width = Math.max(this.width, xy2.x + 1);
      this.height = Math.max(this.height, xy2.y + 1);
    }
    get(xy2) {
      return this.entries.get(this.toTag(xy2));
    }
    getOrDefault(xy2) {
      const existing = this.get(xy2);
      if (existing)
        return existing;
      const value = this.defaultValue(xy2);
      this.set(xy2, value);
      return value;
    }
    asArray() {
      const rows = [];
      for (let y = 0; y < this.height; y++) {
        const row = [];
        for (let x = 0; x < this.width; x++)
          row.push(this.getOrDefault({ x, y }));
        rows.push(row);
      }
      return rows;
    }
  };

  // res/atlas/enemies.png
  var enemies_default = "./enemies-XNAMP7AV.png";

  // res/atlas/enemies.json
  var enemies_default2 = "./enemies-TKYHHQDG.json";

  // res/map.dscript
  var map_default = "./map-ZABSODQV.dscript";

  // res/atlas/test1.png
  var test1_default = "./test1-MYU5F6VR.png";

  // res/atlas/test1.json
  var test1_default2 = "./test1-DCKQ56SO.json";

  // src/resources.ts
  var Resources = {
    "enemies.png": enemies_default,
    "enemies.json": enemies_default2,
    "test1.png": test1_default,
    "test1.json": test1_default2,
    "map.dscript": map_default
  };
  function getResourceURL(id2) {
    const value = Resources[id2];
    if (!value)
      throw new Error(`Invalid resource ID: ${id2}`);
    return value;
  }

  // src/convertGridCartographerMap.ts
  var wall = { wall: true, solid: true };
  var door = { decal: "Door", wall: true };
  var locked = { decal: "Door", wall: true, solid: true };
  var invisible = { solid: true };
  var fake = { wall: true };
  var defaultEdge = { main: wall, opposite: wall };
  var EdgeDetails = {
    [2 /* Door */]: { main: door, opposite: door },
    [33 /* Door_Box */]: { main: door, opposite: door },
    [3 /* Door_Locked */]: { main: locked, opposite: locked },
    [8 /* Door_OneWayRD */]: { main: door, opposite: wall },
    [5 /* Door_OneWayLU */]: { main: wall, opposite: door },
    [13 /* Wall_Secret */]: { main: invisible, opposite: invisible },
    [10 /* Wall_OneWayRD */]: { main: fake, opposite: wall },
    [7 /* Wall_OneWayLU */]: { main: wall, opposite: fake }
  };
  var GCMapConverter = class {
    constructor(env = {}) {
      this.decals = /* @__PURE__ */ new Map();
      this.definitions = new Map(Object.entries(env));
      this.facing = Dir_default.N;
      this.grid = new Grid(() => ({ sides: {}, tags: [] }));
      this.scripts = [];
      this.start = xy(0, 0);
      this.textures = /* @__PURE__ */ new Map();
    }
    tile(x, y) {
      return this.grid.getOrDefault({ x, y });
    }
    convert(j, region = 0, floor = 0) {
      var _a, _b;
      if (!(region in j.regions))
        throw new Error(`No such region: ${region}`);
      const r = j.regions[region];
      const f = r.floors.find((f2) => f2.index === floor);
      if (!f)
        throw new Error(`No such floor: ${floor}`);
      for (const note of f.notes) {
        const { __data, x, y } = note;
        for (const line of (_a = __data == null ? void 0 : __data.split("\n")) != null ? _a : []) {
          if (!line.startsWith("#"))
            continue;
          const [cmd, arg] = line.split(" ");
          this.applyCommand(cmd, arg, x, y);
        }
      }
      for (const row of (_b = f.tiles.rows) != null ? _b : []) {
        let x = f.tiles.bounds.x0 + row.start;
        const y = r.setup.origin === "tl" ? row.y : f.tiles.bounds.height - (row.y - f.tiles.bounds.y0) - 1;
        for (const tile of row.tdata) {
          const mt = this.tile(x, y);
          if (tile.t)
            mt.floor = this.getTexture(tile.tc);
          if (tile.c)
            mt.ceiling = this.getTexture(0);
          if (tile.b)
            this.setEdge(tile.b, tile.bc, mt, Dir_default.S, this.tile(x, y + 1), Dir_default.N);
          if (tile.r)
            this.setEdge(tile.r, tile.rc, mt, Dir_default.E, this.tile(x + 1, y), Dir_default.W);
          x++;
        }
      }
      const { atlas, scripts, start, facing } = this;
      const name = `${r.name}:${f.index}`;
      const cells = this.grid.asArray();
      return { name, atlas, cells, scripts, start, facing };
    }
    getTexture(index = 0) {
      const texture = this.textures.get(index);
      if (typeof texture === "undefined")
        throw new Error(`Unknown texture for palette index ${index}`);
      return texture;
    }
    eval(s) {
      const def = this.definitions.get(s);
      if (typeof def !== "undefined")
        return def;
      const num2 = Number(s);
      if (!isNaN(num2))
        return num2;
      throw new Error(`Could not evaluate: ${s}`);
    }
    applyCommand(cmd, arg, x, y) {
      switch (cmd) {
        case "#ATLAS":
          this.atlas = {
            image: getResourceURL(arg + ".png"),
            json: getResourceURL(arg + ".json")
          };
          return;
        case "#DEFINE": {
          const [key, value] = arg.split(",");
          if (this.definitions.has(key))
            throw new Error(`Already defined: ${key}`);
          this.definitions.set(key, this.eval(value));
          return;
        }
        case "#STYLE": {
          const [index, value] = arg.split(",");
          this.textures.set(this.eval(index), this.eval(value));
          return;
        }
        case "#DECAL": {
          const [name, texture, decal] = arg.split(",");
          this.decals.set(`${name},${this.eval(texture)}`, this.eval(decal));
          return;
        }
        case "#START":
          this.start = { x, y };
          this.facing = dirFromInitial(arg);
          return;
        case "#TAG": {
          const t = this.tile(x, y);
          for (const tag of arg.split(","))
            t.tags.push(tag);
          break;
        }
        case "#SCRIPT":
          for (const id2 of arg.split(","))
            this.scripts.push(getResourceURL(id2));
          break;
        case "#OBJECT":
          this.tile(x, y).object = this.eval(arg);
          break;
        default:
          throw new Error(`Unknown command: ${cmd} ${arg} at (${x},${y})`);
      }
    }
    setEdge(edge, index, lt, ld, rt, rd) {
      var _a, _b, _c;
      const { main, opposite } = (_a = EdgeDetails[edge]) != null ? _a : defaultEdge;
      const texture = this.getTexture(index);
      lt.sides[ld] = {
        wall: main.wall ? texture : void 0,
        decalType: main.decal,
        decal: this.decals.get(`${(_b = main.decal) != null ? _b : ""},${texture}`),
        solid: main.solid
      };
      rt.sides[rd] = {
        wall: opposite.wall ? texture : void 0,
        decalType: opposite.decal,
        decal: this.decals.get(`${(_c = opposite.decal) != null ? _c : ""},${texture}`),
        solid: opposite.solid
      };
    }
  };
  function convertGridCartographerMap(j, region = 0, floor = 0, env = {}) {
    const converter = new GCMapConverter(env);
    return converter.convert(j, region, floor);
  }

  // src/DScript/parser.ts
  var import_nearley = __toESM(require_nearley());

  // src/tools/leftPad.ts
  function leftPad(s, n, char = " ") {
    return Array(n).join(char) + s;
  }

  // src/DScript/Lexer.ts
  var wsPattern = /[ \r\n\t]/;
  var isWhiteSpace = (ch) => wsPattern.test(ch);
  var nlPattern = /[\r\n]/;
  var isNewline = (ch) => nlPattern.test(ch);
  var numberPattern = /^[0-9]+$/;
  var isNumber = (w) => numberPattern.test(w);
  var wordPattern = /^[a-zA-Z][a-zA-Z0-9_]*$/;
  var isWord = (w) => wordPattern.test(w);
  var keywords = [
    "and",
    "any",
    "bool",
    "else",
    "end",
    "false",
    "function",
    "if",
    "not",
    "number",
    "or",
    "return",
    "string",
    "true",
    "xor"
  ];
  var isKeyword = (w) => keywords.includes(w);
  var punctuation = /* @__PURE__ */ new Set([
    "=",
    "+=",
    "-=",
    "*=",
    "/=",
    "^=",
    "(",
    ")",
    ":",
    ",",
    ">",
    ">=",
    "<",
    "<=",
    "==",
    "!=",
    "+",
    "-",
    "*",
    "/",
    "^"
  ]);
  var isPunctuation = (w) => punctuation.has(w);
  var commentChar = ";";
  var Lexer = class {
    constructor() {
      this.reset("");
    }
    get col() {
      return this.index - this.lastLineBreak + 1;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    has(_type) {
      return true;
    }
    reset(data, state) {
      this.buffer = data;
      this.index = 0;
      this.line = state ? state.line : 1;
      this.lastLineBreak = state ? -state.col : 0;
    }
    next() {
      const { line, col, index } = this;
      const [type, value] = this.getNextToken();
      if (type === "EOF")
        return;
      return { line, col, offset: index, type, value };
    }
    save() {
      const { line, col } = this;
      return { line, col: col - 1 };
    }
    formatError(token, message = "Syntax error") {
      const lines = this.buffer.replace(/\r/g, "").split("\n");
      const min = Math.max(0, token.line - 3);
      const max = Math.min(token.line + 2, lines.length - 1);
      const lineNoSize = max.toString().length;
      const context = [];
      for (let i = min; i < max; i++) {
        const line = lines[i];
        const showLineNo = i + 1;
        const raw = showLineNo.toString();
        const lineNo = leftPad(raw, lineNoSize - raw.length);
        context.push(`${lineNo} ${line}`);
        if (showLineNo === token.line)
          context.push(leftPad("^", token.col + lineNoSize + 1, "-"));
      }
      return [
        `${message} at line ${token.line} col ${token.col}`,
        ...context
      ].join("\n");
    }
    isEOF() {
      return this.index >= this.buffer.length;
    }
    peek() {
      return this.buffer[this.index];
    }
    consume() {
      const ch = this.peek();
      this.consumed += ch;
      this.index++;
      if (ch === "\n") {
        this.line++;
        this.lastLineBreak = this.index;
      }
      return ch;
    }
    repeater(isValid) {
      this.consume();
      while (true) {
        if (this.isEOF())
          break;
        const maybe = this.consumed + this.peek();
        if (!isValid(maybe))
          break;
        this.consume();
      }
      return this.consumed;
    }
    getNextToken() {
      this.consumed = "";
      if (this.isEOF())
        return ["EOF", ""];
      const ch = this.peek();
      if (isWhiteSpace(ch)) {
        while (isWhiteSpace(this.peek()))
          this.consume();
        return ["ws", this.consumed];
      }
      if (isNumber(ch)) {
        const number2 = this.repeater(isNumber);
        return ["number", number2];
      }
      if (isWord(ch)) {
        const word2 = this.repeater(isWord);
        if (isKeyword(word2))
          return ["keyword", word2];
        return ["word", word2];
      }
      if (isPunctuation(ch)) {
        const punctuation2 = this.repeater(isPunctuation);
        return ["punctuation", punctuation2];
      }
      if (ch === '"' || ch === "'") {
        this.consume();
        while (true) {
          if (this.isEOF())
            return ["UNCLOSED_STRING", ch];
          const next = this.consume();
          if (next === ch)
            return [ch === "'" ? "sqstring" : "dqstring", this.consumed];
        }
      }
      if (ch === commentChar) {
        this.consume();
        while (!this.isEOF() && !isNewline(this.peek()))
          this.consume();
        return ["comment", this.consumed];
      }
      return ["INVALID", ch];
    }
  };

  // src/DScript/grammar.ts
  function id(d) {
    return d[0];
  }
  var always = (value) => () => value;
  var val = ([tok]) => tok.value;
  var lexer = new Lexer();
  var grammar = {
    Lexer: lexer,
    ParserRules: [
      { "name": "document", "symbols": ["_", "program"], "postprocess": ([, prog]) => prog },
      { "name": "program$ebnf$1", "symbols": [] },
      { "name": "program$ebnf$1", "symbols": ["program$ebnf$1", "declp"], "postprocess": (d) => d[0].concat([d[1]]) },
      { "name": "program", "symbols": ["program$ebnf$1"], "postprocess": id },
      { "name": "declp", "symbols": ["decl", "_"], "postprocess": id },
      { "name": "decl", "symbols": ["stmt"], "postprocess": id },
      { "name": "stmt", "symbols": ["assignment"], "postprocess": id },
      { "name": "stmt", "symbols": ["call"], "postprocess": id },
      { "name": "stmt", "symbols": ["function_def"], "postprocess": id },
      { "name": "stmt", "symbols": ["if_stmt"], "postprocess": id },
      { "name": "stmt", "symbols": ["return_stmt"], "postprocess": id },
      { "name": "assignment", "symbols": ["name", "_", "assignop", "_", "expr"], "postprocess": ([name, , op, , expr]) => ({ _: "assignment", name, op, expr }) },
      { "name": "assignop", "symbols": [{ "literal": "=" }], "postprocess": val },
      { "name": "assignop", "symbols": [{ "literal": "+=" }], "postprocess": val },
      { "name": "assignop", "symbols": [{ "literal": "-=" }], "postprocess": val },
      { "name": "assignop", "symbols": [{ "literal": "*=" }], "postprocess": val },
      { "name": "assignop", "symbols": [{ "literal": "/=" }], "postprocess": val },
      { "name": "assignop", "symbols": [{ "literal": "^=" }], "postprocess": val },
      { "name": "function_def$ebnf$1", "symbols": ["function_type_clause"], "postprocess": id },
      { "name": "function_def$ebnf$1", "symbols": [], "postprocess": () => null },
      { "name": "function_def", "symbols": [{ "literal": "function" }, "__", "name", { "literal": "(" }, "function_args", { "literal": ")" }, "function_def$ebnf$1", "document", "__", { "literal": "end" }], "postprocess": ([, , name, , args, , type, program]) => ({ _: "function", name, args, type, program }) },
      { "name": "function_type_clause", "symbols": [{ "literal": ":" }, "_", "vtype"], "postprocess": ([, , type]) => type },
      { "name": "function_args", "symbols": [], "postprocess": always([]) },
      { "name": "function_args", "symbols": ["name_with_type"] },
      { "name": "function_args", "symbols": ["function_args", "_", { "literal": "," }, "_", "name_with_type"], "postprocess": ([list, , , , value]) => list.concat([value]) },
      { "name": "if_stmt$ebnf$1", "symbols": ["else_clause"], "postprocess": id },
      { "name": "if_stmt$ebnf$1", "symbols": [], "postprocess": () => null },
      { "name": "if_stmt", "symbols": [{ "literal": "if" }, "__", "expr", "__", { "literal": "then" }, "document", "if_stmt$ebnf$1", "__", { "literal": "end" }], "postprocess": ([, , expr, , , positive, negative]) => ({ _: "if", expr, positive, negative }) },
      { "name": "else_clause", "symbols": ["__", { "literal": "else" }, "document"], "postprocess": ([, , clause]) => clause },
      { "name": "return_stmt$ebnf$1$subexpression$1", "symbols": ["__", "expr"], "postprocess": ([, expr]) => expr },
      { "name": "return_stmt$ebnf$1", "symbols": ["return_stmt$ebnf$1$subexpression$1"], "postprocess": id },
      { "name": "return_stmt$ebnf$1", "symbols": [], "postprocess": () => null },
      { "name": "return_stmt", "symbols": [{ "literal": "return" }, "return_stmt$ebnf$1"], "postprocess": ([, expr]) => ({ _: "return", expr }) },
      { "name": "expr", "symbols": ["maths"], "postprocess": id },
      { "name": "maths", "symbols": ["logic"], "postprocess": id },
      { "name": "logic", "symbols": ["logic", "_", "logicop", "_", "boolean"], "postprocess": ([left, , op, , right]) => ({ _: "binary", left, op, right }) },
      { "name": "logic", "symbols": ["boolean"], "postprocess": id },
      { "name": "boolean", "symbols": ["boolean", "_", "boolop", "_", "sum"], "postprocess": ([left, , op, , right]) => ({ _: "binary", left, op, right }) },
      { "name": "boolean", "symbols": ["sum"], "postprocess": id },
      { "name": "sum", "symbols": ["sum", "_", "sumop", "_", "product"], "postprocess": ([left, , op, , right]) => ({ _: "binary", left, op, right }) },
      { "name": "sum", "symbols": ["product"], "postprocess": id },
      { "name": "product", "symbols": ["product", "_", "mulop", "_", "exp"], "postprocess": ([left, , op, , right]) => ({ _: "binary", left, op, right }) },
      { "name": "product", "symbols": ["exp"], "postprocess": id },
      { "name": "exp", "symbols": ["unary", "_", "expop", "_", "exp"], "postprocess": ([left, , op, , right]) => ({ _: "binary", left, op, right }) },
      { "name": "exp", "symbols": ["unary"], "postprocess": id },
      { "name": "unary", "symbols": [{ "literal": "-" }, "value"], "postprocess": ([op, value]) => ({ _: "unary", op: op.value, value }) },
      { "name": "unary", "symbols": [{ "literal": "not" }, "_", "value"], "postprocess": ([op, , value]) => ({ _: "unary", op: op.value, value }) },
      { "name": "unary", "symbols": ["value"], "postprocess": id },
      { "name": "logicop", "symbols": [{ "literal": "and" }], "postprocess": val },
      { "name": "logicop", "symbols": [{ "literal": "or" }], "postprocess": val },
      { "name": "logicop", "symbols": [{ "literal": "xor" }], "postprocess": val },
      { "name": "boolop", "symbols": [{ "literal": ">" }], "postprocess": val },
      { "name": "boolop", "symbols": [{ "literal": ">=" }], "postprocess": val },
      { "name": "boolop", "symbols": [{ "literal": "<" }], "postprocess": val },
      { "name": "boolop", "symbols": [{ "literal": "<=" }], "postprocess": val },
      { "name": "boolop", "symbols": [{ "literal": "==" }], "postprocess": val },
      { "name": "boolop", "symbols": [{ "literal": "!=" }], "postprocess": val },
      { "name": "sumop", "symbols": [{ "literal": "+" }], "postprocess": val },
      { "name": "sumop", "symbols": [{ "literal": "-" }], "postprocess": val },
      { "name": "mulop", "symbols": [{ "literal": "*" }], "postprocess": val },
      { "name": "mulop", "symbols": [{ "literal": "/" }], "postprocess": val },
      { "name": "expop", "symbols": [{ "literal": "^" }], "postprocess": val },
      { "name": "value", "symbols": ["literal_number"], "postprocess": id },
      { "name": "value", "symbols": ["literal_boolean"], "postprocess": id },
      { "name": "value", "symbols": ["literal_string"], "postprocess": id },
      { "name": "value", "symbols": ["name"], "postprocess": id },
      { "name": "value", "symbols": ["call"], "postprocess": id },
      { "name": "call", "symbols": ["name", { "literal": "(" }, "call_args", { "literal": ")" }], "postprocess": ([fn, , args]) => ({ _: "call", fn, args }) },
      { "name": "call_args", "symbols": [], "postprocess": always([]) },
      { "name": "call_args", "symbols": ["expr"] },
      { "name": "call_args", "symbols": ["call_args", "_", { "literal": "," }, "_", "expr"], "postprocess": ([list, , , , value]) => list.concat([value]) },
      { "name": "literal_number", "symbols": [lexer.has("number") ? { type: "number" } : number], "postprocess": ([tok]) => ({ _: "number", value: Number(tok.value) }) },
      { "name": "literal_number", "symbols": [lexer.has("number") ? { type: "number" } : number, { "literal": "." }, lexer.has("number") ? { type: "number" } : number], "postprocess": ([whole, , frac]) => ({ _: "number", value: Number(whole.value + "." + frac.value) }) },
      { "name": "literal_boolean", "symbols": [{ "literal": "true" }], "postprocess": always({ _: "bool", value: true }) },
      { "name": "literal_boolean", "symbols": [{ "literal": "false" }], "postprocess": always({ _: "bool", value: false }) },
      { "name": "literal_string", "symbols": [lexer.has("sqstring") ? { type: "sqstring" } : sqstring], "postprocess": ([tok]) => ({ _: "string", value: tok.value.slice(1, -1) }) },
      { "name": "literal_string", "symbols": [lexer.has("dqstring") ? { type: "dqstring" } : dqstring], "postprocess": ([tok]) => ({ _: "string", value: tok.value.slice(1, -1) }) },
      { "name": "name_with_type", "symbols": ["name", { "literal": ":" }, "_", "vtype"], "postprocess": ([name, , , type]) => ({ _: "arg", type, name }) },
      { "name": "vtype", "symbols": [{ "literal": "any" }], "postprocess": val },
      { "name": "vtype", "symbols": [{ "literal": "bool" }], "postprocess": val },
      { "name": "vtype", "symbols": [{ "literal": "function" }], "postprocess": val },
      { "name": "vtype", "symbols": [{ "literal": "number" }], "postprocess": val },
      { "name": "vtype", "symbols": [{ "literal": "string" }], "postprocess": val },
      { "name": "name", "symbols": [lexer.has("word") ? { type: "word" } : word], "postprocess": ([tok]) => ({ _: "id", value: tok.value }) },
      { "name": "_", "symbols": ["ws"], "postprocess": always(null) },
      { "name": "_", "symbols": ["comment"], "postprocess": always(null) },
      { "name": "_", "symbols": [], "postprocess": always(null) },
      { "name": "__", "symbols": ["ws"], "postprocess": always(null) },
      { "name": "ws", "symbols": [lexer.has("ws") ? { type: "ws" } : ws], "postprocess": always(null) },
      { "name": "comment", "symbols": ["_", lexer.has("comment") ? { type: "comment" } : comment, "_"], "postprocess": always(null) }
    ],
    ParserStart: "document"
  };
  var grammar_default = grammar;

  // src/tools/uniq.ts
  function uniq(items) {
    const set = new Set(items);
    return Array.from(set.values());
  }

  // src/DScript/parser.ts
  function makeEOFToken(p, src) {
    var _a, _b, _c, _d;
    return {
      col: (_b = (_a = p.lexerState) == null ? void 0 : _a.col) != null ? _b : p.lexer.col,
      line: (_d = (_c = p.lexerState) == null ? void 0 : _c.line) != null ? _d : p.lexer.line,
      offset: src.length,
      type: "EOF",
      value: ""
    };
  }
  var ParseError = class extends Error {
    constructor(p, token, src) {
      super("Syntax error");
      this.p = p;
      this.token = token;
      this.src = src;
      const col = p.table[p.current];
      const expected = col.states.map((s) => {
        const ns = s.rule.symbols[s.dot];
        if (typeof ns === "object") {
          if (ns.literal)
            return `"${ns.literal}"`;
          if (ns.type)
            return ns.type;
        }
        if (typeof ns === "string")
          return `(${ns})`;
      }).filter(isDefined);
      const message = token.type === "UNCLOSED_STRING" ? "Unclosed string" : `Got ${token.type} token${token.value ? ` "${token.value}"` : ""}, expected one of: ${uniq(expected).sort().join(", ")}`;
      this.message = [p.lexer.formatError(token), message].join("\n");
    }
  };
  function parse(src) {
    const p = new import_nearley.Parser(import_nearley.Grammar.fromCompiled(grammar_default));
    try {
      p.feed(src.trim());
    } catch (error) {
      throw new ParseError(p, error.token, src);
    }
    const result = p.results;
    if (result.length === 0)
      throw new ParseError(p, makeEOFToken(p, src), src);
    if (result.length > 1) {
      for (let i = 0; i < result.length; i++) {
        console.log(`--- PARSE #${i}`);
        console.dir(result[0], { depth: Infinity });
      }
      throw new Error("Ambiguous parse.");
    }
    return result[0];
  }

  // src/tools/getKeyNames.ts
  function getKeyNames(key, shift, alt, ctrl) {
    const names = [key];
    if (shift)
      names.unshift("Shift+" + key);
    if (alt)
      names.unshift("Alt+" + key);
    if (ctrl)
      names.unshift("Ctrl+" + key);
    return names;
  }

  // src/tools/aabb.ts
  function contains(spot, pos) {
    return pos.x >= spot.x && pos.y >= spot.y && pos.x < spot.ex && pos.y < spot.ey;
  }

  // src/tools/numbers.ts
  function wrap(n, max) {
    const m = n % max;
    return m < 0 ? m + max : m;
  }

  // src/types/logic.ts
  var matchAll = (predicates) => (item) => {
    for (const p of predicates) {
      if (!p(item))
        return false;
    }
    return true;
  };

  // src/Engine.ts
  var Engine = class {
    constructor(canvas) {
      this.canvas = canvas;
      this.render = () => {
        const { ctx, renderSetup } = this;
        const { width, height } = this.canvas;
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, width, height);
        if (!renderSetup) {
          const { draw } = withTextStyle(ctx, {
            textAlign: "center",
            textBaseline: "middle",
            fillStyle: "white"
          });
          draw(
            `Loading: ${this.res.loaded}/${this.res.loading}`,
            width / 2,
            height / 2
          );
          this.draw();
          return;
        }
        renderSetup.dungeon.render();
        renderSetup.hud.render();
        if (this.showLog)
          renderSetup.log.render();
        if (this.combat.inCombat)
          renderSetup.combat.render();
      };
      this.ctx = getCanvasContext(canvas, "2d");
      this.eventHandlers = Object.fromEntries(
        GameEventNames.map((name) => [name, /* @__PURE__ */ new Set()])
      );
      this.zoomRatio = 1;
      this.controls = new Map(DefaultControls_default);
      this.facing = Dir_default.N;
      this.position = xyi(0, 0);
      this.worldSize = xyi(0, 0);
      this.res = new ResourceManager();
      this.drawSoon = new Soon(this.render);
      this.scripting = new EngineScripting(this);
      this.log = [];
      this.showLog = false;
      this.combat = new CombatManager(this);
      this.visited = /* @__PURE__ */ new Map();
      this.walls = /* @__PURE__ */ new Map();
      this.worldVisited = /* @__PURE__ */ new Set();
      this.worldWalls = /* @__PURE__ */ new Map();
      this.inventory = [];
      this.pendingEnemies = [];
      this.party = [
        new Player(this, "A", "Martialist"),
        new Player(this, "B", "Cleavesman"),
        new Player(this, "C", "War Caller"),
        new Player(this, "D", "Loam Seer")
      ];
      canvas.addEventListener("keyup", (e) => {
        const keys = getKeyNames(e.code, e.shiftKey, e.altKey, e.ctrlKey);
        for (const key of keys) {
          const input = this.controls.get(key);
          if (input) {
            e.preventDefault();
            for (const check of input) {
              if (this.processInput(check))
                return;
            }
          }
        }
      });
      const transform = (e) => xyi(e.offsetX / this.zoomRatio, e.offsetY / this.zoomRatio);
      canvas.addEventListener("mousemove", (e) => this.onMouseMove(transform(e)));
      canvas.addEventListener("click", (e) => this.onClick(transform(e)));
    }
    get spotElements() {
      if (this.renderSetup)
        return [this.renderSetup.hud.stats];
      return [];
    }
    getSpot(pos) {
      for (const element of this.spotElements) {
        const spot = element.spots.find((s) => contains(s, pos));
        if (spot)
          return { element, spot };
      }
    }
    onMouseMove(pos) {
      var _a;
      const result = this.getSpot(pos);
      this.canvas.style.cursor = (_a = result == null ? void 0 : result.spot.cursor) != null ? _a : "";
    }
    onClick(pos) {
      const result = this.getSpot(pos);
      if (result)
        result.element.spotClicked(result.spot);
    }
    processInput(i) {
      switch (i) {
        case "Forward":
          return this.move(this.facing);
        case "SlideRight":
          return this.move(rotate(this.facing, 1));
        case "Back":
          return this.move(rotate(this.facing, 2));
        case "SlideLeft":
          return this.move(rotate(this.facing, 3));
        case "TurnLeft":
          return this.turn(-1);
        case "TurnRight":
          return this.turn(1);
        case "ToggleLog":
          return this.toggleLog();
        case "Interact":
          return this.interact();
        case "MenuDown":
          return this.menuMove(1);
        case "MenuUp":
          return this.menuMove(-1);
        case "MenuChoose":
          return this.menuChoose();
        case "RotateLeft":
          return this.partyRotate(-1);
        case "RotateRight":
          return this.partyRotate(1);
        case "SwapLeft":
          return this.partySwap(-1);
        case "SwapRight":
          return this.partySwap(1);
        case "SwapBehind":
          return this.partySwap(2);
      }
    }
    loadWorld(w, position) {
      return __async(this, null, function* () {
        this.renderSetup = void 0;
        this.world = src_default(w);
        this.worldSize = xyi(this.world.cells[0].length, this.world.cells.length);
        this.position = position != null ? position : w.start;
        this.facing = w.facing;
        const combat = new CombatRenderer(this);
        const hud = new HUDRenderer(this);
        const log = new LogRenderer(this);
        const [atlas, image, enemyAtlas, enemyImage] = yield Promise.all([
          this.res.loadAtlas(w.atlas.json),
          this.res.loadImage(w.atlas.image),
          this.res.loadAtlas(getResourceURL("enemies.json")),
          this.res.loadImage(getResourceURL("enemies.png")),
          hud.acquireImages()
        ]);
        const dungeon = new DungeonRenderer(this, atlas, image);
        yield dungeon.addAtlas(atlas.layers, image);
        yield dungeon.addAtlas(enemyAtlas.layers, enemyImage);
        dungeon.dungeon.layers.push(...enemyAtlas.layers);
        const visited = this.visited.get(w.name);
        if (visited)
          this.worldVisited = visited;
        else {
          this.worldVisited = /* @__PURE__ */ new Set();
          this.visited.set(w.name, this.worldVisited);
        }
        const walls = this.walls.get(w.name);
        if (walls)
          this.worldWalls = walls;
        else {
          this.worldWalls = /* @__PURE__ */ new Map();
          this.walls.set(w.name, this.worldWalls);
        }
        this.markVisited();
        this.renderSetup = { combat, dungeon, hud, log };
        return this.draw();
      });
    }
    loadGCMap(jsonUrl, region, floor) {
      return __async(this, null, function* () {
        this.renderSetup = void 0;
        const map = yield this.res.loadGCMap(jsonUrl);
        const { atlas, cells, scripts, start, facing, name } = convertGridCartographerMap(map, region, floor, EnemyObjects);
        if (!atlas)
          throw new Error(`${jsonUrl} did not contain #ATLAS`);
        const codeFiles = yield Promise.all(
          scripts.map((url) => this.res.loadScript(url))
        );
        for (const code of codeFiles) {
          const program = parse(code);
          this.scripting.run(program);
        }
        return this.loadWorld({ name, atlas, cells, start, facing });
      });
    }
    isVisited(x, y) {
      const tag = xyToTag({ x, y });
      return this.worldVisited.has(tag);
    }
    getCell(x, y) {
      var _a;
      if (x < 0 || x >= this.worldSize.x || y < 0 || y >= this.worldSize.y)
        return;
      const cell = (_a = this.world) == null ? void 0 : _a.cells[y][x];
      if (cell && this.combat.inCombat) {
        const result = getCardinalOffset(this.position, { x, y });
        if (result) {
          const enemy = this.combat.getFromOffset(result.dir, result.offset);
          if (enemy) {
            const replaced = src_default(cell);
            replaced.object = enemy.template.object;
            return replaced;
          }
        }
      }
      return cell;
    }
    findCellWithTag(tag) {
      if (!this.world)
        return;
      for (let y = 0; y < this.worldSize.y; y++) {
        for (let x = 0; x < this.worldSize.x; x++) {
          if (this.world.cells[y][x].tags.includes(tag))
            return { x, y };
        }
      }
    }
    draw() {
      this.drawSoon.schedule();
    }
    canMove(dir) {
      const at = this.getCell(this.position.x, this.position.y);
      if (!at)
        return false;
      const wall2 = at.sides[dir];
      if (wall2 == null ? void 0 : wall2.solid)
        return false;
      const destination = move(this.position, dir);
      const cell = this.getCell(destination.x, destination.y);
      if (!cell)
        return false;
      return true;
    }
    move(dir) {
      if (this.combat.inCombat)
        return false;
      if (this.canMove(dir)) {
        const old = this.position;
        this.position = move(this.position, dir);
        this.markVisited();
        this.markNavigable(old, dir);
        this.draw();
        this.scripting.onEnter(this.position, old);
        return true;
      }
      this.markUnnavigable(this.position, dir);
      return false;
    }
    toggleLog() {
      this.showLog = !this.showLog;
      this.draw();
      return true;
    }
    interact() {
      if (!this.party[this.facing].alive)
        return false;
      if (this.combat.inCombat)
        return false;
      return this.scripting.onInteract();
    }
    markVisited() {
      const pos = this.position;
      const tag = xyToTag(pos);
      const cell = this.getCell(pos.x, pos.y);
      if (!this.worldVisited.has(tag) && cell) {
        this.worldVisited.add(tag);
        for (let dir = 0; dir <= 3; dir++) {
          const wall2 = cell.sides[dir];
          const canSeeDoor = (wall2 == null ? void 0 : wall2.decalType) === "Door";
          const hasTexture = typeof (wall2 == null ? void 0 : wall2.wall) === "number";
          const looksSolid = hasTexture;
          const data = {
            canSeeDoor,
            isSolid: looksSolid && !canSeeDoor,
            canSeeWall: hasTexture
          };
          this.worldWalls.set(wallToTag(pos, dir), data);
        }
      }
    }
    markNavigable(pos, dir) {
      var _a;
      const tag = wallToTag(pos, dir);
      const data = (_a = this.worldWalls.get(tag)) != null ? _a : {
        canSeeDoor: false,
        isSolid: false,
        canSeeWall: false
      };
      if (data.isSolid) {
        data.isSolid = false;
        this.worldWalls.set(tag, data);
      }
    }
    markUnnavigable(pos, dir) {
      var _a;
      const tag = wallToTag(pos, dir);
      const data = (_a = this.worldWalls.get(tag)) != null ? _a : {
        canSeeDoor: false,
        isSolid: false,
        canSeeWall: false
      };
      if (!data.isSolid) {
        data.isSolid = true;
        this.worldWalls.set(tag, data);
        this.draw();
      }
    }
    getMinimapData(x, y) {
      if (!this.isVisited(x, y))
        return {};
      const cell = this.getCell(x, y);
      const north = this.getWallData(x, y, Dir_default.N);
      const east = this.getWallData(x, y, Dir_default.E);
      const south = this.getWallData(x, y, Dir_default.S);
      const west = this.getWallData(x, y, Dir_default.W);
      return { cell, north, east, south, west };
    }
    getWallData(x, y, dir) {
      const wallData = this.worldWalls.get(wallToTag({ x, y }, dir));
      const dTag = (wallData == null ? void 0 : wallData.canSeeDoor) ? "d" : "";
      const sTag = (wallData == null ? void 0 : wallData.isSolid) ? "s" : "";
      const wTag = (wallData == null ? void 0 : wallData.canSeeWall) ? "w" : "";
      return `${dTag}${sTag}${wTag}`;
    }
    turn(clockwise) {
      this.combat.index = 0;
      this.facing = rotate(this.facing, clockwise);
      this.draw();
      return true;
    }
    menuMove(mod) {
      if (!this.combat.inCombat)
        return false;
      if (this.combat.side === "enemy")
        return false;
      const actions = this.party[this.facing].actions;
      const index = wrap(this.combat.index + mod, actions.length);
      this.combat.index = index;
      this.draw();
      return true;
    }
    canAct(who, action) {
      if (!who.alive)
        return false;
      if (who.usedThisTurn.has(action.name))
        return false;
      const e = this.fire("onCanAct", { who, action, cancel: false });
      if (e.cancel)
        return false;
      if (action.sp > who.sp)
        return false;
      return true;
    }
    menuChoose() {
      if (!this.combat.inCombat)
        return false;
      if (this.combat.side === "enemy")
        return false;
      const pc = this.party[this.facing];
      const action = pc.actions[this.combat.index];
      if (!action)
        return false;
      if (!this.canAct(pc, action))
        return false;
      const { possibilities, amount } = this.getTargetPossibilities(pc, action);
      if (!possibilities.length)
        return false;
      const targets = pickN(
        possibilities.filter((c) => c.alive),
        amount
      );
      this.act(pc, action, targets);
      return true;
    }
    getOpponent(me, turn = 0) {
      const { dir: myDir, distance } = this.combat.getPosition(me);
      const dir = rotate(myDir, turn);
      return me.isPC ? this.combat.enemies[dir][0] : distance === 0 ? this.party[dir] : void 0;
    }
    getTargetPossibilities(c, a) {
      var _a;
      if (a.targets.type === "self")
        return { amount: 1, possibilities: [c] };
      const amount = (_a = a.targets.count) != null ? _a : Infinity;
      const filters = [
        a.targets.type === "ally" ? (o) => o.isPC === c.isPC : (o) => o.isPC !== c.isPC
      ];
      if (a.targetFilter)
        filters.push(a.targetFilter);
      const { distance, offsets } = a.targets;
      const me = this.combat.getPosition(c);
      if (offsets)
        filters.push((o) => {
          const them = this.combat.getPosition(o);
          return offsets.includes(getDirOffset(me.dir, them.dir));
        });
      if (typeof distance === "number")
        filters.push((o) => {
          const them = this.combat.getPosition(o);
          const diff = Math.abs(them.distance - me.distance);
          return diff <= distance;
        });
      return {
        amount,
        possibilities: this.combat.aliveCombatants.filter(matchAll(filters))
      };
    }
    addToLog(message) {
      this.log.push(message);
      this.showLog = true;
      this.draw();
    }
    fire(name, e) {
      const handlers = this.eventHandlers[name];
      for (const handler of handlers)
        handler(e);
      return e;
    }
    act(me, action, targets) {
      var _a;
      const x = action.x ? me.sp : action.sp;
      me.sp -= x;
      me.usedThisTurn.add(action.name);
      const msg = ((_a = action.useMessage) != null ? _a : `[NAME] uses ${action.name}!`).replace(
        "[NAME]",
        me.name
      );
      if (msg)
        this.addToLog(msg);
      else
        this.draw();
      const e = this.fire("onBeforeAction", {
        attacker: me,
        action,
        targets,
        cancel: false
      });
      if (e.cancel)
        return;
      action.act({ g: this, targets, me, x });
      me.lastAction = action.name;
      if (action.name === "Attack") {
        me.attacksInARow++;
      } else
        me.attacksInARow = 0;
    }
    endTurn() {
      this.combat.endTurn();
    }
    addEffect(makeEffect) {
      const effect = makeEffect(() => this.removeEffect(effect));
      this.combat.effects.push(effect);
      for (const name of GameEventNames) {
        const handler = effect[name];
        if (handler)
          this.eventHandlers[name].add(handler);
      }
    }
    removeEffect(effect) {
      const index = this.combat.effects.indexOf(effect);
      if (index >= 0)
        this.combat.effects.splice(index, 1);
      for (const name of GameEventNames) {
        const handler = effect[name];
        if (handler)
          this.eventHandlers[name].delete(handler);
      }
    }
    roll(size) {
      const value = random(size) + 1;
      this.fire("onRoll", { size, value });
      return value;
    }
    getStat(who, stat) {
      if (stat === "dr")
        return this.fire("onCalculateDR", { who, value: who.dr }).value;
      if (stat === "determination")
        return this.fire("onCalculateDetermination", { who, value: who.dr }).value;
      return who[stat];
    }
    applyDamage(attacker, targets, amount, type) {
      for (const target of targets) {
        const damage = this.fire("onCalculateDamage", {
          attacker,
          target,
          amount,
          type
        });
        const resist = type === "hp" ? this.getStat(target, "dr") : 0;
        const deal = Math.floor(damage.amount - resist);
        if (deal > 0) {
          target[type] -= deal;
          this.draw();
          const message = type === "hp" ? `${target.name} takes ${deal} damage.` : `${target.name} loses ${deal} ${type}.`;
          this.addToLog(message);
          if (target.hp < 1)
            this.kill(target, attacker);
          this.fire("onAfterDamage", { attacker, target, amount, type });
        }
      }
    }
    heal(healer, targets, amount) {
      for (const target of targets) {
        const newHP = Math.min(target.hp + amount, target.maxHp);
        const gain = newHP - target.hp;
        if (gain) {
          target.hp = newHP;
          this.draw();
          const message = `${target.name} heals for ${gain}.`;
          this.addToLog(message);
        }
      }
    }
    kill(who, attacker) {
      who.hp = 0;
      this.addToLog(`${who.name} dies!`);
      this.fire("onKilled", { who, attacker });
      const alive = this.party.find((pc) => pc.alive);
      const winners = alive ? this.combat.allEnemies.length === 0 ? "party" : void 0 : "enemies";
      if (winners) {
        if (alive)
          this.addToLog(`You have vanquished your foes.`);
        else
          this.addToLog(`You have failed.`);
        this.fire("onCombatOver", { winners });
      }
    }
    partyRotate(dir) {
      if (this.combat.inCombat) {
        const immobile = this.party.find((pc) => !pc.canMove);
        if (immobile)
          return false;
        for (const pc of this.party)
          pc.move();
      }
      if (dir === -1) {
        const north = this.party.shift();
        this.party.push(north);
      } else {
        const west = this.party.pop();
        this.party.unshift(west);
      }
      this.draw();
      return true;
    }
    partySwap(side) {
      const dir = rotate(this.facing, side);
      const me = this.party[this.facing];
      const them = this.party[dir];
      if (this.combat.inCombat) {
        if (!me.canMove || !them.canMove)
          return false;
        me.move();
        them.move();
      }
      this.party[this.facing] = them;
      this.party[dir] = me;
      this.draw();
      return true;
    }
  };

  // res/map.json
  var map_default2 = "./map-FGDVPJZZ.json";

  // src/index.ts
  function loadEngine(parent) {
    const container = document.createElement("div");
    parent.appendChild(container);
    const canvas = document.createElement("canvas");
    canvas.tabIndex = 1;
    container.appendChild(canvas);
    const g = new Engine(canvas);
    requestAnimationFrame(() => canvas.focus());
    window.g = g;
    const onResize = () => {
      const wantWidth = 480;
      const wantHeight = 270;
      const ratioWidth = Math.floor(window.innerWidth / wantWidth);
      const ratioHeight = Math.floor(window.innerHeight / wantHeight);
      const ratio = Math.max(1, Math.min(ratioWidth, ratioHeight));
      const width = wantWidth * ratio;
      const height = wantHeight * ratio;
      container.style.width = `${width}px`;
      container.style.height = `${height}px`;
      canvas.width = wantWidth;
      canvas.height = wantHeight;
      g.zoomRatio = ratio;
      g.draw();
    };
    window.addEventListener("resize", onResize);
    onResize();
    void g.loadGCMap(map_default2, 0, 1);
  }
  window.addEventListener("load", () => loadEngine(document.body));
})();
//# sourceMappingURL=bundle.js.map
