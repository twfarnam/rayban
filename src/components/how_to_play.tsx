import styled from 'styled-components'
import copy from '../copy'
import { mobileBreakpoint } from '../utility'
import Button from './button'
import CenterContainer from './center_container'
import Heading from './heading'
import { useLanguage } from './language_provider'

const Logo = styled.img`
  margin-bottom: 1rem;

  @media ${mobileBreakpoint} {
    width: 100px;
  }
`

const Copy = styled.div`
  font-size: 1.2rem;
  margin-bottom: 30px;

  & ul {
    list-style: none;
    padding: 0;
  }

  & li {
    margin: 0.5em 0;
    text-align: center;
  }

  & li::before {
    content: '• ';
  }

  @media ${mobileBreakpoint} {
    font-size: 1rem;
    margin-bottom: 20px;
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
      <Logo src="logo_and_icon_series.svg" />
      <Heading>{copy[language].howToPlayHeader}</Heading>
      <Copy>{copy[language].howToPlay}</Copy>
      <Button onClick={onNextStep}>{copy[language].goToLevel} 1</Button>
    </CenterContainer>
  )
}
