// src/molecules/SidebarPOIListItem.jsx

export default function SidebarPOIListItem({ poi, isActive = false, onClick }) {
    const isPending = poi.status === "en cours";

    const hasCoordinates =
        poi.latitude !== null &&
        poi.latitude !== undefined &&
        poi.longitude !== null &&
        poi.longitude !== undefined;

    const className = [
        "poi-list-item",
        isActive ? "poi-list-item-active" : "",
        isPending ? "poi-list-item-pending" : "",
    ]
        .filter(Boolean)
        .join(" ");
    console.log(poi.name, poi.status, isPending, className);
    return (
        <button type="button" className={className} onClick={onClick}>
      <span className="poi-list-item-title">
        {poi.name || "POI sans nom"}
      </span>

            <span className="poi-list-item-meta">
        {poi.type || "Type non défini"}
      </span>

            <span className="poi-list-item-coordinates">
        {hasCoordinates
            ? `${Number(poi.latitude).toFixed(4)}, ${Number(poi.longitude).toFixed(4)}`
            : "Coordonnées manquantes"}
      </span>

            {isPending && (
                <span className="poi-list-item-status">
          En cours
        </span>
            )}
        </button>
    );
}