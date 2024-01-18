import fs from 'fs'
import os from 'os'
import path from 'path'
import crypto from 'crypto'

import { RESPONSE_HEADER } from '@/constants'

import type { Response } from './index.d'

// 获取网络接口列表
const networkInterfaces = os.networkInterfaces()


export function setResponseHeader(
  res: Response,
  header: {
    [key in RESPONSE_HEADER]: string | string[]
  },
) {
  for (const key in header) {
    const headerValue = header[key].toString()

    if (Array.isArray(headerValue)) {
      res.setHeader(key, headerValue.join(','))
      continue
    }

    res.setHeader(key, header[key])
  }
}

export function hashString(inputString: string) {
  const hash = crypto.createHash('sha256')
  hash.update(inputString)
  return hash.digest('hex')
}

export function getIp() {
  const result = {}

  // 遍历网络接口列表，找到 IPv4 地址
  Object.keys(networkInterfaces).forEach((interfaceName) => {
    const interfaces = networkInterfaces[interfaceName] || []
    for (const iface of interfaces) {
      if (iface.family === 'IPv4' && !iface.internal) {
        result['ipv4'] = iface.address
      }
    }
  })

  return result as { ipv4: string }
}

// 缓存到内存的文件内容
const memoryCache = {}
function readFolderToMemory(
  folderPath: string,
  parentFolder = '',
  excludedFolders: string[] = [],
) {
  const files = fs.readdirSync(folderPath)

  files.forEach((file: string) => {
    const filePath = path.join(folderPath, file)
    // => 父文件夹名字/子文件夹名字/子文件名字
    // => article/0_base/index.md
    const key = path.join(parentFolder, file)?.replace(/\\/g, '/')

    // 检查是否在排除列表中
    if (!excludedFolders.includes(file)) {
      if (fs.statSync(filePath).isDirectory()) {
        // 如果是文件夹，则递归读取，并传递当前文件夹作为父级
        readFolderToMemory(filePath, key, excludedFolders)
      } else {
        const content = fs.readFileSync(filePath, 'utf8')
        memoryCache[key] = content
      }
    }
  })
}
const readFilePath = 'D:\\code\\yomua\\dist'
// 递归读取指定目录内每个文件的内容
// readFolderToMemory(readFilePath, "", ["node_modules"]);
