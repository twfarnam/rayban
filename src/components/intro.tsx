import styled from 'styled-components'
import { mobileBreakpoint } from '../utility'
import Button from './button'
import CenterContainer from './center_container'
import LanguageButton from './language_button'
import { useLanguage } from './language_provider'

const IntroBase = styled(CenterContainer)`
  justify-content: flex-start;
  max-width: initial;
`

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

const BigButton = styled(Button)`
  padding: 1.2rem 3rem;
`

interface IntroProps {
  onNextStep: () => void
}

export default function Intro({ onNextStep }: IntroProps): React.ReactElement {
  const { getTranslation } = useLanguage()
  return (
    <IntroBase>
      <Logo src="logo_and_icon_series.svg" />
      <Copy>{getTranslation('intro')}</Copy>
      <LanguageButton />
      <BigButton onClick={onNextStep}>
        {getTranslation('introButton')}
      </BigButton>
    </IntroBase>
  )
}
