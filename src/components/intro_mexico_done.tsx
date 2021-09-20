import styled from 'styled-components'
import { mobileBreakpoint } from '../utility'
import CenterContainer from './center_container'

const IntroMexicoBase = styled(CenterContainer)`
  max-width: 1000px;
`

const Logo = styled.img`
  width: 400px;
  margin-bottom: 1rem;

  @media ${mobileBreakpoint} {
    width: 150px;
  }
`

const Copy = styled.div`
  font-size: 1rem;
  text-align: center;
  margin: 1rem 0;
`

const Name = styled.div`
  font-size: 1.4rem;
  text-align: center;

  @media ${mobileBreakpoint} {
    font-size: 1rem;
  }
`

const CopyRed = styled(Copy)`
  color: ${(props) => props.theme.red};
`

export default function IntroMexicoDone(): React.ReactElement | null {
  return (
    <IntroMexicoBase>
      <Logo src="logo_and_icon_series.svg" />
      <Copy>Los ganadores son:</Copy>
      <Name>• Leonel Ernesto Carillo Sánchez</Name>
      <Name>• Dante Hernández Ramírez</Name>
      <CopyRed>¡Muchas Felicidades!</CopyRed>
    </IntroMexicoBase>
  )
}
