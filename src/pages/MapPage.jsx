import { useState } from "react";
import Sidebar from "../Organism/Sidebar";
import MapView from "../Organism/MapView";

export default function MapPage({ onLogout }) {
    const [showPendingOnly, setShowPendingOnly] = useState(false);

    return (
        <main className="map-page">
            <div className="map-page-sidebar">
                <Sidebar
                    onLogout={onLogout}
                    showPendingOnly={showPendingOnly}
                    onTogglePendingOnly={() => setShowPendingOnly((current) => !current)}
                />
            </div>

            <div className="map-page-content">
                <MapView showPendingOnly={showPendingOnly} />
            </div>
        </main>
    );
}
