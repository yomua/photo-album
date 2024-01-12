# 概述

上传照片到本地计算机

# 快速开始

1.  `yarn`

    `npm install`

2.  `yarn start`

    `npm run start`

# Dep

- [@yomua/y-server](https://www.npmjs.com/package/@yomua/y-server)

  轻便的 node 服务库, 用来启动项目.

- [@yomua/y-tlog](https://www.npmjs.com/package/@yomua/y-tlog)

  轻便的日志系统, 同时能提供终端日志染色功能.

- [chalk](https://www.npmjs.com/package/chalk)

  用来对终端日志进行染色

- [multer](https://www.npmjs.com/package/multer)

  仅处理 multipart/form-data 类型的文件.

# DevDep

- [@rollup/plugin-typescript](https://www.npmjs.com/package/@rollup/plugin-typescript)

  让 rollup 支持 typescript 的编译插件

  - [@types/node](https://www.npmjs.com/package/@types/node)

  支持 node 内置模块, 变量等类型

- [nodemon](https://www.npmjs.com/package/nodemon)

  允许热更新

- [only-allow](https://www.npmjs.com/package/only-allow)

  仅允许 pnpm 包管理工具

- [prettier](<(https://www.npmjs.com/package/prettier)>)

  代码格式化

- [rollup](<(https://www.npmjs.com/package/rollup)>)

  用来打包 tsc 编译后的文件

- [rollup-plugin-bundleutils](https://www.npmjs.com/package/rollup-plugin-bundleutils)

  压缩代码, tree shaking 之类的

- [rollup-plugin-delete](https://www.npmjs.com/package/rollup-plugin-delete)

  打包时, 允许删除指定包

- [tsc-alias](https://www.npmjs.com/package/tsc-alias)

  编译 tsconfig.json 指定的别名

- [tslib](https://www.npmjs.com/package/tslib)

  tsc 编译时需要

- [typescript](https://www.npmjs.com/package/typescript)

  支持 .ts 文件, 同时内置 tsc

# FAQ

## 为什么都使用 .js 扩展名引入模块?

这是因为如果使用 tsc 方式编译 ts 文件, 如果没有特别的配置 (如: tsc-alias),

是不会自动处理没有扩展名, 省略 index.js 的情况

-> `import utils from '@/utils`,

如果是这样的形式导入, 那么对于 ESModule 来说 [node 是无法识别的](https://www.zhihu.com/question/453620623), 所以需要让模块的 URL 更具体.

- <u>那为什么不是用 .ts 呢? </u>

答案还是因为如果没有特别的配置, tsc 编译时, 并不会编译后缀名, 所以到编译成 .js 文件就会成为:

-> `import utils from '@/utils/index.ts'`

这样依然识别不到 index.ts, 所以需要使用 .js
