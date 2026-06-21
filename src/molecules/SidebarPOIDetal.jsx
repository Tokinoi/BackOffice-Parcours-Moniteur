// src/molecules/SidebarPOIDetail.jsx

export default function SidebarPOIDetail({ poi, onBack, onEdit }) {
    return (
        <div className="sidebar-poi-detail">
            <button type="button" className="button-ghost" onClick={onBack}>
                ← Retour
            </button>

            <div className="poi-detail-header">
                <div>
                    <h2>{poi.name || "POI sans nom"}</h2>
                    <p>{poi.status || "Statut non défini"}</p>
                </div>

                <button type="button" className="button-primary" onClick={onEdit}>
                    Modifier
                </button>
            </div>

            <div className="poi-detail-section">
                <strong>Type</strong>
                <span>{poi.type || "Non défini"}</span>
            </div>

            <div className="poi-detail-section">
                <strong>Description</strong>
                <span>{poi.description || "Aucune description."}</span>
            </div>
        </div>
    );
}
