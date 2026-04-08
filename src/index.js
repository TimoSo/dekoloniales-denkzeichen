import { createRoot } from 'react-dom/client'
import React, { Suspense, useState, useEffect } from 'react'
import './styles.css'
import App, { annotationData } from './App'

function DetailPage({ annotationIndex, onBack }) {
  const ann = annotationData[annotationIndex]
  const [imageHovered, setImageHovered] = useState(false)
  const [leaving, setLeaving] = useState(false)
  if (!ann) return null

  const handleBack = () => {
    setLeaving(true)
    setTimeout(() => onBack(), 600)
  }

  return (
    <div className={`detail-page ${leaving ? 'detail-page-exit' : ''}`}>
      <div className="back-button detail-enter-image" onClick={handleBack}>
        ZURÜCK
      </div>
      <div className="detail-content">
        <div className="detail-image-wrapper detail-enter-image">
          <h2 className={`detail-title detail-enter-title ${imageHovered ? 'detail-title-outline' : ''}`}>{ann.name}</h2>
          <img src={ann.image} alt={ann.name} className="detail-image" onMouseEnter={() => setImageHovered(true)} onMouseLeave={() => setImageHovered(false)} />
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

  // Hintergrund-Gradient abdunkeln auf Detail-Seite
  useEffect(() => {
    if (page === 'detail') {
      document.body.classList.add('detail-bg')
    } else {
      document.body.classList.remove('detail-bg')
    }
  }, [page])

  const handleReadMore = (annotationIndex) => {
    setTitleVisible(false)
    setDetailIndex(annotationIndex)
    setPage('detail')
  }

  const handleBack = () => {
    setPage('home')
    setDetailIndex(null)
    setTimeout(() => setTitleVisible(true), 50)
  }

  return (
    <>
      <Suspense fallback={null}>
        <App page={page} onTreeHover={setTreeHovered} onReadMore={handleReadMore} />
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
      {page === 'detail' && detailIndex !== null && <DetailPage annotationIndex={detailIndex} onBack={handleBack} />}
    </>
  )
}

createRoot(document.getElementById('root')).render(<MainApp />)
