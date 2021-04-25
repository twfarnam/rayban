import { useState, useEffect } from 'react'
import { IoPhonePortraitOutline } from 'react-icons/io5'
import styled from 'styled-components'
import Game from './game'
import outlines from './outlines'
import translations from './translations'

const CenterContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  min-height: 100%;
`

const Glasses = styled.img`
  width: 100%;
`

const Button = styled.button`
  font-size: 26px;
  border: 2px solid black;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  font-family: inherit;
  padding: 0.8rem 2rem;
  line-height: 1;
  background: linear-gradient(180deg, #8b0f27 0%, #d14341 100%);
`

const ChangeLanguage = styled.button`
  background: none;
  border: none;
  color: white;
  text-decoration: underline;
  margin: 1rem 0;
  cursor: pointer;
`

const MessageContainer = styled.div`
  width: 100%;
  position: relative;
`

const Message = styled.div`
  font-size: 7rem;
  font-family: 'RayBanSansInline';
  position: absolute;
  left: 0;
  right: 0;
  top: calc(50% - 1rem);
  transform: translateY(-50%);
  text-align: center;
  z-index: 3;
`

const PhoneAnimation = styled(IoPhonePortraitOutline)`
  font-size: 10em;
  animation: rotate 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;

  @keyframes rotate {
    0% {
      transform: rotate(0);
    }
    90% {
      transform: rotate(-90deg);
    }
    100% {
      transform: rotate(-90deg);
    }
  }
`

type AppStep =
  | 'intro'
  | 'how'
  | 'force_horizontal'
  | 'wayfarer'
  | 'playing'
  | 'end'

export default function App(): React.ReactElement | null {
  const [language, setLanguage] = useState<'es' | 'en'>('en')
  const [step, setStep] = useState<AppStep>('intro')
  const [points, setPoints] = useState<number>(0)
  const [lives, setLives] = useState<number>(3)
  const [level, setLevel] = useState<number>(1)
  const [message, setMessage] = useState<string>('')
  const isMobile = /android|iphone|ipad|ipod/i.test(window.navigator.userAgent)

  useEffect(() => {
    if (step != 'force_horizontal') return
    const advance = () => setStep('wayfarer')
    window.addEventListener('orientationchange', advance)
    return () => window.removeEventListener('orientationchange', advance)
  }, [step])

  useEffect(() => window.scrollTo(0, 0), [step])

  switch (step) {
    case 'intro':
      return (
        <CenterContainer>
          <p>{translations[language].intro}</p>
          <Button onClick={() => setStep('how')}>
            {translations[language].introButton}
          </Button>
          {language == 'es' && (
            <ChangeLanguage onClick={() => setLanguage('en')}>
              {translations['en'].changeLanguage}
            </ChangeLanguage>
          )}
          {language == 'en' && (
            <ChangeLanguage onClick={() => setLanguage('es')}>
              {translations['es'].changeLanguage}
            </ChangeLanguage>
          )}
        </CenterContainer>
      )
    case 'how':
      return (
        <CenterContainer>
          <h1>{translations[language].howToPlayHeader}</h1>
          {translations[language].howToPlay.split('\n').map((text, key) => (
            <p key={key}>{text}</p>
          ))}
          <Button
            onClick={() =>
              isMobile && window.innerWidth < window.innerHeight
                ? setStep('force_horizontal')
                : setStep('wayfarer')
            }>
            {translations[language].start}
          </Button>
        </CenterContainer>
      )
    case 'force_horizontal':
      return (
        <CenterContainer>
          <h1>{translations[language].rotateToLandscape}</h1>
          <img src="phone_rotate.gif" />
        </CenterContainer>
      )
    case 'wayfarer':
      return (
        <CenterContainer onClick={() => setStep('playing')}>
          <h1>Wayfarer</h1>
          <p>{translations[language].wayfarerYear}</p>
          <Glasses src="wayfarer.png" />
          <Button>
            {level == 1
              ? translations[language].goToLevelOne
              : translations[language].goToNextLevel}
          </Button>
        </CenterContainer>
      )
    case 'playing':
      return (
        <CenterContainer>
          <MessageContainer>
            <Message>{message}</Message>
            <Game
              level={level}
              lives={lives}
              language={language}
              points={points}
              outline={outlines['wayfarer']}
              onLifeLost={() => setLives((lives) => lives - 1)}
              onLevelCompleted={() => {
                setPoints((points) => points + level * 300 + lives * 300)
                if (level < 2) {
                  setMessage(translations[language].levelCompleted)
                  setTimeout(() => {
                    setMessage('')
                    setStep('wayfarer')
                    setLevel(level + 1)
                  }, 2000)
                } else {
                  setMessage('You won!')
                }
              }}
              onPoints={(increase: number) =>
                setPoints((points) => points + increase)
              }
            />
          </MessageContainer>
        </CenterContainer>
      )
    default:
      return null
  }
}
