import times from 'lodash/times'
import { IoHeart, IoHeartOutline } from 'react-icons/io5'
import styled from 'styled-components'
import copy from '../copy'
import { useLanguage } from './language_provider'

const GameFooterBase = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  font-size: 2rem;
`

const Copy = styled.div`
  font-size: 1.2em;
  text-align: center;
  margin: 0 1rem;
  align-self: flex-start;
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
`

const Heart = styled(IoHeart)``
const EmptyHeart = Heart.withComponent(IoHeartOutline)

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
            {times(3, (i) =>
              i >= lives ? <EmptyHeart key={i} /> : <Heart key={i} />,
            )}
          </Lives>
        </Border>
        {copy[language].lives}
      </Column>
    </GameFooterBase>
  )
}
