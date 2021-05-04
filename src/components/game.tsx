import cn from 'classnames'
import Hammer from 'hammerjs'
import isEqual from 'lodash/isEqual'
import times from 'lodash/times'
import { useState, useEffect, useRef } from 'react'
import HammerReact from 'react-hammerjs'
import { IoHeart, IoHeartOutline } from 'react-icons/io5'
import styled from 'styled-components'
import copy from '../copy'
import outlines from '../outlines'
import { delay } from '../utility'
import Board from './board'
import CenterContainer from './center_container'
import { useLanguage } from './language_provider'

export interface GameProps {
  level: number
  lives: number
  points: number
  onLifeLost: () => void
  onLevelCompleted: () => void
  onPoints: (points: number) => void
}

const GameBase = styled(CenterContainer)`
  min-height: initial;
  align-items: stretch;
`

const Logo = styled.img`
  width: 200px;
  margin: 2rem;
`

const BackgroundImage = styled.img`
  width: 100%;
`

const Header = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  margin-bottom: 2rem;
  padding: 1rem 2rem;
  line-height: 1;
  border-radius: 1rem;
`

const LevelName = styled.div`
  font-size: 5rem;
  font-family: 'RayBanSansInline';
`

const RedStripes = styled.div`
  flex-grow: 1;
  color: ${(props) => props.theme.red};
  border-bottom: 3px solid currentColor;
  height: 9px;
  border-top: 3px solid currentColor;
  margin: 0 1rem;
`

const Level = styled.div`
  font-size: 2rem;
  color: ${(props) => props.theme.red};
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

const Glasses = styled.img`
  position: absolute;
  width: 100%;
  z-index: 1;
  opacity: 0.5;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
`

const Footer = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  font-size: 2rem;
`

const Spacer = styled.div`
  flex-grow: 1;
`

const Lives = styled.div`
  padding: 0.4rem 1rem;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 0.2em;
`

const Points = styled.div`
  padding: 0.4rem 1.2rem;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 0.1em;
`

const Heart = styled(IoHeart)`
  //
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

const speeds = { 1: 350, 2: 300, 3: 250, 4: 200 } as Record<number, number>

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
  const { level, points, lives, onPoints, onLifeLost, onLevelCompleted } = props
  const { language } = useLanguage()
  const boardHeight = 20
  const boardWidth = 45
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
    // @ts-ignore
    const available = outlines[level].filter(
      (o: Location) => !foodHistory.some((h) => isEqual(o, h)),
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

  const levelName = {
    1: 'Round',
    2: 'Aviator',
    3: 'Wayfarer',
    4: 'Clubmaster',
  }[level]

  const { snake, food, foodHistory } = game
  return (
    <>
      <Logo src="logo.png" />
      <GameBase>
        <BackgroundImage src={`level_${level}_bg.gif`} />
        <p>
          <button onClick={onLevelCompleted}>DEBUG advance level!</button>
        </p>
        <Header>
          <LevelName>{levelName}</LevelName>
          <RedStripes />
          <Level>Level {level}</Level>
        </Header>
        <HammerReact direction="DIRECTION_ALL" onTap={onTap} onSwipe={onSwipe}>
          <OverlayContainer>
            <Overlay className={cn({ long: overlay.length > 1 })}>
              {overlay}
            </Overlay>
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
          </OverlayContainer>
        </HammerReact>
        <Footer>
          <Points>{points.toString().padStart(5, '0')}</Points>
          <Lives>
            {times(3, (i) =>
              i >= lives ? <EmptyHeart key={i} /> : <Heart key={i} />,
            )}
          </Lives>
        </Footer>
        <Footer>
          Points
          <Spacer />
          Lives
        </Footer>
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
