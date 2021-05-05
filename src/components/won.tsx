import copy from '../copy'
import Button from './button'
import CenterContainer from './center_container'
import Header from './header'
import { useLanguage } from './language_provider'

interface WonProps {
  onPlayAgain: () => void
}

export default function Won({ onPlayAgain }: WonProps): React.ReactElement {
  const { language } = useLanguage()
  return (
    <CenterContainer>
      <Header>{copy[language].won}</Header>
      <Button onClick={onPlayAgain}>{copy[language].playAgain}</Button>
    </CenterContainer>
  )
}
