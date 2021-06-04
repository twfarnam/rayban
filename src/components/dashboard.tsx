import { useState } from 'react'
// @ts-ignore
import { GoogleProvider } from 'react-analytics-widget'
import styled from 'styled-components'
import Chart from './chart'

const DashboardBase = styled.div`
  font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;
  color: #333;
`

const CLIENT_ID =
  '557763689254-20rmsnqhjnn4tadn7f2970ofdjhk6dp1.apps.googleusercontent.com'

const afterJune6 = Date.now() - new Date(2021, 5, 6).getTime() > 0

export default function Dashboard(): React.ReactElement {
  const [startDate, setStartDate] = useState<string>('7daysAgo')

  const queryDefaults = {
    metrics: 'ga:sessions',
    'start-date': startDate,
    'end-date': 'yesterday',
  }

  function onChangeStartDate(event: React.ChangeEvent<HTMLSelectElement>) {
    setStartDate(event.target.value)
  }

  return (
    <DashboardBase>
      <GoogleProvider clientId={CLIENT_ID}>
        <select value={startDate} onChange={onChangeStartDate}>
          <option value="7daysAgo">7 Days</option>
          <option value="30daysAgo">30 Days</option>
          {afterJune6 && <option value="2021-06-05">Since June 5th</option>}
        </select>
        <h1>General</h1>
        <h2>Activity (Sessions)</h2>
        <Chart
          config={{
            query: {
              ...queryDefaults,
              dimensions: 'ga:date',
            },
            chart: { type: 'LINE' },
          }}
        />
        <h2>Location (Sessions per country)</h2>
        <Chart
          config={{
            query: {
              ...queryDefaults,
              dimensions: 'ga:country',
            },
            chart: { type: 'GEO' },
          }}
        />
        <h2>Access (where do they get from)</h2>
        <Chart
          config={{
            query: {
              dimensions: 'ga:source',
              ...queryDefaults,
            },
            chart: { type: 'TABLE' },
          }}
        />

        <h1>Game</h1>
        <h2>Highest scores (all countries)</h2>
        <h2>Highest scores per country (will give you the country list)</h2>
        <h2>Times the game was completed</h2>
        <Chart
          config={{
            query: {
              ...queryDefaults,
              dimensions: 'ga:eventLabel',
              metrics: 'ga:eventValue, ga:totalEvents',
            },
            chart: { type: 'TABLE' },
          }}
        />

        <h1>Interaction</h1>
        <h2>Time spent on site</h2>
        <Chart
          config={{
            query: {
              ...queryDefaults,
              dimensions: 'ga:sessionDurationBucket',
              sort: '-ga:sessionDurationBucket',
              metrics: 'ga:sessions',
            },
            chart: { type: 'BAR' },
          }}
        />
        <h2>Recurrence</h2>
        <Chart
          config={{
            query: {
              ...queryDefaults,
              dimensions: 'ga:userType',
              metrics: 'ga:sessions',
            },
            chart: { type: 'COLUMN' },
          }}
        />
        <h2>Devices</h2>
        <Chart
          config={{
            query: {
              ...queryDefaults,
              dimensions: 'ga:deviceCategory',
              metrics: 'ga:sessions',
            },
            chart: { type: 'COLUMN' },
          }}
        />
        <Chart
          config={{
            query: {
              ...queryDefaults,
              dimensions: 'ga:operatingSystem',
              metrics: 'ga:sessions',
            },
            chart: { type: 'COLUMN' },
          }}
        />
      </GoogleProvider>
    </DashboardBase>
  )
}
