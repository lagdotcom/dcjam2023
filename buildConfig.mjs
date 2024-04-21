/*eslint-env node*/

import { config as loadDotEnvConfig } from "dotenv";

import CDNModule from "./CDNModule.mjs";
import InkModule from "./InkModule.mjs";
import { resolve } from "path";

function getDefines() {
  const envConfig = loadDotEnvConfig();
  const envConfigLocal = loadDotEnvConfig({
    path: resolve(process.cwd(), ".env.local"),
  });

  const define = {
    [`process.env.APP_BUILD_VERSION`]: JSON.stringify(
      process.env.npm_package_version
    ),
  };

  if (envConfig.parsed) {
    for (const [k, v] of Object.entries(envConfig.parsed))
      define[`process.env.${k}`] = JSON.stringify(v);
    console.log(`[env] loaded ${Object.keys(envConfig.parsed).length} values`);
  } else
    console.warn(
      `[env] failed to load, ${envConfig.error?.message ?? "unknown error"}`
    );

  if (envConfigLocal.parsed) {
    for (const [k, v] of Object.entries(envConfigLocal.parsed))
      define[`process.env.${k}`] = JSON.stringify(v);
    console.log(
      `[env] loaded ${Object.keys(envConfigLocal.parsed).length} values (.local)`
    );
  }

  return define;
}

/** @type {import('esbuild').BuildOptions} */
const config = {
  entryPoints: ["src/index.ts"],
  bundle: true,
  sourcemap: true,
  outfile: "docs/bundle.js",
  define: getDefines(),
  // minify: true,
  plugins: [CDNModule, InkModule()],
  loader: {
    ".json": "file",
    ".ogg": "file",
    ".png": "file",
  },
};
export default config;
