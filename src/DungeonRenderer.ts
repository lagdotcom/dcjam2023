// adapted from https://dungeoncrawlers.org/tools/dungeonrenderer/

import Engine from "./Engine";
import getFieldOfView from "./fov";
import { rotate, xy } from "./tools/geometry";
import getCanvasContext from "./tools/getCanvasContext";
import Atlas, { AtlasLayer, AtlasTile } from "./types/Atlas";
import Dir from "./types/Dir";
import { AtlasLayerID, Cells, Pixels } from "./types/flavours";

export const tileTag = (
  id: AtlasLayerID,
  type: AtlasTile["type"],
  tile: AtlasTile["tile"],
) => `${type}${id}:${tile.x},${tile.z}`;

export default class DungeonRenderer {
  imageData: Map<string, AtlasTile>;

  constructor(
    public g: Engine,
    public dungeon: Atlas,
    public atlasImage: HTMLImageElement,
    public offset = xy<Pixels>(91, 21),
  ) {
    this.imageData = new Map();
  }

  addAtlas(layers: Atlas["layers"], image: HTMLImageElement) {
    const atlasCanvas = document.createElement("canvas");
    atlasCanvas.width = image.width;
    atlasCanvas.height = image.height;
    const atlasCtx = getCanvasContext(atlasCanvas, "2d", {
      willReadFrequently: true,
    });
    atlasCtx.drawImage(image, 0, 0);

    const promises = [];

    for (const layer of layers) {
      for (const entry of layer.tiles) {
        const imageData = atlasCtx.getImageData(
          entry.coords.x,
          entry.coords.y,
          entry.coords.w,
          entry.coords.h,
        );
        const tmpCanvas = document.createElement("canvas");
        tmpCanvas.width = entry.coords.w;
        tmpCanvas.height = entry.coords.h;
        const tmpCtx = getCanvasContext(tmpCanvas, "2d");
        if (entry.flipped) {
          const data = this.flipImage(
            entry.coords.w,
            entry.coords.h,
            imageData.data,
          );
          imageData.data.set(data);
        }
        tmpCtx.putImageData(imageData, 0, 0);

        this.imageData.set(tileTag(layer.id, entry.type, entry.tile), entry);
        promises.push(
          createImageBitmap(imageData).then((bmp) => {
            entry.image = bmp;
            return entry;
          }),
        );
      }
    }

    return Promise.all(promises);
  }

  getImage(id: AtlasLayerID, type: AtlasTile["type"], x: Cells, z: Cells) {
    const tag = tileTag(id, type, { x, z });
    return this.imageData.get(tag);
  }

  flipImage(w: Pixels, h: Pixels, data: Uint8ClampedArray) {
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

  getLayersOfType(type: AtlasLayer["type"]) {
    return this.dungeon.layers.filter((layer) => layer.type === type);
  }

  project(x: Cells, z: Cells): [x: Pixels, y: Pixels] {
    const { facing, position } = this.g;

    switch (facing) {
      case Dir.N:
        return [position.x + x, position.y + z];
      case Dir.E:
        return [position.x - z, position.y + x];
      case Dir.S:
        return [position.x - x, position.y - z];
      case Dir.W:
        return [position.x + z, position.y - x];
    }
  }

  draw(result: AtlasTile) {
    const dx = result.screen.x - (result.flipped ? result.coords.w : 0);
    const dy = result.screen.y;
    this.g.ctx.drawImage(result.image, dx + this.offset.x, dy + this.offset.y);
  }

  drawFront(result: AtlasTile, x: Cells) {
    const dx = result.screen.x + x * result.coords.fullWidth;
    const dy = result.screen.y;
    this.g.ctx.drawImage(result.image, dx + this.offset.x, dy + this.offset.y);
  }

  drawImage(id: AtlasLayerID, type: AtlasTile["type"], x: Cells, z: Cells) {
    const result = this.getImage(id, type, x, z);
    if (result) this.draw(result);
  }

  drawFrontImage(
    id: AtlasLayerID,
    type: AtlasTile["type"],
    x: Cells,
    z: Cells,
  ) {
    const result = this.getImage(id, type, 0, z);
    if (result) this.drawFront(result, x);
  }

  render() {
    const rightSide = rotate(this.g.facing, 1);
    const leftSide = rotate(this.g.facing, 3);

    // get list of tiles to draw
    const tiles = getFieldOfView(
      this.g,
      this.dungeon.width,
      this.dungeon.depth,
    );
    for (const pos of tiles) {
      const cell = this.g.getCell(pos.x, pos.y);
      if (!cell) continue;

      if (cell.ceiling) this.drawImage(cell.ceiling, "ceiling", pos.dx, pos.dz);
      if (cell.floor) this.drawImage(cell.floor, "floor", pos.dx, pos.dz);
    }

    for (const pos of tiles) {
      const cell = this.g.getCell(pos.x, pos.y);
      if (!cell) continue;
      // console.log(pos, cell);

      if (pos.leftVisible) {
        const left = cell.sides[leftSide];
        if (left?.wall) this.drawImage(left.wall, "side", pos.dx - 1, pos.dz);
        if (left?.decal) this.drawImage(left.decal, "side", pos.dx - 1, pos.dz);
      }
      if (pos.rightVisible) {
        const right = cell.sides[rightSide];
        if (right?.wall) this.drawImage(right.wall, "side", pos.dx + 1, pos.dz);
        if (right?.decal)
          this.drawImage(right.decal, "side", pos.dx + 1, pos.dz);
      }

      const front = cell.sides[this.g.facing];
      if (front?.wall)
        this.drawFrontImage(front.wall, "front", pos.dx, pos.dz - 1);
      if (front?.decal)
        this.drawFrontImage(front.decal, "front", pos.dx, pos.dz - 1);

      if (cell.object)
        this.drawFrontImage(cell.object, "object", pos.dx, pos.dz);
    }
  }
}
