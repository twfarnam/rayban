import { ThemeProvider } from 'styled-components'
import App from './app'
import LanguageProvider from './language_provider'

const theme = {
  red: 'hsl(1deg 78% 51%)',
  gridColor: '#222',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
}

export default function Root(): React.ReactElement {
  return (
    <ThemeProvider theme={theme}>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </ThemeProvider>
  )
}
