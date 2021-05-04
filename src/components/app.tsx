import { useState, useEffect } from 'react'
import ForceLandscape from './force_landscape'
import Game from './game'
import GameOver from './game_over'
import HowToPlay from './how_to_play'
import Intro from './intro'
import LevelIntro from './level_intro'
import Won from './won'

const isMobile = /android|iphone|ipad|ipod/i.test(window.navigator.userAgent)

export type AppStep =
  | 'intro'
  | 'how_to_play'
  | 'force_landscape'
  | 'game'
  | 'level_intro'
  | 'game_over'
  | 'won'

export default function App(): React.ReactElement | null {
  const [step, setStep] = useState<AppStep>('intro')
  const [points, setPoints] = useState<number>(0)
  const [lives, setLives] = useState<number>(3)
  const [level, setLevel] = useState<number>(1)

  useEffect(() => window.scrollTo(0, 0), [step])

  function onLevelCompleted() {
    setPoints((points) => points + level * 300 + lives * 300)
    if (level >= 4) {
      setStep('won')
    } else {
      setStep('level_intro')
      setLevel(level + 1)
    }
  }

  function onPoints(increase: number) {
    setPoints((points) => points + increase)
  }

  function onLifeLost() {
    setLives((lives) => {
      if (lives > 1) return lives - 1
      setStep('game_over')
      return 0
    })
  }

  switch (step) {
    case 'intro':
      return <Intro onNextStep={() => setStep('how_to_play')} />
    case 'how_to_play':
      return (
        <HowToPlay
          onNextStep={() =>
            isMobile && window.innerWidth < window.innerHeight
              ? setStep('force_landscape')
              : setStep('level_intro')
          }
        />
      )
    case 'force_landscape':
      return <ForceLandscape onNextStep={() => setStep('level_intro')} />
    case 'level_intro':
      return <LevelIntro level={level} onNextStep={() => setStep('game')} />
    case 'game':
      return (
        <Game
          level={level}
          points={points}
          lives={lives}
          onLifeLost={onLifeLost}
          onLevelCompleted={onLevelCompleted}
          onPoints={onPoints}
        />
      )
    case 'game_over':
      return <GameOver />
    case 'won':
      return <Won />
  }
}
