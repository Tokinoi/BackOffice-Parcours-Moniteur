import { useState } from 'react';
import { supabase } from '../../supabase';
import './Modal.css';

const ELEVATION_LABELS = {
  light: 'Légère',
  medium: 'Moyenne',
  steep: 'Pentue',
};

const TRAFFIC_LABELS = {
  low: 'Faible',
  high: 'Forte',
};

export default function POIDetailsModal({
  poi,
  userProfile,
  onClose,
  onEdit,
  onPOIUpdated,
}) {
  const [validating, setValidating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const canEdit = userProfile?.role === 'admin' || userProfile?.role === 'moderator';

  const handleValidate = async () => {
    setValidating(true);
    const { error } = await supabase
      .from('pois')
      .update({ status: 'validated' })
      .eq('id', poi.id);

    if (error) {
      console.error('Erreur lors de la validation:', error);
    } else {
      onPOIUpdated();
      onClose();
    }
    setValidating(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce POI ?')) return;

    setDeleting(true);
    const { error } = await supabase.from('pois').delete().eq('id', poi.id);

    if (error) {
      console.error('Erreur lors de la suppression:', error);
    } else {
      onPOIUpdated();
      onClose();
    }
    setDeleting(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>

        <h2>{poi.name}</h2>
        {poi.status === 'pending' && <span className="badge-pending">En attente</span>}

        <div className="poi-details">
          <p>
            <strong>Catégorie :</strong> {poi.category || 'Non spécifiée'}
          </p>
          <p>
            <strong>Description :</strong> {poi.description || 'Aucune description'}
          </p>
          <p>
            <strong>Coordonnées :</strong> {poi.latitude.toFixed(4)}, {poi.longitude.toFixed(4)}
          </p>
          <p>
            <strong>Dénivelé :</strong> {ELEVATION_LABELS[poi.elevation] || 'Aucun'}
          </p>
          {poi.road_types && poi.road_types.length > 0 && (
            <p>
              <strong>Types de voie :</strong>
              <ul>
                {poi.road_types.map((type) => (
                  <li key={type}>{type}</li>
                ))}
              </ul>
            </p>
          )}
          <p>
            <strong>Fréquentation :</strong> {TRAFFIC_LABELS[poi.traffic_level] || 'Non spécifiée'}
          </p>
          <p>
            <strong>Statut :</strong> {poi.status === 'pending' ? 'En attente de validation' : 'Validé'}
          </p>
        </div>

        <div className="modal-actions">
          {canEdit && (
            <>
              <button className="btn-primary" onClick={() => onEdit(poi)}>
                Modifier
              </button>
              <button className="btn-danger" onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Suppression...' : 'Supprimer'}
              </button>
            </>
          )}

          {poi.status === 'pending' && canEdit && (
            <button className="btn-success" onClick={handleValidate} disabled={validating}>
              {validating ? 'Validation...' : 'Valider'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
