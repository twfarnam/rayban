import isEqual from 'lodash/isEqual'
import times from 'lodash/times'
import React from 'react'
import styled from 'styled-components'
import { Location } from './game'

const Row = styled.div`
  display: flex;
  flex-flow: row nowrap;
`

const Square = styled.div`
  flex: 1 1 auto;
  background: #bbb;
  margin: 1px;

  &:before {
    display: block;
    content: '';
    padding-top: 100%;
  }
`

const FoodSquare = styled(Square)`
  background: green;
`

const FoodHistorySquare = styled(Square)`
  background: lightgreen;
`
const SnakeSquare = styled(Square)`
  background: pink;
`

interface BoardProps {
  boardSize: number
  snake: Location[]
  food: Location
  foodHistory: Location[]
}

export default function Board(props: BoardProps): React.ReactElement {
  const { boardSize, snake, food, foodHistory } = props
  return (
    <div>
      {times(boardSize, (y: number) => {
        return (
          <Row key={y}>
            {times(boardSize, (x: number) => {
              if (snake.some((p: Location) => isEqual(p, { x, y }))) {
                return <SnakeSquare key={x} />
              } else if (isEqual(food, { x, y })) {
                return <FoodSquare key={x} />
              } else if (
                foodHistory.some((p: Location) => isEqual(p, { x, y }))
              ) {
                return <FoodHistorySquare key={x} />
              } else {
                return <Square key={x} />
              }
            })}
          </Row>
        )
      })}
    </div>
  )
}
