import { initializeApp } from 'firebase/app'
import {
  User,
  onAuthStateChanged,
  getAuth,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth'
import { getDatabase, ref, push, onValue } from 'firebase/database'
import sortBy from 'lodash/sortBy'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

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

const provider = new GoogleAuthProvider()

const ScoresBase = styled.div`
  font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;
  color: #333;
`

const Table = styled.table`
  td {
    padding: 0.3em 0.5em;
  }
`

export default function Scores(): React.ReactElement | null {
  const [user, setUser] = useState<any>()
  const [data, setData] = useState<any[]>([])
  const [error, setError] = useState<Error>()
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const auth = getAuth()
    onAuthStateChanged(auth, (user: User) => {
      if (user && user.isAnonymous) {
        signOut(auth)
        setLoading(false)
        return
      }
      setUser(user)
      if (!user) {
        setLoading(false)
      } else {
        onValue(
          ref(getDatabase(), 'users'),
          (snapshot) => {
            console.log('huh')
            let data = snapshot.val()
            console.log(data)
            data = Object.keys(data).map((id) => ({
              id,
              ...data[id],
            }))
            data.reverse()
            data = data.filter((d: any) => d.scores)
            data.forEach((d: any) => {
              d.scores = sortBy(Object.values(d.scores), (s: any) => -s.points)
            })
            data = sortBy(data, (d: any) => -d.scores[0].points)
            console.log(data)
            setData(data)
            setLoading(false)
          },
          (error) => {
            setError(error)
            setLoading(false)
          },
        )
      }
    })
  }, [])

  async function onClickSignIn() {
    try {
      setLoading(true)
      const auth = getAuth()
      const result = await signInWithPopup(auth, provider)
      setUser(result.user)
    } catch (error) {
      console.error(error.email)
      alert(error.message)
    }
  }

  if (loading) return null
  if (error) return <h1>{error.message}</h1>
  if (!user) return <button onClick={onClickSignIn}>Sign in</button>
  return (
    <ScoresBase>
      <p>You are logged in as: {user.email}</p>
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Ticket</th>
            <th>Highest Score</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.id}>
              <td>{d.name}</td>
              <td>{d.phone}</td>
              <td>{d.email}</td>
              <td>
                <a
                  target="_blank"
                  href={`https://firebasestorage.googleapis.com/v0/b/rbsnake-ff049.appspot.com/o/${d.id}?alt=media`}
                  rel="noreferrer">
                  {d.ticket}
                </a>
              </td>
              <td>{d.scores[0].points.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </ScoresBase>
  )
}
