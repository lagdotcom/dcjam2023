/*eslint-env node*/
import { config as loadDotEnvConfig } from "dotenv";
import CDNModule from "./CDNModule.mjs";

loadDotEnvConfig();
const define = {};

for (const k in process.env)
  if (k.startsWith("APP_"))
    define[`process.env.${k}`] = JSON.stringify(process.env[k]);
console.log(`Loaded ${Object.keys(define).length} values from .env`);

/** @type {import('esbuild').BuildOptions} */
const config = {
  entryPoints: ["src/index.ts"],
  bundle: true,
  sourcemap: true,
  outfile: "docs/bundle.js",
  define,
  // minify: true,
  plugins: [CDNModule],
  loader: {
    ".dscript": "file",
    ".json": "file",
    ".ogg": "file",
    ".png": "file",
  },
};
export default config;
