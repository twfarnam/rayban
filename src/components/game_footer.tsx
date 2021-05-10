import times from 'lodash/times'
import styled from 'styled-components'
// @ts-ignore
import raybanIcon from '../../static/rb_icon.svg'
import copy from '../copy'
import { useLanguage } from './language_provider'

const GameFooterBase = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 0;

  @media (max-width: 800px) {
    padding-top: 0;
  }
`

const Copy = styled.div`
  font-size: 1.2rem;
  text-align: center;
  margin: 0 1rem;

  @media (max-width: 800px) {
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

  @media (max-width: 800px) {
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

  @media (max-width: 800px) {
    & {
      padding: 1rem 2rem;
    }
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

  @media (max-width: 800px) {
    & > svg {
      width: 20px;
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
  const { language } = useLanguage()
  return (
    <GameFooterBase>
      <Column>
        <Border>
          <Points>{points.toString().padStart(5, '0')}</Points>
        </Border>
        {copy[language].points}
      </Column>
      <Copy>
        {
          // @ts-ignore
          copy[language][`level${level}Header`]
        }
      </Copy>
      <Column>
        <Border>
          <Lives>
            {times(lives, (i) => (
              <RayBanIcon
                key={i}
                dangerouslySetInnerHTML={{ __html: raybanIcon as string }}
              />
            ))}
          </Lives>
        </Border>
        {copy[language].lives}
      </Column>
    </GameFooterBase>
  )
}
