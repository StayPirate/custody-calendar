/** Possibili assegnazioni di uno slot */
export type SlotAssignment = "mom" | "dad" | null;

/** Periodo della giornata */
export type DayPeriod = "morning" | "afternoon";

/** Dati di uno slot salvati su Firestore */
export interface SlotData {
  assignedTo: SlotAssignment;
  updatedBy: string;
  updatedAt: Date;
}

/** Mappa degli slot di un mese: chiave = "giorno-periodo" (es. "15-morning") */
export type MonthSlots = Record<string, SlotData>;

/** Rappresentazione di un mese nel formato "YYYY-MM" */
export type MonthKey = string;
