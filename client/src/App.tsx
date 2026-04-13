import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './styles/index.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import StorefrontHome from './pages/storefront/StorefrontHome'
import ArtworkDetail from './pages/ArtworkDetail'
import ArtistProfile from './pages/ArtistProfile'
import Join from './pages/Join'
import CreatorLayout from './pages/creator/CreatorLayout'
import AdminDashboard from './pages/admin/AdminDashboard'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-paper">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<StorefrontHome />} />
            <Route path="/artwork/:id" element={<ArtworkDetail />} />
            <Route path="/artist/:username" element={<ArtistProfile />} />
            <Route path="/join" element={<Join />} />
            <Route path="/creator/*" element={<CreatorLayout />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
