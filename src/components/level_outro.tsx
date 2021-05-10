import styled from 'styled-components'
import copy from '../copy'
import Button from './button'
import CenterContainer from './center_container'
import GlassesAnimation from './glasses_animation'
import Heading from './heading'
import { useLanguage } from './language_provider'
import Logo from './logo'

const Copy = styled.p`
  font-size: 1.3em;
  text-align: center;
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
  const { language } = useLanguage()

  return (
    <CenterContainer>
      <Logo />
      <Heading>
        {
          // @ts-ignore
          copy[language][`level${level}Header`]
        }
      </Heading>
      <GlassesAnimation level={level} lottieData={lottieData} />
      <Copy>
        {
          // @ts-ignore
          copy[language][`level${level}Copy`]
        }
      </Copy>
      <Button onClick={onNextStep}>
        {copy[language].goToLevel} {level + 1}
      </Button>
    </CenterContainer>
  )
}
