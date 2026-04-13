import { useAuth } from "../hooks/useAuth";
import { useCalendar } from "../hooks/useCalendar";
import LoginPage from "./LoginPage";
import Header from "./Header";
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
    getSlotAssignment,
    goToPreviousMonth,
    goToNextMonth,
  } = useCalendar(userId);

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
