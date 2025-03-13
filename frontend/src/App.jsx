import Header from './components/Header'
import {BrowserRouter as Router, Routes, Route, useNavigate} from 'react-router-dom'
import HomePage from './pages/HomePage'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import { useState, useEffect } from 'react'
import { decodeToken } from 'react-jwt'
import ErrorPage from './pages/ErrorPage'
import RootPage from './pages/RootPage'
import conns from './components/BackendConn'
import NotificationsPage from './pages/NotificationsPage'
import NoAccessPage from './pages/NoAccessPage'
import NewTextEditor from './components/NewTextEditor'
import TextEditor from './components/TextEditor'
function App() {

  
  
  
  return (
    <div className='App'>
      <Router>

        <Header name={name}/>

        <Routes>

          <Route path="*" element={<ErrorPage/>}/>

          <Route path="/register" element={<RegisterPage/>}/>
          <Route path="/login" element = {<LoginPage/>}/>
          <Route path="/notebook" element = {<NewTextEditor/>}/>
          <Route path='/legacyeditor' element={<TextEditor/>}/>
          <Route path="/notifications/:user" element={<NotificationsPage/>}/>
          <Route path="/noaccess/:path" element = {<NoAccessPage/>}/>
          <Route path="/:path" element={<RootPage/>} />

          <Route path="/" element={<HomePage/>}/>
       
        </Routes>
      </Router>
    </div>
  )
}

export default App
