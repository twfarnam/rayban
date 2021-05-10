import cn from 'classnames'
import isEqual from 'lodash/isEqual'
import times from 'lodash/times'
import styled from 'styled-components'
import { Location } from './game'

const BoardBase = styled.div`
  border-radius: 9%;
  overflow: hidden;
`

const Row = styled.div`
  position: relative;
  display: flex;
  flex-flow: row nowrap;
  border-top: 1px solid ${(props) => props.theme.gridColor};

  &:last-child {
    border-bottom: 1px solid ${(props) => props.theme.gridColor};
  }
`

const Square = styled.div`
  position: relative;
  flex: 1 1 auto;
  border-left: 1px solid ${(props) => props.theme.gridColor};

  &:last-child {
    border-right: 1px solid ${(props) => props.theme.gridColor};
  }

  &:before {
    display: block;
    content: '';
    padding-top: 100%;
  }

  &.outline {
    background: hsl(0deg 38% 30%);
  }

  &.food-history {
    background: #bb2039;
  }
`

const Food = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  margin: auto;
  background: white;
  border-radius: 5px;
  z-index: 10;

  &::before,
  &::after {
    content: '';
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 30px;
    height: 30px;
    border: 4px solid white;
    border-radius: 50%;
    transform: translate(-50%, -50%) scale(0);
    opacity: 1;
    animation: ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
  }

  &::after {
    animation-delay: -0.5s;
  }

  @keyframes ripple {
    0% {
      transform: translate(-50%, -50%) scale(0);
      opacity: 1;
    }
    100% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 0;
    }
  }
`
const SnakeSquare = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  border-radius: 40%;
  z-index: 5;
`

interface BoardProps {
  visible: boolean
  width: number
  height: number
  snake: Location[]
  food: Location | null
  foodHistory: Location[]
}

export default function Board(props: BoardProps): React.ReactElement {
  const { visible, width, height, snake, food, foodHistory } = props
  // const [outline, setOutline] = useState<Location[]>([])

  return (
    <BoardBase style={{ visibility: visible ? 'visible' : 'hidden' }}>
      {times(height, (y: number) => {
        return (
          <Row key={y}>
            {times(width, (x: number) => {
              const snakeIndex = snake.findIndex((p: Location) =>
                isEqual(p, { x, y }),
              )
              const isFood = food && isEqual(food, { x, y })
              const isFoodHistory = foodHistory.some((p: Location) =>
                isEqual(p, { x, y }),
              )
              // const isOutline = outline.some((p: Location) =>
              //   isEqual(p, { x, y }),
              // )
              return (
                <Square
                  key={x}
                  // onClick={() => {
                  //   if (isOutline) {
                  //     const newOutline = outline.filter(
                  //       (p: Location) => !isEqual(p, { x, y }),
                  //     )
                  //     console.log(newOutline)
                  //     setOutline(newOutline)
                  //   } else {
                  //     const newOutline = [...outline, { x, y }]
                  //     newOutline.sort((a, b) =>
                  //       a.y == b.y ? (a.x > b.x ? 1 : -1) : a.y > b.y ? 1 : -1,
                  //     )
                  //     console.log(newOutline)
                  //     setOutline(newOutline)
                  //   }
                  // }}
                  className={cn({
                    // outline: isOutline,
                    'food-history': isFoodHistory,
                  })}>
                  {isFood && <Food />}
                  {snakeIndex >= 0 && (
                    <SnakeSquare
                      key={x}
                      className={cn({ head: snakeIndex == 0 })}
                      style={{ background: snakeColor(snake, snakeIndex) }}
                    />
                  )}
                </Square>
              )
            })}
          </Row>
        )
      })}
    </BoardBase>
  )
}

function snakeColor(snake: Location[], index: number) {
  const color = 155 * ((snake.length - index) / snake.length) + 100
  return `rgb(${color}, ${color}, ${color})`
}
