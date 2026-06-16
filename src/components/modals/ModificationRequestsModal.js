import { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import './Modal.css';

export default function ModificationRequestsModal({ onClose, onUpdate }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    const { data, error: err } = await supabase
      .from('modification_requests')
      .select(`
        id,
        poi_id,
        pois:poi_id(name, id),
        description,
        status,
        created_at
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (err) {
      setError(err.message);
    } else {
      setRequests(data || []);
    }
    setLoading(false);
  };

  const handleApprove = async (requestId, poiId) => {
    setProcessing(requestId);
    setError('');

    try {
      // Update modification request status
      const { error: err1 } = await supabase
        .from('modification_requests')
        .update({ status: 'approved' })
        .eq('id', requestId);

      if (err1) throw err1;

      // Validate the POI
      const { error: err2 } = await supabase
        .from('pois')
        .update({ status: 'validated' })
        .eq('id', poiId);

      if (err2) throw err2;

      loadRequests();
      onUpdate();
    } catch (err) {
      setError(err.message);
    }

    setProcessing(null);
  };

  const handleReject = async (requestId) => {
    setProcessing(requestId);
    setError('');

    try {
      const { error: err } = await supabase
        .from('modification_requests')
        .update({ status: 'rejected' })
        .eq('id', requestId);

      if (err) throw err;

      loadRequests();
      onUpdate();
    } catch (err) {
      setError(err.message);
    }

    setProcessing(null);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>

        <h2>Demandes de modification</h2>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <p>Chargement...</p>
        ) : requests.length === 0 ? (
          <p>Aucune demande en attente</p>
        ) : (
          <div className="requests-list">
            {requests.map((req) => (
              <div key={req.id} className="request-item">
                <div className="request-header">
                  <h4>{req.pois?.name || 'POI supprimé'}</h4>
                  <span className="request-date">
                    {new Date(req.created_at).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <p className="request-description">{req.description}</p>
                <div className="request-actions">
                  <button
                    className="btn-success"
                    onClick={() => handleApprove(req.id, req.poi_id)}
                    disabled={processing === req.id}
                  >
                    {processing === req.id ? 'Traitement...' : 'Approuver'}
                  </button>
                  <button
                    className="btn-danger"
                    onClick={() => handleReject(req.id)}
                    disabled={processing === req.id}
                  >
                    {processing === req.id ? 'Traitement...' : 'Rejeter'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
