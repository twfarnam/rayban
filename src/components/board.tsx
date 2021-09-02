import cn from 'classnames'
import times from 'lodash/times'
import styled from 'styled-components'
import { Location, isEqualLocation } from '../utility'

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
  background: rgba(0, 0, 0, 0.9);
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
    background: none;
  }
`

export const Food = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  margin: auto;
  color: white;
  background: currentColor;
  border-radius: 50%;
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
    border: 4px solid currentColor;
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
export const SnakeSquare = styled.div`
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
  snake: (Location | null)[]
  food: Location | null
  foodHistory: Record<string, boolean>
}

export default function Board(props: BoardProps): React.ReactElement {
  const { visible, width, height, snake, food, foodHistory } = props
  // const [outline, setOutline] = useState<Location[]>([])

  const snakeObject = snake.reduce<Record<string, number>>((obj, loc, i) => {
    if (loc) obj[`${loc.x},${loc.y}`] = i
    return obj
  }, {})

  return (
    <BoardBase style={{ visibility: visible ? 'visible' : 'hidden' }}>
      {times(height, (y: number) => {
        return (
          <Row key={y}>
            {times(width, (x: number) => {
              // const snakeIndex = snake.findIndex((p: Location) =>
              //   isEqual(p, { x, y }),
              // )
              const snakeIndex = snakeObject[`${x},${y}`]
              const isFood = food && isEqualLocation(food, { x, y })
              const isFoodHistory = foodHistory.hasOwnProperty(`${x},${y}`)
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
                  {typeof snakeIndex != 'undefined' && snakeIndex >= 0 && (
                    <SnakeSquare
                      key={x}
                      className={cn({ head: snakeIndex == 0 })}
                      style={{
                        background: snakeColor(snake.length, snakeIndex),
                      }}
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

export function snakeColor(length: number, index: number) {
  const color = 155 * ((length - index) / length) + 100
  return `rgb(${color}, ${color}, ${color})`
}
