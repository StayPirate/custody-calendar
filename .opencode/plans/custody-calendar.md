# Piano di Implementazione - Custody Calendar

## Struttura del Progetto

```
calendar/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── functions/
│   ├── src/
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
├── src/
│   ├── components/
│   │   ├── App.tsx
│   │   ├── Calendar.tsx
│   │   ├── CalendarDay.tsx
│   │   ├── Slot.tsx
│   │   ├── Header.tsx
│   │   └── LoginPage.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useCalendar.ts
│   ├── lib/
│   │   ├── firebase.ts
│   │   ├── exportPdf.ts
│   │   └── magicWand.ts
│   ├── types.ts
│   ├── main.tsx
│   └── index.css
├── index.html
├── firestore.rules
├── firebase.json
├── .firebaserc
├── package.json
├── tsconfig.json
├── vite.config.ts
└── SPECS.md
```

## Fasi

### Fase 1: Scaffolding
- Init Vite + React + TS (package.json, tsconfig.json, vite.config.ts)
- Install: react, react-dom, firebase, jspdf, html2canvas
- Dev: typescript, @types/react, @types/react-dom, vite, @vitejs/plugin-react
- index.html, main.tsx entry point
- types.ts con tipi condivisi

### Fase 2: Firebase + Auth
- lib/firebase.ts con config placeholder
- hooks/useAuth.ts (Google Sign-In, onAuthStateChanged)
- LoginPage.tsx
- App.tsx con auth routing

### Fase 3: Calendario + Firestore
- hooks/useCalendar.ts (onSnapshot, setDoc, deleteDoc)
- Calendar.tsx (griglia, navigazione mesi)
- CalendarDay.tsx (2 slot per giorno)
- Slot.tsx (click ciclico bianco->rosa->azzurro->bianco)
- Header.tsx (navigazione, pulsanti)
- index.css (colori, layout griglia)

### Fase 4: Funzionalita' avanzate
- lib/magicWand.ts (regole settimanali)
- Pulsante Reset
- lib/exportPdf.ts (jsPDF + html2canvas, A4 landscape)

### Fase 5: Cloud Functions
- functions/ init con TypeScript
- Endpoint GET /ical/mom e /ical/dad
- Generazione .ics da Firestore

### Fase 6: Deploy
- firestore.rules
- firebase.json
- .github/workflows/deploy.yml (build + push www + deploy functions)

## Decisioni Tecniche
- State: React hooks + Firestore onSnapshot (real-time)
- CSS: vanilla CSS
- PDF: jsPDF + html2canvas
- iCal: ical-generator in Cloud Functions
- Feed iCal: URL pubblici senza token
- Config Firebase: placeholder da sostituire manualmente
- GitHub Pages: branch www, base path /custody-calendar/
