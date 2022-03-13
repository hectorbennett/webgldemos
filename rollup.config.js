import resolve from "@rollup/plugin-node-resolve";
import babel from "rollup-plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import { string } from "rollup-plugin-string";

const packageJson = require("./package.json");

export default [
  {
    // preserveModules: true,
    input: "src/index.js",
    output: [
      {
        file: packageJson.main,
        format: "cjs",
        sourcemap: true,
      },
      {
        file: packageJson.module,
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve({ extensions: [".jsx", ".js"] }),
      string({
        // Required to be specified
        include: "**/*.glsl",

        // Undefined by default
        // exclude: ["**/index.html"]
      }),
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
