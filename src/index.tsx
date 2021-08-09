import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import LoadingScreen from './components/loading_screen'
import './index.css'

console.error('loading...')
const Root = React.lazy(() =>
  // @ts-ignore
  retry(() => {
    console.error('importing...')
    return import(/* webpackChunkNam: "root" */ './components/root')
  }),
)

ReactDOM.render(
  <Suspense fallback={<LoadingScreen />}>
    <Root />
  </Suspense>,
  document.querySelector('#app'),
)

// @ts-ignore
function retry(fn, retriesLeft = 5, interval = 500) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      fn()
        // @ts-ignore
        .then((data) => {
          console.error('import worked')
          resolve(data)
        })
        // @ts-ignore
        .catch((error) => {
          console.error('retrying import', error)
          setTimeout(() => {
            if (retriesLeft === 1) {
              // reject('maximum retries exceeded');
              reject(error)
              return
            }

            // Passing on "reject" is the important part
            retry(fn, retriesLeft - 1, interval).then(resolve, reject)
          }, interval)
        })
    }, 20)
  })
}
