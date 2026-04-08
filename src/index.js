import { createRoot } from 'react-dom/client'
import React, { Suspense, useState, useEffect } from 'react'
import './styles.css'
import App, { annotationData } from './App'

function DetailPage({ annotationIndex, onBack, leaving }) {
  const ann = annotationData[annotationIndex]
  const [imageHovered, setImageHovered] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })

  // Mausposition für dynamischen Schatten tracken
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  if (!ann) return null

  // Schatten fällt entgegengesetzt zur Mausposition (Maus = Lichtquelle)
  const shadowX = (mousePos.x - 0.5) * -15
  const shadowY = (mousePos.y - 0.5) * -15
  const imageShadowStyle = {
    boxShadow: `${shadowX}px ${shadowY}px 25px rgba(0, 0, 0, 0.15)`,
    transition: 'box-shadow 0.3s ease',
  }

  return (
    <div className={`detail-page ${leaving ? 'detail-page-exit' : ''}`}>
      <div className="back-button detail-enter-image" onClick={onBack}>
        ZURÜCK
      </div>
      <div className="detail-content">
        <div className="detail-image-wrapper detail-enter-image">
          <h2 className={`detail-title detail-enter-title ${imageHovered ? 'detail-title-outline' : ''}`}>{ann.name}</h2>
          <img
            src={ann.image}
            alt={ann.name}
            className="detail-image"
            style={imageShadowStyle}
            onMouseEnter={() => setImageHovered(true)}
            onMouseLeave={() => setImageHovered(false)}
          />
        </div>
        <p className="detail-text detail-enter-text">{ann.detailText}</p>
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
        <ul>
          <li>Klicke auf die Buttons um mehr zu erfahren.</li>
          <li>Mit gedrückter Maustaste kannst du den Baum bewegen.</li>
          <li>Wenn du ins Leere klickst, gelangst du zur normalen Ansicht.</li>
        </ul>
      </div>
    </>
  )
}

function MainApp() {
  const [page, setPage] = useState('home')
  const [titleVisible, setTitleVisible] = useState(true)
  const [treeHovered, setTreeHovered] = useState(false)
  const [detailIndex, setDetailIndex] = useState(null)
  const [detailExiting, setDetailExiting] = useState(false)

  const handleReadMore = (annotationIndex) => {
    setTitleVisible(false)
    setDetailIndex(annotationIndex)
    setPage('detail')
  }

  // Zurück: Detail-Exit und Baum-Animation gleichzeitig
  const handleBack = () => {
    if (detailExiting) return
    setDetailExiting(true)
    setPage('home')
    setTimeout(() => {
      setDetailExiting(false)
      setDetailIndex(null)
      setTitleVisible(true)
    }, 600)
  }

  return (
    <>
      {/* Hintergrund-Gradient-Overlay für Detail-Seite */}
      <div className={`bg-overlay ${page === 'detail' || detailExiting ? 'bg-overlay-active' : ''}`} />

      <Suspense fallback={null}>
        <App page={page} onTreeHover={setTreeHovered} onReadMore={handleReadMore} onBack={handleBack} />
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

      {page === 'home' && !detailExiting && <InfoBox />}
      {(page === 'detail' || detailExiting) && detailIndex !== null && (
        <DetailPage annotationIndex={detailIndex} onBack={handleBack} leaving={detailExiting} />
      )}
    </>
  )
}

createRoot(document.getElementById('root')).render(<MainApp />)
