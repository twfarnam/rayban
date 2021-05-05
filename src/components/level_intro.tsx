import styled from 'styled-components'
import copy from '../copy'
import Button from './button'
import CenterContainer from './center_container'
import Header from './header'
import { useLanguage } from './language_provider'

const Logo = styled.img`
  width: 150px;
  margin-bottom: 40px;
`

const Glasses = styled.img`
  width: 100%;
`

const Copy = styled.p`
  font-size: 1.3em;
  text-align: center;
`

interface LevelIntroProps {
  level: number
  onNextStep: () => void
}

export default function LevelIntro({
  level,
  onNextStep,
}: LevelIntroProps): React.ReactElement {
  const { language } = useLanguage()

  return (
    <CenterContainer>
      <Logo src="logo.png" />
      <Header>
        {
          // @ts-ignore
          copy[language][`level${level}Header`]
        }
      </Header>
      <Glasses src={`level_${level}_glasses.png`} />
      <Copy>
        {
          // @ts-ignore
          copy[language][`level${level}Copy`]
        }
      </Copy>
      <Button onClick={onNextStep}>
        {level == 1
          ? copy[language].goToLevelOne
          : copy[language].goToNextLevel}
      </Button>
    </CenterContainer>
  )
}
