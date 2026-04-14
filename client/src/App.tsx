import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import './styles/index.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import StorefrontHome from './pages/storefront/StorefrontHome'
import ArtworkDetail from './pages/ArtworkDetail'
import ArtistProfile from './pages/ArtistProfile'
import Join from './pages/Join'
import CreatorLayout from './pages/creator/CreatorLayout'
import AdminDashboard from './pages/admin/AdminDashboard'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin w-8 h-8 border-2 border-vermilion border-t-transparent rounded-full" /></div>
  return isAuthenticated ? children : <Navigate to="/join" replace />
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin, loading } = useAuth()
  if (loading) return null
  return isAdmin ? children : <Navigate to="/" replace />
}

function AppRoutes() {
  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<StorefrontHome />} />
          <Route path="/artwork/:id" element={<ArtworkDetail />} />
          <Route path="/artist/:username" element={<ArtistProfile />} />
          <Route path="/join" element={<Join />} />
          <Route path="/creator/*" element={<ProtectedRoute><CreatorLayout /></ProtectedRoute>} />
          <Route path="/admin/*" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
