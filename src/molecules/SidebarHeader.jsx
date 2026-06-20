// src/molecules/SidebarHeader.jsx

export default function SidebarHeader({
                                          title = "Parcours Moniteur",
                                          onRefresh,
                                          onShowModRequests,
                                          onShowUserMgmt,
                                          onLogout,
                                          modRequestsCount = 0,
                                          isAdmin = false,
                                      }) {
    return (
        <header className="sidebar-header">
            <div className="sidebar-header-title">
                <h1>{title}</h1>
            </div>

            <div className="sidebar-header-actions">
                <button
                    type="button"
                    className="icon-button"
                    onClick={onRefresh}
                    title="Actualiser"
                    aria-label="Actualiser"
                >
                    🔄
                </button>

                {isAdmin && (
                    <>
                        <button
                            type="button"
                            className="icon-button icon-button-with-badge"
                            onClick={onShowModRequests}
                            title="Demandes de modification"
                            aria-label="Demandes de modification"
                        >
                            📝

                            {modRequestsCount > 0 && (
                                <span className="notification-badge">
                  {modRequestsCount}
                </span>
                            )}
                        </button>

                        <button
                            type="button"
                            className="icon-button"
                            onClick={onShowUserMgmt}
                            title="Gestion utilisateurs"
                            aria-label="Gestion utilisateurs"
                        >
                            👥
                        </button>
                    </>
                )}

                <button
                    type="button"
                    className="icon-button icon-button-danger"
                    onClick={onLogout}
                    title="Déconnexion"
                    aria-label="Déconnexion"
                >
                    ↪
                </button>
            </div>
        </header>
    );
}