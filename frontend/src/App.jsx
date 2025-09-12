import React from 'react'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import SettingsPage from './pages/SettingsPage'
import ProfilePage from './pages/ProfilePage'
import { Routes , Route, Navigate} from 'react-router-dom'
import {useAuthStore} from './store/useAuthStore.js'
import { useThemeStore } from "./store/useThemeStorage.js" 
import { useEffect } from 'react'
import { Loader } from "lucide-react";
import { Toaster } from 'react-hot-toast'

const App = () => {

const {authUser , checkAuth , isCheckingAuth} = useAuthStore();
const {theme} = useThemeStore();

useEffect(() => {
  checkAuth();
},[checkAuth])

// in App.jsx (or a ThemeProvider)
useEffect(() => {
  const root = document.documentElement;
  root.classList.remove('dark');            // prevent conflicts
  root.setAttribute('data-theme', theme);   // apply DaisyUI theme
}, [theme]);


console.log("Auth User :" , authUser);

if(isCheckingAuth && !authUser) return (
  <div className="flex items-center justify-center h-screen">
    <Loader  className="size-15 animate-spin" />
  </div>
);
  

  return (
    <div data-theme = {theme}>
      <Navbar/>
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login"/>} />
        {/* <Route path="/" element={<HomePage /> } /> */}
        <Route path="/signup" element={!authUser ? <SignUpPage/>: <Navigate to="/"/>} />
        <Route path="/login" element={!authUser ? <LoginPage/>: <Navigate to="/"/>} />
        <Route path="/settings" element={<SettingsPage/>} />
        <Route path="/profile" element={authUser ? <ProfilePage/> : <Navigate to="/login"/>} />
      </Routes>

      <Toaster />
    </div>
  )
}

export default App