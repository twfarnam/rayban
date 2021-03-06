import Lottie from 'lottie-react'
import styled from 'styled-components'
import { mobileBreakpoint } from '../utility'

const GlassesAnimationBase = styled.div`
  width: 80%;
  position: relative;

  &::before {
    content: '';
    display: block;
    padding-top: 40%;
  }

  @media ${mobileBreakpoint} {
    width: 50%;
  }
`

const Animation = styled(Lottie)`
  position: absolute;
  top: -18%;
  width: 100%;
`

interface GlassesAnimationProps {
  level: number
  lottieData: Record<string, any>
}

export default function GlassesAnimation({
  level,
  lottieData,
}: GlassesAnimationProps): React.ReactElement {
  return (
    <GlassesAnimationBase>
      {lottieData[`level_${level}_glasses.json`] && (
        <Animation animationData={lottieData[`level_${level}_glasses.json`]} />
      )}
    </GlassesAnimationBase>
  )
}
