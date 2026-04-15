import CalendarDay from "./CalendarDay";
import type { DayPeriod, SlotAssignment } from "../types";

const DAY_NAMES = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];

interface CalendarProps {
  year: number;
  month: number;
  getSlotAssignment: (day: number, period: DayPeriod) => SlotAssignment;
  onSlotClick: (day: number, period: DayPeriod) => void;
}

function Calendar({ year, month, getSlotAssignment, onSlotClick }: CalendarProps) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Giorno della settimana del primo giorno del mese (0=Lun, 6=Dom)
  const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7;

  // Determina il giorno corrente (solo se il mese visualizzato è quello attuale)
  const now = new Date();
  const todayDay =
    now.getFullYear() === year && now.getMonth() === month ? now.getDate() : -1;

  // Crea le celle vuote per i giorni prima del primo giorno del mese
  const emptyCells = Array.from({ length: firstDayOfWeek }, (_, i) => (
    <div key={`empty-${i}`} className="calendar-day calendar-day-empty" />
  ));

  // Crea le celle per ogni giorno del mese
  const dayCells = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const dayOfWeek = (new Date(year, month, day).getDay() + 6) % 7;
    const isWeekend = dayOfWeek >= 5;

    return (
      <CalendarDay
        key={day}
        day={day}
        morningAssignment={getSlotAssignment(day, "morning")}
        afternoonAssignment={getSlotAssignment(day, "afternoon")}
        onSlotClick={onSlotClick}
        isWeekend={isWeekend}
        isToday={day === todayDay}
      />
    );
  });

  return (
    <div className="calendar">
      <div className="calendar-header">
        {DAY_NAMES.map((name) => (
          <div key={name} className="calendar-header-cell">
            {name}
          </div>
        ))}
      </div>
      <div className="calendar-grid">
        {emptyCells}
        {dayCells}
      </div>
    </div>
  );
}

export default Calendar;
