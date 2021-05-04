// import styled from 'styled-components'
import copy from '../copy'
import CenterContainer from './center_container'
import { useLanguage } from './language_provider'

interface GameOverProps {
  // onPlayAgain: () => {}
}

export default function GameOver(props: GameOverProps): React.ReactElement {
  const { language } = useLanguage()
  return (
    <CenterContainer>
      <h1>{copy[language].gameOver}</h1>
    </CenterContainer>
  )
}
