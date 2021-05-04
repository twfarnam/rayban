// import styled from 'styled-components'
import copy from '../copy'
import CenterContainer from './center_container'
import { useLanguage } from './language_provider'

interface WonProps {
  // onPlayAgain: () => {}
}

export default function Won(props: WonProps): React.ReactElement {
  const { language } = useLanguage()
  return (
    <CenterContainer>
      <h1>{copy[language].won}</h1>
    </CenterContainer>
  )
}
