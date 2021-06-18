import styled from 'styled-components'
import Button from './button'
import { useLanguage } from './language_provider'

const CookieNoticeBase = styled.div`
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  display: flex;
  font-size: 0.9rem;
  flex-flow: column nowrap;
  align-items: center;
  line-height: 1;
  background: black;
  color: white;
  padding: 2rem;

  & + div {
    padding-bottom: 300px;
  }
`

const Notice = styled.div`
  max-width: 800px;
  text-align: center;
`

const Accept = styled(Button)`
  margin: 1rem 0;
`

const Reject = styled.div`
  text-decoration: underline;
  cursor: pointer;
`

interface CookieNoticeProps {
  onClickAccept: () => void
  onClickReject: () => void
}

export default function CookieNotice(
  props: CookieNoticeProps,
): React.ReactElement {
  const { getTranslation } = useLanguage()
  return (
    <CookieNoticeBase>
      <Notice>{getTranslation('cookieNotice')}</Notice>
      <Accept onClick={props.onClickAccept}>
        {getTranslation('cookieNoticeAccept')}
      </Accept>
      <Reject onClick={props.onClickReject}>
        {getTranslation('cookieNoticeReject')}
      </Reject>
    </CookieNoticeBase>
  )
}
