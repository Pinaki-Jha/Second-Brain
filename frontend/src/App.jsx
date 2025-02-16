import Header from './components/Header'
import {BrowserRouter as Router, Routes, Route, useNavigate} from 'react-router-dom'
import ProjectPage from './pages/ProjectPage'
import BookPage from './pages/BookPage'
import HomePage from './pages/HomePage'
import ProjectList from './pages/ProjectList'
import ToDoPage from './pages/ToDoPage'
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
function App() {

  
  const [projectList, setProjectList] = useState()

  async function getProjectList() {
    const token = localStorage.getItem('token');
    if(token){
    const user = decodeToken(token);
    const response = await fetch(conns.ProjectListConn, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
  
    const data = await response.json();
    const lalaList = await data.projectlist;
    //console.log(lalaList)
  
    setProjectList(lalaList);
  }
}
  
  useEffect(() => {
    getProjectList();
  }, []);
  
  
  
  return (
    <div className='App'>
      <Router>

        <Header name={name}/>

        <Routes>

          <Route path="*" element={<ErrorPage/>}/>

          <Route path="/register" element={<RegisterPage/>}/>
          <Route path="/login" element = {<LoginPage/>}/>
          <Route path="/notebook" element = {<NewTextEditor/>}/>

          
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
