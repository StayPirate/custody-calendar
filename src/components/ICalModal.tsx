import { useState } from "react";
import { auth } from "../lib/firebase";

const REGION = "europe-west1";

function getICalUrls() {
  const projectId = auth.app.options.projectId;
  const base = `https://${REGION}-${projectId}.cloudfunctions.net`;
  return {
    mom: `${base}/icalMom`,
    dad: `${base}/icalDad`,
  };
}

interface ICalModalProps {
  onClose: () => void;
}

function ICalModal({ onClose }: ICalModalProps) {
  const urls = getICalUrls();
  const [copiedMom, setCopiedMom] = useState(false);
  const [copiedDad, setCopiedDad] = useState(false);

  const copyToClipboard = async (url: string, who: "mom" | "dad") => {
    try {
      await navigator.clipboard.writeText(url);
      if (who === "mom") {
        setCopiedMom(true);
        setTimeout(() => setCopiedMom(false), 2000);
      } else {
        setCopiedDad(true);
        setTimeout(() => setCopiedDad(false), 2000);
      }
    } catch {
      // Fallback: seleziona il testo
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2>Aggiungi a Google Calendar</h2>
        <p className="modal-instructions">
          Copia il link e aggiungilo su Google Calendar:
          <br />
          <strong>Impostazioni &rarr; Aggiungi calendario &rarr; Da URL</strong>
        </p>

        <div className="ical-row">
          <span className="ical-label">Mamma</span>
          <input className="ical-url" type="text" value={urls.mom} readOnly />
          <button className="ical-copy" onClick={() => copyToClipboard(urls.mom, "mom")}>
            {copiedMom ? "Copiato!" : "Copia"}
          </button>
        </div>

        <div className="ical-row">
          <span className="ical-label">Papa'</span>
          <input className="ical-url" type="text" value={urls.dad} readOnly />
          <button className="ical-copy" onClick={() => copyToClipboard(urls.dad, "dad")}>
            {copiedDad ? "Copiato!" : "Copia"}
          </button>
        </div>

        <button className="modal-close" onClick={onClose}>Chiudi</button>
      </div>
    </div>
  );
}

export default ICalModal;
