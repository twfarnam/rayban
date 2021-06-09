import styled from 'styled-components'
import { isMexico } from '../config'
import Chart from './chart'

const AdminTrafficBase = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: flex-start;
`

interface AdminTrafficProps {
  startDate: string
}

export default function AdminTraffic({
  startDate,
}: AdminTrafficProps): React.ReactElement {
  const queryDefaults = {
    metrics: 'ga:sessions',
    'start-date': startDate,
    'end-date': 'yesterday',
  }

  return (
    <AdminTrafficBase>
      <Chart
        title="Sessions"
        config={{
          query: {
            ...queryDefaults,
            dimensions: 'ga:date',
          },
          chart: { type: 'LINE', options: { width: '800' } },
        }}
      />
      {!isMexico && (
        <>
          <Chart
            title="Location"
            config={{
              query: {
                ...queryDefaults,
                dimensions: 'ga:country',
              },
              chart: { type: 'GEO' },
            }}
          />
        </>
      )}
    </AdminTrafficBase>
  )
}
