import copy from '../copy'
import Button from './button'
import CenterContainer from './center_container'
import Heading from './heading'
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
      <Heading>{copy[language].gameOver}</Heading>
      <Button onClick={onPlayAgain}>{copy[language].playAgain}</Button>
    </CenterContainer>
  )
}
