import del from 'rollup-plugin-delete'
import { terser } from 'rollup-plugin-bundleutils'
import typescript from '@rollup/plugin-typescript'

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        dir: `dist`,
        format: 'es',
        plugins: [
          // 压缩代码, tree shaking
          terser(),
        ],
      },
    ],
    plugins: [
      // 打包前删除指定文件
      del({ targets: 'dist/*' }),

      // 解析 ts
      typescript({
        compilerOptions: { lib: ['es5', 'es6', 'dom'], target: 'es5' },
      }),
    ],
  },
]
