import { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import './Modal.css';

export default function UserManagementModal({ onClose, onUpdate }) {
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
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    const { error: err } = await supabase.auth.admin.deleteUser(userId);

    if (err) {
      setError(err.message);
    } else {
      loadUsers();
      onUpdate();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>

        <h2>User Management</h2>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <p>Loading users...</p>
        ) : (
          <div className="users-table">
            <table>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Display Name</th>
                  <th>Role</th>
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
                        Change Role
                      </button>
                      <button
                        className="btn-small btn-danger"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
