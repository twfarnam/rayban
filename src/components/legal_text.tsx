import styled from 'styled-components'
import { mobileBreakpoint } from '../utility'
import Button from './button'

const LegalTextBase = styled.div`
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  padding: 3rem;

  @media ${mobileBreakpoint} {
    padding: 1rem;
  }

  & ~ * {
    display: none !important;
  }
`

const Logo = styled.img`
  width: 200px;
  position: absolute;
  top: 2rem;
  left: 2rem;

  @media ${mobileBreakpoint} {
    position: initial;
    width: 100px;
    margin-bottom: 0.5rem;
  }
`

const IconSeriesLogo = styled.img`
  width: 150px;
  margin-bottom: 1rem;

  @media ${mobileBreakpoint} {
    position: initial;
    width: 100px;
    margin-bottom: 0.5rem;
  }
`

const Heading = styled.h1`
  font-size: 1.5em;
  margin: 0.5rem 0;

  @media ${mobileBreakpoint} {
    margin: 0;
  }
`

const ScrollContainer = styled.div`
  overflow: scroll;
  flex: 1 1 auto;
  max-width: 800px;
  margin 1rem auto;

  @media ${mobileBreakpoint} {
    margin 1rem auto;
  }

  & > :first-child {
    margin-top: 0;
  }
`

interface LegalTextProps {
  onClickDone: (event: React.MouseEvent) => void
  header: React.ReactNode
  body: React.ReactNode
}

export default function LegalText({
  onClickDone,
  header,
  body,
}: LegalTextProps): React.ReactElement {
  return (
    <LegalTextBase>
      <Logo src="logo.png" />
      <IconSeriesLogo src="icon_series.svg" />
      <Heading>{header}</Heading>
      <ScrollContainer>{body}</ScrollContainer>
      <Button onClick={onClickDone}>Regresar</Button>
    </LegalTextBase>
  )
}
