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
      <Logo src="logo.png" />
      <Heading>
        {
          // @ts-ignore
          copy[language][`level${level}Header`]
        }
      </Heading>
      {lottieData[`level_${level}_glasses.json`] && (
        <Lottie animationData={lottieData[`level_${level}_glasses.json`]} />
      )}
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
