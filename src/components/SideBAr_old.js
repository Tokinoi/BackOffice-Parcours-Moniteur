import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import './Sidebar.css';

const ELEVATIONS = [
  { value: null, label: 'Aucun' },
  { value: 'light', label: 'Légère' },
  { value: 'medium', label: 'Moyenne' },
  { value: 'steep', label: 'Pentue' },
];

const ROAD_TYPES = [
  'Giratoire',
  'Carrefour',
  'Céder le passage',
  'Priorité à droite',
  'Limitation 30',
  'Limitation 50',
  'Limitation 70+',
];

const TRAFFIC_LEVELS = [
  { value: 'low', label: 'Faible' },
  { value: 'high', label: 'Forte' },
];

export default function SideBAr_old({
  pois,
  userProfile,
  onPOIUpdated,
  onLogout,
  onShowUserMgmt,
  onShowModRequests,
  activePOI: externalActivePOI,
  onSelectPOI,
}) {
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [view, setView] = useState('list'); // 'list', 'detail', 'edit', 'add'
  const [activePOI, setActivePOI] = useState(null);
  const [modRequestsCount, setModRequestsCount] = useState(0);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    latitude: '',
    longitude: '',
    elevation: null,
    road_types: [],
    traffic_level: 'low',
  });

  useEffect(() => {
    loadModRequestsCount();
  }, []);

  // Handle external POI selection (from map marker click)
  useEffect(() => {
    if (externalActivePOI) {
      handlePOIClick(externalActivePOI);
    }
  }, [externalActivePOI]);

  const loadModRequestsCount = async () => {
    const { count } = await supabase
      .from('modification_requests')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');
    setModRequestsCount(count || 0);
  };

  const categories = [...new Set(pois.map((p) => p.category).filter(Boolean))];

  const filtered = pois.filter((poi) => {
    const categoryMatch = !filterCategory || poi.category === filterCategory;
    const statusMatch =
      filterStatus === 'all' ||
      (filterStatus === 'pending' && poi.status === 'pending') ||
      (filterStatus === 'validated' && poi.status === 'validated');
    return categoryMatch && statusMatch;
  });

  const handlePOIClick = (poi) => {
    setActivePOI(poi);
    setFormData({
      name: poi.name || '',
      description: poi.description || '',
      category: poi.category || '',
      latitude: poi.latitude || '',
      longitude: poi.longitude || '',
      elevation: poi.elevation || null,
      road_types: poi.road_types || [],
      traffic_level: poi.traffic_level || 'low',
    });
    setView('detail');
  };

  const handleAddPOI = () => {
    setActivePOI(null);
    setFormData({
      name: '',
      description: '',
      category: '',
      latitude: '',
      longitude: '',
      elevation: null,
      road_types: [],
      traffic_level: 'low',
    });
    setView('add');
  };

  const handleEditPOI = () => {
    setView('edit');
  };

  const handleRoadTypeToggle = (type) => {
    setFormData((prev) => ({
      ...prev,
      road_types: prev.road_types.includes(type)
        ? prev.road_types.filter((t) => t !== type)
        : [...prev.road_types, type],
    }));
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleValidatePOI = async () => {
    setFormLoading(true);
    setFormError('');
    const { error } = await supabase
      .from('pois')
      .update({ status: 'validated' })
      .eq('id', activePOI.id);

    if (error) {
      setFormError(error.message);
    } else {
      onPOIUpdated();
      setView('list');
    }
    setFormLoading(false);
  };

  const handleDeletePOI = async (poi) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce POI ?')) return;

    setFormLoading(true);
    setFormError('');
    const { error } = await supabase.from('pois').delete().eq('id', poi.id);

    if (error) {
      setFormError(error.message);
    } else {
      onPOIUpdated();
      setView('list');
    }
    setFormLoading(false);
  };

  const handleSavePOI = async () => {
    setFormError('');
    if (!formData.name || !formData.latitude || !formData.longitude) {
      setFormError('Nom et coordonnées sont obligatoires');
      return;
    }

    setFormLoading(true);
    try {
      const data = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        elevation: formData.elevation,
        road_types: formData.road_types,
        traffic_level: formData.traffic_level,
      };

      if (activePOI?.id) {
        const { error } = await supabase
          .from('pois')
          .update(data)
          .eq('id', activePOI.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('pois')
          .insert([
            {
              ...data,
              status: 'pending',
              created_by: userProfile?.id,
            },
          ]);
        if (error) throw error;
      }

      onPOIUpdated();
      setView('list');
    } catch (err) {
      setFormError(err.message);
    }
    setFormLoading(false);
  };

  const canEdit = userProfile?.role === 'admin' || userProfile?.role === 'moderator';

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1>Parcours Moniteur</h1>
        <div className="header-buttons">
          <button
            className="icon-btn"
            onClick={onPOIUpdated}
            title="Actualiser"
          >
            🔄
          </button>
          {userProfile?.role === 'admin' && (
            <div className="button-group">
              <button
                className="icon-btn mod-requests-btn"
                onClick={onShowModRequests}
                title="Demandes de modification"
              >
                📝
                {modRequestsCount > 0 && <span className="badge">{modRequestsCount}</span>}
              </button>
              <button className="icon-btn" onClick={onShowUserMgmt} title="Gestion utilisateurs">
                👥
              </button>
            </div>
          )}
          <button className="logout-btn" onClick={onLogout} title="Déconnexion">
            ↪
          </button>
        </div>
      </div>

      <div className="sidebar-content">
        {view === 'list' && (
          <>
            <div className="filter-section">
              <h3>Filtres</h3>
              <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                <option value="">Toutes catégories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <div className="status-tabs">
                <button
                  className={`tab ${filterStatus === 'all' ? 'active' : ''}`}
                  onClick={() => setFilterStatus('all')}
                >
                  Tous
                </button>
                <button
                  className={`tab ${filterStatus === 'pending' ? 'active' : ''}`}
                  onClick={() => setFilterStatus('pending')}
                >
                  En attente
                </button>
                <button
                  className={`tab ${filterStatus === 'validated' ? 'active' : ''}`}
                  onClick={() => setFilterStatus('validated')}
                >
                  Validés
                </button>
              </div>
            </div>

            {canEdit && (
              <button className="add-poi-btn" onClick={handleAddPOI}>
                + Ajouter un POI
              </button>
            )}

            <h3>Points of Interest</h3>
            <div className="poi-count">{filtered.length} points trouvés</div>
            <div className="poi-list">
              {filtered.length === 0 ? (
                <p>Aucun point trouvé</p>
              ) : (
                filtered.map((poi) => (
                  <div key={poi.id} className="poi-item">
                    <div onClick={() => handlePOIClick(poi)}>
                      <div className="poi-header">
                        <div className="poi-name">{poi.name}</div>
                        {poi.status === 'pending' && <span className="badge-pending">En attente</span>}
                      </div>
                      <div className="poi-category">{poi.category || 'N/A'}</div>
                      <div className="poi-coords">
                        {poi.latitude.toFixed(4)}, {poi.longitude.toFixed(4)}
                      </div>
                    </div>
                    {canEdit && (
                      <div className="poi-actions">
                        <button
                          className="btn-edit"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActivePOI(poi);
                            setFormData({
                              name: poi.name || '',
                              description: poi.description || '',
                              category: poi.category || '',
                              latitude: poi.latitude || '',
                              longitude: poi.longitude || '',
                              elevation: poi.elevation || null,
                              road_types: poi.road_types || [],
                              traffic_level: poi.traffic_level || 'low',
                            });
                            setView('edit');
                          }}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="btn-delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePOI(poi);
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {view === 'detail' && activePOI && (
          <div className="detail-view">
            <button className="back-btn" onClick={() => setView('list')}>
              ← Retour
            </button>

            <h2>{activePOI.name}</h2>
            {activePOI.status === 'pending' && <span className="badge-pending">En attente</span>}

            <div className="detail-content">
              <p>
                <strong>Catégorie :</strong> {activePOI.category || 'Non spécifiée'}
              </p>
              <p>
                <strong>Description :</strong> {activePOI.description || 'Aucune description'}
              </p>
              <p>
                <strong>Coordonnées :</strong> {activePOI.latitude.toFixed(4)},{' '}
                {activePOI.longitude.toFixed(4)}
              </p>
              <p>
                <strong>Dénivelé :</strong>{' '}
                {activePOI.elevation === 'light'
                  ? 'Légère'
                  : activePOI.elevation === 'medium'
                    ? 'Moyenne'
                    : activePOI.elevation === 'steep'
                      ? 'Pentue'
                      : 'Aucun'}
              </p>
              {activePOI.road_types && activePOI.road_types.length > 0 && (
                <p>
                  <strong>Types de voie :</strong>
                  <ul>
                    {activePOI.road_types.map((type) => (
                      <li key={type}>{type}</li>
                    ))}
                  </ul>
                </p>
              )}
              <p>
                <strong>Fréquentation :</strong>{' '}
                {activePOI.traffic_level === 'low' ? 'Faible' : 'Forte'}
              </p>
              <p>
                <strong>Statut :</strong>{' '}
                {activePOI.status === 'pending' ? 'En attente de validation' : 'Validé'}
              </p>
            </div>

            <div className="detail-actions">
              {canEdit && (
                <>
                  <button className="btn-primary" onClick={handleEditPOI}>
                    ✏️ Modifier
                  </button>
                  <button className="btn-danger" onClick={() => handleDeletePOI(activePOI)}>
                    🗑️ Supprimer
                  </button>
                </>
              )}

              {activePOI.status === 'pending' && canEdit && (
                <button className="btn-success" onClick={handleValidatePOI} disabled={formLoading}>
                  ✓ Valider
                </button>
              )}
            </div>
          </div>
        )}

        {(view === 'edit' || view === 'add') && (
          <div className="edit-view">
            <button className="back-btn" onClick={() => setView('detail')}>
              ← Retour
            </button>

            <h2>{activePOI?.id ? 'Modifier POI' : 'Ajouter un POI'}</h2>

            {formError && <div className="error-message">{formError}</div>}

            <form>
              <input
                type="text"
                name="name"
                placeholder="Nom du POI *"
                value={formData.name}
                onChange={handleFormChange}
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleFormChange}
                rows="3"
              />
              <input
                type="text"
                name="category"
                placeholder="Catégorie"
                value={formData.category}
                onChange={handleFormChange}
                list="categories"
              />
              <datalist id="categories">
                {categories.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>

              <div className="form-row">
                <input
                  type="number"
                  name="latitude"
                  placeholder="Latitude *"
                  value={formData.latitude}
                  onChange={handleFormChange}
                  step="0.0001"
                  required
                />
                <input
                  type="number"
                  name="longitude"
                  placeholder="Longitude *"
                  value={formData.longitude}
                  onChange={handleFormChange}
                  step="0.0001"
                  required
                />
              </div>

              <label>Dénivelé</label>
              <select
                name="elevation"
                value={formData.elevation || ''}
                onChange={(e) => setFormData({ ...formData, elevation: e.target.value || null })}
              >
                {ELEVATIONS.map((opt) => (
                  <option key={opt.value || 'none'} value={opt.value || ''}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <label>Types de voie</label>
              <div className="checkbox-group">
                {ROAD_TYPES.map((type) => (
                  <label key={type} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.road_types.includes(type)}
                      onChange={() => handleRoadTypeToggle(type)}
                    />
                    {type}
                  </label>
                ))}
              </div>

              <label>Fréquentation</label>
              <div className="radio-group">
                {TRAFFIC_LEVELS.map((opt) => (
                  <label key={opt.value} className="radio-label">
                    <input
                      type="radio"
                      name="traffic"
                      value={opt.value}
                      checked={formData.traffic_level === opt.value}
                      onChange={() => setFormData({ ...formData, traffic_level: opt.value })}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>

              <button
                type="button"
                className="btn-primary"
                onClick={handleSavePOI}
                disabled={formLoading}
              >
                {formLoading ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
