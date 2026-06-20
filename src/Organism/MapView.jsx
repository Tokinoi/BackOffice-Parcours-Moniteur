import { useEffect } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    useMap,
    useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import usePOI from "../hooks/usePOI";

const cyanIcon = L.icon({
    iconUrl: "/cyan_pin.svg",
    iconSize: [36, 48],
    iconAnchor: [18, 48],
});

const yellowIcon = L.icon({
    iconUrl: "/yellow_pin.svg",
    iconSize: [36, 48],
    iconAnchor: [18, 48],
});

function getPOIIcon(poi) {
    const status = poi.status?.trim().toLowerCase();
    return status === "en cours" ? yellowIcon : cyanIcon;
}

function MapFocusOnPOI({ poi, isEditingPOI }) {
    const map = useMap();

    useEffect(() => {
        if (isEditingPOI || !poi?.latitude || !poi?.longitude) return;

        map.flyTo(
            [Number(poi.latitude), Number(poi.longitude)],
            16,
            { duration: 0.6 }
        );
    }, [poi, isEditingPOI, map]);

    return null;
}

function MapEditController() {
    const {
        isEditingPOI,
        updateEditingLocation,
    } = usePOI();

    useMapEvents({
        click(event) {
            if (!isEditingPOI) return;

            updateEditingLocation(
                event.latlng.lat,
                event.latlng.lng
            );
        },
    });

    return null;
}
export default function MapView() {
    const {
        pois,
        activePOI,
        selectPOI,
        isEditingPOI,
        editingLocation,
    } = usePOI();

    const visiblePois = pois.filter((poi) => (
        poi.latitude !== null &&
        poi.latitude !== undefined &&
        poi.longitude !== null &&
        poi.longitude !== undefined
    ));

    return (
        <div className="map-view">
            {isEditingPOI && (
                <div className="map-edit-hint">
                    Clique sur la carte pour déplacer le point
                </div>
            )}

            <MapContainer
                center={[48.8566, 2.3522]}
                zoom={13}
                className="leaflet-map"
            >
                <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapFocusOnPOI
                    poi={activePOI}
                    isEditingPOI={isEditingPOI}
                />

                <MapEditController />

                {visiblePois.map((poi) => {
                    const isEditedPOI =
                        isEditingPOI &&
                        activePOI?.id === poi.id &&
                        editingLocation;

                    const latitude = isEditedPOI
                        ? editingLocation.latitude
                        : poi.latitude;

                    const longitude = isEditedPOI
                        ? editingLocation.longitude
                        : poi.longitude;

                    return (
                        <Marker
                            key={poi.id}
                            position={[
                                Number(latitude),
                                Number(longitude),
                            ]}
                            icon={getPOIIcon(poi)}
                            eventHandlers={{
                                click: () => {
                                    if (!isEditingPOI) {
                                        selectPOI(poi);
                                    }
                                },
                            }}
                        />
                    );
                })}
            </MapContainer>
        </div>
    );
}
