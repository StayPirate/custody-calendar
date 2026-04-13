import type { SlotAssignment, DayPeriod } from "../types";

interface SlotProps {
  assignment: SlotAssignment;
  period: DayPeriod;
  onClick: () => void;
}

function Slot({ assignment, period, onClick }: SlotProps) {
  const label = period === "morning" ? "Matt." : "Pom.";

  let className = "slot";
  if (assignment === "mom") {
    className += " slot-mom";
  } else if (assignment === "dad") {
    className += " slot-dad";
  }

  return (
    <button
      className={className}
      onClick={onClick}
      title={`${label} - ${assignment === "mom" ? "Mamma" : assignment === "dad" ? "Papa'" : "Non assegnato"}`}
    >
      <span className="slot-label">{label}</span>
    </button>
  );
}

export default Slot;
