import cn from 'classnames'
import isEqual from 'lodash/isEqual'
import { useState, useEffect, useRef, useCallback } from 'react'
import HammerReact from 'react-hammerjs'
import styled from 'styled-components'
import copy from '../copy'
import outlines from '../outlines'
import { delay, playAudio } from '../utility'
import Board from './board'
import Button from './button'
import GameFooter from './game_footer'
import GameHeader from './game_header'
import { useLanguage } from './language_provider'

const HammerElement = styled.div`
  width: 100%;
`

const BoardContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;

  @media (max-width: 800px) {
    max-width: 400px;
    padding: 0;
  }

  @media (max-width: 600px) {
    max-width: 300px;
    padding: 0;
  }
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

  @media (max-width: 800px) {
    & {
      font-size: 7rem;
    }

    &.long {
      font-size: 3rem;
    }
  }
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
  lottieData: Record<string, any>
}

const boardHeight = 22
const boardWidth = 45

export default function Game(props: GameProps): React.ReactElement {
  const { level, points, lives, onPoints, onLifeLost, onLevelCompleted } = props
  const { language } = useLanguage()
  const [boardVisible, setBoardVisible] = useState<boolean>(true)
  const baseElem = useRef<HTMLDivElement | null>(null)
  const baseRef = (node: HTMLDivElement) => {
    if (!node || baseElem.current == node) return
    baseElem.current = node
    setTimeout(() => {
      const rect = node.getBoundingClientRect()
      window.scrollTo(0, rect.top - rect.height / 2)
    })
  }
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
      food: randomFood(game.foodHistory),
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
    return
    setOverlay('3')
    await delay(1000)
    setOverlay('2')
    await delay(1000)
    setOverlay('1')
    await delay(1000)
    setOverlay(copy[language].youreOn)
    await delay(1000)
    playAudio('sound/level_begins.mp3')
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
        playAudio('sound/eaten_dot.mp3')
        game.foodHistory.push(food!)
        game.foodHistory.push(randomFood(game.foodHistory)!)
        game.foodHistory.push(randomFood(game.foodHistory)!)
        game.foodHistory.push(randomFood(game.foodHistory)!)
        game.foodHistory.push(randomFood(game.foodHistory)!)
        game.foodHistory.push(randomFood(game.foodHistory)!)
        game.foodHistory.push(randomFood(game.foodHistory)!)
        game.foodHistory.push(randomFood(game.foodHistory)!)
        game.foodHistory = game.foodHistory.filter((f) => !!f)
        setTimeout(() => onPoints(100))
        food = randomFood(game.foodHistory)
        if (!food) {
          setTimeout(async () => {
            setBoardVisible(false)
            setOverlay(copy[language].levelCompleted)
            await delay(3000)
            onLevelCompleted()
          })
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
        playAudio('sound/direction_change.mp3')
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

  const { snake, food, foodHistory } = game
  // @ts-ignore
  const outline = outlines[level] as Location[]
  return (
    <HammerReact onTap={onTap}>
      <HammerElement>
        <GameHeader
          level={level}
          percentComplete={Math.round(
            (foodHistory.length / outline.length) * 100,
          )}
        />
        <BoardContainer ref={baseRef}>
          <Overlay className={cn({ long: overlay.length > 1 })}>
            {overlay}
          </Overlay>
          <BoardBackground src="board_background.png" />
          <Board
            visible={boardVisible}
            width={boardWidth}
            height={boardHeight}
            snake={snake}
            food={food}
            foodHistory={foodHistory}
          />
        </BoardContainer>
        <GameFooter points={points} lives={lives} level={level} />
        <p style={{ textAlign: 'center' }}>
          <Button
            onClick={async () => {
              setBoardVisible(false)
              setOverlay(copy[language].levelCompleted)
              await delay(3000)
              onLevelCompleted()
            }}>
            DEBUG advance level!
          </Button>
        </p>{' '}
      </HammerElement>
    </HammerReact>
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
