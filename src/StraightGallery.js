import React, { useState, useMemo } from 'react'

// Bilddaten mit dazugehörigem Text
const galleryData = [
  { id: 1, alt: 'Aufbau 1', src: '/Baobab_Aufbau_1.jpg', text: 'Ein funkelnder Moment in der Dunkelheit.' },
  { id: 2, alt: 'Aufbau 2', src: '/Baobab_Aufbau_2.jpg', text: 'Ein alter Hut mit vielen Geschichten.' },
  { id: 3, alt: 'Aufbau 3', src: '/Baobab_Aufbau_3.jpg', text: 'Den richtigen Winkel finden.' },
  { id: 4, alt: 'Aufbau 4', src: '/Baobab_Aufbau_4.jpg', text: 'Die Schönheit der Natur in Blüte.' },
  { id: 5, alt: 'Aufbau 6', src: '/Baobab_Aufbau_6.jpg', text: 'Musik, die die Seele berührt.' },
]

export function StraightGallery() {
  const [activeIndex, setActiveIndex] = useState(null)
  const [hoveredIndex, setHoveredIndex] = useState(null)

  // Zufällige Rotation pro Bild (einmalig berechnet)
  const rotations = useMemo(() => {
    return galleryData.map(() => Math.random() * 6 - 3)
  }, [])

  // Klick öffnet/schließt den Text
  const handleClick = (index) => {
    if (activeIndex === index) {
      setActiveIndex(null)
    } else {
      setActiveIndex(index)
    }
  }

  return (
    <div className="straight-gallery-wrapper">
      <div className="straight-gallery-row">
        {galleryData.map((item, index) => {
          // Dynamischer Offset: Wenn gehovert, machen Nachbarn Platz
          const isHovered = hoveredIndex === index
          const isNeighbor = hoveredIndex !== null && Math.abs(hoveredIndex - index) === 1
          const isActive = activeIndex === index

          let translateX = 0
          if (hoveredIndex !== null && !isHovered) {
            // Bilder links vom gehoverten nach links, rechts nach rechts
            const diff = index - hoveredIndex
            if (Math.abs(diff) === 1) {
              translateX = diff * 30 // 30px Platz machen
            } else if (Math.abs(diff) === 2) {
              translateX = diff * 15
            }
          }

          return (
            <div
              key={item.id}
              className={`straight-gallery-item ${isActive ? 'gallery-active' : ''}`}
              style={{
                transform: `rotate(${isHovered || isActive ? 0 : rotations[index]}deg) translateX(${translateX}px) scale(${isHovered ? 1.08 : 1})`,
                zIndex: isHovered || isActive ? 20 : 10 - Math.abs(index - (hoveredIndex ?? 0)),
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => handleClick(index)}>
              <img src={item.src} alt={item.alt} />
            </div>
          )
        })}
      </div>

      {/* Text erscheint erst nach Klick */}
      <div className={`straight-gallery-text ${activeIndex !== null ? 'visible' : ''}`}>
        {activeIndex !== null ? galleryData[activeIndex].text : ''}
      </div>
    </div>
  )
}
