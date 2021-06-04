import { useEffect, useRef } from 'react'
import { isMexico } from '../config'

interface ChartProps {
  config: any
}

export default function Chart({ config }: ChartProps) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!ref.current) return
    // @ts-ignore
    const chart = new gapi.analytics.googleCharts.DataChart({
      ...config,
      chart: {
        ...config.chart,
        container: ref.current,
        options: { width: '500' },
      },
    })
    chart
      .set({ query: { ids: isMexico ? 'ga:244255611' : 'ga:243980451' } })
      .execute()
  }, [ref.current, JSON.stringify(config)])

  return <div ref={ref} />
}
