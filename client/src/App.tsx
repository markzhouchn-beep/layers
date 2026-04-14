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

function CreatorRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, loading } = useAuth()
  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div style={{ width: 32, height: 32, border: '3px solid rgba(0,0,0,0.1)', borderTopColor: '#0075de', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
    </div>
  )
  if (!isAuthenticated) return <Navigate to="/join" replace />
  if (user?.role !== 'creator') return <Navigate to="/" replace />
  return children
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
      <main className="flex-1" style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <Routes>
          <Route path="/" element={<StorefrontHome />} />
          <Route path="/artwork/:id" element={<ArtworkDetail />} />
          <Route path="/artist/:username" element={<ArtistProfile />} />
          <Route path="/join" element={<Join />} />
          <Route path="/creator/*" element={
            <CreatorRoute>
              <CreatorLayout />
            </CreatorRoute>
          } />
          <Route path="/admin/*" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
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
