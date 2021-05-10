import styled from 'styled-components'

const LogoBase = styled.img`
  width: 150px;
  margin-bottom: 40px;

  @media (max-width: 800px) {
    width: 100px;
    margin-bottom: 20px;
  }
`

export default function Logo(): React.ReactElement {
  return <LogoBase src="logo.png" />
}
