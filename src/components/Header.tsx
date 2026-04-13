export const MONTH_NAMES = [
  "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
  "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre",
];

interface HeaderProps {
  year: number;
  month: number;
  userName: string | null;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onMagicWand: () => void;
  onReset: () => void;
  onExportPdf: () => void;
  onSignOut: () => void;
}

function Header({
  year,
  month,
  userName,
  onPreviousMonth,
  onNextMonth,
  onMagicWand,
  onReset,
  onExportPdf,
  onSignOut,
}: HeaderProps) {
  return (
    <header className="app-header">
      <div className="header-left">
        <h1>Custody Calendar</h1>
      </div>
      <div className="header-center">
        <button className="nav-button" onClick={onPreviousMonth} title="Mese precedente">
          &larr;
        </button>
        <span className="month-display">
          {MONTH_NAMES[month]} {year}
        </span>
        <button className="nav-button" onClick={onNextMonth} title="Mese successivo">
          &rarr;
        </button>
      </div>
      <div className="header-actions">
        <button className="action-button action-magic" onClick={onMagicWand} title="Applica regole settimanali">
          Bacchetta Magica
        </button>
        <button className="action-button action-reset" onClick={onReset} title="Resetta tutti gli slot del mese">
          Reset
        </button>
        <button className="action-button action-pdf" onClick={onExportPdf} title="Esporta in PDF">
          PDF
        </button>
      </div>
      <div className="header-right">
        <span className="user-name">{userName}</span>
        <button className="sign-out-button" onClick={onSignOut}>
          Esci
        </button>
      </div>
    </header>
  );
}

export default Header;
