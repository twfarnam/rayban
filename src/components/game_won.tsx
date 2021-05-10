import Lottie from 'lottie-react'
import styled from 'styled-components'
import copy from '../copy'
import Button from './button'
import CenterContainer from './center_container'
import Heading from './heading'
import { useLanguage } from './language_provider'

const Confetti = styled(Lottie)`
  position: absolute;
  transform: translate(-30%, 10%);
  & + & {
    transform: translate(30%, -30%);
  }
  & + & + & {
    transform: scale(0.5) translate(-20%, -10%);
  }
  & + & + & + & {
    transform: scale(0.5) translate(30%, 30%);
  }

  @media (max-width: 800px) {
    transform: translate(-90%, 10%);
    & + & {
      transform: translate(90%, 10%);
    }
    & + & + & {
      transform: scale(0.5) translate(-50%, -5%);
    }
    & + & + & + & {
      transform: scale(0.5) translate(60%, 30%);
    }
  }
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
        <>
          <Confetti animationData={lottieData[`confetti.json`]} />
          <Confetti animationData={lottieData[`confetti.json`]} />
          <Confetti animationData={lottieData[`confetti.json`]} />
          <Confetti animationData={lottieData[`confetti.json`]} />
        </>
      )}
      <Button onClick={onPlayAgain}>{copy[language].playAgain}</Button>
    </CenterContainer>
  )
}
