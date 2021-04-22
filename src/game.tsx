import isEqual from 'lodash/isEqual'
import { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import Board from './board'

const GameBase = styled.div`
  max-width: 600px;
  margin: 1rem auto;
`

const directionKeys = {
  ArrowDown: 'down',
  ArrowUp: 'up',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  k: 'down',
  i: 'up',
  j: 'left',
  l: 'right',
} as Record<string, Direction>

const speeds = [350, 300, 250, 200, 150]

type Status = 'prestart' | 'running' | 'game_over' | 'won'
type Direction = 'up' | 'down' | 'left' | 'right'

export interface GameState {
  state: Status
  level: number
  points: number
  direction: Direction
  nextDirection: Direction | null
  foodHistory: Location[]
  food: Location
  snake: Location[]
}

const initialState: GameState = {
  state: 'prestart',
  direction: 'left',
  nextDirection: null,
  level: 1,
  points: 0,
  foodHistory: [],
  food: { x: 5, y: 8 },
  snake: [
    { x: 11, y: 13 },
    { x: 12, y: 13 },
    { x: 13, y: 13 },
  ],
}

export interface Location {
  x: number
  y: number
}

export default function Game(): React.ReactElement {
  const boardSize = 20
  const animationFrame = useRef<{ lastTime: number; requestID: number }>({
    lastTime: 0,
    requestID: 0,
  })
  const [game, setGame] = useState<GameState>(initialState)

  useEffect(() => {
    animationFrame.current.requestID = window.requestAnimationFrame(tick)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.cancelAnimationFrame(animationFrame.current.requestID)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  function tick(time: number) {
    setGame((game) => {
      animationFrame.current.requestID = window.requestAnimationFrame(tick)
      if (time - animationFrame.current.lastTime > speeds[game.level]) {
        animationFrame.current.lastTime = time
        if (game.state == 'running') gameLoop()
      }
      return game
    })
  }

  function gameLoop() {
    setGame((game) => {
      let { food, direction } = game
      const { state, snake, nextDirection } = game

      // next position of the snake
      let { x, y } = snake[0]
      direction = nextDirection ?? direction
      switch (direction) {
        case 'up':
          y--
          break
        case 'down':
          y++
          break
        case 'right':
          x++
          break
        case 'left':
          x--
          break
      }
      // hit self
      if (snake.some((p) => p.x == x && p.y == y)) {
        return { ...game, state: 'game_over' }
      }
      // hit a wall
      if (x < 0 || y < 0 || x >= boardSize || y >= boardSize) {
        return { ...game, state: 'game_over' }
      }
      // advances
      snake.unshift({ x, y })

      // if eating, place more food. if not, tail shrinks
      if (isEqual(food, { x, y })) {
        game.foodHistory.push(food)
        food = randomPoint()
      } else {
        snake.pop()
      }

      return { ...game, state, food, direction, nextDirection: null }
    })
  }

  function randomPoint() {
    return {
      x: Math.floor(Math.random() * boardSize),
      y: Math.floor(Math.random() * boardSize),
    }
  }

  function onClickStartNewGame() {
    setGame({ ...initialState, state: 'running' })
  }

  function onKeyDown(event: KeyboardEvent) {
    setGame((game) => {
      if (game.nextDirection) return game
      const nextDirection = directionKeys[event.key]
      if (nextDirection && nextDirection != oppositeDirection(game.direction)) {
        game.nextDirection = nextDirection
      }
      return game
    })
  }

  const { state, snake, food, foodHistory } = game
  return (
    <GameBase>
      Game
      {state == 'prestart' && (
        <button onClick={onClickStartNewGame}>Start</button>
      )}
      <Board
        boardSize={boardSize}
        snake={snake}
        food={food}
        foodHistory={foodHistory}
      />
      {state == 'game_over' && (
        <>
          <h1>Game over!</h1>
          <button onClick={onClickStartNewGame}>Start</button>
        </>
      )}
    </GameBase>
  )
}

function oppositeDirection(direction: Direction): Direction {
  switch (direction) {
    case 'up':
      return 'down'
    case 'down':
      return 'up'
    case 'right':
      return 'left'
    case 'left':
      return 'right'
  }
}
