import { existsSync, readFileSync, writeFileSync } from "fs";

export default class FetchCache {
  constructor(private basePath: string) {}

  getFilename(path: string) {
    return this.basePath + path.replace(/[^a-zA-Z0-9.]/g, "_");
  }

  has(path: string) {
    // TODO expiration
    return existsSync(this.getFilename(path));
  }

  get(path: string) {
    const fullPath = this.getFilename(path);
    console.log("Reading from cache:", path);
    return readFileSync(fullPath, { encoding: "utf-8" });
  }

  set(path: string, data: string) {
    const fullPath = this.getFilename(path);
    console.log("Writing:", fullPath);
    return writeFileSync(fullPath, data, { encoding: "utf-8" });
  }
}
