import { createReadStream, statSync } from 'fs'
import { join } from 'path'
import * as functions from 'firebase-functions'

export const instagramRedirect = functions.https.onRequest(
  (request, response) => {
    try {
      const isSocial = /Instagram|FBAN/i.test(
        request.headers['user-agent'] ?? '',
      )
      const isAndroid = /Android/i.test(request.headers['user-agent'] ?? '')
      const isIOS = /iOS/i.test(request.headers['user-agent'] ?? '')
      if (isSocial && isAndroid) {
        response.setHeader('Content-Type', 'application/pdf')
        response.setHeader('Content-Disposition', 'inline; filename= blablabla')
        response.setHeader('Content-Transfer-Encoding', 'binary')
        response.setHeader('Accept-Ranges', 'bytes')
        response.send('')
      } else if (isSocial && isIOS) {
        const path = join(__dirname, '../instagram-ios.html')
        const stat = statSync(path)
        response.writeHead(200, {
          'Content-Type': 'text/html; charset=utf-8',
          'Content-Length': stat.size,
        })
        createReadStream(path).pipe(response)
      } else {
        response.status(302)
        response.setHeader('Location', 'https://theiconseriesmexico.com')
        response.send('')
      }
    } catch (error) {
      console.error(error)
    }
  },
)
