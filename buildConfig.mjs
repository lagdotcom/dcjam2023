import CDNModule from "./CDNModule.mjs";
import InkModule from "./InkModule.mjs";

/** @type {import('esbuild').BuildOptions} */
const config = {
  entryPoints: ["src/index.ts"],
  bundle: true,
  sourcemap: true,
  outfile: "docs/bundle.js",
  // minify: true,
  plugins: [CDNModule, InkModule()],
  loader: {
    ".json": "file",
    ".ogg": "file",
    ".png": "file",
  },
};
export default config;
