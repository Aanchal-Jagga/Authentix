import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import ImageVerification from './pages/ImageVerification'
import GazeDetection from './pages/GazeDetection'
import TextVerification from './pages/TextVerification'
import Login from './pages/Login'
import Signup from './pages/Signup'

function App() {
  const location = useLocation()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/image-verification" element={<ImageVerification />} />
            <Route path="/gaze-detection" element={<GazeDetection />} />
            <Route path="/text-verification" element={<TextVerification />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  )
}

export default App
