import styled from 'styled-components'
import copy from '../copy'
import { mobileBreakpoint } from '../utility'
import Button from './button'
import CenterContainer from './center_container'
import { useLanguage } from './language_provider'
import Logo from './logo'

const IconLogo = styled.div`
  @media ${mobileBreakpoint} {
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

  @media ${mobileBreakpoint} {
    & {
      font-size: 120px;
    }
  }

  @media ${mobileBreakpoint} {
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

  @media ${mobileBreakpoint} {
    & {
      font-size: 50px;
    }
  }

  @media ${mobileBreakpoint} {
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
      <Logo />
      <IconLogo>
        <TheIcon>The Icon</TheIcon>
        <Series>Series</Series>
      </IconLogo>
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
