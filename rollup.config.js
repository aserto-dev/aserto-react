import external from 'rollup-plugin-peer-deps-external'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { babel } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import multiInput from 'rollup-plugin-multi-input'


import typescript from '@rollup/plugin-typescript'

import pkg from './package.json'

const makeExternalPredicate = (externalArr) => {
  if (externalArr.length === 0) return () => false
  return (id) => new RegExp(`^(${externalArr.join('|')})($|/)`).test(id)
}
const extensions = ['.js', '.jsx', '.ts', '.tsx']

const config = {
  input: ['src/index.tsx', 'src/components/**/index.tsx', 'src/components/**/index.tsx'],
  preserveModules: false,
  output: [
    {
      dir: 'dist',
      sourcemapPathTransform: (relativePath) => {
        return path.relative('src', relativePath)
      },
      format: 'esm',
      sourcemap: false,
    },
  ],
  plugins: [
    // This prevents needing an additional `external` prop in this config file by automaticall excluding peer dependencies
    typescript({
      sourceMap: false,
    }),
    peerDepsExternal(),
    // Convert CommonJS modules to ES6
    commonjs({ include: 'node_modules/**' }),
    external(),
    babel({
      babelHelpers: 'runtime',
      extensions,
      include: ['src/**/*'],
      exclude: 'node_modules/**',
      babelrc: true,
    }),
    nodeResolve({ extensions }),
    multiInput(),
  ],
  external: makeExternalPredicate(
    Object.keys(pkg.peerDependencies || {}).concat(Object.keys(pkg.dependencies || {}))
  ),
}

export default config
