import styled from 'styled-components'
import copy from '../copy'
import Button from './button'
import CenterContainer from './center_container'
import { useLanguage } from './language_provider'

const Logo = styled.img`
  width: 150px;
  margin-bottom: 40px;
`

const Copy = styled.p`
  font-size: 1.2em;
`

const Spacer = styled.div`
  height: 100px;
`

interface HowToPlayProps {
  onNextStep: () => void
}

export default function HowToPlay({
  onNextStep,
}: HowToPlayProps): React.ReactElement {
  const { language } = useLanguage()

  return (
    <CenterContainer>
      <Logo src="logo.png" />
      <h1>{copy[language].howToPlayHeader}</h1>
      {copy[language].howToPlay.split('\n').map((text, key) => (
        <Copy key={key}>{text}</Copy>
      ))}
      <Spacer />
      <Button onClick={onNextStep}>{copy[language].start}</Button>
    </CenterContainer>
  )
}
