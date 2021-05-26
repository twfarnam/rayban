import styled from 'styled-components'
import { mobileBreakpoint } from '../utility'
import Button from './button'
import CenterContainer from './center_container'
import GlassesAnimation from './glasses_animation'
import Heading from './heading'
import { useLanguage } from './language_provider'

const Logo = styled.img`
  margin-bottom: 2rem;

  @media ${mobileBreakpoint} {
    width: 100px;
  }
`

const LevelHeading = styled(Heading)`
  margin: 0;
  font-size: 1.5rem;

  @media ${mobileBreakpoint} {
    font-size: 1.2rem;
  }
`

const Copy = styled.p`
  text-align: center;
  font-size; 1.2rem;
  max-width: 600px;

  @media ${mobileBreakpoint} {
    font-size; 1rem;
  }
`

interface LevelOutroProps {
  level: number
  onNextStep: () => void
  lottieData: Record<string, any>
}

export default function LevelOutro({
  level,
  onNextStep,
  lottieData,
}: LevelOutroProps): React.ReactElement {
  const { getTranslation } = useLanguage()

  return (
    <CenterContainer>
      <Logo src="logo_and_icon_series.svg" />
      <LevelHeading>
        {
          // @ts-ignore
          getTranslation(`level${level}Header`)
        }
      </LevelHeading>
      <GlassesAnimation level={level} lottieData={lottieData} />
      <Copy>
        {
          // @ts-ignore
          getTranslation(`level${level}Copy`)
        }
      </Copy>
      <Button onClick={onNextStep}>
        {
          // @ts-ignore
          getTranslation('nextLevel')
        }
      </Button>
    </CenterContainer>
  )
}
