import typescript from 'rollup-plugin-typescript2'
export default [
  {
    input: './src/index.ts',
    output: {
      file: './lib/index.esm.js',
      format: 'esm',
      sourcemap: true
    },
    plugins: [typescript()]
  },
  {
    input: './src/index.ts',
    output: {
      file: './lib/index.js',
      format: 'cjs',
      sourcemap: true
    },
    plugins: [typescript()]
  }
]
