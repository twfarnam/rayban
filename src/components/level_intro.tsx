import styled from 'styled-components'
import copy from '../copy'
import { mobileBreakpoint } from '../utility'
import Button from './button'
import CenterContainer from './center_container'
import GlassesAnimation from './glasses_animation'
import Heading from './heading'
import { useLanguage } from './language_provider'

const LevelHeading = styled(Heading)`
  margin: 0;
  margin-bottom: 0.5em;
`

const Logo = styled.img`
  margin-bottom: 2rem;

  @media ${mobileBreakpoint} {
    width: 100px;
  }
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
      <Logo src="logo_and_icon_series.svg" />
      <GlassesAnimation level={level} lottieData={lottieData} />
      <LevelHeading>
        {
          // @ts-ignore
          copy[language][`level${level}Glasses`]
        }
      </LevelHeading>
      <Button onClick={onNextStep}>
        {copy[language].playLevel} {level}
      </Button>
    </CenterContainer>
  )
}
