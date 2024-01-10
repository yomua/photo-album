import typescript from "@rollup/plugin-typescript";

const DEFAULT_PLUGINS = [
  typescript({
    // 编译 typescript
    compilerOptions: { lib: ["es5", "es6", "dom"], target: "es5" },
  }),
];

const input = "lib/index.js";

export default [
  {
    input: input,
    output: {
      file: `dist/index.js`,
      format: "es",
    },
    plugins: [...DEFAULT_PLUGINS],
  },
  {
    input: input,
    output: {
      file: `dist/cjs/index.js`,
      format: "cjs",
    },
    plugins: [...DEFAULT_PLUGINS],
  },
];
