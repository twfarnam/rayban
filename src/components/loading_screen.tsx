import styled from 'styled-components'
import LoadingAnimation from './loading_animation'

const Background = styled.video`
  position: fixed;
  height: 100%;
  width: 100%;
  object-fit: cover;
  z-index: -1;
`

export default function LoadingScreen(): React.ReactElement {
  return (
    <>
      <Background playsInline autoPlay loop muted src="background.mp4" />
      <LoadingAnimation />
    </>
  )
}
