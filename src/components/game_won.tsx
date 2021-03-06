import Lottie from 'lottie-react'
import styled from 'styled-components'
import Button from './button'
import CenterContainer from './center_container'
import Heading from './heading'
import { useLanguage } from './language_provider'

const GameWonBase = styled(CenterContainer)`
  max-width: 900px;
`

const Fireworks = styled(Lottie)`
  position: absolute;
`

const Copy = styled.p`
  text-align: center;
  font-size: 1.3em;
`

interface GameWonProps {
  onPlayAgain: () => void
  showPrizeInfo: boolean
  points: number
  lottieData: Record<string, any>
}

export default function GameWon({
  onPlayAgain,
  showPrizeInfo,
  points,
  lottieData,
}: GameWonProps): React.ReactElement {
  const { getTranslation } = useLanguage()
  return (
    <GameWonBase>
      <Heading>{getTranslation('won')}</Heading>
      {showPrizeInfo && (
        <Copy>
          Ya estás participando por un Guitar Hero, tu puntaje es:{' '}
          {points?.toLocaleString()}
          <br />
          Los ganadores se anunciarán el 2 de Agosto 2021
        </Copy>
      )}
      {lottieData[`confetti.json`] && (
        <Fireworks animationData={lottieData[`confetti.json`]} />
      )}
      <Button onClick={onPlayAgain}>{getTranslation('playAgain')}</Button>
    </GameWonBase>
  )
}
