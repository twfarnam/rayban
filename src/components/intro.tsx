import styled from 'styled-components'
import copy from '../copy'
import Button from './button'
import CenterContainer from './center_container'
import { useLanguage } from './language_provider'

const Logo = styled.img`
  width: 80%;
`

const Copy = styled.p`
  font-size: 1.5em;
  margin: 2em 0;
  white-space: pre-wrap;
  text-align: center;
`

const ChangeLanguage = styled.button`
  background: none;
  border: none;
  color: white;
  text-decoration: underline;
  margin: 1rem 0;
  cursor: pointer;
`

interface IntroProps {
  onNextStep: () => void
}

export default function Intro({ onNextStep }: IntroProps): React.ReactElement {
  const { language, setLanguage } = useLanguage()

  return (
    <CenterContainer>
      <Logo src="logo.png" />
      <Copy>{copy[language].intro}</Copy>
      <Button onClick={onNextStep}>{copy[language].introButton}</Button>
      {language == 'es' && (
        <ChangeLanguage onClick={() => setLanguage('en')}>
          {copy['en'].changeLanguage}
        </ChangeLanguage>
      )}
      {language == 'en' && (
        <ChangeLanguage onClick={() => setLanguage('es')}>
          {copy['es'].changeLanguage}
        </ChangeLanguage>
      )}
    </CenterContainer>
  )
}
