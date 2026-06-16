// src/molecules/SidebarPOIList.jsx

import Molecules from "./index";

export default function SidebarPOIList({
                                           pois = [],
                                           activePOI = null,
                                           onSelectPOI,
                                           onAddPOI,
                                       }) {
    return (
        <div className="sidebar-poi-list">
            <div className="sidebar-poi-list-header">
                <div>
                    <h2>Points d’intérêt</h2>
                    <p>{pois.length} point(s) trouvé(s)</p>
                </div>

                <button
                    type="button"
                    className="button-primary"
                    onClick={onAddPOI}
                >
                    Ajouter
                </button>
            </div>

            <div className="poi-list">
                {pois.length === 0 && (
                    <p className="empty-message">Aucun point trouvé.</p>
                )}

                {pois.map((poi) => (
                    <Molecules.SidebarPOIListItem
                        key={poi.id}
                        poi={poi}
                        isActive={activePOI?.id === poi.id}
                        onClick={() => onSelectPOI?.(poi)}
                    />
                ))}
            </div>
        </div>
    );
}