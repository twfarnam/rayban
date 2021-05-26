import styled from 'styled-components'
import { useLanguage, LanguageOption } from './language_provider'

const DebugLanguageSelectorBase = styled.div`
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1000;

  & select {
    width: 150px;
  }
`

export default function DebugLanguageSelector(): React.ReactElement {
  const { language, setLanguage } = useLanguage()
  return (
    <DebugLanguageSelectorBase>
      <select
        value={language}
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
      </select>
    </DebugLanguageSelectorBase>
  )
}
