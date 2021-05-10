import styled from 'styled-components'
import copy from '../copy'
import Button from './button'
import CenterContainer from './center_container'
import Heading from './heading'
import { useLanguage } from './language_provider'

const Logo = styled.img`
  width: 150px;
  margin-bottom: 20px;
`

const Copy = styled.div`
  font-size: 1.2em;
  margin-bottom: 30px;

  & li {
    margin: 0.3em 0;
  }
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
      <Heading>{copy[language].howToPlayHeader}</Heading>
      <Copy>{copy[language].howToPlay}</Copy>
      <Button onClick={onNextStep}>{copy[language].goToLevel} 1</Button>
    </CenterContainer>
  )
}
