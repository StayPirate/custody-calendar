import { useAuth } from "../hooks/useAuth";
import LoginPage from "./LoginPage";

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
    <div className="app">
      <header className="app-header">
        <h1>Custody Calendar</h1>
        <div className="user-info">
          <span>{user.displayName}</span>
          <button className="sign-out-button" onClick={signOut}>
            Esci
          </button>
        </div>
      </header>
      <main>
        <p>Benvenuto, {user.displayName}! Il calendario arrivera' presto.</p>
      </main>
    </div>
  );
}

export default App;
