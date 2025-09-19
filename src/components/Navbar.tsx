import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useAuth } from '../contexts/AuthContext'
import { Radio, Package, Upload, Wrench, Home, LogOut, Tag } from 'lucide-react'
import './Navbar.css'

export default function Navbar() {
  const { t } = useLanguage()
  const { user, logout } = useAuth()
  const location = useLocation()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const navItems = [
    { path: '/', label: t('nav.dashboard'), icon: Home },
    { path: '/radios', label: t('nav.radios'), icon: Radio },
    { path: '/accessories', label: t('nav.accessories'), icon: Package },
    { path: '/brands', label: t('nav.brands'), icon: Tag },
    { path: '/issue', label: t('nav.issue'), icon: Upload },
    { path: '/installation', label: t('nav.installation'), icon: Wrench },
  ]

  return (
    <nav className="navbar">
      <div className="navbar__container">
        <div className="navbar__brand">
          <h1 className="navbar__title">{t('app.title')}</h1>
        </div>
        
        <div className="navbar__menu">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`navbar__link ${location.pathname === path ? 'navbar__link--active' : ''}`}
            >
              <Icon className="navbar__icon" />
              <span className="navbar__text">{label}</span>
            </Link>
          ))}
        </div>

        <div className="navbar__user">
          {user && (
            <div className="navbar__user-info">
              <span className="navbar__user-email">{user.email}</span>
              <button
                onClick={handleLogout}
                className="navbar__logout"
                title={t('common.logout')}
              >
                <LogOut className="navbar__logout-icon" />
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
