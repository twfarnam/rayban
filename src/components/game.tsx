import cn from 'classnames'
import Hammer from 'hammerjs'
import isEqual from 'lodash/isEqual'
import { useState, useEffect, useRef } from 'react'
import HammerReact from 'react-hammerjs'
import styled from 'styled-components'
import copy from '../copy'
import outlines from '../outlines'
import { delay } from '../utility'
import Board from './board'
import Button from './button'
import CenterContainer from './center_container'
import GameFooter from './game_footer'
import GameHeader from './game_header'
import { useLanguage } from './language_provider'

const GameBase = styled(CenterContainer)`
  min-height: initial;
  align-items: stretch;
  padding-bottom: 100px;
`

const BoardContainer = styled.div`
  position: relative;
`

const BoardBackground = styled.img`
  width: 103%;
  position: absolute;
  top: -2.8%;
  left: -1.5%;
`

const Overlay = styled.div`
  font-size: 15rem;
  font-family: 'RayBanSansInline';
  position: absolute;
  left: 0;
  right: 0;
  top: calc(50% - 1rem);
  transform: translateY(-50%);
  text-align: center;
  z-index: 15;

  &.long {
    font-size: 7rem;
  }
`

const Glasses = styled.img`
  position: absolute;
  width: 100%;
  z-index: 1;
  opacity: 0.5;
  top: -10%;
  pointer-events: none;
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

const speeds = { 1: 180, 2: 160, 3: 140, 4: 120 } as Record<number, number>

type Direction = 'up' | 'down' | 'left' | 'right'

interface GameState {
  running: boolean
  points: number
  direction: Direction
  nextDirection: Direction | null
  foodHistory: Location[]
  food: Location | null
  snake: Location[]
}

const initialState = (): GameState => ({
  running: false,
  direction: 'left',
  nextDirection: null,
  points: 0,
  foodHistory: [],
  food: { x: 5, y: 8 },
  snake: [
    { x: 41, y: 7 },
    { x: 42, y: 7 },
    { x: 43, y: 7 },
  ],
})

export interface Location {
  x: number
  y: number
}

interface GameProps {
  level: number
  lives: number
  points: number
  onLifeLost: () => void
  onLevelCompleted: () => void
  onPoints: (points: number) => void
}

const boardHeight = 22
const boardWidth = 45

export default function Game(props: GameProps): React.ReactElement {
  const { level, points, lives, onPoints, onLifeLost, onLevelCompleted } = props
  const { language } = useLanguage()
  const animationFrame = useRef<{ lastTime: number; requestID: number }>({
    lastTime: 0,
    requestID: 0,
  })
  const [game, setGame] = useState<GameState>(() => ({
    ...initialState(),
    food: randomFood(),
  }))
  const [overlay, setOverlay] = useState<string>('')

  useEffect(() => {
    if (lives == 0) return
    startGame()
    setGame({
      ...game,
      snake: initialState().snake,
      direction: 'left',
      food: randomFood(),
    })
  }, [lives])

  useEffect(() => {
    animationFrame.current.requestID = window.requestAnimationFrame(tick)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.cancelAnimationFrame(animationFrame.current.requestID)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  async function startGame() {
    setOverlay('3')
    await delay(1000)
    setOverlay('2')
    await delay(1000)
    setOverlay('1')
    await delay(1000)
    setOverlay(copy[language].youreOn)
    await delay(1000)
    setOverlay('')
    setGame((game) => ({ ...game, running: true }))
  }

  function tick(time: number) {
    setGame((game) => {
      animationFrame.current.requestID = window.requestAnimationFrame(tick)
      if (time - animationFrame.current.lastTime > speeds[level]) {
        animationFrame.current.lastTime = time
        if (game.running) gameLoop()
      }
      return game
    })
  }

  function gameLoop() {
    setGame((game) => {
      let { food, direction } = game
      const { snake, nextDirection } = game

      // find next position of the snake
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
      if (
        // hit self
        snake.some((p) => p.x == x && p.y == y) ||
        // hit a wall
        x < 0 ||
        y < 0 ||
        x >= boardWidth ||
        y >= boardHeight
      ) {
        setTimeout(() => onLifeLost())
        return { ...game, running: false }
      }
      // advances
      snake.unshift({ x, y })

      // if eating, place more food. if not, tail shrinks
      if (isEqual(food, { x, y })) {
        const foodForHistory = [
          food,
          randomFood(game.foodHistory),
          randomFood(game.foodHistory),
        ].filter((f) => !!f) as Location[]
        game.foodHistory = [...game.foodHistory, ...foodForHistory]
        setTimeout(() => onPoints(100))
        food = randomFood(game.foodHistory)
        if (!food) {
          setTimeout(() => onLevelCompleted())
          return { ...game, food: null, running: false }
        }
      } else {
        snake.pop()
      }

      return { ...game, food, direction, nextDirection: null }
    })
  }

  function randomFood(foodHistory: Location[] = []): Location | null {
    // @ts-ignore
    const available = outlines[level].filter(
      (o: Location) => !foodHistory.some((h) => isEqual(o, h)),
    )
    if (available.length < 1) return null
    const index = Math.floor(Math.random() * available.length)
    return available[index]
  }

  function onKeyDown(event: KeyboardEvent) {
    if (directionKeys[event.key]) {
      event.preventDefault()
      setDirection(directionKeys[event.key])
    }
  }

  function setDirection(nextDirection: Direction) {
    setGame((game) => {
      if (game.nextDirection) return game
      if (nextDirection && nextDirection != oppositeDirection(game.direction)) {
        game.nextDirection = nextDirection
      }
      return game
    })
  }

  function onTap(event: any) {
    setGame((game) => {
      const head = document.querySelector('.head')
      if (!head) return game
      const headRect = head.getBoundingClientRect()
      if (['up', 'down'].includes(game.direction)) {
        const headX = headRect.left + headRect.width / 2
        const deltaX = event.center.x - headX
        setDirection(deltaX > 0 ? 'right' : 'left')
      } else {
        const headY = headRect.top + headRect.height / 2
        const deltaY = event.center.y - headY
        setDirection(deltaY > 0 ? 'down' : 'up')
      }
      return game
    })
  }

  function onSwipe(event: any) {
    const directions = {
      [Hammer.DIRECTION_RIGHT]: 'right',
      [Hammer.DIRECTION_LEFT]: 'left',
      [Hammer.DIRECTION_UP]: 'up',
      [Hammer.DIRECTION_DOWN]: 'down',
    } as Record<number, Direction>
    const direction = directions[event.direction]
    if (direction) {
      console.log(`swipe ${direction}`)
      setDirection(direction)
    }
  }

  const { snake, food, foodHistory } = game
  return (
    <>
      <GameHeader level={level} />
      <GameBase>
        <HammerReact onTap={onTap}>
          <BoardContainer>
            <Overlay className={cn({ long: overlay.length > 1 })}>
              {overlay}
            </Overlay>
            <BoardBackground src="board_background.png" />
            <Glasses src={`level_${level}_glasses.png`} />
            <Board
              width={boardWidth}
              height={boardHeight}
              // @ts-ignore
              outline={outlines[level]}
              snake={snake}
              food={food}
              foodHistory={foodHistory}
            />
          </BoardContainer>
        </HammerReact>
        <GameFooter points={points} lives={lives} level={level} />
        <p style={{ textAlign: 'center' }}>
          <Button onClick={onLevelCompleted}>DEBUG advance level!</Button>
        </p>
      </GameBase>
    </>
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
