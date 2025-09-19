import { useLanguage } from '../contexts/LanguageContext'
import './Footer.css'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__content">
          <p className="footer__text">
            © 2024 {t('app.title')}. Alle rechten voorbehouden.
          </p>
          <div className="footer__links">
            <a href="#" className="footer__link">Privacy</a>
            <a href="#" className="footer__link">Voorwaarden</a>
            <a href="#" className="footer__link">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
