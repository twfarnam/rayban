import styled from 'styled-components'
import { mobileBreakpoint } from '../utility'
import { SnakeSquare, Food, snakeColor } from './board'
import CenterContainer from './center_container'

const IntroMexicoBase = styled(CenterContainer)`
  max-width: 1000px;
`

const Logo = styled.img`
  width: 500px;

  @media ${mobileBreakpoint} {
    width: 150px;
  }
`

const LargeCopy = styled.div`
  font-size: 1.4em;
  text-align: center;
  margin: 1rem 0;

  @media ${mobileBreakpoint} {
    font-size: 1.2rem;
  }
`

const Row = styled.div`
  display: flex;
  flex-flow: row nowrap;
  margin: 2rem 0;
`

const FoodContainer = styled.div`
  position: relative;
  height 1rem;
  width: 1rem;
`

const StyledFood = styled(Food)`
  color: ${(props) => props.theme.red};
  width: 50%;
  height: 50%;
`

const Spacer = styled.div`
  width: 100px;
`

const StyledSnakeSquare = styled(SnakeSquare)`
  position: relative;
  height 1rem;
  width: 1rem;
  border-radius: 50%;
`

const SmallCopy = styled.div`
  font-size: 1em;
  text-align: center;
  margin-bottom: 1rem;

  @media ${mobileBreakpoint} {
    font-size: 1rem;
  }
`

export default function IntroMexicoDone(): React.ReactElement | null {
  return (
    <IntroMexicoBase>
      <Logo src="logo_and_icon_series.svg" />
      <LargeCopy>Conoce los resultados próximamente.</LargeCopy>
      <Row>
        <StyledSnakeSquare style={{ background: snakeColor(10, 10) }} />
        <StyledSnakeSquare style={{ background: snakeColor(10, 9) }} />
        <StyledSnakeSquare style={{ background: snakeColor(10, 8) }} />
        <StyledSnakeSquare style={{ background: snakeColor(10, 7) }} />
        <StyledSnakeSquare style={{ background: snakeColor(10, 6) }} />
        <StyledSnakeSquare style={{ background: snakeColor(10, 5) }} />
        <StyledSnakeSquare style={{ background: snakeColor(10, 4) }} />
        <StyledSnakeSquare style={{ background: snakeColor(10, 3) }} />
        <StyledSnakeSquare style={{ background: snakeColor(10, 2) }} />
        <StyledSnakeSquare style={{ background: snakeColor(10, 1) }} />
        <StyledSnakeSquare style={{ background: snakeColor(10, 0) }} />
        <Spacer />
        <FoodContainer>
          <StyledFood />
        </FoodContainer>
      </Row>
      <SmallCopy>#YOUAREON</SmallCopy>
    </IntroMexicoBase>
  )
}
