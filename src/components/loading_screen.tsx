import styled from 'styled-components'

const Background = styled.video`
  position: fixed;
  height: 100%;
  width: 100%;
  object-fit: cover;
  z-index: -1;
`

export const LoadingAnimation = styled.div`
  display: inline-block;
  position: absolute;
  width: 140px;
  height: 140px;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;

  &::after {
    content: '';
    display: block;
    border-radius: 50%;
    width: 0;
    height: 0;
    margin: 8px;
    box-sizing: border-box;
    border: 32px solid #fff;
    border-color: #fff transparent #fff transparent;
    animation: spin 1.2s infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0);
      animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
    }
    50% {
      transform: rotate(900deg);
      animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    }
    100% {
      transform: rotate(1800deg);
    }
  }
`

export default function LoadingScreen() {
  return (
    <>
      <Background playsInline autoPlay loop muted src="background.mp4" />
      <LoadingAnimation />
    </>
  )
}
