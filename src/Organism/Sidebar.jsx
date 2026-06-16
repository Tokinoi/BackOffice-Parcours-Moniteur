// src/Organism/Sidebar.jsx

import { useState } from "react";
import Molecules from "../molecules";
import usePOI from "../hooks/usePOI";

const VIEWS = {
    LIST: "list",
    DETAIL: "detail",
    ADD: "add",
    EDIT: "edit",
};

export default function Sidebar() {
    const {
        pois,
        activePOI,
        poiLoading,
        poiError,
        selectPOI,
        refreshPOIs,
    } = usePOI();

    const [view, setView] = useState(VIEWS.LIST);

    const handleSelectPOI = (poi) => {
        selectPOI(poi);
        setView(VIEWS.DETAIL);
    };

    const handleBackToList = () => {
        setView(VIEWS.LIST);
    };

    return (
        <aside className="sidebar">
            <Molecules.SidebarHeader
                onRefresh={refreshPOIs}
                onLogout={() => console.log("logout")}
            />

            <div className="sidebar-content">
                {poiLoading && <p>Chargement...</p>}
                {poiError && <p className="error-message">{poiError}</p>}

                {!poiLoading && view === VIEWS.LIST && (
                    <Molecules.SidebarPOIList
                        pois={pois}
                        activePOI={activePOI}
                        onSelectPOI={handleSelectPOI}
                        onAddPOI={() => setView(VIEWS.ADD)}
                    />
                )}

                {!poiLoading && view === VIEWS.DETAIL && activePOI && (
                    <Molecules.SidebarPOIDetail
                        poi={activePOI}
                        onBack={handleBackToList}
                        onEdit={() => setView(VIEWS.EDIT)}
                    />
                )}

                {!poiLoading && view === VIEWS.ADD && (
                    <Molecules.SidebarPOIAdd
                        onBack={handleBackToList}
                    />
                )}

                {!poiLoading && view === VIEWS.EDIT && activePOI && (
                    <Molecules.SidebarPOIEdit
                        poi={activePOI}
                        onBack={() => setView(VIEWS.DETAIL)}
                        onSaved={() => setView(VIEWS.DETAIL)}
                        onDeleted={() => setView(VIEWS.LIST)}
                    />
                )}
            </div>
        </aside>
    );
}