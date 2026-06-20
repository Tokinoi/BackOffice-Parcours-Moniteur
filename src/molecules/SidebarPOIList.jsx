import Molecules from "./index";

export default function SidebarPOIList({
                                           pois = [],
                                           activePOI = null,
                                           showPendingOnly = false,
                                           onTogglePendingOnly,
                                           onSelectPOI,
                                       }) {
    const visiblePois = showPendingOnly
        ? pois.filter((poi) => poi.status?.trim().toLowerCase() === "en cours")
        : pois;

    return (
        <div className="sidebar-poi-list">
            <div className="sidebar-poi-list-header">
                <div>
                    <h2>Points d’intérêt</h2>
                    <p>{visiblePois.length} point(s) trouvé(s)</p>
                </div>

                <div className="sidebar-poi-list-actions">
                    <button
                        type="button"
                        className={showPendingOnly ? "button-filter button-filter-active" : "button-filter"}
                        onClick={onTogglePendingOnly}
                        aria-pressed={showPendingOnly}
                    >
                        En cours
                    </button>

                </div>
            </div>

            <div className="poi-list">
                {visiblePois.length === 0 && (
                    <p className="empty-message">Aucun point trouvé.</p>
                )}

                {visiblePois.map((poi) => (
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
