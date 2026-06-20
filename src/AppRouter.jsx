import { useEffect, useState } from "react";
import LoginScreen from "./components/LoginScreen";
import MapPage from "./pages/MapPage";
import POIProvider from "./providers/POIProvider";
import { UserDAO } from "./dao/UserDAO";
import { supabase } from "./supabase";

const isSupabaseConfigured = Boolean(supabase);

export default function AppRouter() {
    const [session, setSession] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState("");

    useEffect(() => {
        let isMounted = true;

        const loadSession = async () => {
            if (!isSupabaseConfigured) {
                setAuthError("Configuration Supabase manquante dans Vercel.");
                setLoading(false);
                return;
            }

            const { data, error } = await supabase.auth.getSession();

            if (!isMounted) return;

            if (error) {
                setAuthError(error.message);
                setLoading(false);
                return;
            }

            setSession(data.session);
        };

        loadSession();

        const { data } = isSupabaseConfigured
            ? supabase.auth.onAuthStateChange((_event, nextSession) => {
                setSession(nextSession);
            })
            : { data: null };

        return () => {
            isMounted = false;
            data?.subscription.unsubscribe();
        };
    }, []);

    useEffect(() => {
        let isMounted = true;

        const loadProfile = async () => {
            setAuthError("");
            setProfile(null);

            if (!session?.user) {
                setLoading(false);
                return;
            }

            setLoading(true);

            try {
                const nextProfile = await UserDAO.getById(session.user.id);

                if (!UserDAO.isActive(nextProfile) || !UserDAO.isAdmin(nextProfile)) {
                    await supabase.auth.signOut();
                    throw new Error("Acces reserve aux administrateurs.");
                }

                if (isMounted) {
                    setProfile(nextProfile);
                }
            } catch (error) {
                await supabase.auth.signOut();

                if (isMounted) {
                    setAuthError(error.message);
                    setProfile(null);
                    setSession(null);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadProfile();

        return () => {
            isMounted = false;
        };
    }, [session]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setProfile(null);
        setSession(null);
    };

    if (loading) {
        return (
            <div className="auth-loading">
                <div className="auth-loading-panel">
                    <span className="auth-loading-mark" />
                    <p>Verification des acces...</p>
                </div>
            </div>
        );
    }

    if (!session || !profile) {
        return <LoginScreen authError={authError} />;
    }

    return (
        <POIProvider>
            <MapPage onLogout={handleLogout} />
        </POIProvider>
    );
}
