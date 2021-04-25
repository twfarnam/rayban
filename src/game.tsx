import cn from 'classnames'
import Hammer from 'hammerjs'
import isEqual from 'lodash/isEqual'
import times from 'lodash/times'
import { useState, useEffect, useRef, useMemo } from 'react'
import HammerReact from 'react-hammerjs'
import { IoHeart, IoHeartOutline } from 'react-icons/io5'
import styled from 'styled-components'
import Board from './board'
import translations from './translations'
import { delay } from './utility'

export interface GameProps {
  level: number
  lives: number
  language: 'en' | 'es'
  points: number
  outline: Location[]
  onLifeLost: () => void
  onLevelCompleted: () => void
  onPoints: (points: number) => void
}

const GameBase = styled.div`
  width: 100%;
`

const OverlayContainer = styled.div`
  position: relative;
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
  z-index: 3;

  &.long {
    font-size: 7rem;
  }
`

const Level = styled.div`
  font-size: 1.4em;
`

const Stats = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  color: ${(props) => props.theme.red};
`

const Lives = styled.div`
  padding: 0.4rem 1rem;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 0.2em;
`

const Points = styled.div`
  font-size: 1.4rem;
  padding: 0.4rem 1.2rem;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 0.1em;
`

const Heart = styled(IoHeart)`
  font-size: 2rem;
`
const EmptyHeart = Heart.withComponent(IoHeartOutline)

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

const speeds = { 1: 350, 2: 300, 3: 250, 4: 200, 5: 150 } as Record<
  number,
  number
>

type Direction = 'up' | 'down' | 'left' | 'right'

export interface GameState {
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

export default function Game(props: GameProps): React.ReactElement {
  const {
    level,
    points,
    language,
    lives,
    outline,
    onPoints,
    onLifeLost,
    onLevelCompleted,
  } = props
  const boardHeight = 20
  const boardWidth = 50
  const animationFrame = useRef<{ lastTime: number; requestID: number }>({
    lastTime: 0,
    requestID: 0,
  })
  const [game, setGame] = useState<GameState>(() => ({
    ...initialState(),
    food: randomFood(),
  }))
  const [overlay, setOverlay] = useState<string>('3')

  useEffect(() => {
    if (lives > 0) {
      startGame()
      setGame({
        ...game,
        snake: initialState().snake,
        direction: 'left',
        food: randomFood(),
      })
    } else {
      setOverlay(translations[language].gameOver)
    }
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
    setOverlay(translations[language].youreOn)
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
        game.foodHistory.push(food!)
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
    const available = outline.filter(
      (o) => !foodHistory.some((h) => isEqual(o, h)),
    )
    if (available.length < 1) return null
    const index = Math.floor(Math.random() * available.length)
    return available[index]
  }

  function onKeyDown(event: KeyboardEvent) {
    setDirection(directionKeys[event.key])
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
    <GameBase>
      <Level>Level {level}</Level>
      <HammerReact direction="DIRECTION_ALL" onTap={onTap} onSwipe={onSwipe}>
        <OverlayContainer>
          <Overlay className={cn({ long: overlay.length > 1 })}>
            {overlay}
          </Overlay>
          <Board
            width={boardWidth}
            height={boardHeight}
            outline={outline}
            snake={snake}
            food={food}
            foodHistory={foodHistory}
          />
        </OverlayContainer>
      </HammerReact>
      <Stats>
        <Lives>
          {times(3, (i) =>
            i >= lives ? <EmptyHeart key={i} /> : <Heart key={i} />,
          )}
        </Lives>
        <Points>{points.toString().padStart(5, '0')}</Points>
      </Stats>
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
