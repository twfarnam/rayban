import styled from 'styled-components'
import copy from '../copy'
import { mobileBreakpoint } from '../utility'
import Button from './button'
import CenterContainer from './center_container'
import { useLanguage } from './language_provider'

const Logo = styled.img`
  width: 500px;

  @media ${mobileBreakpoint} {
    width: 200px;
  }
`

const Copy = styled.div`
  font-size: 1.5em;
  text-align: center;
`

const Spacer = styled.div`
  flex-grow: 1;
`

const CookieNotice = styled.div`
  font-size: 0.8rem;
  line-height: 1;
  background: black;
  color: white;
  padding: 0.6rem 1.2rem 0.85rem;
  border-radius: 0.7rem;
  margin: 1rem 0;
`

// const ChangeLanguage = styled.button`
//   background: none;
//   border: none;
//   color: white;
//   text-decoration: underline;
//   margin: 1rem 0;
//   cursor: pointer;
// `

interface IntroProps {
  onNextStep: () => void
}

export default function Intro({ onNextStep }: IntroProps): React.ReactElement {
  const { language, setLanguage } = useLanguage()
  return (
    <CenterContainer>
      <Logo src="logo_and_icon_series.svg" />
      <Copy>{copy[language].intro}</Copy>
      <Button onClick={onNextStep}>{copy[language].introButton}</Button>
      <Spacer />
      <CookieNotice>{copy[language].cookieNotice}</CookieNotice>
    </CenterContainer>
  )
  // {language == 'es' && (
  //   <ChangeLanguage onClick={() => setLanguage('en')}>
  //     {copy['en'].changeLanguage}
  //   </ChangeLanguage>
  // )}
  // {language == 'en' && (
  //   <ChangeLanguage onClick={() => setLanguage('es')}>
  //     {copy['es'].changeLanguage}
  //   </ChangeLanguage>
  // )}
}
