import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './styles/index.css'
import { I18nProvider } from './i18n'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import ArtworkDetail from './pages/ArtworkDetail'
import ArtistProfile from './pages/ArtistProfile'
import Join from './pages/Join'
import CreatorDashboard from './pages/CreatorDashboard'
import AdminDashboard from './pages/AdminDashboard'

function App() {
  return (
    <I18nProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-paper">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/artwork/:id" element={<ArtworkDetail />} />
              <Route path="/artist/:username" element={<ArtistProfile />} />
              <Route path="/join" element={<Join />} />
              <Route path="/creator" element={<CreatorDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </I18nProvider>
  )
}

export default App
