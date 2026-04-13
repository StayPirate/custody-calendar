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
}

function CalendarDay({
  day,
  morningAssignment,
  afternoonAssignment,
  onSlotClick,
  isWeekend,
}: CalendarDayProps) {
  return (
    <div className={`calendar-day${isWeekend ? " calendar-day-weekend" : ""}`}>
      <div className="day-number">{day}</div>
      <div
        className="day-half"
        style={{ backgroundColor: morningAssignment ? COLORS[morningAssignment] : "transparent" }}
        onClick={() => onSlotClick(day, "morning")}
      />
      <div
        className="day-half"
        style={{ backgroundColor: afternoonAssignment ? COLORS[afternoonAssignment] : "transparent" }}
        onClick={() => onSlotClick(day, "afternoon")}
      />
    </div>
  );
}

export default CalendarDay;
