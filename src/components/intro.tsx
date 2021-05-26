import styled from 'styled-components'
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

interface IntroProps {
  onNextStep: () => void
}

export default function Intro({ onNextStep }: IntroProps): React.ReactElement {
  const { getTranslation } = useLanguage()
  return (
    <CenterContainer>
      <Logo src="logo_and_icon_series.svg" />
      <Copy>{getTranslation('intro')}</Copy>
      <Button onClick={onNextStep}>{getTranslation('introButton')}</Button>
      <Spacer />
      <CookieNotice>{getTranslation('cookieNotice')}</CookieNotice>
    </CenterContainer>
  )
}
