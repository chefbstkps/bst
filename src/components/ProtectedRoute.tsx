import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ReactNode } from 'react'

interface ProtectedRouteProps {
  children: ReactNode
  requireAdmin?: boolean
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Laden...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
