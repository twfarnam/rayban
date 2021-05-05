import copy from '../copy'
import Button from './button'
import CenterContainer from './center_container'
import Header from './header'
import { useLanguage } from './language_provider'

interface GameOverProps {
  onPlayAgain: () => void
}

export default function GameOver({
  onPlayAgain,
}: GameOverProps): React.ReactElement {
  const { language } = useLanguage()
  return (
    <CenterContainer>
      <Header>{copy[language].gameOver}</Header>
      <Button onClick={onPlayAgain}>{copy[language].playAgain}</Button>
    </CenterContainer>
  )
}
