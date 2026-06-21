// src/molecules/SidebarPOIListItem.jsx

export default function SidebarPOIListItem({ poi, isActive = false, onClick }) {
    const isPending = poi.status === "en cours";

    const className = [
        "poi-list-item",
        isActive ? "poi-list-item-active" : "",
        isPending ? "poi-list-item-pending" : "",
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <button type="button" className={className} onClick={onClick}>
      <span className="poi-list-item-title">
        {poi.name || "POI sans nom"}
      </span>

            <span className="poi-list-item-meta">
        {poi.type || "Type non défini"}
      </span>

            {isPending && (
                <span className="poi-list-item-status">
          En cours
        </span>
            )}
        </button>
    );
}
