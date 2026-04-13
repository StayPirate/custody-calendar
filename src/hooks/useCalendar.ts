import { useState, useEffect, useCallback } from "react";
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import type { SlotAssignment, DayPeriod, MonthSlots } from "../types";

/** Genera la chiave del mese nel formato "YYYY-MM" */
export function toMonthKey(year: number, month: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}`;
}

/** Genera la chiave dello slot nel formato "giorno-periodo" */
function toSlotKey(day: number, period: DayPeriod): string {
  return `${day}-${period}`;
}

export function useCalendar(userId: string) {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [slots, setSlots] = useState<MonthSlots>({});
  const [loading, setLoading] = useState(true);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthKey = toMonthKey(year, month);

  // Ascolta i cambiamenti in tempo reale degli slot del mese corrente
  useEffect(() => {
    setLoading(true);

    const slotsRef = collection(db, "calendars", monthKey, "slots");
    const unsubscribe = onSnapshot(slotsRef, (snapshot) => {
      const newSlots: MonthSlots = {};
      snapshot.forEach((doc) => {
        const data = doc.data();
        newSlots[doc.id] = {
          assignedTo: data.assignedTo,
          updatedBy: data.updatedBy,
          updatedAt: data.updatedAt?.toDate() ?? new Date(),
        };
      });
      setSlots(newSlots);
      setLoading(false);
    });

    return unsubscribe;
  }, [monthKey]);

  // Cicla l'assegnazione di uno slot: null -> mom -> dad -> null
  const cycleSlot = useCallback(
    async (day: number, period: DayPeriod) => {
      const slotKey = toSlotKey(day, period);
      const current = slots[slotKey]?.assignedTo ?? null;

      let next: SlotAssignment;
      if (current === null) {
        next = "mom";
      } else if (current === "mom") {
        next = "dad";
      } else {
        next = null;
      }

      const slotRef = doc(db, "calendars", monthKey, "slots", slotKey);

      if (next === null) {
        await deleteDoc(slotRef);
      } else {
        await setDoc(slotRef, {
          assignedTo: next,
          updatedBy: userId,
          updatedAt: serverTimestamp(),
        });
      }
    },
    [slots, monthKey, userId],
  );

  // Imposta direttamente l'assegnazione di uno slot
  const setSlot = useCallback(
    async (day: number, period: DayPeriod, value: SlotAssignment) => {
      const slotKey = toSlotKey(day, period);
      const slotRef = doc(db, "calendars", monthKey, "slots", slotKey);

      if (value === null) {
        await deleteDoc(slotRef);
      } else {
        await setDoc(slotRef, {
          assignedTo: value,
          updatedBy: userId,
          updatedAt: serverTimestamp(),
        });
      }
    },
    [monthKey, userId],
  );

  // Resetta tutti gli slot del mese corrente
  const resetMonth = useCallback(async () => {
    const deletePromises = Object.keys(slots).map((slotKey) => {
      const slotRef = doc(db, "calendars", monthKey, "slots", slotKey);
      return deleteDoc(slotRef);
    });
    await Promise.all(deletePromises);
  }, [slots, monthKey]);

  // Navigazione mesi
  const goToPreviousMonth = useCallback(() => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }, []);

  const goToNextMonth = useCallback(() => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }, []);

  // Ottieni l'assegnazione di uno slot specifico
  const getSlotAssignment = useCallback(
    (day: number, period: DayPeriod): SlotAssignment => {
      const slotKey = toSlotKey(day, period);
      return slots[slotKey]?.assignedTo ?? null;
    },
    [slots],
  );

  return {
    year,
    month,
    monthKey,
    slots,
    loading,
    cycleSlot,
    setSlot,
    resetMonth,
    goToPreviousMonth,
    goToNextMonth,
    getSlotAssignment,
  };
}
