import log from '@yomua/y-tlog'
import server from '@yomua/y-server'

import { RESPONSE_HEADER } from '@/constants'
import { uploadFile, uploadFiles } from '@/utils/upload'
import { setResponseHeader, getIp } from '@/utils/index'

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
    [RESPONSE_HEADER.ACCESS_CONTROL_ALLOW_METHODS]: ['POST', 'PUT'],
    [RESPONSE_HEADER.ACCESS_CONTROL_ALLOW_HEADERS]: [
      'X-Requested-With',
      'Content-Type',
    ],
    [RESPONSE_HEADER.ACCESS_CONTROL_ALLOW_CREDENTIALS]: 'true',
  })
})

const { dye } = log

app.start(PORT, (port: number) => {
  log(dye.success('   <------------------------------------------------>'))

  log(
    dye.info(dye.success('   |'), 'Server is running at '),
    dye.success(`http://localhost:${port}      |`),
  )

  log(
    dye.success('   |'),
    dye.info('Server is running at '),
    dye.success(`http://${ipv4}:${port}  |`),
  )
  log(dye.success('   <------------------------------------------------>'))
})
