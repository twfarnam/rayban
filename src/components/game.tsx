import cn from 'classnames'
import isEqual from 'lodash/isEqual'
import times from 'lodash/times'
import { useState, useEffect, useRef, MutableRefObject } from 'react'
import HammerReact from 'react-hammerjs'
import styled from 'styled-components'
// @ts-ignore
import muteButton from '../../static/mute.svg'
import copy from '../copy'
import outlines from '../outlines'
import { delay, playAudio, stopAudio, mobileBreakpoint } from '../utility'
import Board from './board'
import GameFooter from './game_footer'
import GameHeader from './game_header'
import { useLanguage } from './language_provider'

const HammerElement = styled.div`
  width: 100%;
`

const MuteButton = styled.div`
  width: 40px;
  position: absolute;
  left: 100%;
  cursor: pointer;

  @media ${mobileBreakpoint} {
    width: 20px;
  }
`

const BoardContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;

  @media ${mobileBreakpoint} {
    max-width: 400px;
    padding: 0;
  }

  @media (max-width: 600px) {
    max-width: 300px;
    padding: 0;
  }
`

const BoardBackground = styled.img`
  width: 100%;
  position: absolute;
  top: 2%;
  left: -0.5%;
`

const Overlay = styled.div`
  font-size: 15rem;
  font-family: 'RayBanSansInline';
  position: absolute;
  white-space: pre-wrap;
  left: 0;
  right: 0;
  top: calc(50% - 1rem);
  transform: translateY(-50%);
  text-align: center;
  z-index: 15;
  line-height: 1;

  &.long {
    font-size: 7rem;
  }

  &.very-long {
    font-size: 4rem;
  }

  @media ${mobileBreakpoint} {
    & {
      font-size: 7rem;
    }

    &.long {
      font-size: 3rem;
    }

    &.very-long {
      font-size: 2rem;
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
  levelStartTime: number
  time: number
  direction: Direction
  nextDirection: Direction | null
  foodHistory: Record<string, boolean>
  food: Location | null
  snake: Location[]
}

const initialState = (): GameState => ({
  running: false,
  direction: 'left',
  nextDirection: null,
  points: 0,
  foodHistory: {},
  food: { x: 5, y: 8 },
  levelStartTime: 0,
  time: 60,
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
  onLevelCompleted: (time: number) => void
  onPoints: (points: number) => void
  lottieData: Record<string, any>
  mute: MutableRefObject<boolean>
}

const boardHeight = 22
const boardWidth = 45

export default function Game(props: GameProps): React.ReactElement {
  const {
    level,
    points,
    lives,
    onPoints,
    onLevelCompleted,
    lottieData,
    mute,
  } = props
  const { language } = useLanguage()
  const [boardVisible, setBoardVisible] = useState<boolean>(true)
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
    if (!mute.current) playAudio('sound/music.mp3')
    return () => stopAudio('sound/music.mp3')
  }, [])

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
    if (!mute.current) playAudio('sound/level_begins.mp3')
    setOverlay('')
    setGame((game) => ({
      ...game,
      levelStartTime: window.performance.now() - (60 - game.time) * 1000,
      running: true,
    }))
  }

  function tick(timestamp: number) {
    setGame((game) => {
      const { running, levelStartTime } = game
      animationFrame.current.requestID = window.requestAnimationFrame(tick)
      if (timestamp - animationFrame.current.lastTime > speeds[level]) {
        animationFrame.current.lastTime = timestamp
        if (running) gameLoop()
      }
      const time = Math.max(
        0,
        Math.round(60 - (timestamp - levelStartTime) / 1000),
      )
      if (!running || time == game.time) return game
      return { ...game, time }
    })
  }

  function gameLoop() {
    setGame((game) => {
      let { food, direction } = game
      const { snake, nextDirection, time } = game

      // time runs out so restart the level
      if (time <= 0) {
        onLifeLost().then(() =>
          setGame((game) => ({
            ...game,
            levelStartTime: window.performance.now(),
            time: 60,
            food: null,
            foodHistory: {},
          })),
        )
        return { ...game, running: false }
      }

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
        onLifeLost()
        return { ...game, running: false }
      }
      // advances
      snake.unshift({ x, y })

      // if eating, place more food. if not, tail shrinks
      if (isEqual(food, { x, y })) {
        if (!mute.current) playAudio('sound/eaten_dot.mp3')
        game.foodHistory[`${food!.x},${food!.y}`] = true
        const addRandomFood = (foodHistory: Record<string, boolean>) => {
          const food = randomFood(foodHistory)
          if (food) foodHistory[`${food.x},${food.y}`] = true
        }
        times(7, () => addRandomFood(game.foodHistory))
        setTimeout(() => onPoints(100))
        food = randomFood(game.foodHistory)
        if (!food) {
          setTimeout(async () => {
            setBoardVisible(false)
            setOverlay(copy[language].levelCompleted)
            await delay(3000)
            onLevelCompleted(time)
          })
          return { ...game, food: null, running: false }
        }
      } else {
        snake.pop()
      }

      return { ...game, food, direction, nextDirection: null }
    })
  }

  function randomFood(
    foodHistory: Record<string, boolean> = {},
  ): Location | null {
    // @ts-ignore
    const available = outlines[level].filter(
      (o: Location) => !foodHistory.hasOwnProperty(`${o.x},${o.y}`),
    )
    if (available.length < 1) return null
    const index = Math.floor(Math.random() * available.length)
    return available[index]
  }

  function onClickMute() {
    mute.current = !mute.current
    window.localStorage.rayBanSnakeMute = mute.current
    if (mute.current) {
      stopAudio('sound/music.mp3')
    } else {
      playAudio('sound/direction_change.mp3')
      playAudio('sound/music.mp3')
    }
  }

  async function onLifeLost() {
    if (!mute.current) playAudio('sound/life_lost.mp3')
    setTimeout(() => setOverlay(copy[language].lifeLost))
    await delay(3000)
    setTimeout(() => props.onLifeLost())
  }

  function onKeyDown(event: KeyboardEvent) {
    if (directionKeys[event.key]) {
      event.preventDefault()
      setDirection(directionKeys[event.key])
    }
  }

  function setDirection(nextDirection: Direction) {
    setGame((game) => {
      if (!game.running || game.nextDirection) return game
      if (
        nextDirection &&
        nextDirection != game.direction &&
        nextDirection != oppositeDirection(game.direction)
      ) {
        if (!mute.current) playAudio('sound/direction_change.mp3')
        game.nextDirection = nextDirection
      }
      return game
    })
  }

  function onTap(event: any) {
    if (event.target.closest('[data-no-tap]')) return
    setGame((game) => {
      if (!game.running || game.nextDirection) return game
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

  const { snake, food, foodHistory, time } = game
  // @ts-ignore
  const outline = outlines[level] as Location[]
  return (
    <HammerReact onTap={onTap}>
      <HammerElement>
        <GameHeader level={level} time={time} lottieData={lottieData} />
        <BoardContainer>
          <MuteButton
            data-no-tap
            onClick={onClickMute}
            dangerouslySetInnerHTML={{ __html: muteButton as string }}
          />
          <Overlay
            className={cn({
              long: overlay.length > 1,
              'very-long': overlay.length > 16,
            })}>
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
      </HammerElement>
    </HammerReact>
  )
  // <p style={{ textAlign: 'center' }}>
  //   <Button
  //     onClick={async () => {
  //       setBoardVisible(false)
  //       setOverlay(copy[language].levelCompleted)
  //       await delay(3000)
  //       onLevelCompleted(time)
  //     }}>
  //     DEBUG advance level!
  //   </Button>
  // </p>
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
