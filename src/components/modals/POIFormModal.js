import { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import './Modal.css';

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

export default function POIFormModal({
  poi,
  userProfile,
  onClose,
  onPOIUpdated,
  allCategories,
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [elevation, setElevation] = useState(null);
  const [roadTypes, setRoadTypes] = useState([]);
  const [trafficLevel, setTrafficLevel] = useState('low');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (poi) {
      setName(poi.name || '');
      setDescription(poi.description || '');
      setCategory(poi.category || '');
      setLatitude(poi.latitude || '');
      setLongitude(poi.longitude || '');
      setElevation(poi.elevation || null);
      setRoadTypes(poi.road_types || []);
      setTrafficLevel(poi.traffic_level || 'low');
    }
  }, [poi]);

  const handleRoadTypeToggle = (type) => {
    setRoadTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!name || !latitude || !longitude) {
      setError('Nom et coordonnées sont obligatoires');
      setLoading(false);
      return;
    }

    const data = {
      name,
      description,
      category,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      elevation,
      road_types: roadTypes,
      traffic_level: trafficLevel,
    };

    try {
      if (poi?.id) {
        const { error: err } = await supabase
          .from('pois')
          .update(data)
          .eq('id', poi.id);
        if (err) throw err;
      } else {
        const { error: err } = await supabase
          .from('pois')
          .insert([
            {
              ...data,
              status: 'pending',
              created_by: userProfile?.id,
            },
          ]);
        if (err) throw err;
      }

      onPOIUpdated();
      onClose();
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>

        <h2>{poi?.id ? 'Modifier POI' : 'Ajouter un POI'}</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nom du POI *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
          />
          <input
            type="text"
            placeholder="Catégorie"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            list="categories"
          />
          <datalist id="categories">
            {allCategories.map((cat) => (
              <option key={cat} value={cat} />
            ))}
          </datalist>

          <div className="form-row">
            <input
              type="number"
              placeholder="Latitude *"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              step="0.0001"
              required
            />
            <input
              type="number"
              placeholder="Longitude *"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              step="0.0001"
              required
            />
          </div>

          <label>Dénivelé</label>
          <select value={elevation || ''} onChange={(e) => setElevation(e.target.value || null)}>
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
                  checked={roadTypes.includes(type)}
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
                  checked={trafficLevel === opt.value}
                  onChange={(e) => setTrafficLevel(e.target.value)}
                />
                {opt.label}
              </label>
            ))}
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </form>
      </div>
    </div>
  );
}
