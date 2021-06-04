import { getDatabase, ref, push, onValue } from 'firebase/database'
import { useState, useEffect, useRef } from 'react'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import styled from 'styled-components'
import { isMexico, isDebug, isMobile } from '../config'
import { userRequest } from '../firebase'
import { preloadImage, preloadAudio, playAudio, stopAudio } from '../utility'
import DebugLanguageSelector from './debug_language_selector'
import ForceLandscape from './force_landscape'
import Game from './game'
import GameOver from './game_over'
import GameWon from './game_won'
import HowToPlay from './how_to_play'
import Intro from './intro'
import IntroMexico from './intro_mexico'
import LevelIntro from './level_intro'
import LevelOutro from './level_outro'
import LoadingScreen from './loading_screen'

export type AppStep =
  | 'intro'
  | 'how_to_play'
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
  const mute = useRef<boolean>(window.localStorage.rayBanSnakeMute == 'true')
  const [lottieData, setLottieData] = useState<Record<string, any>>({})
  const [name, setName] = useState<string>()
  const [loading, setLoading] = useState<boolean>(isMexico)

  useEffect(() => {
    if (!isMexico) return
    userRequest.then(async (user) => {
      onValue(ref(getDatabase(), 'users/' + user.uid), (snapshot) => {
        const data = snapshot.val()
        if (data && data.name) setName(data.name)
        setLoading(false)
      })
    })
  }, [])

  useEffect(() => {
    if (step == 'game') return
    window.scrollTo(0, 0)
  }, [step])

  useEffect(() => {
    preloadLottieFile('level_1_bg.json')
    preloadLottieFile('level_1_glasses.json')
    preloadImage('logo.png')
    preloadImage('icon_series.svg')
    preloadImage('large_border.png')
    preloadImage('board_background.png')
    preloadAudio('sound/direction_change.mp3')
    preloadAudio('sound/game_lost.mp3')
    preloadAudio('sound/life_lost.mp3')
    preloadAudio('sound/eaten_dot.mp3')
    preloadAudio('sound/level_begins.mp3')
    preloadAudio('sound/music.mp3', true)
  }, [])

  useEffect(() => {
    // by waiting until level_intro we give the level_1 assets a chance to load
    // first
    if (step != 'level_intro') {
      return
    } else if (level == 4) {
      preloadLottieFile('confetti.json')
    } else {
      preloadLottieFile(`level_${level + 1}_bg.json`)
      preloadLottieFile(`level_${level + 1}_glasses.json`)
    }
  }, [level, step])

  async function preloadLottieFile(path: string) {
    if (lottieData[path]) return
    const request = await fetch(path)
    const data = await request.json()
    setLottieData((lottieData) => ({ ...lottieData, [path]: data }))
  }

  async function onLevelCompleted(time: number) {
    stopAudio('sound/music.mp3')
    setLives(3)
    setPoints((points) => {
      points = points + level * 300 + lives * 300 + time * 50
      if (level >= 4) {
        setStep('game_won')
        if (isMexico && name) {
          userRequest
            .then(async (user) => {
              const db = getDatabase()
              await push(ref(db, `users/${user.uid}/scores`), {
                time: new Date().toISOString(),
                points,
              })
            })
            .catch((error) => {
              console.error(error)
              alert(error.message)
            })
        }
        // @ts-ignore
        gtag('event', 'game_won', {
          event_category: 'Game',
          event_label: 'Game Won',
          value: points,
        })
      } else {
        setStep('level_outro')
        // @ts-ignore
        gtag('event', `level_${level}_completed`, {
          event_category: 'Game',
          event_label: `Level ${level} Completed`,
          value: points,
        })
      }
      return points
    })
  }

  function onPoints(increase: number) {
    setPoints((points) => points + increase)
  }

  function onLifeLost() {
    setLives((lives) => {
      if (lives > 1) {
        return lives - 1
      } else {
        if (!mute.current) playAudio('sound/game_lost.mp3')
        setStep('game_over')
        // @ts-ignore
        gtag('event', 'game_lost', {
          event_category: 'Game',
          event_label: 'Game Lost',
          value: points,
        })
        return 0
      }
    })
  }

  function onPlayAgain(won: boolean) {
    setPoints(0)
    setLives(3)
    // you still advance in the levels even though you lost
    if (won) setLevel(1)
    setStep('level_intro')
  }

  if (loading) return <LoadingScreen />
  return (
    <>
      {isDebug && <DebugLanguageSelector />}
      <Background playsInline autoPlay loop muted src="background.mp4" />
      {!['intro', 'how_to_play'].includes(step) && isMobile && (
        <ForceLandscape />
      )}
      <TransitionGroup component={null}>
        <CSSTransition key={step} timeout={500}>
          {(() => {
            switch (step) {
              case 'intro':
                return isMexico ? (
                  <IntroMexico
                    name={name}
                    onNextStep={() => setStep('how_to_play')}
                  />
                ) : (
                  <Intro onNextStep={() => setStep('how_to_play')} />
                )
              case 'how_to_play':
                return <HowToPlay onNextStep={() => setStep('level_intro')} />
              case 'level_intro':
                return (
                  <LevelIntro
                    lottieData={lottieData}
                    level={level}
                    onNextStep={() => {
                      setStep('game')
                      if (!mute.current) playAudio('sound/music.mp3')
                    }}
                  />
                )
              case 'game':
                return (
                  <Game
                    lottieData={lottieData}
                    level={level}
                    points={points}
                    lives={lives}
                    mute={mute}
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
                return <GameOver onPlayAgain={() => onPlayAgain(false)} />
              case 'game_won':
                return (
                  <GameWon
                    onPlayAgain={() => onPlayAgain(true)}
                    showPrizeInfo={isMexico && !!name}
                    points={points}
                    lottieData={lottieData}
                  />
                )
            }
          })()}
        </CSSTransition>
      </TransitionGroup>
    </>
  )
}
