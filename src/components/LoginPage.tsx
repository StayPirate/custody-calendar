interface LoginPageProps {
  onSignIn: () => void;
}

function LoginPage({ onSignIn }: LoginPageProps) {
  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Custody Calendar</h1>
        <p>Accedi per gestire il calendario di affidamento.</p>
        <button className="login-button" onClick={onSignIn}>
          Accedi con Google
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
