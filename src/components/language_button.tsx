import { useState } from 'react'
import styled from 'styled-components'
import { isMobile } from '../config'
import { useLanguage, LanguageOption } from './language_provider'

const LanguageButtonBase = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`

const Label = styled.label`
  display: block;
  font-size: 1.2em;
`

const Select = styled.select`
  border: 2px solid ${(props) => props.theme.red};
  border-radius: 10px;
  padding: 1rem 1.3rem;
  color: white;
  font-family: inherit;
  text-align-last: center;
  font-size: 1em;
  appearance: none;
  background-image: url('data:image/svg+xml;charset=US-ASCII,${encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/></svg>',
    )}'),
    linear-gradient(90deg, #8d3032 0%, #2f0102 100%);
  background-repeat: no-repeat;
  background-position: right 0.4em top 50%, center;
  background-size: 1em auto, auto;
  margin: 0.3rem 0;
`

const FullscreenOptions = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.9);
  overflow: scroll;
  overscroll-behavior: contain;
  z-index: 1;
  display: flex;
  flex-flow: column nowrap;
`

const FullscreenOptionsContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;

  & h1 {
    font-weight: normal;
  }
`

const Option = styled.div`
  font-size: 1.3em;
  cursor: pointer;
  padding: 0.5em 0;
`

export default function LanguageButton(): React.ReactElement {
  const { language, getTranslation, setLanguage } = useLanguage()
  const [open, setOpen] = useState<boolean>(false)

  function onMouseDown(event: React.MouseEvent<HTMLSelectElement>) {
    if (isMobile) return
    event.preventDefault()
    setOpen(true)
  }

  function onClickOption(language: LanguageOption) {
    return () => {
      setOpen(false)
      setLanguage(language)
    }
  }
  return (
    <LanguageButtonBase className="dont-clear-cookie-notice">
      {open && (
        <FullscreenOptions>
          <FullscreenOptionsContainer>
            <h1>Select your language:</h1>
            <Option onClick={onClickOption('en')}>English</Option>
            <Option onClick={onClickOption('es')}>Spanish</Option>
            <Option onClick={onClickOption('pt')}>Portuguese EMEA</Option>
            <Option onClick={onClickOption('pt-br')}>Portuguese Brazil</Option>
            <Option onClick={onClickOption('fr')}>French</Option>
            <Option onClick={onClickOption('de')}>German</Option>
            <Option onClick={onClickOption('it')}>Italian</Option>
            <Option onClick={onClickOption('ja')}>Japanese</Option>
            <Option onClick={onClickOption('th')}>Thai</Option>
            <Option onClick={onClickOption('zh-cn')}>Simplified Chinese</Option>
          </FullscreenOptionsContainer>
        </FullscreenOptions>
      )}
      <Label>{getTranslation('chooseLanguage')}</Label>
      <Select
        value={language}
        onMouseDown={onMouseDown}
        onChange={(event) => setLanguage(event.target.value as LanguageOption)}>
        <option value="en">English</option>
        <option value="es">Spanish</option>
        <option value="pt">Portuguese EMEA</option>
        <option value="pt-br">Portuguese Brazil</option>
        <option value="fr">French</option>
        <option value="de">German</option>
        <option value="it">Italian</option>
        <option value="ja">Japanese</option>
        <option value="th">Thai</option>
        <option value="zh-cn">Simplified Chinese</option>
      </Select>
    </LanguageButtonBase>
  )
}
