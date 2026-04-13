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

- L'assegnazione avviene tramite click diretto sulla meta' della cella corrispondente al periodo desiderato (meta' superiore = mattina, meta' inferiore = pomeriggio).
- Il click cicla tra i tre stati:
  1. Click su slot trasparente -> diventa **rosa** (mamma)
  2. Click su slot rosa -> diventa **azzurro** (papa')
  3. Click su slot azzurro -> torna **trasparente** (non assegnato)
- Il ciclo si ripete continuamente.

### Interfaccia Utente

L'interfaccia e' volutamente **minimale e priva di elementi superflui**, con l'obiettivo di essere immediata da usare senza necessita' di spiegazioni. L'applicazione e' localizzata esclusivamente in italiano.

**Principi di design:**
- Nessuna label, icona decorativa o testo non strettamente necessario.
- Le azioni disponibili sono ridotte al minimo indispensabile.
- L'interazione principale (assegnazione degli slot) avviene con un singolo click.

**Header:**
- Contiene solo la navigazione tra i mesi (frecce + nome mese/anno) e le informazioni utente (nome + pulsante Esci).
- Nessun pulsante di azione nell'header.

**Cella giornaliera:**
- Contiene unicamente il numero del giorno, posizionato in alto a destra.
- La cella e' divisa in due meta' uguali (superiore = mattina, inferiore = pomeriggio), entrambe cliccabili.
- Nessuna label, icona o testo aggiuntivo all'interno della cella.
- Il colore di sfondo di ciascuna meta' indica l'assegnazione corrente.

**Pulsanti di azione:**
- I pulsanti di azione (Bacchetta Magica, Reset, Esporta PDF, iCal) sono raggruppati dietro un singolo pulsante "+" (FAB toggle) posizionato fisso in basso a destra dello schermo.
- Cliccando il "+", i pulsanti appaiono verticalmente verso l'alto con un'animazione a cascata. Il "+" ruota di 45° diventando una "x".
- Cliccando fuori dal menu o sulla "x" il menu si richiude.
- Tutti i pulsanti FAB hanno lo stesso stile e colore.

**Responsivita':**
- Il layout e' responsive e ottimizzato per l'uso sia da desktop che da dispositivi mobili.
- Su desktop: celle con altezza generosa, griglia spaziata.
- Su mobile: celle piu' compatte, il calendario si adatta al viewport disponibile senza necessita' di scroll orizzontale.
- Le dimensioni delle celle si adattano dinamicamente allo schermo.
- L'altezza massima del calendario e' limitata a 900px; su viewport piu' piccoli si adatta al 100% dell'altezza disponibile.
- Il calendario e' ancorato in alto nella pagina (non centrato verticalmente).

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
- Ogni evento nel feed iCal ha come titolo "Emma 👧❤️🎈".
- Gli URL dei feed sono accessibili dall'interfaccia tramite un **pulsante FAB** (icona calendario) che apre un modale con:
  - I link copiabili per il feed di mamma e papa'.
  - Un pulsante "Copia" per ciascun link che copia l'URL negli appunti.
  - Istruzioni su come aggiungere il feed a Google Calendar (Impostazioni > Aggiungi calendario > Da URL).
- Gli URL dei feed sono derivati dalla configurazione Firebase (`projectId` e `region`), non hardcoded.

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

| Stato            | Colore                    | Codice       |
|------------------|---------------------------|--------------|
| Non assegnato    | Trasparente               | `transparent`|
| Mamma            | Rosa semi-trasparente      | `#ffbdfd80`  |
| Papa'            | Azzurro semi-trasparente   | `#5c9af780`  |

I colori sono semi-trasparenti per permettere di scrivere a penna sopra il calendario stampato mantenendo la leggibilita' delle scritte.

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
  4. Inclusione del file **`CNAME`** (contenente `calendar.gianlu.ca`) nel branch `www`, necessario per il corretto funzionamento del dominio custom su GitHub Pages
- GitHub Pages e' configurato per servire dal branch `www`.
- Il branch `www` contiene esclusivamente i file compilati (HTML, JS, CSS) e il file `CNAME`, non il codice sorgente.
- L'applicazione e' raggiungibile tramite il dominio custom **`calendar.gianlu.ca`**, gestito attraverso Cloudflare.

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
7. **Configurare il dominio custom** `calendar.gianlu.ca` sulla web console di **Cloudflare**: creare un record CNAME che punti a `staypirate.github.io` e configurare le impostazioni SSL/TLS.
8. **Creare il service account e configurare il GitHub Secret**:
   - Generare una chiave JSON del service account da **Firebase Console > Project Settings > Service accounts > Generate new private key**.
   - Su GitHub, nel repository del progetto, andare su **Settings > Secrets and variables > Actions** e creare un nuovo secret chiamato `FIREBASE_SERVICE_ACCOUNT` contenente il contenuto del file JSON scaricato.
9. **Assegnare i ruoli IAM al service account** creato al punto 8. Su **Google Cloud Console > IAM & Admin > IAM**, trovare il service account e assegnare i seguenti ruoli:
   - Firebase Admin (`roles/firebase.admin`)
   - Cloud Functions Admin (`roles/cloudfunctions.admin`)
   - Cloud Run Admin (`roles/run.admin`)
   - Cloud Datastore User (`roles/datastore.user`)
   - Firebase Rules Admin (`roles/firebaserules.admin`)
   - Service Usage Consumer (`roles/serviceusage.serviceUsageConsumer`)
   - Artifact Registry Administrator (`roles/artifactregistry.admin`)
   - Service Account User (`roles/iam.serviceAccountUser`)
10. **Abilitare le Google Cloud API richieste**. Su **Google Cloud Console > APIs & Services > Library**, cercare e abilitare le seguenti API:
    - Cloud Functions API (`cloudfunctions.googleapis.com`)
    - Cloud Build API (`cloudbuild.googleapis.com`)
    - Artifact Registry API (`artifactregistry.googleapis.com`)
    - Cloud Run API (`run.googleapis.com`)
    - Eventarc API (`eventarc.googleapis.com`)
    - Cloud Billing API (`cloudbilling.googleapis.com`)
11. **Aggiungere il dominio custom ai domini autorizzati di Firebase Authentication**: su **Firebase Console > Authentication > Settings > Authorized domains**, aggiungere il dominio dell'applicazione (es. `calendar.gianlu.ca`).

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
