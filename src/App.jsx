import { useState, useEffect } from 'react'
import Nav from "./components/Navebar"
import './App.css'
import './utils/storage'
import Dashboard from './components/dashboard'
import About from './components/About'
import FloatingCheckWindow from './components/floatingcheckwindow'
import Hero from './components/hero'
import Footer from './components/footer'
import ProfileSettings from './components/profile'
import ChatWidget from './components/chatwidget'
import HealthImportance from "./components/healthimportance"
import {watchUser,logOut} from "./utils/auth"
import LoginWindow from './components/login'
import { clearState, loadGeminiSettings, loadState, saveGeminiSettings, saveState } from './utils/storage'
function defaultState(){
  return {profile:null, history:[]}
}
function App() {
const [state, setState] = useState(defaultState())
const [geminiSettings,setgeminisettings]=useState(()=>loadGeminiSettings())
const [checkWindow,setCheckWindow]=useState(null)
const [showProfile,setShowProfile]=useState(false)
const [showLogin, setShowLogin]=useState(false)
const [loginMode,setLoginMode]=useState("login")
const [logoutBanner,setLogoutBanner]=useState(false)
const [pendingAction,setPendingAction]=useState(null)
const [welcomeBanner,setWelcomeBanner]=useState(false)
const [user,setUser]=useState(null)
const [authChecked,setAuthChecked]=useState(false)
const [hydratedFor, setHydratedFor] = useState(null)
// Listen for Firebase auth state on mount
  useEffect(() => {
    const unsubscribe = watchUser((firebaseUser) => {
      setUser(firebaseUser)
      setAuthChecked(true)
    })
    return unsubscribe
  }, [])
  // load this user's data 
useEffect(() => {
  if (user) { 
    setState(loadState(user.uid) || defaultState()) 
    setHydratedFor(user.uid) 
  }
   else { 
    setState(defaultState()) 
    setHydratedFor(null) 
  } }, [user]) // save only after loading finished for this same user useEffect(() => { if (user && hydratedFor === user.uid) saveState(user.uid, state) }, [user, hydratedFor, state]) // after all hooks, before the main return: if (!authChecked) { return <div className="text-center p-5 text-secondary">Loading…</div> }
// Load this user's saved profile/history whenever they log in or out
  useEffect(() => {
    if (user) {
      setState(loadState(user.uid) || defaultState())
    } else {
      setState(defaultState())
    }
  }, [user])

  // Persist state for the current user whenever it changes
  useEffect(() => {
    if (user) saveState(user.uid, state)
  }, [user, state])
function handleSetProfile(profile){
  setState(previous=>({...previous,profile}))

  
}
function handleSaveCheckIn(entry){
  const record={id:crypto.randomUUID(),date:new Date().toISOString(),...entry}
  setState(previous=>({...previous,history:[record,...previous.history]}))


}
function handleSaveGemini(settings){
setgeminisettings(settings)
saveGeminiSettings(settings)
}
function handleResetData(){
  clearState()
  setState(defaultState())
  setShowProfile(false)
  setCheckWindow(null)
}
function scrollToSection(id){
  document.getElementById(id)?.scrollIntoView({behavior:"smooth"})


}
// Open the login window on the "Log In" tab or the "Sign Up" tab
  function openLogin(mode) {
    setLoginMode(mode)
    setShowLogin(true)
  }

  function handleGetStarted() {
    if (user) {
      setCheckWindow('check')
    } else {
      setPendingAction('check')
      openLogin('login')
    }
  }

  function handleOpenProfile() {
    if (user) {
      setShowProfile(true)
    } else {
      setPendingAction('profile')
      openLogin('login')
    }
  }

  function handleOpenHistory() {
    if (user) {
      setCheckWindow('history')
    } else {
      setPendingAction('history')
      openLogin('login')
    }
  }
function handleAuthSuccess() {
    setShowLogin(false)
    setLogoutBanner(false)
    setWelcomeBanner(true)
    setTimeout(() => setWelcomeBanner(false), 4000)

    if (pendingAction === 'check') setCheckWindow('check')
    if (pendingAction === 'history') setCheckWindow('history')
    if (pendingAction === 'profile') setShowProfile(true)
    setPendingAction(null)
  }

  async function handleLogout() {
    await logOut()
    setCheckWindow(null)
    setShowProfile(false)
    setPendingAction(null)
    setWelcomeBanner(false)
    setLogoutBanner(true)
    setTimeout(() => setLogoutBanner(false), 4000)
  }
const latestEntry=state.history[0]
const latestvitals=latestEntry?{symptoms:latestEntry.symptoms,mood:latestEntry.mood,temperature:latestEntry.temperature,heartRate:latestEntry.heartRate}
:null
if (!authChecked) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
        <span className="text-secondary">Loading…</span>
      </div>
    )
  }
return (
    <div className="">

    
    <Nav
    user={user}
    profile={state.profile}
    onOpenProfile={()=>setShowProfile(true)}
    onGetStarted={()=>{setCheckWindow("check");console.log(checkWindow)}}
    onLoginClick={() => openLogin('login')}
        onSignupClick={() => openLogin('signup')}
        onLogout={handleLogout}
    onNavigate={scrollToSection}
    />
    {welcomeBanner && user && (
        <div className="alert alert-success text-center mb-0 rounded-0 py-2">
          Welcome, {state.profile?.name || user.displayName || user.email} 👋
        </div>
      )}

      {logoutBanner && !user && (
        <div className="alert alert-secondary text-center mb-0 rounded-0 py-2">
          You are logged out. See you soon!
        </div>
      )}
    <Hero  onGetStarted={()=>{setCheckWindow("check");console.log(checkWindow)}} />
      <HealthImportance/>
    <Dashboard
     profile={state.profile}
     history={state.history}
     onOpenHistory={()=>setCheckWindow("history")}
     onGetStarted={()=>setCheckWindow("check")}
    />
    <About/>
    <Footer/>
    {checkWindow && (
        <FloatingCheckWindow
          initialTab={checkWindow}
          profile={state.profile}
          onSetProfile={handleSetProfile}
          history={state.history}
          onSaveCheckIn={handleSaveCheckIn}
        geminiSettings={geminiSettings}
          onClose={() => setCheckWindow(null)}
        />
      )}
      {showProfile && (
        <ProfileSettings
          user={user}
          profile={state.profile}
          onClose={() => setShowProfile(false)}
          onSaveProfile={handleSetProfile}
          onResetData={handleResetData}
          onLogout={handleLogout}
        />
      )}

      {showLogin && (
        <LoginWindow
          initialMode={loginMode}
          onClose={() => { setShowLogin(false); setPendingAction(null) }}
          onSuccess={handleAuthSuccess}
        />
      )}
      <ChatWidget geminiSettings={geminiSettings}latestVitals={latestvitals}></ChatWidget>
    </div>
   
  )
}

export default App
