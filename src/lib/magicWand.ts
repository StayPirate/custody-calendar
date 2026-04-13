import type { SlotAssignment, DayPeriod } from "../types";

/**
 * Regole fisse settimanali per la bacchetta magica.
 * Gli slot con `null` non vengono toccati (restano nello stato in cui si trovano).
 *
 * Giorni della settimana: 0=Lunedi', 1=Martedi', ..., 4=Venerdi', 5=Sabato, 6=Domenica
 */
const WEEKLY_RULES: Record<number, { morning: SlotAssignment | undefined; afternoon: SlotAssignment | undefined }> = {
  0: { morning: undefined, afternoon: "mom" },     // Lunedi': - / Mamma
  1: { morning: "mom", afternoon: "mom" },          // Martedi': Mamma / Mamma
  2: { morning: "mom", afternoon: "dad" },          // Mercoledi': Mamma / Papa'
  3: { morning: "dad", afternoon: "dad" },          // Giovedi': Papa' / Papa'
  4: { morning: "dad", afternoon: undefined },      // Venerdi': Papa' / -
  // 5: Sabato - nessuna regola
  // 6: Domenica - nessuna regola
};

export interface MagicWandSlot {
  day: number;
  period: DayPeriod;
  value: SlotAssignment;
}

/**
 * Calcola gli slot da applicare per la bacchetta magica su un dato mese.
 * Restituisce solo gli slot che devono essere modificati (quelli con regola definita).
 */
export function getMagicWandSlots(year: number, month: number): MagicWandSlot[] {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const result: MagicWandSlot[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    // Converti il giorno della settimana JS (0=Dom) in formato 0=Lun
    const dayOfWeek = (new Date(year, month, day).getDay() + 6) % 7;
    const rules = WEEKLY_RULES[dayOfWeek];

    if (!rules) continue;

    if (rules.morning !== undefined) {
      result.push({ day, period: "morning", value: rules.morning });
    }
    if (rules.afternoon !== undefined) {
      result.push({ day, period: "afternoon", value: rules.afternoon });
    }
  }

  return result;
}
