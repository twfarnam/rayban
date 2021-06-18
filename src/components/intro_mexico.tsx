import { useState, useLayoutEffect } from 'react'
import styled from 'styled-components'
import { mobileBreakpoint } from '../utility'
import Button from './button'
import CenterContainer from './center_container'
import { useLanguage } from './language_provider'
import LegalText from './legal_text'
import PrivacyPolicy from './privacy_policy'
import Registration from './registration'
import Terms from './terms'

const IntroMexicoBase = styled(CenterContainer)`
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
  font-size: 1em;
  text-align: center;
  margin-bottom: 1rem;

  @media ${mobileBreakpoint} {
    font-size: 1rem;
  }
`

const Spacer = styled.div`
  flex-grow: 1;
`

interface IntroMexicoProps {
  name?: string
  onNextStep: () => void
}

export default function IntroMexico({
  name,
  onNextStep,
}: IntroMexicoProps): React.ReactElement | null {
  const { getTranslation } = useLanguage()
  const [page, setPage] = useState<'terms' | 'privacyPolicy' | 'form'>('form')
  const [pageChanged, setPageChanged] = useState<boolean>(false)

  function onClickShowPrivacy(event: React.MouseEvent) {
    event.preventDefault()
    setPage('privacyPolicy')
    setPageChanged(true)
  }

  function onClickShowTerms(event: React.MouseEvent) {
    event.preventDefault()
    setPage('terms')
    setPageChanged(true)
  }

  useLayoutEffect(() => {
    if (!pageChanged) return
    window.scrollTo(0, 100000)
  }, [page, pageChanged])

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
      <IntroMexicoBase>
        <Logo src="logo_and_icon_series.svg" />
        <LargeCopy>
          ¡COMPLETA LAS 4 FORMAS Y CONVIÉRTETE EN UN RAY-BAN ICON MASTER!
          <br />
          ADEMÁS, ¡LIVERPOOL TE PREMIARÁ SI ERES UNO DE LOS 2 MEJORES PUNTAJES CON UN GUITAR HERO LIVE!
        </LargeCopy>
        <SmallCopy>
          PARA PARTICIPAR POR GUITAR HERO LIVE ES NECESARIO REALIZAR LA COMPRA DE TUS RAY-BAN
          EN LIVERPOOL,
          <br />
          REGISTRAR TU TICKET DE COMPRA Y SI ERES UNO DE LOS 2 PUNTAJES MÁS
          ALTOS, ¡GANARÁS!
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
      </IntroMexicoBase>
    </>
  )
}
