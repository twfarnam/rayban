import * as functions from 'firebase-functions'

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const instagramRedirect = functions.https.onRequest(
  (request, response) => {
    const isInsta = /Instagram/i.test(request.headers['user-agent'] ?? '')
    const isAndroid = /Android/i.test(request.headers['user-agent'] ?? '')
    const isIOS = /iOS/i.test(request.headers['user-agent'] ?? '')
    if (isInsta && isAndroid) {
      response.setHeader('Content-Type', 'application/pdf')
      response.setHeader('Content-Disposition', 'inline; filename= blablabla')
      response.setHeader('Content-Transfer-Encoding', 'binary')
      response.setHeader('Accept-Ranges', 'bytes')
      response.send('')
    } else if (isInsta && isIOS) {
      response.status(302)
      response.setHeader(
        'Location',
        'https://storage.googleapis.com/rb-snake-static/instagram-ios.html',
      )
      response.send('')
    } else {
      response.status(302)
      response.setHeader('Location', 'https://theiconseriesmexico.com')
      response.send('')
    }
  },
)
