import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import LoadingScreen from './components/loading_screen'
import './index.css'

const Root = React.lazy(
  () => import(/* webpackChunkNam: "root" */ './components/root'),
)

ReactDOM.render(
  <Suspense fallback={<LoadingScreen />}>
    <Root />
  </Suspense>,
  document.querySelector('#app'),
)
