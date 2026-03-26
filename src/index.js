import { createRoot } from 'react-dom/client'
import React, { Suspense, useState } from 'react'
import './styles.css'
import App from './App'

function ArchivePage() {
  return (
    <div className="page-content">
      <h2>Das Archiv</h2>
      <p>Hier stehen die Inhalte für das Archiv.</p>
    </div>
  )
}

function ArtistsPage() {
  return (
    <div className="page-content">
      <h2>Artists</h2>
      <p>Hier stehen die Inhalte für die Artists.</p>
    </div>
  )
}

function DekolonialePraxisPage() {
  return (
    <div className="page-content">
      <h2>Dekoloniale Praxis</h2>
      <p>Hier stehen die Inhalte für die Dekoloniale Praxis.</p>
    </div>
  )
}

function Header({ setPage, page }) {
  const [style, setStyle] = useState({ opacity: 0, left: 0 })

  const handleMouseEnter = (e) => {
    const span = e.target
    const centerLeft = span.offsetLeft + span.offsetWidth / 2 - 20
    setStyle({ opacity: 1, left: centerLeft })
  }

  const handleMouseLeave = () => {
    setStyle((prev) => ({ ...prev, opacity: 0 }))
  }

  const navItems = [
    { label: 'DENKZEICHEN', id: 'home' },
    { label: 'DEKOLONIALE PRAXIS', id: 'dekolonialePraxis' },
    { label: 'ARCHIV', id: 'archiv' },
    { label: 'ARTISTS', id: 'artists' },
  ]

  return (
    <div className="header">
      <div className="nav-wrapper" onMouseLeave={handleMouseLeave}>
        {navItems.map((item) => (
          <span
            key={item.id}
            className={`nav-item ${page === item.id ? 'nav-active' : ''} ${page !== 'home' && page === item.id ? 'nav-active-colored' : ''}`}
            style={{ margin: '0 2em' }}
            onMouseEnter={handleMouseEnter}
            onClick={() => setPage(item.id)}>
            {item.label}
          </span>
        ))}
        <div className="sliding-line" style={style} />
      </div>
    </div>
  )
}

function InfoBox() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <img src="/info_button_e01.png" alt="Info" className="info-button" onClick={() => setOpen((prev) => !prev)} />
      <div className={`info-box ${open ? 'info-box-open' : ''}`}>
        <p>
          Klicke auf die Buttons um an sie ranzuzoomen.
          <br />
          Klicke ins Leere, um zur normalen Ansicht zurück zu kehren.
        </p>
      </div>
    </>
  )
}

function MainApp() {
  const [page, setPage] = useState('home')
  const [titleVisible, setTitleVisible] = useState(true)

  const handleSetPage = (newPage) => {
    if (newPage === 'home') {
      setPage('home')
      setTimeout(() => setTitleVisible(true), 50)
    } else {
      setTitleVisible(false)
      setPage(newPage)
    }
  }

  return (
    <>
      <Header setPage={handleSetPage} page={page} />

      <Suspense fallback={null}>
        <App page={page} />
      </Suspense>

      <div className={`main-background-title ${titleVisible ? 'title-visible' : 'title-hidden'}`}>
        <h1 className="desktop-title">
          DEKOLONIALES
          <br />
          DENKZEICHEN
          <br />
          DORTMUND
        </h1>
        <h1 className="mobile-title">
          DEKO<br />LONI<br />ALES<br />DENK<br />ZEIC<br />HEN
        </h1>
      </div>

      {page === 'home' && <InfoBox />}

      {page === 'archiv' && <ArchivePage />}
      {page === 'artists' && <ArtistsPage />}
      {page === 'dekolonialePraxis' && <DekolonialePraxisPage />}
    </>
  )
}

createRoot(document.getElementById('root')).render(<MainApp />)
