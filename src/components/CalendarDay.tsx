import Slot from "./Slot";
import type { SlotAssignment, DayPeriod } from "../types";

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
      <div className="day-slots">
        <Slot
          assignment={morningAssignment}
          period="morning"
          onClick={() => onSlotClick(day, "morning")}
        />
        <Slot
          assignment={afternoonAssignment}
          period="afternoon"
          onClick={() => onSlotClick(day, "afternoon")}
        />
      </div>
    </div>
  );
}

export default CalendarDay;
