import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import LoginScreen from './components/LoginScreen';
import SideBAr_old from './components/SideBAr_old';
import MapView from './components/MapView';
import ModificationRequestsModal from './components/modals/ModificationRequestsModal';
import './App.css';

function App() {
  const [session, setSession] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [pois, setPois] = useState([]);
  const [mapLoading, setMapLoading] = useState(true);
  const [showModRequests, setShowModRequests] = useState(false);
  const [showUserMgmt, setShowUserMgmt] = useState(false);
  const [activePOI, setActivePOI] = useState(null);

  // Auth state
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (session) {
        await loadUserProfile(session.user.id);
        await loadPOIs();
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        if (session) {
          loadUserProfile(session.user.id);
          loadPOIs();
        }
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  const loadUserProfile = async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Erreur lors du chargement du profil:', error);
    } else {
      setUserProfile(data);
    }
  };

  const loadPOIs = async () => {
    setMapLoading(true);
    const { data, error } = await supabase
      .from('pois')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur lors du chargement des POIs:', error);
    } else {
      setPois(data || []);
    }
    setMapLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUserProfile(null);
    setPois([]);
  };

  const handleMarkerClick = (poi) => {
    setActivePOI(poi);
  };

  if (!session) {
    return <LoginScreen />;
  }

  return (
    <div className="App">
      <SideBAr_old
        pois={pois}
        userProfile={userProfile}
        onPOIUpdated={loadPOIs}
        onLogout={handleLogout}
        onShowUserMgmt={() => setShowUserMgmt(true)}
        onShowModRequests={() => setShowModRequests(true)}
        activePOI={activePOI}
        onSelectPOI={setActivePOI}
      />

      <MapView
        pois={pois}
        onMarkerClick={handleMarkerClick}
        loading={mapLoading}
        activePOI={activePOI}
      />

      {showUserMgmt && userProfile?.role === 'admin' && (
        <div className="modal-overlay" onClick={() => setShowUserMgmt(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowUserMgmt(false)}>×</button>
            <h2>Gestion des utilisateurs</h2>
            <UserManagementPanel onClose={() => setShowUserMgmt(false)} onUpdate={loadPOIs} />
          </div>
        </div>
      )}

      {showModRequests && (
        <ModificationRequestsModal
          onClose={() => setShowModRequests(false)}
          onUpdate={() => {
            loadPOIs();
            setShowModRequests(false);
          }}
        />
      )}
    </div>
  );
}

function UserManagementPanel({ onClose, onUpdate }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const { data, error: err } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (err) {
      setError(err.message);
    } else {
      setUsers(data || []);
    }
    setLoading(false);
  };

  const handleToggleRole = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'moderator' : 'admin';

    const { error: err } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId);

    if (err) {
      setError(err.message);
    } else {
      loadUsers();
      onUpdate();
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;

    const { error: err } = await supabase.auth.admin.deleteUser(userId);

    if (err) {
      setError(err.message);
    } else {
      loadUsers();
      onUpdate();
    }
  };

  return (
    <>
      {error && <div className="error-message">{error}</div>}
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div className="users-table">
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Nom</th>
                <th>Rôle</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.email || user.id.slice(0, 8)}</td>
                  <td>{user.display_name || '-'}</td>
                  <td>{user.role}</td>
                  <td className="actions">
                    <button
                      className="btn-small"
                      onClick={() => handleToggleRole(user.id, user.role)}
                    >
                      Changer rôle
                    </button>
                    <button
                      className="btn-small btn-danger"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default App;
