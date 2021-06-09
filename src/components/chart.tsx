import { useEffect, useState, useRef } from 'react'
import styled from 'styled-components'
import { isMexico } from '../config'

const red = '#E42421'
const black = '#222'

const ChartBase = styled.div`
  background: ${black};
  padding: 1rem;
  margin: 1rem;
  border-radius: 1rem;

  .gapi-analytics-data-chart .google-visualization-table-table,
  .gapi-analytics-data-chart .gapi-analytics-data-chart-styles-table-tr-odd {
    background: none;
  }
`

const Title = styled.div`
  font-weight: 500;
  margin-bottom: 1rem;
`

interface ChartProps {
  title: string
  config: any
}

export default function Chart({ title, config }: ChartProps) {
  const [error, setError] = useState<Error>()
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!ref.current) return
    // @ts-ignore
    const chart = new gapi.analytics.googleCharts.DataChart({
      ...config,
      chart: {
        ...config.chart,
        container: ref.current,
        options: {
          width: '500',
          ...config.chart.options,
          backgroundColor: black,
          colorAxis: { colors: ['#ECB4B4', red] },
          colors: [red],
          vAxis: {
            textStyle: {
              color: red,
            },
          },
          hAxis: {
            textStyle: {
              color: red,
            },
          },
          chartArea: {
            backgroundColor: black,
          },
        },
      },
    })
    chart.on('error', ({ error }: any) => {
      console.log('hiya', error)
      setError(error)
    })
    chart
      .set({ query: { ids: isMexico ? 'ga:244255611' : 'ga:243980451' } })
      .execute()
  }, [ref.current, JSON.stringify(config)])

  return (
    <ChartBase>
      <Title>{title}</Title>
      {error && <Title>{error.message}</Title>}
      <div ref={ref} />
    </ChartBase>
  )
}
