import React, { useState, useMemo } from 'react'

// Bilddaten mit dazugehörigem Text
const galleryData = [
  { id: 660, alt: 'Aufbau', src: '/project/workspace/public/Baobab_Aufbau_1.jpg', text: 'Ein funkelnder Moment in der Dunkelheit.' },
  { id: 669, alt: 'hat', src: 'https://picsum.photos/id/669/1200/1200', text: 'Ein alter Hut mit vielen Geschichten.' },
  { id: 823, alt: 'camera', src: 'https://picsum.photos/id/823/1200/1200', text: 'Den richtigen Winkel finden.' },
  { id: 64, alt: 'flowers', src: 'https://picsum.photos/id/64/1200/1200', text: 'Die Schönheit der Natur in Blüte.' },
  { id: 836, alt: 'guitar', src: 'https://picsum.photos/id/836/1200/1200', text: 'Musik, die die Seele berührt.' },
  { id: 1027, alt: 'pensive', src: 'https://picsum.photos/id/1027/1200/1200', text: 'Gedankenversunken in der Weite.' },
  { id: 646, alt: 'sunlight', src: 'https://picsum.photos/id/646/1200/1200', text: 'Das letzte Licht des Tages.' },
]

export function StraightGallery() {
  const [activeText, setActiveText] = useState('')
  const [isHovered, setIsHovered] = useState(false)
  const [tappedIndex, setTappedIndex] = useState(null)

  // Zufällige Rotation pro Bild (einmalig berechnet)
  const rotations = useMemo(() => {
    return galleryData.map(() => Math.random() * 8 - 4)
  }, [])

  const handleMouseEnter = (text) => {
    setActiveText(text)
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  // Mobile: Tippen zeigt Text über dem Bild
  const handleTap = (index, text) => {
    if (tappedIndex === index) {
      setTappedIndex(null)
      setActiveText('')
    } else {
      setTappedIndex(index)
      setActiveText(text)
    }
  }

  return (
    <div className="straight-gallery-wrapper">
      <div className="straight-gallery-row">
        {galleryData.map((item, index) => (
          <div
            key={item.id}
            className={`straight-gallery-item ${tappedIndex === index ? 'tapped' : ''}`}
            style={{ transform: `rotate(${rotations[index]}deg)` }}
            onMouseEnter={() => handleMouseEnter(item.text)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleTap(index, item.text)}>
            <img src={item.src} alt={item.alt} />
          </div>
        ))}
      </div>

      {/* Text unter der Galerie (Desktop) / über dem Bild (Mobile via CSS) */}
      <div className={`straight-gallery-text ${isHovered || tappedIndex !== null ? 'visible' : ''}`}>{activeText || 'Hover ein Bild für mehr Infos'}</div>
    </div>
  )
}
