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
  const { getTranslation } = useLanguage()
  return (
    <CenterContainer>
      <Heading>{getTranslation('gameOver')}</Heading>
      <Button onClick={onPlayAgain}>{getTranslation('playAgain')}</Button>
    </CenterContainer>
  )
}
