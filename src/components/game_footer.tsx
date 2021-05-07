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
  margin-top: 2rem;
`

const Copy = styled.div`
  font-size: 1.2rem;
  text-align: center;
  margin: 0 1rem;
`

const Border = styled.div`
  background-image: url('small_border.png');
  background-size: contain;
  padding: 2rem 3rem;
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

const Lives = styled.div`
  display: flex;
  flex-flow: row nowrap;
  font-size: 2rem;
`

const RayBanIcon = styled.div`
  margin-right: 10px;

  &:last-child {
    margin-right: 0;
  }

  & > svg {
    width: 30px;
    fill: white;
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
        <Border>{points.toString().padStart(5, '0')}</Border>
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
