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
          
          <Route path="/:user/:path" element={<RootPage/>} />

          <Route path="/" element={<HomePage/>}/>
          <Route path="/project list" element = {<ProjectList/>}/>


          {projectList? (
            projectList.map(projects=>{
              return(projects.content.map(project=>{
                const oldPath = "/" + project.name
                const path = oldPath.split(' ').join('-');
                //console.log(path)
                return(
                  <Route key={project.id} path={path} element = {<ProjectPage heading={project.name} projectID ={project.id} itemList={project.itemList}/>}/>
                )
              }))
            })
          ):(<></>)}


          <Route path= "/book page" element = {<BookPage/>}/>
          <Route path="/todo list" element = {<ToDoPage/>}/>

        </Routes>
      </Router>
    </div>
  )
}

export default App
