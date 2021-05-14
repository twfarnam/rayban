import styled from 'styled-components'
import { mobileBreakpoint } from '../utility'

const LogoBase = styled.img`
  width: 150px;
  margin-bottom: 40px;

  @media ${mobileBreakpoint} {
    width: 100px;
    margin-bottom: 20px;
  }
`

export default function Logo(): React.ReactElement {
  return <LogoBase src="logo.png" />
}
