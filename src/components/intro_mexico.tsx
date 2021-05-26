import { getDatabase, ref, onValue } from 'firebase/database'
import { useState, useEffect } from 'react'
import styled from 'styled-components'
import copy from '../copy'
import { userRequest } from '../firebase'
import { mobileBreakpoint } from '../utility'
import Button from './button'
import CenterContainer from './center_container'
import { useLanguage } from './language_provider'
import LegalText from './legal_text'
import PrivacyPolicy from './privacy_policy'
import Registration from './registration'
import Terms from './terms'

const IntroBase = styled(CenterContainer)`
  max-width: 1000px;
`

const Logo = styled.img`
  width: 500px;

  @media ${mobileBreakpoint} {
    width: 150px;
  }
`

const LargeCopy = styled.div`
  font-size: 1.4em;
  text-align: center;
  margin: 1rem 0;

  @media ${mobileBreakpoint} {
    font-size: 1.2rem;
  }
`

const SmallCopy = styled.div`
  font-size: 1.2em;
  text-align: center;
  margin-bottom: 1rem;

  @media ${mobileBreakpoint} {
    font-size: 1rem;
  }
`

const Spacer = styled.div`
  flex-grow: 1;
`

const CookieNotice = styled.div`
  font-size: 0.8rem;
  line-height: 1;
  background: black;
  color: white;
  padding: 0.6rem 1.2rem 0.85rem;
  border-radius: 0.7rem;
  margin: 1rem 0;
`

interface IntroProps {
  onNextStep: () => void
}

export default function Intro({
  onNextStep,
}: IntroProps): React.ReactElement | null {
  const { getTranslation } = useLanguage()
  const [loading, setLoading] = useState<boolean>(true)
  const [name, setName] = useState<string>()
  const [page, setPage] = useState<'terms' | 'privacyPolicy' | 'form'>('form')

  useEffect(() => {
    userRequest.then(async (user) => {
      onValue(ref(getDatabase(), 'users/' + user.uid), (snapshot) => {
        const data = snapshot.val()
        if (data && data.name) setName(data.name)
        setLoading(false)
      })
    })
  }, [])

  function onClickShowPrivacy(event: React.MouseEvent) {
    event.preventDefault()
    setPage('privacyPolicy')
  }

  function onClickShowTerms(event: React.MouseEvent) {
    event.preventDefault()
    setPage('terms')
  }

  if (loading) return null
  return (
    <>
      {page == 'terms' && (
        <LegalText
          header="Bases de la Promoción"
          body={<Terms />}
          onClickDone={() => setPage('form')}
        />
      )}
      {page == 'privacyPolicy' && (
        <LegalText
          header="Aviso de Privacidad"
          body={<PrivacyPolicy />}
          onClickDone={() => setPage('form')}
        />
      )}
      <IntroBase>
        <Logo src="logo_and_icon_series.svg" />
        <LargeCopy>
          ¡JUEGA Y SÉ DE LOS MEJORES PUNTAJES PARA GANAR UN PLAY STATION!
        </LargeCopy>
        <SmallCopy>
          PARA PODER PARTICIPAR POR UN PLAY STATION ES NECESARIO REALIZAR LA COMPRA DE UN PRODUCTO RAY-BAN EN TIENDAS PARTICIPANTES LIVERPOOL.
          <br />
          CONSULTA BASES Y CONDICIONES DEL PROGRAMA.
        </SmallCopy>
        {name ? (
          <>
            <LargeCopy>Bienvenidos {name}!</LargeCopy>
            <Button onClick={onNextStep}>
              {getTranslation('introButton')}
            </Button>
          </>
        ) : (
          <Registration
            onNextStep={onNextStep}
            onClickShowPrivacy={onClickShowPrivacy}
            onClickShowTerms={onClickShowTerms}
          />
        )}
        <Spacer />
        <CookieNotice>{getTranslation('cookieNotice')}</CookieNotice>
      </IntroBase>
    </>
  )
}
