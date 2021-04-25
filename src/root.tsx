import { ThemeProvider } from 'styled-components'
import App from './app'

const theme = {
  red: 'hsl(1deg 78% 51%)',
  gridColor: '#444',
}

export default function Root(): React.ReactElement {
  return (
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  )
}
