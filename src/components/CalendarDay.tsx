import type { SlotAssignment, DayPeriod } from "../types";

const COLORS: Record<string, string> = {
  mom: "#ffbdfd80",
  dad: "#5c9af780",
};

interface CalendarDayProps {
  day: number;
  morningAssignment: SlotAssignment;
  afternoonAssignment: SlotAssignment;
  onSlotClick: (day: number, period: DayPeriod) => void;
  isWeekend: boolean;
  isToday: boolean;
}

function CalendarDay({
  day,
  morningAssignment,
  afternoonAssignment,
  onSlotClick,
  isWeekend,
  isToday,
}: CalendarDayProps) {
  const sameColor = morningAssignment && morningAssignment === afternoonAssignment;

  return (
    <div
      className={`calendar-day${isWeekend ? " calendar-day-weekend" : ""}${isToday ? " calendar-day-today" : ""}`}
      style={sameColor ? { backgroundColor: COLORS[morningAssignment] } : undefined}
    >
      <div className="day-number">{day}</div>
      <div
        className="day-half"
        style={{ backgroundColor: sameColor ? "transparent" : (morningAssignment ? COLORS[morningAssignment] : "transparent") }}
        onClick={() => onSlotClick(day, "morning")}
      />
      <div
        className="day-half"
        style={{ backgroundColor: sameColor ? "transparent" : (afternoonAssignment ? COLORS[afternoonAssignment] : "transparent") }}
        onClick={() => onSlotClick(day, "afternoon")}
      />
    </div>
  );
}

export default CalendarDay;
