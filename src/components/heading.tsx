import styled from 'styled-components'
import { mobileBreakpoint } from '../utility'

export default styled.h1`
  text-align: center;
  font-weight: 400;
  margin: 1rem 0;

  @media ${mobileBreakpoint} {
    margin: 0.5rem 0;
  }
`
