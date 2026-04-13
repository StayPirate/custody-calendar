# Custody Calendar - Specifiche di Progetto

## Panoramica

Applicazione web per gestire il calendario di affidamento condiviso di una figlia tra i due genitori (mamma e papa'). Il calendario permette di assegnare ogni mezza giornata (mattina/pomeriggio) a uno dei due genitori, visualizzare il mese corrente o navigare tra i mesi, esportare in PDF ed integrare con Google Calendar.

---

## Funzionalita'

### Calendario Mensile

- Vista di un singolo mese alla volta.
- Navigazione libera tra i mesi (avanti e indietro, senza limiti).
- Ogni giorno e' suddiviso in due slot: **mattina** e **pomeriggio**.
- Ogni slot puo' essere in uno dei tre stati:
  - **Bianco**: non assegnato
  - **Rosa**: assegnato alla mamma
  - **Azzurro**: assegnato al papa'

### Interazione sugli Slot

- L'assegnazione avviene tramite click ciclico sullo slot:
  1. Click su slot bianco -> diventa **rosa** (mamma)
  2. Click su slot rosa -> diventa **azzurro** (papa')
  3. Click su slot azzurro -> torna **bianco** (non assegnato)
- Il ciclo si ripete continuamente.

### Pulsante "Bacchetta Magica"

Applica automaticamente gli slot fissi settimanali al mese visualizzato, **senza modificare** gli slot non coinvolti dalla regola (es. weekend, lunedi' mattina, venerdi' pomeriggio).

Regole fisse settimanali:

| Giorno       | Mattina  | Pomeriggio |
|--------------|----------|------------|
| Lunedi'      | -        | Mamma      |
| Martedi'     | Mamma    | Mamma      |
| Mercoledi'   | Mamma    | Papa'      |
| Giovedi'     | Papa'    | Papa'      |
| Venerdi'     | Papa'    | -          |
| Sabato       | -        | -          |
| Domenica     | -        | -          |

Gli slot contrassegnati con `-` non vengono toccati dalla bacchetta magica e restano nello stato in cui si trovano.

### Pulsante "Reset"

Riporta **tutti** gli slot del mese attualmente visualizzato a bianco (non assegnato).

### Esportazione PDF

- Generazione PDF lato client (nel browser), senza necessita' di server.
- Il PDF deve essere formattato per la stampa su foglio **A4 in orientamento landscape**.
- Librerie candidate: jsPDF, html2canvas.

### Integrazione Google Calendar

- Il calendario e' disponibile come feed **iCal (.ics)** da aggiungere a Google Calendar come calendario esterno.
- Vengono generati **due feed separati**:
  - **Feed mamma**: contiene solo gli slot assegnati alla mamma.
  - **Feed papa'**: contiene solo gli slot assegnati al papa'.
- Ogni genitore aggiunge al proprio Google Calendar solo il proprio feed, vedendo cosi' esclusivamente i momenti in cui la figlia sta con lui/lei.
- I feed vengono generati dinamicamente tramite Firebase Cloud Functions (endpoint HTTP che restituiscono file .ics).

---

## Autenticazione e Accesso

- Il calendario puo' essere visualizzato e modificato **solo previa autenticazione**.
- Metodo di autenticazione: **Google Sign-In** tramite Firebase Authentication.
- **Entrambi i genitori** possono autenticarsi e modificare il calendario.
- Gli utenti autorizzati vengono configurati manualmente sulla console Firebase.

---

## Architettura e Stack Tecnologico

### Frontend

| Componente     | Tecnologia         |
|----------------|---------------------|
| Framework      | React               |
| Linguaggio     | TypeScript           |
| Build tool     | Vite                 |
| Hosting        | GitHub Pages         |

### Backend (BaaS)

| Componente       | Tecnologia              |
|------------------|--------------------------|
| Autenticazione   | Firebase Authentication  |
| Database         | Firebase Firestore       |
| Feed iCal        | Firebase Cloud Functions |

### Colori

| Stato            | Colore   |
|------------------|----------|
| Non assegnato    | Bianco   |
| Mamma            | Rosa     |
| Papa'            | Azzurro  |

---

## Struttura Dati (Firestore)

Ogni slot del calendario viene salvato su Firestore. Struttura indicativa:

```
calendars/
  {year-month}/           (es. "2026-04")
    slots/
      {day-period}/       (es. "15-morning", "15-afternoon")
        assignedTo: "mom" | "dad" | null
        updatedBy: {userId}
        updatedAt: {timestamp}
```

---

## Deployment

### Frontend (GitHub Pages)

- Il codice sorgente risiede sul branch `main`.
- Ad ogni push su `main`, una **GitHub Action** esegue automaticamente:
  1. `npm install` - installazione dipendenze
  2. `npm run build` - build di produzione (Vite)
  3. Copia del contenuto della build nella **root** del branch **`www`**
- GitHub Pages e' configurato per servire dal branch `www`.
- Il branch `www` contiene esclusivamente i file compilati (HTML, JS, CSS), non il codice sorgente.

### Cloud Functions

- Le Firebase Cloud Functions (per i feed iCal) vengono deployate **automaticamente via GitHub Action** ad ogni push su `main`, insieme al deploy del frontend.
- L'obiettivo e' limitare al minimo le operazioni manuali: tutto il deploy (frontend + Cloud Functions) e' automatizzato.

---

## Prerequisiti e Setup Iniziale

### Operazioni manuali (una tantum)

1. **Creare un progetto Firebase** su [console.firebase.google.com](https://console.firebase.google.com).
2. **Attivare Firebase Authentication** e abilitare il provider Google Sign-In.
3. **Creare il database Firestore** e selezionare la region preferita.
4. **Upgrade al piano Blaze** (pay-as-you-go) per abilitare le Cloud Functions. Richiede una carta di credito, ma l'uso rimane nella quota gratuita per volumi bassi.
5. **Registrare gli account Google** dei due genitori come utenti autorizzati.
6. **Configurare GitHub Pages** per servire dal branch `www`.
7. **Creare il repository GitHub** e configurare i secrets necessari per la GitHub Action (se richiesto per il deploy delle Cloud Functions).

### Configurazione nel codice

- La configurazione Firebase (API key, project ID, ecc.) viene inserita nel codice frontend. Queste chiavi sono pubbliche; la sicurezza e' garantita dalle regole Firestore e dall'autenticazione.
- Le regole di sicurezza Firestore vengono definite nel file `firestore.rules` e deployate insieme al progetto. Le regole devono garantire che:
  - Solo gli utenti autenticati possano leggere i dati del calendario.
  - Solo gli utenti autenticati possano scrivere (creare, modificare, cancellare) i dati del calendario.
  - Nessun utente non autenticato possa accedere a qualsiasi dato.
  - I campi `updatedBy` e `updatedAt` vengano sempre popolati correttamente ad ogni scrittura.

---

## Costi

| Servizio             | Costo                                                        |
|----------------------|--------------------------------------------------------------|
| GitHub Pages         | Gratuito                                                     |
| GitHub Actions       | Gratuito (per repository pubblici e nei limiti del piano free)|
| Firebase Auth        | Gratuito                                                     |
| Firebase Firestore   | Gratuito entro la quota del piano Blaze                      |
| Cloud Functions      | Gratuito entro la quota (2M invocazioni/mese)                |

Per un uso familiare con due utenti, il costo previsto e' **zero**.
