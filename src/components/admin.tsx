import {
  User,
  onAuthStateChanged,
  getAuth,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth'
import { useEffect, useState } from 'react'
import { BrowserRouter, Switch, Route, NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { isMexico } from '../config'
import { mobileBreakpoint } from '../utility'
import AdminEvents from './admin_events'
import AdminTraffic from './admin_traffic'
import LoadingAnimation from './loading_animation'
import Scores from './scores'

const AdminBase = styled.div``

const AdminLogin = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  min-height: 100%;
`

const BigLogo = styled.img`
  width: 300px;
  margin-top: -100px;
`

const RoundButton = styled.button`
  padding: 0.5rem 3rem;
  border-radius: 1rem;
  background: white;
  color: black;
  margin: 2rem 0;
`

const Header = styled.div`
  display: flex;
  flex-flow: row;
  align-items: flex-end;
  font-size: 14px;

  @media ${mobileBreakpoint} {
    flex-flow: column;
    align-items: flex-start;
  }
`

const InnerHeader = styled.div`
  flex-grow: 1;
  display: flex;
  flex-flow: row wrap;
  align-items: center;

  @media ${mobileBreakpoint} {
    flex-flow: column;
    align-items: flex-start;
  }
`

const HeaderLink = styled(NavLink)`
  color: inherit;
  text-decoration: none;
  border: 1px solid white;
  border-radius: 1rem;
  padding: 0.5em 3rem;
  margin: 0.5em 0;

  &.active {
    background: white;
    color: black;
  }
`

const Divider = styled.div`
  border-left: 1px solid white;
  height: 20px;
  margin: 0 10px;

  @media ${mobileBreakpoint} {
    display: none;
  }
`

const Spacer = styled.div`
  flex-grow: 1;
`

const SignOut = styled.span`
  cursor: pointer;
`

const Logo = styled.img`
  width: 100px;
  margin-right: 1rem;
`

const Select = styled.select`
  margin: 1rem 0;
`

export default function Admin(): React.ReactElement {
  const [user, setUser] = useState<any>()
  const [loading, setLoading] = useState<boolean>(true)
  const [startDate, setStartDate] = useState<string>('7daysAgo')

  useEffect(() => {
    const auth = getAuth()
    onAuthStateChanged(auth, (user: User) => {
      if (user && user.isAnonymous) {
        signOut(auth)
        setLoading(false)
        return
      }
      setUser(user)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (!user || user.isAnonymous) return
    // @ts-ignore
    gapi.analytics.auth.on('error', (error) => console.error(error))
    // @ts-ignore
    gapi.analytics.ready((a) => {
      // @ts-ignore
      const authResponse = gapi.analytics.auth.getAuthResponse()
      console.log('---> authResponse', authResponse)
      if (!authResponse) {
        // @ts-ignore
        gapi.analytics.auth.on('success', (response) => setLoading(false))
      } else {
        setLoading(false)
      }
      // @ts-ignore
      gapi.analytics.auth?.authorize({
        container: document.createElement('div'),
        clientid:
          '557763689254-20rmsnqhjnn4tadn7f2970ofdjhk6dp1' +
          '.apps.googleusercontent.com',
      })
    })
  }, [user])

  async function onClickSignIn() {
    try {
      setLoading(true)
      const auth = getAuth()
      const provider = new GoogleAuthProvider()
      provider.addScope('https://www.googleapis.com/auth/analytics.readonly')
      const result = await signInWithPopup(auth, provider)
      setUser(result.user)
    } catch (error) {
      console.error(error.email)
      alert(error.message)
    }
  }

  async function onClickSignOut() {
    signOut(getAuth())
    setUser(null)
  }

  function onChangeStartDate(event: React.ChangeEvent<HTMLSelectElement>) {
    setStartDate(event.target.value)
  }

  if (loading) {
    return (
      <AdminLogin>
        <LoadingAnimation />
      </AdminLogin>
    )
  } else if (!user) {
    return (
      <AdminLogin>
        <BigLogo src="/logo_and_icon_series.svg" />
        <RoundButton onClick={onClickSignIn}>Access</RoundButton>
      </AdminLogin>
    )
  } else {
    return (
      <AdminBase>
        <BrowserRouter>
          <Header>
            <Logo src="/logo_and_icon_series.svg" />
            <InnerHeader>
              <HeaderLink exact to="/admin">
                Overview
              </HeaderLink>
              <Divider />
              <HeaderLink exact to="/admin/events">
                Events & Interaction
              </HeaderLink>
              {isMexico && (
                <>
                  <Divider />
                  <HeaderLink exact to="/admin/scores">
                    Scores
                  </HeaderLink>
                </>
              )}
              <Spacer />
              <span>
                You are logged in as <b>{user.email}</b>
              </span>
              <Divider />
              <SignOut onClick={onClickSignOut}>Logout</SignOut>
            </InnerHeader>
          </Header>
          <Route exact path={['/admin', '/admin/events']}>
            <Select value={startDate} onChange={onChangeStartDate}>
              <option value="7daysAgo">7 Days</option>
              <option value="30daysAgo">30 Days</option>
              <option value="2021-06-05">Since June 5th</option>
            </Select>
          </Route>
          <Switch>
            <Route exact path="/admin">
              <AdminTraffic startDate={startDate} />
            </Route>
            <Route exact path="/admin/events">
              <AdminEvents startDate={startDate} />
            </Route>
            {isMexico && (
              <Route exact path="/admin/scores">
                <Scores />{' '}
              </Route>
            )}
          </Switch>
        </BrowserRouter>
      </AdminBase>
    )
  }
}
