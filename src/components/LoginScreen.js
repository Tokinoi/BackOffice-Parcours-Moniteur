import { useState } from 'react';
import { supabase } from '../supabase';
import './LoginScreen.css';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState('moderator');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error('Failed to create user');
      }

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            display_name: displayName,
            role: role,
          },
        ]);

      if (profileError) throw profileError;

      // Auto-login after signup
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) throw loginError;

      setError('');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleSubmit = (e) => {
    if (isSignUp) {
      handleSignUp(e);
    } else {
      handleLogin(e);
    }
  };

  return (
    <div className="login-screen">
      <div className="login-card">
        <h1>Parcours Moniteur</h1>
        <p>Back-office</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {isSignUp && (
            <>
              <input
                type="text"
                placeholder="Nom complet"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="moderator">Modérateur</option>
                <option value="admin">Administrateur</option>
              </select>
            </>
          )}

          <button type="submit" disabled={loading}>
            {loading ? 'Traitement...' : isSignUp ? 'S\'inscrire' : 'Se connecter'}
          </button>
        </form>

        {error && <div className="error-message">{error}</div>}

        <div className="toggle-auth">
          {isSignUp ? (
            <>
              Déjà inscrit?{' '}
              <button
                type="button"
                className="link-btn"
                onClick={() => {
                  setIsSignUp(false);
                  setError('');
                  setDisplayName('');
                  setRole('moderator');
                }}
              >
                Se connecter
              </button>
            </>
          ) : (
            <>
              Pas encore de compte?{' '}
              <button
                type="button"
                className="link-btn"
                onClick={() => {
                  setIsSignUp(true);
                  setError('');
                }}
              >
                S\'inscrire
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
