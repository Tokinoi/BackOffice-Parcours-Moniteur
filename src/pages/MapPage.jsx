// src/pages/MapPage.jsx
import Sidebar from "../Organism/Sidebar";
import MapView from "../components/MapView";
import usePOI from "../hooks/usePOI";

export default function MapPage() {
    const {
        pois,
        activePOI,
        poiLoading,
        selectPOI,
    } = usePOI();

    return (
        <main className="map-page">
            <div className="map-page-sidebar">
                <Sidebar />
            </div>
        </main>
    );
}