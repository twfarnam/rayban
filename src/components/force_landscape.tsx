import { useEffect } from 'react'
import copy from '../copy'
// import styled from 'styled-components'
import CenterContainer from './center_container'
import { useLanguage } from './language_provider'

// const PhoneAnimation = styled(IoPhonePortraitOutline)`
//   font-size: 10em;
//   animation: rotate 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
//
//   @keyframes rotate {
//     0% {
//       transform: rotate(0);
//     }
//     90% {
//       transform: rotate(-90deg);
//     }
//     100% {
//       transform: rotate(-90deg);
//     }
//   }
//

interface ForceLandscapeProps {
  onNextStep: () => void
}

export default function ForceLandscape({
  onNextStep,
}: ForceLandscapeProps): React.ReactElement {
  const { language } = useLanguage()

  useEffect(() => {
    const advance = () => onNextStep()
    window.addEventListener('orientationchange', advance)
    return () => window.removeEventListener('orientationchange', advance)
  })

  return (
    <CenterContainer>
      <h1>{copy[language].rotateToLandscape}</h1>
      <img src="phone_rotate.gif" />
    </CenterContainer>
  )
}
