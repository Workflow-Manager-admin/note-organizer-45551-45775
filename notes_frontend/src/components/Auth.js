import React, { useState } from "react";
import { supabase } from "../supabaseClient";

/**
 * PUBLIC_INTERFACE
 * A minimalistic authentication box for signup, login, and logout.
 */
function Auth({ session, onSessionUpdate }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login"); // or "signup"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // PUBLIC_INTERFACE
  async function handleAuth(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      let result;
      if (mode === "login") {
        result = await supabase.auth.signInWithPassword({ email, password });
      } else {
        result = await supabase.auth.signUp({ email, password });
      }
      if (result.error) setError(result.error.message);
      else onSessionUpdate(result.data.session);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // PUBLIC_INTERFACE
  async function handleLogout() {
    setLoading(true);
    await supabase.auth.signOut();
    onSessionUpdate(null);
    setLoading(false);
  }

  // If logged in, show logout; otherwise show auth form
  if (session) {
    return (
      <div className="auth-box">
        <span>
          Logged in ({session.user.email || session.user.id}) &nbsp;
          <button onClick={handleLogout} className="btn btn-logout" disabled={loading}>
            Sign Out
          </button>
        </span>
      </div>
    );
  }

  return (
    <div className="auth-box">
      <form onSubmit={handleAuth}>
        <h2>{mode === "login" ? "Login" : "Sign Up"}</h2>
        <input
          className="input"
          autoComplete="username"
          required
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={loading}
        />
        <input
          className="input"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          required
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          disabled={loading}
        />
        {error && <div className="error">{error}</div>}
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {mode === "login" ? "Login" : "Sign Up"}
        </button>
        <div style={{ margin: "1rem 0" }}>
          <button
            type="button"
            className="btn btn-link"
            disabled={loading}
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
          >
            {mode === "login"
              ? "Need an account? Sign Up"
              : "Back to Login"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Auth;
