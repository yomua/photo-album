import server from '@yomua/y-server'
import log from './utils/log.js'

// import chalk from '../node_modules/@yomua/y-tlog/dist/index.js'
import tlog from '@yomua/y-tlog'

tlog(tlog.success("'__ff'"))

import { RESPONSE_HEADER } from '@/constants.js'
import { uploadFile, uploadFiles } from '@/utils/upload.js'
import { setResponseHeader, getIp } from '@/utils/index.js'

const { ipv4 } = getIp()

const app = server()

const PORT = 4000

app.listener('/upload', (req, res) => {
  uploadFile(req, res)
})

app.listener('/upload_files', (req, res) => {
  uploadFiles(req, res)
})

app.cors((_, res) => {
  setResponseHeader(res, {
    [RESPONSE_HEADER.ACCESS_CONTROL_ALLOW_ORIGIN]: 'http://192.168.3.143:8000',
    [RESPONSE_HEADER.ACCESS_CONTROL_ALLOW_METHODS]: 'POST',
    [RESPONSE_HEADER.ACCESS_CONTROL_ALLOW_HEADERS]: [
      'X-Requested-With',
      'Content-Type',
    ],
    [RESPONSE_HEADER.ACCESS_CONTROL_ALLOW_CREDENTIALS]: 'true',
  })
})

app.start(PORT, (port: number) => {
  log(log.success('   <------------------------------------------------>'))

  log(
    log.info(log.success('   |'), 'Server is running at '),
    log.success(`http://localhost:${port}      |`),
  )

  log(
    log.success('   |'),
    log.info('Server is running at '),
    log.success(`http://${ipv4}:${port}  |`),
  )
  log(log.success('   <------------------------------------------------>'))
})
