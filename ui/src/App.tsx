import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Resumes from './pages/Resumes'
import ResumeDetail from './pages/ResumeDetail'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/resumes" element={<Resumes />} />
      <Route path="/resumes/:id" element={<ResumeDetail />} />
    </Routes>
  )
}

export default App
