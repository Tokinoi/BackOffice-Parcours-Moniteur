import { useState } from "react";
import { supabase } from "../supabase";
import "./LoginScreen.css";

const isSupabaseConfigured = Boolean(supabase);

export default function LoginScreen({ authError = "" }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setLoading(true);

        if (!isSupabaseConfigured) {
            setError("Configuration Supabase manquante dans Vercel.");
            setLoading(false);
            return;
        }

        const { error: loginError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (loginError) {
            setError(loginError.message);
        }

        setLoading(false);
    };

    const visibleError = error || authError;

    return (
        <main className="login-screen">
            <section className="login-card" aria-labelledby="login-title">
                <div className="login-brand">
                    <span className="login-brand-mark">
                        <img src="/icon.png" alt="" aria-hidden="true" />
                    </span>
                    <div>
                        <h1 id="login-title">Parcours Moniteur</h1>
                        <p>Back-office administrateur</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <label>
                        Email administrateur
                        <input
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            autoComplete="email"
                            required
                        />
                    </label>

                    <label>
                        Mot de passe
                        <input
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            autoComplete="current-password"
                            required
                        />
                    </label>

                    <button type="submit" disabled={loading}>
                        {loading ? "Connexion..." : "Se connecter"}
                    </button>
                </form>

                {visibleError && (
                    <p className="login-error" role="alert">
                        {visibleError}
                    </p>
                )}
            </section>
        </main>
    );
}
