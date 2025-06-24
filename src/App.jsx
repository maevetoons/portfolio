import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import './Home.css'
import Home from './Home.jsx'
import Project from './Project.jsx'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/project/:projectId" element={<Project />} />
      </Routes>
    </Router>
  )
}

export default App
