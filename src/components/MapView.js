import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const pendingIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const activeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function MapView({ pois, onMarkerClick, loading, activePOI }) {
  const [position, setPosition] = useState([48.8566, 2.3522]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition([pos.coords.latitude, pos.coords.longitude]);
        },
        () => {}
      );
    }
  }, []);

  return (
    <div style={{ height: '100%', width: '100%' }}>
      {loading ? (
        <div className="map-loading">Getting your location...</div>
      ) : (
        <MapContainer center={position} zoom={13} className="map-container" style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {pois.map((poi) => {
            let icon = L.Icon.Default.prototype;
            if (activePOI?.id === poi.id) {
              icon = activeIcon;
            } else if (poi.status === 'pending') {
              icon = pendingIcon;
            }

            return (
              <Marker
                key={poi.id}
                position={[poi.latitude, poi.longitude]}
                icon={icon}
                eventHandlers={{
                  click: () => onMarkerClick(poi),
                }}
              >
                <Popup>
                  <div style={{ cursor: 'pointer' }} onClick={() => onMarkerClick(poi)}>
                    <h4>{poi.name}</h4>
                    <p>{poi.latitude.toFixed(4)}, {poi.longitude.toFixed(4)}</p>
                    {poi.status === 'pending' && <span style={{ color: 'orange' }}>Pending</span>}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      )}
    </div>
  );
}
