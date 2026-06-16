// src/molecules/SidebarPOIDetail.jsx

export default function SidebarPOIDetail({ poi, onBack, onEdit }) {
    const hasCoordinates =
        poi.latitude !== null &&
        poi.latitude !== undefined &&
        poi.longitude !== null &&
        poi.longitude !== undefined;

    return (
        <div className="sidebar-poi-detail">
            <button type="button" className="button-ghost" onClick={onBack}>
                ← Retour
            </button>

            <div className="poi-detail-header">
                <div>
                    <h2>{poi.name || "POI sans nom"}</h2>
                    <p>{poi.type || "Type non défini"}</p>
                </div>

                <button type="button" className="button-primary" onClick={onEdit}>
                    Modifier
                </button>
            </div>

            <div className="poi-detail-section">
                <strong>Statut</strong>
                <span>{poi.status || "Non défini"}</span>
            </div>

            <div className="poi-detail-section">
                <strong>Description</strong>
                <span>{poi.description || "Aucune description."}</span>
            </div>

            <div className="poi-detail-section">
                <strong>Coordonnées</strong>
                <span>
          {hasCoordinates
              ? `${Number(poi.latitude).toFixed(4)}, ${Number(poi.longitude).toFixed(4)}`
              : "Coordonnées manquantes"}
        </span>
            </div>
        </div>
    );
}