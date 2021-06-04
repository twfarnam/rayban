import { initializeApp } from 'firebase/app'
import {
  getAuth,
  User,
  onAuthStateChanged,
  signInAnonymously,
} from 'firebase/auth'
import { isMexico } from './config'

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

export const userRequest = new Promise<User>((resolve, reject) => {
  if (!isMexico) return
  const auth = getAuth()
  onAuthStateChanged(auth, (user) => {
    if (user) {
      resolve(user)
    } else {
      signInAnonymously(auth).catch((error) => reject(error))
    }
  })
})
