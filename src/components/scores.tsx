import { getDatabase, ref, onValue } from 'firebase/database'
import sortBy from 'lodash/sortBy'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import LoadingAnimation from './loading_animation'

const ScoresBase = styled.div``

const Table = styled.table`
  margin-top: 2rem;

  td {
    padding: 0.8em 1.5em;
  }

  a {
    color: #888;
  }
`

export default function Scores(): React.ReactElement | null {
  const [data, setData] = useState<any[]>([])
  const [error, setError] = useState<Error>()
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    onValue(
      ref(getDatabase(), 'users'),
      (snapshot) => {
        let data = snapshot.val()
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
        setData(data)
        setLoading(false)
      },
      (error) => setError(error),
    )
  }, [])

  if (error) {
    return <h1>{error.message}</h1>
  } else if (loading) {
    return <LoadingAnimation />
  } else {
    return (
      <ScoresBase>
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
}
