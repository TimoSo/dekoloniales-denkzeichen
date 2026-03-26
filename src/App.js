import { useRef, useState, useEffect } from 'react'
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

  const handleReset = (transition = true) => {
    if (controlsRef.current) {
      controlsRef.current.setLookAt(0, 1.5, 14, 0, 0, 0, transition)
      setIsZoomedIn(false)
    }
  }

  useEffect(() => {
    handleReset(false)
  }, [page])

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
      <ambientLight intensity={1} />
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

  const markerKiste = useRef()
  const markerKrone = useRef()
  const markerSpiegel = useRef()

  const { scene } = useGLTF('/Baobab_Website_e11.glb')

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh && child.material.transparent) {
        child.material.depthWrite = false // Wichtigste Zeile
        child.material.polygonOffset = true
        child.material.polygonOffsetFactor = -1
        child.material.needsUpdate = true
        child.material.roughness = Math.max(child.material.roughness, 0.3)
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

    if (spinRef.current && !isZoomedIn) {
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

        {/* Annotations ohne occlude – kein Konflikt mit den Markern */}
        <Annotation position={[1.75, 3, 2]} onClick={() => page === 'home' && handleZoomTo(markerKiste)}>
          Kiste
        </Annotation>

        <Annotation position={[3.2, 8.8, 0]} onClick={() => page === 'home' && handleZoomTo(markerKrone)}>
          Krone
        </Annotation>

        <Annotation position={[-0.9, 5.8, 1]} onClick={() => page === 'home' && handleZoomTo(markerSpiegel)}>
          Spiegel
        </Annotation>
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
        className="annotation"
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
