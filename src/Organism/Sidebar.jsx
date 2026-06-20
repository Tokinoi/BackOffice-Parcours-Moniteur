import { useEffect, useState } from "react";
import Molecules from "../molecules";
import usePOI from "../hooks/usePOI";

const VIEWS = {
    LIST: "list",
    DETAIL: "detail",
    EDIT: "edit",
};

export default function Sidebar({ onLogout, showPendingOnly, onTogglePendingOnly }) {
    const {
        pois,
        activePOI,
        poiLoading,
        poiError,
        selectPOI,
        clearActivePOI,
        refreshPOIs,
        startPOIEdit,
        stopPOIEdit,
    } = usePOI();

    const [view, setView] = useState(VIEWS.LIST);

    useEffect(() => {
        if (activePOI && view !== VIEWS.EDIT) {
            setView(VIEWS.DETAIL);
        }
    }, [activePOI, view]);

    const goToList = () => {
        stopPOIEdit();
        clearActivePOI();
        setView(VIEWS.LIST);
    };

    const goToDetail = () => {
        stopPOIEdit();
        setView(VIEWS.DETAIL);
    };

    const goToEdit = () => {
        startPOIEdit(activePOI);
        setView(VIEWS.EDIT);
    };

    const goToDocumentation = () => {
        window.location.assign("/documentation.html");
    };

    const handleSelectPOI = (poi) => {
        stopPOIEdit();
        selectPOI(poi);
        setView(VIEWS.DETAIL);
    };

    return (
        <aside className="sidebar">
            <Molecules.SidebarHeader
                onRefresh={refreshPOIs}
                onDocumentation={goToDocumentation}
                onLogout={onLogout}
            />

            <div className="sidebar-content">
                {poiLoading && <p>Chargement...</p>}
                {poiError && <p className="error-message">{poiError}</p>}

                {!poiLoading && view === VIEWS.LIST && (
                    <Molecules.SidebarPOIList
                        pois={pois}
                        activePOI={activePOI}
                        showPendingOnly={showPendingOnly}
                        onTogglePendingOnly={onTogglePendingOnly}
                        onSelectPOI={handleSelectPOI}
                    />
                )}

                {!poiLoading && view === VIEWS.DETAIL && activePOI && (
                    <Molecules.SidebarPOIDetail
                        poi={activePOI}
                        onBack={goToList}
                        onEdit={goToEdit}
                    />
                )}

                {!poiLoading && view === VIEWS.EDIT && activePOI && (
                    <Molecules.SidebarPOIEdit
                        poi={activePOI}
                        onBack={goToDetail}
                        onSaved={goToDetail}
                        onDeleted={goToList}
                    />
                )}
            </div>
        </aside>
    );
}
