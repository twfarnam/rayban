// @ts-nocheck
import { initializeApp } from 'firebase/app'
import ReactDOM from 'react-dom'
import Admin from './components/admin'
import './admin.css'

initializeApp({
  apiKey: 'AIzaSyDFWdpyMJBkmhsDKokKHiwSo8YLE2LGvsc',
  authDomain: 'rbsnake-ff049.firebaseapp.com',
  databaseURL: 'https://rbsnake-ff049-default-rtdb.firebaseio.com',
  projectId: 'rbsnake-ff049',
  storageBucket: 'rbsnake-ff049.appspot.com',
  messagingSenderId: '557763689254',
  appId: '1:557763689254:web:cb02638a9061b641e81fe7',
  measurementId: 'G-SLTRPE28N4',
})
;(function (w, d, s, g, js, fjs) {
  g = w.gapi || (w.gapi = {})
  g.analytics = {
    q: [],
    ready: function (cb) {
      this.q.push(cb)
    },
  }
  js = d.createElement(s)
  fjs = d.getElementsByTagName(s)[0]
  js.src = 'https://apis.google.com/js/platform.js'
  fjs.parentNode.insertBefore(js, fjs)
  js.onload = function () {
    g.load('analytics')
  }
})(window, document, 'script')

ReactDOM.render(<Admin />, document.querySelector('#app'))
