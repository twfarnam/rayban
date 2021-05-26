import { useEffect } from 'react'
import styled from 'styled-components'
// @ts-ignore
import phone from '../../static/phone.svg'
import CenterContainer from './center_container'
import Heading from './heading'
import { useLanguage } from './language_provider'

const ForceLandscapeBase = styled(CenterContainer)`
  @media (orientation: portrait) {
    & + * {
      display: none;
    }
  }

  @media (orientation: landscape) {
    display: none;
  }
`

const PhoneAnimation = styled.div`
  width: 50%;
  margin: 1rem auto;

  & svg {
    width: 100%;
    animation: rotate 1s ease-in-out infinite;
  }

  & .arrow {
    fill: white;
    animation: fade 1s ease-in-out infinite;
  }

  & .square {
    fill: none;
    stroke: white;
  }

  @keyframes rotate {
    0% {
      transform: rotate(45deg);
    }
    70% {
      transform: rotate(-45deg);
    }
    100% {
      transform: rotate(-45deg);
    }
  }

  @keyframes fade {
    0% {
      opacity: 1;
    }
    70% {
      opacity: 0;
    }
    100% {
      opacity: 0;
    }
  }
`

interface ForceLandscapeProps {}

export default function ForceLandscape({}: ForceLandscapeProps): React.ReactElement {
  const { getTranslation } = useLanguage()

  return (
    <ForceLandscapeBase>
      <Heading>{getTranslation('rotateToLandscape')}</Heading>
      <PhoneAnimation dangerouslySetInnerHTML={{ __html: phone as string }} />
    </ForceLandscapeBase>
  )
}
