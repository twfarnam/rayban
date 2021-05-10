import Lottie from 'lottie-react'
import styled from 'styled-components'
import copy from '../copy'
import Button from './button'
import CenterContainer from './center_container'
import Heading from './heading'
import { useLanguage } from './language_provider'

const Logo = styled.img`
  width: 150px;
  margin-bottom: 40px;
`

const LevelHeading = styled(Heading)`
  margin: 0;
  margin-bottom: 0.5em;
`

interface LevelIntroProps {
  level: number
  onNextStep: () => void
  lottieData: Record<string, any>
}

export default function LevelIntro({
  level,
  onNextStep,
  lottieData,
}: LevelIntroProps): React.ReactElement {
  const { language } = useLanguage()

  return (
    <CenterContainer>
      <Logo src="logo.png" />
      {
        // @ts-ignore
        copy[language][`level${level}Intro`].split('\n').map((h, i) => (
          <LevelHeading key={i}>{h}</LevelHeading>
        ))
      }
      {lottieData[`level_${level}_glasses.json`] && (
        <Lottie
          renderer="canvas"
          loop={true}
          autoplay={true}
          animationData={lottieData[`level_${level}_glasses.json`]}
        />
      )}
      <Button onClick={onNextStep}>
        {copy[language].playLevel} {level}
      </Button>
    </CenterContainer>
  )
}
