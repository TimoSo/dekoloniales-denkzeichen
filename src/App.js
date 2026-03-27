import { useRef, useState, useEffect, useCallback } from 'react'
import { Canvas, extend, useFrame } from '@react-three/fiber'
import { useGLTF, SoftShadows, Html, CameraControls, Environment } from '@react-three/drei'
import { easing, geometry } from 'maath'

extend(geometry)

export default function App({ page }) {
  const controlsRef = useRef()
  const [isZoomedIn, setIsZoomedIn] = useState(false)

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

  return (
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

      <Model page={page} handleZoomTo={handleZoomTo} isZoomedIn={isZoomedIn} position={[0, -5.5, 3]} rotation={[0, -0.2, 0]} />

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
      />
    </Canvas>
  )
}

// Annotation-Daten mit Zusatzinfos
const annotationData = [
  { name: 'Handelswege', position: [1.75, 2.5, 2], info: 'Die Handelswege symbolisieren den kolonialen Handel und die Ausbeutung von Ressourcen.' },
  { name: 'Krone', position: [3.2, 8.8, 0], info: 'Die Baumkrone steht für Wachstum, Widerstand und die Verbindung zur Natur.' },
  { name: 'Baobab', position: [-0.9, 5.8, 1], info: 'Der Baobab ist ein Symbol für Stärke und kulturelles Gedächtnis.' },
  { name: 'Hafen', position: [-1.75, 2.5, -2], info: 'Der Hafen verweist auf den transatlantischen Handel und seine Folgen.' },
  { name: 'Lichter', position: [-2.5, 8.3, 0], info: 'Die Lichter stehen für Erinnerung und Hoffnung.' },
  { name: 'Spiegel', position: [1, 4, -1], info: 'Der Spiegel lädt zur Selbstreflexion über koloniale Kontinuitäten ein.' },
]

function Model({ page, handleZoomTo, isZoomedIn, ...props }) {
  const group = useRef()
  const light = useRef()
  const spinRef = useRef()
  const modelRef = useRef()
  const [showAnnotations, setShowAnnotations] = useState(false)

  const markerRefs = useRef(annotationData.map(() => ({ current: null })))

  const { scene } = useGLTF('/Baobab_Website_e12.glb')

  // Annotations nach kurzem Delay einfaden
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

    if (page === 'dekolonialePraxis') {
      targetPos = [-4, -3, 3]
      targetScale = 4.5
    } else if (page === 'kontext') {
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
  })

  return (
    <group ref={group} {...props} dispose={null}>
      <group ref={spinRef}>
        <primitive ref={modelRef} object={scene} position={[0, 0, 0]} />

        {/* Marker-Boxen für fitToBox */}
        {annotationData.map((ann, i) => (
          <mesh
            key={ann.name + '-marker'}
            ref={(el) => { markerRefs.current[i].current = el }}
            position={ann.position}
            visible={false}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial />
          </mesh>
        ))}

        {/* Annotations mit Occlusion und Info-Textfeld */}
        {showAnnotations && annotationData.map((ann, i) => (
          <Annotation
            key={ann.name}
            position={ann.position}
            name={ann.name}
            info={ann.info}
            onClick={() => page === 'home' && handleZoomTo(markerRefs.current[i])}
          />
        ))}
      </group>

      <spotLight angle={0.5} penumbra={0.5} ref={light} castShadow intensity={2} shadow-mapSize={1024} shadow-bias={-0.001}>
        <orthographicCamera attach="shadow-camera" args={[-10, 10, -10, 10, 0.1, 50]} />
      </spotLight>
    </group>
  )
}

function Annotation({ name, info, onClick, ...props }) {
  const [expanded, setExpanded] = useState(false)

  const handleClick = (e) => {
    e.stopPropagation()
    setExpanded(!expanded)
    if (onClick) onClick()
  }

  return (
    <Html {...props} transform sprite center occlude="blending" style={{ transition: 'opacity 0.3s' }}>
      <div className="annotation-container">
        <div
          className="annotation annotation-fadein"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={handleClick}>
          {name}
        </div>
        {expanded && (
          <div className="annotation-info annotation-fadein">
            {info}
          </div>
        )}
      </div>
    </Html>
  )
}
