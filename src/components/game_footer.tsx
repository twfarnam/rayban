import times from 'lodash/times'
import styled from 'styled-components'
// @ts-ignore
import raybanIcon from '../../static/rb_icon.svg'
import { mobileBreakpoint } from '../utility'
import { useLanguage } from './language_provider'

const GameFooterBase = styled.div`
  width: 100%;
  max-width: 800px;
  margin 0 auto;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;

  @media  ${mobileBreakpoint}{
    padding-top: 0;
  }
`

const Copy = styled.div`
  font-size: 1.2rem;
  text-align: center;
  margin: 0 1rem;

  @media ${mobileBreakpoint} {
    font-size: 1rem;
  }
`

const Border = styled.div`
  font-size: 1.8rem;
  background-image: url('small_border.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  color: white;
`

const Column = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  color: ${(props) => props.theme.red};
`

const Points = styled.div`
  line-height: 1;
  padding: 1.8rem 3rem 2rem;

  @media ${mobileBreakpoint} {
    & {
      padding: 1rem 2rem;
      font-size: 1.2rem;
    }
  }
`

const Lives = styled.div`
  display: flex;
  flex-flow: row nowrap;
  padding: 1.5rem 2rem;

  @media ${mobileBreakpoint} {
    & {
      padding: 1rem 2rem;
    }
  }
`

const LivesIcon = styled.div`
  width: 40px;
  margin-right: 10px;

  &:last-child {
    margin-right: 0;
  }

  @media ${mobileBreakpoint} {
    width: 15px;
    margin-right: 3px;
  }
`

const RayBanIcon = styled.div`
  margin-right: 10px;

  &:last-child {
    margin-right: 0;
  }

  & > svg {
    width: 40px;
    fill: white;
  }

  @media ${mobileBreakpoint} {
    margin-right: 3px;

    & > svg {
      width: 15px;
    }
  }
`

interface GameFooterProps {
  points: number
  lives: number
  level: number
}

export default function GameFooter({
  points,
  lives,
  level,
}: GameFooterProps): React.ReactElement {
  const { getTranslation } = useLanguage()
  return (
    <GameFooterBase>
      <Column>
        <Border>
          <Points>{points.toString().padStart(5, '0')}</Points>
        </Border>
        {getTranslation('points')}
      </Column>
      <Copy>
        {
          // @ts-ignore
          getTranslation(`level${level}Header`)
        }
      </Copy>
      <Column>
        <Border>
          <Lives>
            {times(3, (i) =>
              i >= lives ? (
                <LivesIcon key={i} />
              ) : (
                <RayBanIcon
                  key={i}
                  dangerouslySetInnerHTML={{ __html: raybanIcon as string }}
                />
              ),
            )}
          </Lives>
        </Border>
        {getTranslation('lives')}
      </Column>
    </GameFooterBase>
  )
}
