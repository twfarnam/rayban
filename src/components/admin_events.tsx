import styled from 'styled-components'
import { isMexico } from '../config'
import Chart from './chart'

const AdminEventsBase = styled.div`
  display: flex;
  flex-flow: row wrap;
  align-items: stretch;

  & > * {
    flex-grow: 1;
  }
`

interface AdminEventsProps {
  startDate: string
}

export default function AdminEvents({
  startDate,
}: AdminEventsProps): React.ReactElement {
  const queryDefaults = {
    metrics: 'ga:sessions',
    'start-date': startDate,
    'end-date': 'yesterday',
  }

  return (
    <AdminEventsBase>
      <Chart
        title="Traffic Sources"
        config={{
          query: {
            ...queryDefaults,
            dimensions: 'ga:source',
          },
          chart: { type: 'TABLE' },
        }}
      />
      <Chart
        title="Game Events"
        config={{
          query: {
            ...queryDefaults,
            dimensions: 'ga:eventLabel',
            metrics: 'ga:totalEvents',
            sort: 'ga:eventLabel',
            filters: 'ga:eventLabel!=Lost',
          },
          chart: { type: 'TABLE' },
        }}
      />
      {/* <Chart
        title="Time spent on site"
        config={{
          query: {
            ...queryDefaults,
            dimensions: 'ga:sessionDurationBucket',
            // sort: '-ga:sessionDurationBucket',
            // metrics: 'ga:sessionDuration',
            // metrics: 'ga:sessions',
          },
          chart: { type: 'TABLE' },
        }}
      /> */}
      <Chart
        title="Users by Session Count"
        config={{
          query: {
            ...queryDefaults,
            dimensions: 'ga:sessionCount',
            metrics: 'ga:users',
          },
          chart: { type: 'BAR' },
        }}
      />
      <Chart
        title="Returning Visitors"
        config={{
          query: {
            ...queryDefaults,
            dimensions: 'ga:userType',
            metrics: 'ga:sessions',
          },
          chart: { type: 'COLUMN' },
        }}
      />
      <Chart
        title="Device Profile"
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
        title="Operating System"
        config={{
          query: {
            ...queryDefaults,
            dimensions: 'ga:operatingSystem',
            metrics: 'ga:sessions',
          },
          chart: { type: 'COLUMN' },
        }}
      />
      <Chart
        title="Hour of Day"
        config={{
          query: {
            ...queryDefaults,
            dimensions: 'ga:hour',
          },
          chart: { type: 'COLUMN' },
        }}
      />
    </AdminEventsBase>
  )
}
