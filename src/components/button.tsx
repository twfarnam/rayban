import styled from 'styled-components'

export default styled.button`
  font-size: 1.2rem;
  border: none;
  border-radius: 9px;
  color: white;
  cursor: pointer;
  font-family: inherit;
  padding: 0.8rem 2rem;
  line-height: 1;
  user-select: none;
  background: ${(props) => props.theme.red};
  position: relative;

  &::before {
    display: block;
    content: '';
    position: absolute;
    top: -4px;
    right: -4px;
    bottom: -4px;
    left: -4px;
    background-image: url('border.svg');
    background-image: url(border.svg);
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
`
