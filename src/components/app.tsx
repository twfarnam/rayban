import { useState, useEffect } from 'react'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import styled from 'styled-components'
import { preloadImage, preloadAudio, playAudio } from '../utility'
import ForceLandscape from './force_landscape'
import Game from './game'
import GameOver from './game_over'
import GameWon from './game_won'
import HowToPlay from './how_to_play'
import Intro from './intro'
import LevelIntro from './level_intro'
import LevelOutro from './level_outro'

const isMobile = /android|iphone|ipad|ipod/i.test(window.navigator.userAgent)

export type AppStep =
  | 'intro'
  | 'how_to_play'
  | 'force_landscape'
  | 'level_intro'
  | 'game'
  | 'level_outro'
  | 'game_over'
  | 'game_won'

const Background = styled.video`
  position: fixed;
  height: 100%;
  width: 100%;
  object-fit: cover;
  z-index: -1;
`

export default function App(): React.ReactElement | null {
  const [step, setStep] = useState<AppStep>('intro')
  const [points, setPoints] = useState<number>(0)
  const [lives, setLives] = useState<number>(3)
  const [level, setLevel] = useState<number>(1)
  const [lottieData, setLottieData] = useState<Record<string, any>>({})

  useEffect(() => window.scrollTo(0, 0), [step])

  useEffect(() => {
    preloadLottieFile('level_1_bg.json')
    preloadLottieFile('level_1_glasses.json')
    preloadImage('large_border.png')
    preloadImage('board_background.png')
    preloadImage('board_background.png')
    preloadAudio('sound/direction_change.mp3')
    preloadAudio('sound/game_lost.mp3')
    preloadAudio('sound/life_lost.mp3')
    preloadAudio('sound/eaten_dot.mp3')
    preloadAudio('sound/level_begins.mp3')
    preloadAudio('sound/music.mp3', true)
  }, [])

  useEffect(() => {
    if (step != 'level_intro') return
    preloadLottieFile(`level_${level + 1}_bg.json`)
    preloadLottieFile(`level_${level + 1}_glasses.json`)
    if (level == 4) {
      preloadLottieFile('confetti.json')
    }
  }, [level, step])

  async function preloadLottieFile(path: string) {
    const request = await fetch(path)
    const data = await request.json()
    setLottieData((lottieData) => ({ ...lottieData, [path]: data }))
  }

  function onLevelCompleted() {
    setPoints((points) => points + level * 300 + lives * 300)
    if (level >= 4) {
      setStep('game_won')
    } else {
      setStep('level_outro')
    }
  }

  function onPoints(increase: number) {
    setPoints((points) => points + increase)
  }

  function onLifeLost() {
    setLives((lives) => {
      if (lives > 1) {
        playAudio('sound/life_lost.mp3')
        return lives - 1
      } else {
        playAudio('sound/game_lost.mp3')
        setStep('game_over')
        return 0
      }
    })
  }

  function onPlayAgain() {
    setPoints(0)
    setLives(3)
    setLevel(1)
    setStep('level_intro')
  }

  return (
    <>
      <Background playsInline autoPlay loop muted src="background.mp4" />
      <TransitionGroup component={null}>
        <CSSTransition key={step} timeout={500}>
          {(() => {
            switch (step) {
              case 'intro':
                return (
                  <Intro
                    onNextStep={() => {
                      playAudio('sound/music.mp3')
                      setStep('how_to_play')
                    }}
                  />
                )
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
                return (
                  <ForceLandscape onNextStep={() => setStep('level_intro')} />
                )
              case 'level_intro':
                return (
                  <LevelIntro
                    lottieData={lottieData}
                    level={level}
                    onNextStep={() => setStep('game')}
                  />
                )
              case 'game':
                return (
                  <Game
                    lottieData={lottieData}
                    level={level}
                    points={points}
                    lives={lives}
                    onLifeLost={onLifeLost}
                    onLevelCompleted={onLevelCompleted}
                    onPoints={onPoints}
                  />
                )
              case 'level_outro':
                return (
                  <LevelOutro
                    lottieData={lottieData}
                    level={level}
                    onNextStep={() => {
                      setLevel(level + 1)
                      setStep('level_intro')
                    }}
                  />
                )
              case 'game_over':
                return <GameOver onPlayAgain={onPlayAgain} />
              case 'game_won':
                return (
                  <GameWon onPlayAgain={onPlayAgain} lottieData={lottieData} />
                )
            }
          })()}
        </CSSTransition>
      </TransitionGroup>
    </>
  )
}
