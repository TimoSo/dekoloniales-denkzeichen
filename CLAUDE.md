# Dekoloniales Denkzeichen Dortmund

## Projektbeschreibung
Interaktive Website für ein dekoloniales Denkzeichen in Dortmund. Zentrales Element ist ein 3D-Baobab-Baum mit klickbaren Annotationspunkten, der sich je nach Seite bewegt und skaliert.

## Tech Stack
- React 18
- React Three Fiber (`@react-three/fiber`) — 3D-Rendering
- `@react-three/drei` — Helpers (CameraControls, Html, useGLTF, SoftShadows, Environment)
- `maath` — Easing-Funktionen und Geometrie
- Hosting/Entwicklung: CodeSandbox.io

## Projektstruktur
```
/
├── public/
│   ├── Baobab_Website_e11.glb    # 3D-Modell (Baobab-Baum)
│   ├── info_button_e01.png        # Info-Button Icon
│   ├── baobab_up32.png            # Custom Cursor
│   └── baobab_up_hover32.png      # Custom Hover-Cursor
├── src/
│   ├── index.js                   # Entry Point, Navigation, Seiten, Header
│   ├── App.js                     # 3D Canvas, Modell, Kamera, Annotationen
│   └── styles.css                 # Globale Styles
├── CLAUDE.md                      # Diese Datei
└── package.json
```

## Architektur

### Seiten/Routing
- Kein React Router — State-basiertes Routing über `useState('home')`
- Seiten: `home`, `archiv`, `artists`, `dekolonialePraxis`
- Seitenwechsel beeinflusst Position und Skalierung des 3D-Modells

### 3D-Szene (App.js)
- `Canvas` mit Basic Shadows und Fog
- `Model`-Komponente lädt GLB via `useGLTF`
- Kamera: `CameraControls` mit eingeschränkten Polar-/Azimut-Winkeln
- Annotationen: `Html` aus drei, als klickbare Labels auf dem Baum
- Zoom: `fitToBox` auf unsichtbare Marker-Meshes
- Easing: `maath/easing` für sanfte Kamera- und Positionsübergänge
- Modell dreht sich langsam (`spinRef.rotation.y += delta * 0.3`)
- Mausverfolgung: Modell rotiert leicht in Richtung Cursor (nur auf Home)

### Annotationen
Drei Annotationspunkte auf dem Baum:
- **Kiste** — Position [1.75, 3, 2]
- **Krone** — Position [3.2, 8.8, 0]
- **Spiegel** — Position [-0.9, 5.8, 1]

Jede Annotation hat einen unsichtbaren Marker-Mesh für `fitToBox`-Zoom.

### Navigation (index.js)
- Header mit Sliding-Line-Animation unter aktiven Nav-Items
- Info-Button unten links mit aufklappbarer Info-Box
- Großer Hintergrundtitel "DEKOLONIALES DENKZEICHEN DORTMUND" (CSS, z-index: -1)

## Konventionen
- Kommentare auf Deutsch
- CSS-Klassen in kebab-case (`main-background-title`, `info-box`)
- React-Komponenten in PascalCase (`ArchivePage`, `InfoBox`)
- Keine externen UI-Libraries — alles custom CSS
- Schriftarten: 'Josefin Sans' (Headlines), 'Inter' (Body), 'Amiri' (Serif-Akzente)
- Farbschema: Schwarz/Weiß mit Akzentfarbe `rgb(0, 105, 76)` (Grün)

## Wichtige Hinweise
- Transparente Materialien im GLB brauchen `depthWrite: false` und `polygonOffset`
- `pointer-events: none` auf dem Hintergrundtitel, damit 3D-Interaktion durchgeht
- Custom Cursor über CSS (`cursor: url(...)`)
- Canvas hat eine Fade-in-Animation (2s)
- `onPointerMissed` auf dem Canvas setzt den Zoom nur zurück wenn `isZoomedIn === true`

## Befehle
- `npm start` — Entwicklungsserver starten
- `npm run build` — Produktions-Build

## Offene Aufgaben / Nächste Schritte
- Inhalte für Archiv-, Artists- und Dekoloniale-Praxis-Seiten
- Weitere Annotationspunkte am Baum
- Mobile Responsive Design
- Ladebildschirm / Suspense Fallback für das 3D-Modell
