import { createRoot } from 'react-dom/client'
import React, { Suspense, useState } from 'react'
import './styles.css'
import App from './App'
import { StraightGallery } from './StraightGallery'

function KontextPage() {
  return (
    <div className="page-content kontext-page">
      <StraightGallery />
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
  const isHome = page === 'home'
  const label = isHome ? 'KONTEXT' : 'DENKZEICHEN'

  const handleClick = () => {
    if (isHome) {
      setPage('kontext')
    } else {
      setPage('home')
    }
  }

  return (
    <div className="header">
      <div
        className={`header-button ${isHome ? 'header-button-brown' : 'header-button-default'}`}
        onClick={handleClick}>
        {label}
      </div>
    </div>
  )
}

function KontextOverlay({ active }) {
  return <div className={`kontext-overlay ${active ? 'kontext-overlay-active' : ''}`} />
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
  const [overlayActive, setOverlayActive] = useState(false)

  const handleSetPage = (newPage) => {
    if (newPage === 'kontext') {
      setOverlayActive(true)
      setTimeout(() => {
        setTitleVisible(false)
        setPage('kontext')
      }, 600)
    } else if (newPage === 'home') {
      setOverlayActive(false)
      setPage('home')
      setTimeout(() => setTitleVisible(true), 50)
    } else {
      setOverlayActive(false)
      setTitleVisible(false)
      setPage(newPage)
    }
  }

  return (
    <>
      <Header setPage={handleSetPage} page={page} />
      <KontextOverlay active={overlayActive} />

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
          DEKO
          <br />
          LONI
          <br />
          ALES
          <br />
          DENK
          <br />
          ZEIC
          <br />
          HEN
        </h1>
      </div>

      {page === 'home' && <InfoBox />}
      {page === 'kontext' && <KontextPage />}
      {page === 'artists' && <ArtistsPage />}
      {page === 'dekolonialePraxis' && <DekolonialePraxisPage />}
    </>
  )
}

createRoot(document.getElementById('root')).render(<MainApp />)
