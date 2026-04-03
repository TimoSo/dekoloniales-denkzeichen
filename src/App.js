import { useRef, useState, useEffect, useCallback } from 'react'
import * as THREE from 'three'
import { Canvas, extend, useFrame } from '@react-three/fiber'
import { useGLTF, SoftShadows, Html, CameraControls, Environment } from '@react-three/drei'
import { easing, geometry } from 'maath'

extend(geometry)

// Annotation-Daten mit Zusatzinfos und Bildern
export const annotationData = [
  {
    name: 'Handelswege',
    position: [1.75, 2.5, 2],
    info: 'Der Baum steht auf einer Transportkiste, die auf den Kolonialwarenhandel und dessen Transportwege verweist. Sie steht symbolisch für die globalen Handelsstrukturen, durch die Orte wie der Dortmunder Hafen in koloniale Ausbeutungsverhältnisse eingebunden waren. Diese Handelsstrukturen waren untrennbar mit Gewalt, Enteignung und systematischer Ausbeutung verbunden. In unmittelbarer Nähe befindet sich zudem ein ehemaliges Gebäude des Kolonialwarenhandels, das heute von der GrünBau gGmbH genutzt wird.',
    image: '/Baobab_Aufbau_1.jpg',
  },
  {
    name: 'Krone',
    position: [3.2, 8.8, 0],
    info: 'Die Baumkrone steht für Wachstum, Widerstand und die Verbindung zur Natur.',
    image: '/Baobab_Aufbau_2.jpg',
  },
  {
    name: 'Baobab',
    position: [-0.9, 5.8, 1],
    info: 'Der Baobab ist Erinnerung, Lebenskraft, Widerstand und Austausch. Das Kunstwerk soll eine dekoloniale Praxis verfolgen und den Raum für die Schwarze Community und weitere BIPoC öffnen.',
    image: '/Baobab_Aufbau_3.jpg',
  },
  {
    name: 'Hafen',
    position: [-1.75, 2.5, -2],
    info: 'Vielleicht hast du schon gehört, dass der Dortmunder Hafen unmittelbar mit der Kolonialgeschichte in Verbindung steht. Hierher wurden Rohstoffe, aus den annexierten Gebieten des afrikanischen Kontinents für den städtischen Verkauf oder zur industriellen Weiterverarbeitung verladen.',
    image: '/Baobab_Aufbau_4.jpg',
  },
  {
    name: 'Lichter',
    position: [-2.5, 8.3, 0],
    info: 'Die Lichter stehen für Erinnerung und Hoffnung.',
    image: '/Baobab_Aufbau_6.jpg',
  },
  {
    name: 'Spiegel',
    position: [1, 4, -1],
    info: 'Du kannst dich aber auch in ihm spiegeln, bei ihm deine eigene Position zum Thema hinterfragen und dich kritisch mit der Kolonialgeschichte auseinandersetzen.',
    image: '/Baobab_Aufbau_1.jpg',
  },
]

export default function App({ page, onTreeHover, onReadMore }) {
  const controlsRef = useRef()
  const [isZoomedIn, setIsZoomedIn] = useState(false)
  const [activeAnnotation, setActiveAnnotation] = useState(null)
  const [infoOverlay, setInfoOverlay] = useState(null)

  const handleZoomTo = (markerRef) => {
    if (controlsRef.current && markerRef.current) {
      controlsRef.current.fitToBox(markerRef.current, true, {
        paddingTop: 3,
        paddingBottom: 3,
        paddingLeft: 3,
        paddingRight: 3,
      })
      setIsZoomedIn(true)
    }
  }

  const handleReset = useCallback((transition = true) => {
    if (controlsRef.current) {
      controlsRef.current.setLookAt(0, 1.5, 14, 0, 0, 0, transition)
      setIsZoomedIn(false)
      setActiveAnnotation(null)
      setInfoOverlay(null)
    }
  }, [])

  useEffect(() => {
    handleReset(false)
  }, [page, handleReset])

  // Rechtsklick: Kamera zurück zur Ursprungsposition
  useEffect(() => {
    const handleContextMenu = (e) => {
      if (page === 'home') {
        e.preventDefault()
        handleReset(true)
      }
    }
    window.addEventListener('contextmenu', handleContextMenu)
    return () => window.removeEventListener('contextmenu', handleContextMenu)
  }, [page, handleReset])

  const handleReadMoreClick = () => {
    if (activeAnnotation !== null && onReadMore) {
      onReadMore(activeAnnotation)
    }
  }

  return (
    <>
      <Canvas
        shadows="basic"
        eventSource={document.getElementById('root')}
        eventPrefix="client"
        camera={{ position: [0, 1.5, 14], fov: 45 }}
        onPointerMissed={() => {
          if (isZoomedIn) handleReset(true)
        }}>
        <fog attach="fog" args={['black', 0, 25]} />
        <pointLight position={[10, 10, -40]} intensity={5} />
        <pointLight position={[-10, 10, -20]} intensity={5} />

        <Model
          page={page}
          handleZoomTo={handleZoomTo}
          isZoomedIn={isZoomedIn}
          activeAnnotation={activeAnnotation}
          setActiveAnnotation={setActiveAnnotation}
          setInfoOverlay={setInfoOverlay}
          onTreeHover={onTreeHover}
          position={[0, -5.5, 3]}
          rotation={[0, -0.2, 0]}
        />

        <SoftShadows samples={4} />
        <ambientLight intensity={0.6} />
        <Environment preset="city" />

        <CameraControls
          ref={controlsRef}
          enabled={page === 'home'}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2}
          minAzimuthAngle={-Math.PI / 2}
          maxAzimuthAngle={Math.PI / 2}
          dollySpeed={0}
          truckSpeed={0}
        />
      </Canvas>

      {/* Info-Text Overlay mit Weiterlesen-Button */}
      {infoOverlay && (
        <div className="annotation-info-overlay annotation-fadein">
          {infoOverlay.text}
          <div className="read-more-button" onClick={handleReadMoreClick}>
            Weiterlesen
          </div>
        </div>
      )}
    </>
  )
}

function Model({ page, handleZoomTo, isZoomedIn, activeAnnotation, setActiveAnnotation, setInfoOverlay, onTreeHover, ...props }) {
  const group = useRef()
  const light = useRef()
  const spinRef = useRef()
  const modelRef = useRef()
  const [showAnnotations, setShowAnnotations] = useState(false)
  const [annotationVisibility, setAnnotationVisibility] = useState(annotationData.map(() => true))

  const markerRefs = useRef(annotationData.map(() => ({ current: null })))

  const { scene } = useGLTF('/Baobab_Website_e11.glb')

  useEffect(() => {
    const timer = setTimeout(() => setShowAnnotations(true), 200)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        if (child.material.transparent) {
          child.material.depthWrite = false
          child.material.polygonOffset = true
          child.material.polygonOffsetFactor = -1
        }

        if (child.material.transmission && child.material.transmission > 0) {
          child.material.roughness = Math.max(child.material.roughness, 0.5)
          child.material.ior = 1
          child.material.thickness = 0.1
          child.material.specularIntensity = 0.6
          child.material.envMapIntensity = 0.9
        }

        child.material.needsUpdate = true
      }
    })
  }, [scene])

  useFrame((state, delta) => {
    if (page === 'home') {
      easing.dampE(group.current.rotation, [0, -state.pointer.x * (Math.PI / 10), 0], 1.5, delta)
      easing.damp3(light.current.position, [state.pointer.x * 12, 0, 8 + state.pointer.y * 4], 0.2, delta)
    } else {
      easing.dampE(group.current.rotation, [0, 0, 0], 1.5, delta)
    }

    let targetPos = [0, 0, 0]
    let targetScale = 2.5

    // Detail-Seite: Baum nach unten, nur Krone sichtbar
    if (page === 'detail') {
      targetPos = [0, -15, -2]
      targetScale = 4.5
    }

    if (modelRef.current) {
      easing.damp3(modelRef.current.scale, [targetScale, targetScale, targetScale], 0.8, delta)
    }
    easing.damp3(spinRef.current.position, targetPos, 0.8, delta)

    if (spinRef.current && !isZoomedIn) {
      spinRef.current.rotation.y += delta * 0.3
    }

    // Sichtbarkeit der Annotations berechnen
    if (spinRef.current && showAnnotations) {
      const camera = state.camera
      const newVisibility = annotationData.map((ann) => {
        const worldPos = new THREE.Vector3(...ann.position)
        spinRef.current.localToWorld(worldPos)
        const modelCenter = new THREE.Vector3(0, 4, 0)
        spinRef.current.localToWorld(modelCenter)
        const annDist = camera.position.distanceTo(worldPos)
        const centerDist = camera.position.distanceTo(modelCenter)
        return annDist < centerDist + 2
      })
      setAnnotationVisibility(newVisibility)
    }
  })

  const handleAnnotationClick = (index) => {
    const ann = annotationData[index]
    if (activeAnnotation === index) {
      setActiveAnnotation(null)
      setInfoOverlay(null)
    } else {
      setActiveAnnotation(index)
      setInfoOverlay({ text: ann.info })
    }
    if (page === 'home') handleZoomTo(markerRefs.current[index])
  }

  return (
    <group ref={group} {...props} dispose={null}>
      <group ref={spinRef}>
        <primitive
          ref={modelRef}
          object={scene}
          position={[0, 0, 0]}
          onPointerEnter={() => onTreeHover && onTreeHover(true)}
          onPointerLeave={() => onTreeHover && onTreeHover(false)}
        />

        {annotationData.map((ann, i) => (
          <mesh
            key={ann.name + '-marker'}
            ref={(el) => {
              markerRefs.current[i].current = el
            }}
            position={ann.position}
            visible={false}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial />
          </mesh>
        ))}

        {showAnnotations && page === 'home' &&
          annotationData.map((ann, i) => (
            <Annotation
              key={ann.name}
              position={ann.position}
              name={ann.name}
              isActive={activeAnnotation === i}
              isVisible={annotationVisibility[i]}
              onClick={() => handleAnnotationClick(i)}
            />
          ))}
      </group>

      <spotLight angle={0.5} penumbra={0.5} ref={light} castShadow intensity={2} shadow-mapSize={1024} shadow-bias={-0.001}>
        <orthographicCamera attach="shadow-camera" args={[-10, 10, -10, 10, 0.1, 50]} />
      </spotLight>
    </group>
  )
}

function Annotation({ name, isActive, isVisible, onClick, ...props }) {
  const handleClick = (e) => {
    e.stopPropagation()
    if (onClick) onClick()
  }

  return (
    <Html
      {...props}
      transform
      sprite
      center
      style={{
        transition: 'opacity 0.3s',
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none',
      }}>
      <div className="annotation-container">
        <div
          className={`annotation annotation-fadein ${isActive ? 'annotation-active' : ''}`}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={handleClick}>
          {name}
        </div>
      </div>
    </Html>
  )
}
