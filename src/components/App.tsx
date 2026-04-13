import { useCallback } from "react";
import { useAuth } from "../hooks/useAuth";
import { useCalendar } from "../hooks/useCalendar";
import { getMagicWandSlots } from "../lib/magicWand";
import { exportCalendarToPdf } from "../lib/exportPdf";
import LoginPage from "./LoginPage";
import Header, { MONTH_NAMES } from "./Header";
import Calendar from "./Calendar";

function AuthenticatedApp({ userId, userName, onSignOut }: {
  userId: string;
  userName: string | null;
  onSignOut: () => void;
}) {
  const {
    year,
    month,
    loading,
    cycleSlot,
    setSlot,
    resetMonth,
    getSlotAssignment,
    goToPreviousMonth,
    goToNextMonth,
  } = useCalendar(userId);

  const handleMagicWand = useCallback(async () => {
    const slotsToApply = getMagicWandSlots(year, month);
    const promises = slotsToApply.map((s) => setSlot(s.day, s.period, s.value));
    await Promise.all(promises);
  }, [year, month, setSlot]);

  const handleReset = useCallback(async () => {
    const confirmed = window.confirm(
      "Sei sicuro di voler resettare tutti gli slot del mese?"
    );
    if (confirmed) {
      await resetMonth();
    }
  }, [resetMonth]);

  const handleExportPdf = useCallback(async () => {
    const monthName = MONTH_NAMES[month] ?? "";
    await exportCalendarToPdf(monthName, year);
  }, [month, year]);

  return (
    <div className="app">
      <Header
        year={year}
        month={month}
        userName={userName}
        onPreviousMonth={goToPreviousMonth}
        onNextMonth={goToNextMonth}
        onSignOut={onSignOut}
      />
      <main>
        {loading ? (
          <div className="loading">
            <p>Caricamento calendario...</p>
          </div>
        ) : (
          <Calendar
            year={year}
            month={month}
            getSlotAssignment={getSlotAssignment}
            onSlotClick={cycleSlot}
          />
        )}
      </main>
      <div className="fab-container">
        <button className="fab" onClick={handleMagicWand} title="Applica regole settimanali">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M7.5 5.6L10 7 8.6 4.5 10 2 7.5 3.4 5 2l1.4 2.5L5 7zm12 9.8L17 14l1.4 2.5L17 19l2.5-1.4L22 19l-1.4-2.5L22 14zM22 2l-2.5 1.4L17 2l1.4 2.5L17 7l2.5-1.4L22 7l-1.4-2.5zm-7.63 5.29a.996.996 0 0 0-1.41 0L1.29 18.96a.996.996 0 0 0 0 1.41l2.34 2.34c.39.39 1.02.39 1.41 0L16.7 11.05a.996.996 0 0 0 0-1.41l-2.33-2.35zM5.21 19.88L4.12 18.79 14.3 8.61l1.09 1.09L5.21 19.88z"/>
          </svg>
        </button>
        <button className="fab fab-reset" onClick={handleReset} title="Resetta tutti gli slot del mese">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"/>
          </svg>
        </button>
        <button className="fab fab-pdf" onClick={handleExportPdf} title="Esporta in PDF">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

function App() {
  const { user, loading, signIn, signOut } = useAuth();

  if (loading) {
    return (
      <div className="loading">
        <p>Caricamento...</p>
      </div>
    );
  }

  if (!user) {
    return <LoginPage onSignIn={signIn} />;
  }

  return (
    <AuthenticatedApp
      userId={user.uid}
      userName={user.displayName}
      onSignOut={signOut}
    />
  );
}

export default App;
