import resolve from "@rollup/plugin-node-resolve";
import babel from "rollup-plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import { string } from "rollup-plugin-string";

import pkg from "./package.json" assert { type: "json" };

export default [
  {
    input: "src/index.js",
    output: [
      {
        file: pkg.main,
        format: "cjs",
        sourcemap: true,
      },
      {
        file: pkg.module,
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve({ extensions: [".jsx", ".js"] }),
      string({ include: "**/*.glsl" }),
      commonjs(),
      babel({
        extensions: [".jsx", ".js", ".tsx"],
        exclude: "node_modules/**",
        presets: ["@babel/preset-react"],
      }),
      terser(),
    ],
  },
];
