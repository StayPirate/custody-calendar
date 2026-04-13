import { onRequest } from "firebase-functions/v2/https";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import icalGenerator from "ical-generator";

initializeApp();
const db = getFirestore();

type Parent = "mom" | "dad";

interface SlotDoc {
  assignedTo: Parent | null;
  updatedBy: string;
  updatedAt: FirebaseFirestore.Timestamp;
}

/**
 * Genera un feed iCal per il genitore specificato.
 * Legge tutti i mesi disponibili su Firestore e crea eventi per ogni slot assegnato.
 */
async function generateIcalFeed(parent: Parent): Promise<string> {
  const parentLabel = parent === "mom" ? "Mamma" : "Papa'";

  const calendar = icalGenerator({
    name: `Custody Calendar - ${parentLabel}`,
    timezone: "Europe/Rome",
    prodId: {
      company: "custody-calendar",
      product: "ical-feed",
      language: "IT",
    },
  });

  // Leggi tutti i documenti mese dalla collezione "calendars"
  const monthsSnapshot = await db.collection("calendars").listDocuments();

  for (const monthDoc of monthsSnapshot) {
    const monthId = monthDoc.id; // formato "YYYY-MM"
    const parts = monthId.split("-");
    if (parts.length !== 2) continue;

    const year = parseInt(parts[0]!, 10);
    const month = parseInt(parts[1]!, 10) - 1; // JS months are 0-indexed

    if (isNaN(year) || isNaN(month)) continue;

    const slotsSnapshot = await monthDoc.collection("slots").get();

    for (const slotDoc of slotsSnapshot.docs) {
      const data = slotDoc.data() as SlotDoc;

      if (data.assignedTo !== parent) continue;

      // Parse slot ID: "day-period" (es. "15-morning")
      const slotParts = slotDoc.id.split("-");
      if (slotParts.length !== 2) continue;

      const day = parseInt(slotParts[0]!, 10);
      const period = slotParts[1]; // "morning" o "afternoon"

      if (isNaN(day)) continue;

      let startHour: number;
      let endHour: number;
      let periodLabel: string;

      if (period === "morning") {
        startHour = 8;
        endHour = 13;
        periodLabel = "Mattina";
      } else if (period === "afternoon") {
        startHour = 13;
        endHour = 20;
        periodLabel = "Pomeriggio";
      } else {
        continue;
      }

      const start = new Date(year, month, day, startHour, 0, 0);
      const end = new Date(year, month, day, endHour, 0, 0);

      calendar.createEvent({
        start,
        end,
        summary: "Emma 👧❤️🎈",
        description: `Slot ${periodLabel.toLowerCase()} assegnato a ${parentLabel}`,
      });
    }
  }

  return calendar.toString();
}

/**
 * Endpoint HTTP per il feed iCal della mamma.
 * GET /ical/mom
 */
export const icalMom = onRequest(
  { region: "europe-west1", cors: true },
  async (_req, res) => {
    try {
      const feed = await generateIcalFeed("mom");
      res.set("Content-Type", "text/calendar; charset=utf-8");
      res.set("Content-Disposition", 'attachment; filename="custody-mom.ics"');
      res.send(feed);
    } catch (error) {
      console.error("Errore generazione feed mamma:", error);
      res.status(500).send("Errore nella generazione del feed iCal");
    }
  },
);

/**
 * Endpoint HTTP per il feed iCal del papa'.
 * GET /ical/dad
 */
export const icalDad = onRequest(
  { region: "europe-west1", cors: true },
  async (_req, res) => {
    try {
      const feed = await generateIcalFeed("dad");
      res.set("Content-Type", "text/calendar; charset=utf-8");
      res.set("Content-Disposition", 'attachment; filename="custody-dad.ics"');
      res.send(feed);
    } catch (error) {
      console.error("Errore generazione feed papa':", error);
      res.status(500).send("Errore nella generazione del feed iCal");
    }
  },
);
