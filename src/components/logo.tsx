import styled from 'styled-components'
import { mobileBreakpoint } from '../utility'

const LogoBase = styled.img`
  width: 150px;
  margin-bottom: 20px;

  @media ${mobileBreakpoint} {
    width: 80px;
    margin-bottom: 10px;
  }
`

export default function Logo(): React.ReactElement {
  return <LogoBase src="logo.png" />
}
