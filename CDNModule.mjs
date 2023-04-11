/*eslint-env node*/

const externals = {
  inkjs: "inkjs",
  moo: "moo",
  nearley: "nearley",
};

const filter = new RegExp(
  Object.keys(externals)
    .map((module) => `^${module}$`)
    .join("|")
);

/** @type {import('esbuild').Plugin} */
const module = {
  name: "CDN",
  setup(build) {
    build.onResolve({ filter, namespace: "file" }, (args) => {
      return {
        path: args.path,
        namespace: "cdn",
      };
    });
    build.onLoad({ filter: /.*/, namespace: "cdn" }, (args) => {
      const glob = externals[args.path];
      const exports =
        typeof glob === "function" ? glob() : `globalThis.${glob}`;

      console.log("injected", args.path);
      return {
        contents: `module.exports = ${exports}`,
        loader: "js",
      };
    });
  },
};
export default module;
