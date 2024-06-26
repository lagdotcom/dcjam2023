import Atlas from "./types/Atlas";
import { InkSource, ResourceURL } from "./types/flavours";
import { GCMap } from "./types/GCMap";

export default class ResourceManager {
  promises: Map<ResourceURL, Promise<unknown>>;
  loaders: Promise<unknown>[];
  atlases: Record<ResourceURL, Atlas>;
  audio: Record<ResourceURL, HTMLAudioElement>;
  maps: Record<ResourceURL, GCMap>;
  images: Record<ResourceURL, HTMLImageElement>;
  scripts: Record<ResourceURL, InkSource>;
  loaded: number;
  loading: number;

  constructor() {
    this.promises = new Map();
    this.loaders = [];
    this.atlases = {};
    this.audio = {};
    this.images = {};
    this.maps = {};
    this.scripts = {};
    this.loaded = 0;
    this.loading = 0;
  }

  private start<T>(src: ResourceURL, promise: Promise<T>) {
    this.loading++;

    this.promises.set(src, promise);
    this.loaders.push(
      promise.then((arg) => {
        this.loaded++;
        return arg;
      }),
    );
    return promise;
  }

  loadImage(src: ResourceURL): Promise<HTMLImageElement> {
    const res = this.promises.get(src);
    if (res) return res as Promise<HTMLImageElement>;

    return this.start(
      src,
      new Promise<HTMLImageElement>((resolve) => {
        const img = new Image();
        img.src = src;

        img.addEventListener("load", () => {
          this.images[src] = img;
          resolve(img);
        });
      }),
    );
  }

  loadAtlas(src: ResourceURL): Promise<Atlas> {
    const res = this.promises.get(src);
    if (res) return res as Promise<Atlas>;

    return this.start(
      src,
      fetch(src)
        .then<Atlas>((r) => r.json())
        .then((atlas) => {
          this.atlases[src] = atlas;
          return atlas;
        }),
    );
  }

  loadGCMap(src: ResourceURL): Promise<GCMap> {
    const res = this.promises.get(src);
    if (res) return res as Promise<GCMap>;

    return this.start(
      src,
      fetch(src)
        .then<GCMap>((r) => r.json())
        .then((map) => {
          this.maps[src] = map;
          return map;
        }),
    );
  }

  loadScript(src: ResourceURL): Promise<string> {
    const res = this.promises.get(src);
    if (res) return res as Promise<string>;

    return this.start(
      src,
      fetch(src)
        .then((r) => r.text())
        .then((script) => {
          this.scripts[src] = script;
          return script;
        }),
    );
  }

  loadAudio(src: ResourceURL): Promise<HTMLAudioElement> {
    const res = this.promises.get(src);
    if (res) return res as Promise<HTMLAudioElement>;

    return this.start(
      src,
      new Promise<HTMLAudioElement>((resolve) => {
        const audio = new Audio();
        audio.src = src;

        audio.addEventListener("canplaythrough", () => {
          this.audio[src] = audio;
          resolve(audio);
        });
      }),
    );
  }
}
