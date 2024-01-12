import type HTTP from 'http'

export type Request = HTTP.IncomingMessage
export type Response = HTTP.ServerResponse<HTTP.IncomingMessage> & {
  req: HTTP.IncomingMessage
}
