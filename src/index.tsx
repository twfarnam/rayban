// @ts-nocheck
import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import LoadingScreen from './components/loading_screen'
import { isMexico } from './config'
import './index.css'

window.dataLayer = window.dataLayer || []
function gtag() {
  dataLayer.push(arguments)
}
gtag('js', new Date())
gtag('config', isMexico ? 'UA-195304155-2' : 'UA-195304155-1')

const Root = React.lazy(
  () => import(/* webpackChunkNam: "root" */ './components/root'),
)

ReactDOM.render(
  <Suspense fallback={<LoadingScreen />}>
    <Root />
  </Suspense>,
  document.querySelector('#app'),
)
