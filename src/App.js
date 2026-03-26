import { useRef, useState, useEffect, useCallback } from 'react'
import { Canvas, extend, useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations, SoftShadows, Html, CameraControls, Environment } from '@react-three/drei'
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
        // Nur zurücksetzen wenn wirklich herangezoomt ist
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

function Model({ page, handleZoomTo, isZoomedIn, ...props }) {
  const group = useRef()
  const light = useRef()
  const spinRef = useRef()
  const modelRef = useRef()
  const [showAnnotations, setShowAnnotations] = useState(false)

  const markerKiste = useRef()
  const markerKrone = useRef()
  const markerSpiegel = useRef()

  const { scene, animations } = useGLTF('/Baobab_Website_e11.glb')
  const { actions } = useAnimations(animations, modelRef)
  const [introComplete, setIntroComplete] = useState(false)

  // Intro-Animation abspielen wenn vorhanden im GLB
  useEffect(() => {
    const actionNames = Object.keys(actions)
    if (actionNames.length > 0 && page === 'home') {
      const introAction = actions[actionNames[0]]
      introAction.reset()
      introAction.clampWhenFinished = true
      introAction.loop = 2200 // THREE.LoopOnce
      introAction.play()

      // Nach Ende der Animation: Intro fertig
      const onFinished = () => setIntroComplete(true)
      introAction.getMixer().addEventListener('finished', onFinished)
      return () => introAction.getMixer().removeEventListener('finished', onFinished)
    } else {
      // Kein Animation vorhanden — sofort starten
      setIntroComplete(true)
    }
  }, [actions, page])

  // Annotations nach 2 Sekunden einfaden (nach Intro)
  useEffect(() => {
    if (!introComplete) return
    const timer = setTimeout(() => setShowAnnotations(true), 2000)
    return () => clearTimeout(timer)
  }, [introComplete])

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        // Transparente Materialien (Baumkrone mit transmission)
        if (child.material.transparent) {
          child.material.depthWrite = false
          child.material.polygonOffset = true
          child.material.polygonOffsetFactor = -1
        }

        // Transmission-Materialien: Flimmern reduzieren
        if (child.material.transmission && child.material.transmission > 0) {
          child.material.roughness = Math.max(child.material.roughness, 0.5)
          child.material.ior = 1 // Brechungsindex auf 1 = kein Refraction-Flimmern
          child.material.thickness = 0.1 // Minimale Dicke reduziert Artefakte
          child.material.specularIntensity = 0.6 // Reduziert spekulative Reflexionen
          child.material.envMapIntensity = 0.9 // Reduziert Environment-Reflexionen
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

    if (page === 'archiv') {
      targetPos = [-4, -4, 3]
      targetScale = 4.5
    } else if (page === 'artists') {
      targetPos = [5, 1, 3]
      targetScale = 4.5
    }

    if (modelRef.current) {
      easing.damp3(modelRef.current.scale, [targetScale, targetScale, targetScale], 0.8, delta)
    }
    easing.damp3(spinRef.current.position, targetPos, 0.8, delta)

    if (spinRef.current && !isZoomedIn && introComplete) {
      spinRef.current.rotation.y += delta * 0.3
    }
  })

  return (
    <group ref={group} {...props} dispose={null}>
      <group ref={spinRef}>
        <primitive ref={modelRef} object={scene} position={[0, 0, 0]} />

        {/* Sichtbare Marker-Boxen für fitToBox – aber winzig und transparent */}
        <mesh ref={markerKiste} position={[1.75, 3, 2]} visible={false}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial />
        </mesh>

        <mesh ref={markerKrone} position={[3.2, 8.8, 0]} visible={false}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial />
        </mesh>

        <mesh ref={markerSpiegel} position={[-0.9, 5.8, 1]} visible={false}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial />
        </mesh>

        {/* Annotations mit 2s Fade-in nach Laden */}
        {showAnnotations && (
          <>
            <Annotation position={[1.75, 3, 2]} onClick={() => page === 'home' && handleZoomTo(markerKiste)}>
              Kiste
            </Annotation>

            <Annotation position={[3.2, 8.8, 0]} onClick={() => page === 'home' && handleZoomTo(markerKrone)}>
              Krone
            </Annotation>

            <Annotation position={[-0.9, 5.8, 1]} onClick={() => page === 'home' && handleZoomTo(markerSpiegel)}>
              Spiegel
            </Annotation>
          </>
        )}
      </group>

      <spotLight angle={0.5} penumbra={0.5} ref={light} castShadow intensity={2} shadow-mapSize={1024} shadow-bias={-0.001}>
        <orthographicCamera attach="shadow-camera" args={[-10, 10, -10, 10, 0.1, 50]} />
      </spotLight>
    </group>
  )
}

function Annotation({ children, onClick, ...props }) {
  return (
    <Html {...props} transform sprite center>
      <div
        className="annotation annotation-fadein"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation()
          onClick && onClick()
        }}>
        {children}
      </div>
    </Html>
  )
}
