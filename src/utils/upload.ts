import fs from 'fs'
import path from 'path'
import multer from 'multer'
import log from '@yomua/y-tlog'
import type HTTP from 'http'

import { Request, Response } from './index.d'

type ModifyRequest = HTTP.IncomingMessage & {
  files: { [key: string]: string }[]
  file: {
    originalname: string
    buffer: Buffer
  }
}

const storage = multer.memoryStorage() // 存储在内存中
const upload = multer({ storage })

const rootDir = process.cwd()

const { dye } = log

function uploadFiles(req: Request, res: Response) {
  const uploadDir = path.join(rootDir, 'picture')

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir)
  }

  const multerUploadArray = upload.array('file')

  // 这里会修改 req 和 res, 所以在以下使用 req 时重新 as 了类型.
  multerUploadArray(req, res, (err: Error) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' })
      res.end('文件上传失败')
      log(dye.error('文件上传失败: '), `${err.message}`)
      return
    }

    let i = 0
    let filesLength = (req as ModifyRequest).files.length
    ;(req as ModifyRequest).files.forEach(async (file) => {
      const fileName = decodeURIComponent(escape(file.originalname))
      const filePath = path.join(uploadDir, fileName)
      fs.writeFile(filePath, file.buffer, 'binary', (err) => {
        if (err) {
          log(dye.error('文件写入失败: '), `${err.message}`)
          res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' })
          res.end('文件写入失败')
          return
        }

        i += 1

        log(`${fileName} 上传成功`)

        if (i === filesLength) {
          log(`所有文件上传成功, 总个数为: ${i}`)
          res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' })
          res.end('文件上传成功')
        }
      })
    })
  })
}

function uploadFile(req: Request, res: Response) {
  const uploadDir = path.join(rootDir, 'picture')

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir)
  }

  const multerUpload = upload.single('file')

  multerUpload(req, res, (err: Error) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' })
      res.end('文件上传失败')
      log(dye.error('文件上传失败: '), `${err.message}`)
      return
    }

    const fileName = decodeURIComponent(
      escape((req as ModifyRequest).file.originalname),
    )

    const filePath = path.join(uploadDir, fileName)

    fs.writeFile(
      filePath,
      (req as ModifyRequest).file.buffer,
      'binary',
      (err) => {
        if (err) {
          log(dye.error('文件写入失败: '), `${err.message}`)
          res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' })
          res.end('文件写入失败')
          return
        }

        log(fileName, dye.success('上传成功'))
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' })
        res.end(`${fileName} 上传成功`)
      },
    )
  })
}

export { uploadFile, uploadFiles }
