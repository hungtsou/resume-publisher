import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Resumes from './pages/Resumes'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/resumes" element={<Resumes />} />
    </Routes>
  )
}

export default App
