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
        onMagicWand={handleMagicWand}
        onReset={handleReset}
        onExportPdf={handleExportPdf}
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
