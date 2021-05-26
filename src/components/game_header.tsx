import { useMediaQuery } from '@react-hook/media-query'
import Lottie from 'lottie-react'
import styled from 'styled-components'
import { mobileBreakpoint } from '../utility'
import CenterContainer from './center_container'
import { useLanguage } from './language_provider'

const GameHeaderBase = styled(CenterContainer)`
  align-items: stretch;
  min-height: initial;
  padding-bottom: 0;
`

const Logo = styled.img`
  position: absolute;
  top: 2rem;
  left: 2rem;
  width: 200px;
`

const IconSeriesLogo = styled.img`
  width: 200px;
  margin-top: 1rem;
`

const AnimationContainer = styled.div`
  width: 100%;
  position: relative;

  &::before {
    content: '';
    display: block;
    padding-top: 17%;
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
`

const RowContent = styled.div`
  position: relative;
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

  @media ${mobileBreakpoint} {
    font-size: 3rem;
  }

  body[data-lang='zh-cn'] & {
    font-size: 3em;

    @media ${mobileBreakpoint} {
      font-size: 1rem;
    }
  }
`

const RedStripes = styled.div`
  flex-grow: 1;
  color: ${(props) => props.theme.red};
  position: relative;
  top: -0.5em;
  font-size: 1.2em;
  margin: 0 1rem;

  & small {
    font-size: 0.8em;
  }
`

const RedStripesIndicator = styled.div`
  position: absolute;
  top: 100%;
  width: 100%;
  border-bottom: 9px double rgb(118, 22, 23);

  &.top {
    border-color: ${(props) => props.theme.red};
    z-index: 5;
  }

  @media ${mobileBreakpoint} {
    border-bottom: 6px double rgb(118, 22, 23);
  }
`

const Level = styled.div`
  font-size: 2rem;
  color: ${(props) => props.theme.red};

  @media ${mobileBreakpoint} {
    font-size: 1rem;
  }
`

interface GameHeaderProps {
  level: number
  time: number
  lottieData: Record<string, any>
}

export default function GameHeader({
  level,
  time,
  lottieData,
}: GameHeaderProps): React.ReactElement {
  const { getTranslation } = useLanguage()
  const isDesktopViewport = useMediaQuery('(min-width: 800px)')
  return (
    <>
      {isDesktopViewport && <Logo src="logo.png" />}
      {isDesktopViewport && <IconSeriesLogo src="icon_series.svg" />}
      <GameHeaderBase>
        {isDesktopViewport && (
          <AnimationContainer>
            {lottieData[`level_${level}_bg.json`] && (
              <Animation animationData={lottieData[`level_${level}_bg.json`]} />
            )}
          </AnimationContainer>
        )}
        <Row>
          <RowBackground src="large_border.png" />
          <RowContent>
            <LevelName>
              {
                // @ts-ignore
                getTranslation(`level${level}Glasses`)
              }
            </LevelName>
            <RedStripes>
              {Math.round(time)} <small>{getTranslation('seconds')}</small>
              <RedStripesIndicator />
              <RedStripesIndicator
                className="top"
                style={{ width: Math.round((time / 60) * 100) + '%' }}
              />
            </RedStripes>
            <Level>
              {
                // @ts-ignore
                getTranslation('level' + level)
              }
            </Level>
          </RowContent>
        </Row>
      </GameHeaderBase>
    </>
  )
}
