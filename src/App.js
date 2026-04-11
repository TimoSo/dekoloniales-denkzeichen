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
    detailName: 'Handels-\nwege',
    position: [1.75, 2.5, 2],
    info: 'Der Baum steht auf einer Transportkiste, die auf den Kolonialwarenhandel und dessen Transportwege verweist.',
    detailText:
      'Die Transportkiste am Fuß des Baobabs verweist auf den Kolonialwarenhandel und die Handelswege, die Dortmund mit der kolonialen Ausbeutung verbanden. Dortmund war als Industriestandort Teil eines globalen Netzwerks, das Rohstoffe aus kolonisierten Gebieten verarbeitete und davon profitierte.\n\nFidel Amoussou-Moderan, Doktorand in Geschichte, hat im Auftrag der GrünBau gGmbH die Verbindungen zwischen Dortmund und dem Kolonialismus erforscht. Seine Arbeit zeigt, wie tief die kolonialen Handelsstrukturen in die lokale Wirtschaftsgeschichte eingeschrieben sind — von Importfirmen über Verarbeitungsbetriebe bis hin zu den Konsumgewohnheiten der Bevölkerung.\n\nDie Kiste steht symbolisch für die materiellen Grundlagen des Kolonialismus: Güter wie Kaffee, Kakao, Palmöl, Kautschuk und Baumwolle, die unter Zwang produziert und über transkontinentale Routen verschifft wurden. Diese Handelsstrukturen waren untrennbar mit Gewalt, Enteignung und systematischer Ausbeutung verbunden.\n\nIn unmittelbarer Nähe des Denkzeichens befindet sich ein ehemaliges Gebäude des Kolonialwarenhandels, das heute von der GrünBau gGmbH genutzt wird — ein Ort, an dem koloniale Vergangenheit und gegenwärtige Erinnerungsarbeit direkt aufeinandertreffen.',
    image: '/Baobab_Aufbau_1.jpg',
  },
  {
    name: 'Baobab',
    position: [-0.9, 5.8, 1],
    info: 'Der Baobab ist Erinnerung, Lebenskraft, Widerstand und Austausch.',
    detailText:
      'Der Baobab — auch Affenbrotbaum genannt — ist ein kulturelles Symbol von enormer Bedeutung. In vielen westafrikanischen Traditionen gilt er als „Wortbaum": ein Ort, an dem Geschichten bewahrt, Konflikte gelöst und Wissen von Generation zu Generation weitergegeben werden. Unter seinem Blätterdach versammelten sich die Griots — die Hüter*innen der mündlichen Überlieferung.\n\nDer Baobab kann über tausend Jahre alt werden und speichert in seinem Stamm enorme Mengen Wasser. Diese Widerstandsfähigkeit macht ihn zum Symbol für Stärke, Ausdauer und das kulturelle Gedächtnis der afrikanischen Diaspora.\n\nAuf der Karibikinsel St. Croix steht ein Baobab, der von versklavten Menschen aus Westafrika dorthin gebracht wurde. Als Zeichen der Erinnerung an ihre Heimat und ihre Identität überlebte er Jahrhunderte der Unterdrückung — ein lebendiges Denkmal des Widerstands.\n\nDie Frucht des Baobab ist reich an Vitamin C, Kalzium und Antioxidantien. Aus den Fasern werden Seile und Textilien hergestellt, die Blätter dienen als Nahrung und Medizin. Der Baum ist Lebensgrundlage und kulturelles Erbe zugleich.\n\nEin afrikanisches Sprichwort sagt: „Weisheit ist wie ein Baobab-Baum — niemand kann sie alleine umfassen." Das dekoloniale Denkzeichen greift diese Weisheit auf: Es lädt dazu ein, gemeinsam hinzusehen, zuzuhören und zu verstehen.',
    image: '/Baobab_Aufbau_3.jpg',
  },
  {
    name: 'Hafen',
    position: [-1.75, 2.5, -2],
    info: 'Der Dortmunder Hafen steht in unmittelbarer Verbindung mit der Kolonialgeschichte.',
    detailText:
      'Triggerwarnung: Dieser Text behandelt koloniale Gewalt, einschließlich Versklavung, Völkermord und systematischer Unterdrückung. Er kann belastend sein.\n\nDer Dortmunder Hafen, eröffnet 1899, war von Beginn an in koloniale Handelsstrukturen eingebunden. Über den Dortmund-Ems-Kanal wurden Rohstoffe aus den kolonisierten Gebieten — darunter Kaffee, Kakao, Palmöl und Kautschuk — nach Dortmund transportiert und hier industriell weiterverarbeitet. Der Hafen war ein Knotenpunkt im Netzwerk kolonialer Warenströme.\n\nDiese Geschichte ist untrennbar mit der deutschen Kolonialherrschaft verbunden: In „Deutsch-Südwestafrika" (dem heutigen Namibia) verübte das Deutsche Reich zwischen 1904 und 1908 einen Völkermord an den Herero und Nama. Zehntausende Menschen wurden ermordet, in Konzentrationslager gesperrt oder in die Wüste getrieben. Dieser Genozid — der erste des 20. Jahrhunderts — wurde lange verdrängt und erst 2021 von der Bundesregierung offiziell anerkannt.\n\nAuch in anderen kolonisierten Gebieten — in Ostafrika, Kamerun, Togo und im Pazifik — ging die deutsche Herrschaft mit Zwangsarbeit, Landraub und kultureller Zerstörung einher. Die wirtschaftlichen Profite dieser Ausbeutung flossen direkt in die deutsche Industrie und damit auch nach Dortmund.\n\nDas Denkzeichen macht diese unsichtbaren Verbindungen sichtbar und lädt dazu ein, den Hafen als einen Ort mit kolonialer Vergangenheit neu zu betrachten.',
    image: '/Baobab_Aufbau_4.jpg',
  },
  {
    name: 'Dekolonial',
    detailName: 'Dekoloniale Praxis',
    position: [-2.5, 8.3, 0],
    info: 'Was bedeutet dekoloniale Praxis? Ein Ansatz zur Auseinandersetzung mit kolonialen Kontinuitäten.',
    detailText:
      'Dekoloniale Praxis bedeutet, koloniale Denkmuster, Strukturen und Machtverhältnisse zu erkennen, zu hinterfragen und aktiv zu verändern. Es geht nicht nur um die Aufarbeitung historischer Ereignisse, sondern um die Auseinandersetzung mit den Kontinuitäten des Kolonialismus in der Gegenwart.\n\nDie Dekoloniale Rechtswissenschaft untersucht, wie koloniale Strukturen in heutigen Rechtssystemen fortwirken. Sie zeigt auf, dass viele der Normen und Institutionen, die wir als universell betrachten, in kolonialen Kontexten entstanden sind und bis heute Machtverhältnisse reproduzieren.\n\n„Dekolonisierung ist kein Ereignis, sondern ein fortlaufender Prozess. Sie erfordert, dass wir die Strukturen, die koloniale Macht reproduzieren, nicht nur erkennen, sondern aktiv verändern."\n— Nikita Dhawan, Politikwissenschaftlerin\n\n„Das Recht war eines der mächtigsten Werkzeuge des Kolonialismus. Es wurde benutzt, um Landraub zu legitimieren, Menschen zu entrechten und kulturelle Praktiken zu kriminalisieren. Eine dekoloniale Rechtspraxis muss diese Geschichte anerkennen und alternative Formen der Gerechtigkeit entwickeln."\n— Sundhya Pahuja, Rechtswissenschaftlerin\n\nDas dekoloniale Denkzeichen versteht sich als Teil dieser Praxis: Es schafft einen Raum, in dem verdrängte Geschichten sichtbar werden, in dem Fragen gestellt werden dürfen und in dem neue Perspektiven entstehen können.',
    image: '/Baobab_Aufbau_6.jpg',
  },
  {
    name: 'Spiegel',
    position: [1, 4, -1],
    info: 'Der Spiegel lädt zur Selbstreflexion über koloniale Kontinuitäten ein.',
    detailText:
      'Du kannst dich aber auch in ihm spiegeln, bei ihm deine eigene Position zum Thema hinterfragen und dich kritisch mit der Kolonialgeschichte auseinandersetzen. Der Spiegel ist bewusst als interaktives Element gestaltet — er fordert Besuchende auf, sich selbst in Bezug zur kolonialen Vergangenheit zu setzen. Kolonialismus ist keine abgeschlossene Geschichte, sondern wirkt in Strukturen, Denkmustern und Machtverhältnissen bis heute fort. Der Spiegel fragt: Wo stehe ich? Welche Privilegien habe ich? Wie profitiere ich möglicherweise von Strukturen, die in der Kolonialzeit geschaffen wurden? Diese Fragen sind unbequem, aber notwendig — denn nur durch Selbstreflexion kann eine echte dekoloniale Praxis entstehen.',
    image: '/Baobab_Aufbau_1.jpg',
  },
]

export default function App({ page, onTreeHover, onReadMore, onBack }) {
  const controlsRef = useRef()
  const [isZoomedIn, setIsZoomedIn] = useState(false)
  const [activeAnnotation, setActiveAnnotation] = useState(null)
  const [infoOverlay, setInfoOverlay] = useState(null)
  const [overlayExiting, setOverlayExiting] = useState(false)
  const [exitingOverlayData, setExitingOverlayData] = useState(null)

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
      controlsRef.current.setLookAt(0, 2, 14, 0, 0.5, 0, transition)
      setIsZoomedIn(false)
      setActiveAnnotation(null)
      setInfoOverlay(null)
    }
  }, [])

  // Kamera-Reset: nur beim ersten Render instant, bei Rückkehr zu Home sanft
  const hasRendered = useRef(false)
  useEffect(() => {
    if (!hasRendered.current) {
      handleReset(false)
      hasRendered.current = true
    } else if (page === 'home') {
      handleReset(true)
    } else if (page === 'detail') {
      // Kamera wird im useFrame zurückgesetzt (CameraControls ist disabled)
      setIsZoomedIn(false)
      setActiveAnnotation(null)
    }
  }, [page, handleReset])

  // Rechtsklick: auf Home Kamera zurücksetzen, auf Detail zurück zur Startseite
  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault()
      if (page === 'home') {
        handleReset(true)
      } else if (page === 'detail' && onBack) {
        onBack()
      }
    }
    window.addEventListener('contextmenu', handleContextMenu)
    return () => window.removeEventListener('contextmenu', handleContextMenu)
  }, [page, handleReset, onBack])

  const handleReadMoreClick = () => {
    if (activeAnnotation !== null && onReadMore) {
      // Overlay-Exit-Animation starten, Baum sofort bewegen
      setExitingOverlayData(infoOverlay)
      setOverlayExiting(true)
      setInfoOverlay(null)
      setActiveAnnotation(null)
      onReadMore(activeAnnotation)
      // Overlay nach Animation entfernen
      setTimeout(() => {
        setOverlayExiting(false)
        setExitingOverlayData(null)
      }, 1500)
    }
  }

  return (
    <>
      <Canvas
        shadows="basic"
        eventSource={document.getElementById('root')}
        eventPrefix="client"
        camera={{ position: [0, 2, 14], fov: 45 }}
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
          onBack={onBack}
          position={[0, -5, 3]}
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

      {/* Info-Text Overlay mit Weiterlesen-Button — z-index über Annotations */}
      {infoOverlay && (
        <div className="annotation-info-overlay annotation-fadein">
          {infoOverlay.text}
          <br />
          <span className="read-more-button" onClick={handleReadMoreClick}>
            Weiterlesen
          </span>
        </div>
      )}

      {/* Overlay Exit-Animation: fliegt nach unten raus */}
      {overlayExiting && exitingOverlayData && (
        <div className="annotation-info-overlay overlay-exit">
          {exitingOverlayData.text}
          <br />
          <span className="read-more-button">Weiterlesen</span>
        </div>
      )}
    </>
  )
}

function Model({ page, handleZoomTo, isZoomedIn, activeAnnotation, setActiveAnnotation, setInfoOverlay, onTreeHover, onBack, ...props }) {
  const group = useRef()
  const light = useRef()
  const spinRef = useRef()
  const modelRef = useRef()
  const [showAnnotations, setShowAnnotations] = useState(false)
  const [annotationVisibility, setAnnotationVisibility] = useState(annotationData.map(() => true))

  const markerRefs = useRef(annotationData.map(() => ({ current: null })))
  const lookAtRef = useRef(new THREE.Vector3(0, 0.5, 0))
  const detailTransitionStarted = useRef(false)

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

    // Detail-Seite: Baum nach unten, Kamera zurück zur Standardposition
    if (page === 'detail') {
      targetPos = [0, -11, -2]
      targetScale = 3.5
      // Beim ersten Frame: aktuelles Blickziel der Kamera erfassen
      if (!detailTransitionStarted.current) {
        const dir = new THREE.Vector3()
        state.camera.getWorldDirection(dir)
        lookAtRef.current.copy(state.camera.position).add(dir.multiplyScalar(14))
        detailTransitionStarted.current = true
      }
      // Kamera-Position und Blickziel sanft interpolieren
      easing.damp3(state.camera.position, [0, 2, 14], 0.8, delta)
      easing.damp3(lookAtRef.current, [0, 0.5, 0], 0.8, delta)
      state.camera.lookAt(lookAtRef.current)
    } else {
      detailTransitionStarted.current = false
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
          onClick={() => {
            if (page === 'detail' && onBack) onBack()
          }}
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

        {showAnnotations &&
          page === 'home' &&
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
        <div className={`annotation annotation-fadein ${isActive ? 'annotation-active' : ''}`} onPointerDown={(e) => e.stopPropagation()} onClick={handleClick}>
          {name}
        </div>
      </div>
    </Html>
  )
}
