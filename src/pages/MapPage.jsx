import Sidebar from "../Organism/Sidebar";
import MapView from "../Organism/MapView";

export default function MapPage({ onLogout }) {
    return (
        <main className="map-page">
            <div className="map-page-sidebar">
                <Sidebar onLogout={onLogout} />
            </div>

            <div className="map-page-content">
                <MapView />
            </div>
        </main>
    );
}
