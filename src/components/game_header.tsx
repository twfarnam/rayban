import Lottie from 'lottie-react'
import { useState, useEffect } from 'react'
import styled from 'styled-components'
import copy from '../copy'
import CenterContainer from './center_container'
import { useLanguage } from './language_provider'

const GameHeaderBase = styled(CenterContainer)`
  align-items: stretch;
  min-height: initial;
  padding-bottom: 0;
`

const Logo = styled.img`
  width: 200px;
  margin: 2rem 2rem 0;
`

const AnimationContainer = styled.div`
  width: 100%;
  position: relative;

  &::before {
    content: '';
    display: block;
    padding-top: 29.2%;
  }
`

const Animation = styled(Lottie)`
  position: absolute;
  top: 0;
  width: 100%;
`

const Row = styled.div`
  position: relative;
  margin: 0 -1rem;
`

const RowBackground = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: -1;
`

const RowContent = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  z-index: 1;
  line-height: 1;
  padding: 1rem 3rem 1.2rem;
`

const LevelName = styled.div`
  font-size: 5rem;
  font-family: 'RayBanSansInline';
`

const RedStripes = styled.div<{ percentComplete: number }>`
  flex-grow: 1;
  color: ${(props) => props.theme.red};
  position: relative;
  top: -0.7em;
  font-size: 1.2em;
  margin: 0 1rem;

  &::before {
    content: '';
    display: block;
    position: absolute;
    top: 100%;
    width: 100%;
    border-bottom: 3px solid rgb(118, 22, 23);
    height: 6px;
    border-top: 3px solid rgb(118, 22, 23);
  }

  &::after {
    content: '';
    display: block;
    position: absolute;
    top: 100%;
    width: ${(props) => props.percentComplete}%;
    border-bottom: 3px solid currentColor;
    height: 6px;
    border-top: 3px solid currentColor;
  }
`

const Level = styled.div`
  font-size: 2rem;
  color: ${(props) => props.theme.red};
`

interface GameHeaderProps {
  level: number
  percentComplete: number
}

const levelNames = {
  1: 'Round',
  2: 'Aviator',
  3: 'Wayfarer',
  4: 'Clubmaster',
} as Record<number, string>

export default function GameHeader({
  level,
  percentComplete,
}: GameHeaderProps): React.ReactElement {
  const { language } = useLanguage()
  const [animationData, setAnimationData] = useState<Record<string, unknown>>()

  useEffect(() => {
    const controller = new AbortController()
    fetch(`level_${level}_bg.json`, { signal: controller.signal })
      .then((request) => request.json())
      .then((data) => setAnimationData(data))
    return () => controller.abort()
  }, [])

  return (
    <>
      <Logo src="logo.png" />
      <GameHeaderBase>
        <AnimationContainer>
          {animationData && <Animation animationData={animationData} />}
        </AnimationContainer>
        <Row>
          <RowBackground src="large_border.png" />
          <RowContent>
            <LevelName>{levelNames[level]}</LevelName>
            <RedStripes percentComplete={percentComplete}>
              {percentComplete}%
            </RedStripes>
            <Level>
              {copy[language].level} {level}
            </Level>
          </RowContent>
        </Row>
      </GameHeaderBase>
    </>
  )
}
