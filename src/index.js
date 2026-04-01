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
  const [scribbleVisible, setScribbleVisible] = useState(false)

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
        onClick={handleClick}
        onMouseEnter={() => setScribbleVisible(true)}
        onMouseLeave={() => setScribbleVisible(false)}>
        {label}
        {/* Scribble-Kreis beim Hover */}
        <img
          src="/baobab_hover_scribble_e01.png"
          alt=""
          className={`header-scribble ${scribbleVisible ? 'scribble-visible' : ''}`}
        />
      </div>
    </div>
  )
}

function KontextOverlay({ active, closing, originRect }) {
  // Sphere-Wipe: radiale Ausbreitung vom Button
  const style = {}
  if (originRect) {
    const cx = originRect.left + originRect.width / 2
    const cy = originRect.top + originRect.height / 2
    style['--wipe-cx'] = `${cx}px`
    style['--wipe-cy'] = `${cy}px`
  }

  let className = 'kontext-overlay'
  if (active && !closing) className += ' kontext-overlay-active'
  if (closing) className += ' kontext-overlay-closing'

  return <div className={className} style={style} />
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
  const [overlayClosing, setOverlayClosing] = useState(false)
  const [buttonRect, setButtonRect] = useState(null)
  // Titel wechselt zur Outline wenn über den Baum gehovert wird
  const [treeHovered, setTreeHovered] = useState(false)

  const handleSetPage = (newPage) => {
    if (newPage === 'kontext') {
      // Button-Position für Sphere-Wipe merken
      const btn = document.querySelector('.header-button')
      if (btn) setButtonRect(btn.getBoundingClientRect())
      setOverlayActive(true)
      setTimeout(() => {
        setTitleVisible(false)
        setPage('kontext')
      }, 600)
    } else if (newPage === 'home') {
      // Sphere-Wipe rückwärts
      const btn = document.querySelector('.header-button')
      if (btn) setButtonRect(btn.getBoundingClientRect())
      setOverlayClosing(true)
      setPage('home')
      setTimeout(() => {
        setOverlayActive(false)
        setOverlayClosing(false)
        setTitleVisible(true)
      }, 2000)
    } else {
      setOverlayActive(false)
      setTitleVisible(false)
      setPage(newPage)
    }
  }

  return (
    <>
      <Header setPage={handleSetPage} page={page} />
      <KontextOverlay active={overlayActive} closing={overlayClosing} originRect={buttonRect} />

      <Suspense fallback={null}>
        <App page={page} onTreeHover={setTreeHovered} />
      </Suspense>

      <div className={`main-background-title ${titleVisible ? 'title-visible' : 'title-hidden'} ${treeHovered ? 'title-outline' : ''}`}>
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
