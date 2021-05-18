import Lottie from 'lottie-react'
import styled from 'styled-components'
import copy from '../copy'
import Button from './button'
import CenterContainer from './center_container'
import Heading from './heading'
import { useLanguage } from './language_provider'

const Fireworks = styled(Lottie)`
  position: absolute;
`

interface GameWonProps {
  onPlayAgain: () => void
  lottieData: Record<string, any>
}

export default function GameWon({
  onPlayAgain,
  lottieData,
}: GameWonProps): React.ReactElement {
  const { language } = useLanguage()
  return (
    <CenterContainer>
      <Heading>{copy[language].won}</Heading>
      {lottieData[`confetti.json`] && (
        <Fireworks animationData={lottieData[`confetti.json`]} />
      )}
      <Button onClick={onPlayAgain}>{copy[language].playAgain}</Button>
    </CenterContainer>
  )
}
