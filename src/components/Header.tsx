export const MONTH_NAMES = [
  "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
  "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre",
];

interface HeaderProps {
  month: number;
  userName: string | null;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onSignOut: () => void;
}

function Header({
  month,
  userName,
  onPreviousMonth,
  onNextMonth,
  onSignOut,
}: HeaderProps) {
  return (
    <header className="app-header">
      <div className="header-nav">
        <button className="nav-button" onClick={onPreviousMonth} title="Mese precedente">
          &larr;
        </button>
        <span className="month-display">
          {MONTH_NAMES[month]}
        </span>
        <button className="nav-button" onClick={onNextMonth} title="Mese successivo">
          &rarr;
        </button>
      </div>
      <div className="header-user">
        <span className="user-name">{userName}</span>
        <button className="sign-out-button" onClick={onSignOut}>
          Esci
        </button>
      </div>
    </header>
  );
}

export default Header;
