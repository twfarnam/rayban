import styled from 'styled-components'
import copy from '../copy'
import Button from './button'
import CenterContainer from './center_container'
import { useLanguage } from './language_provider'

const Logo = styled.div`
  @media (max-width: 800px) {
    & {
      max-width: 450px;
    }
  }
`

const TheIcon = styled.div`
  font-size: 240px;
  width: 100%;
  text-align: center;
  font-family: 'RayBanSansInline';
  line-height: 1;
  border-top: 12px double ${(props) => props.theme.red};

  @media (max-width: 800px) {
    & {
      font-size: 120px;
    }
  }

  @media (max-width: 400px) {
    & {
      font-size: 70px;
    }
  }
`
const Series = styled.div`
  display: flex;
  width: 100%;
  flex-flow: row nowrap;
  align-items: center;
  line-height: 1;
  font-size: 90px;
  font-weight: normal;

  @media (max-width: 800px) {
    & {
      font-size: 50px;
    }
  }

  @media (max-width: 400px) {
    & {
      font-size: 30px;
    }
  }

  &::before,
  &::after {
    flex-grow: 1;
    content: '';
    display: block;
    border-top: 12px double ${(props) => props.theme.red};
  }
  &::before {
    margin-right: 2rem;
  }
  &::after {
    margin-left: 2rem;
  }
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
      <Logo>
        <TheIcon>The Icon</TheIcon>
        <Series>Series</Series>
      </Logo>
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
