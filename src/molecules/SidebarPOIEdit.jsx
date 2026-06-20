import { useState } from "react";
import usePOI from "../hooks/usePOI";
import { POI_STATUSES, POI_TYPES } from "../constants/poiOptions";

export default function SidebarPOIEdit({ poi, onBack, onSaved, onDeleted }) {
    const {
        updatePOI,
        deletePOI,
        editingLocation,
    } = usePOI();

    const [formData, setFormData] = useState({
        name: poi.name || "",
        type: poi.type || "",
        status: poi.status || "en cours",
        description: poi.description || "",
    });

    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");

    const latitude = editingLocation?.latitude ?? poi.latitude;
    const longitude = editingLocation?.longitude ?? poi.longitude;

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if (!formData.name.trim()) {
            setError("Le nom du POI est obligatoire.");
            return;
        }

        if (!formData.type) {
            setError("Le type du POI est obligatoire.");
            return;
        }

        if (!formData.status) {
            setError("Le statut du POI est obligatoire.");
            return;
        }

        setLoading(true);

        try {
            await updatePOI(poi.id, {
                name: formData.name.trim(),
                type: formData.type,
                status: formData.status,
                description: formData.description.trim(),
                latitude,
                longitude,
            });

            onSaved?.();
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        const confirmed = window.confirm(
            `Supprimer définitivement le POI "${poi.name || "sans nom"}" ?`
        );

        if (!confirmed) return;

        setError("");
        setDeleting(true);

        try {
            await deletePOI(poi.id);
            onDeleted?.();
        } catch (error) {
            setError(error.message);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <form className="sidebar-poi-form" onSubmit={handleSubmit}>
            <button type="button" className="button-ghost" onClick={onBack}>
                ← Retour au détail
            </button>

            <h2>Modifier le POI</h2>

            {error && <p className="error-message">{error}</p>}

            <label>
                Nom
                <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nom du POI"
                />
            </label>

            <label>
                Type
                <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                >
                    <option value="">Sélectionner un type</option>

                    {POI_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                            {type.label}
                        </option>
                    ))}
                </select>
            </label>

            <label>
                Statut
                <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                >
                    {POI_STATUSES.map((status) => (
                        <option key={status.value} value={status.value}>
                            {status.label}
                        </option>
                    ))}
                </select>
            </label>

            <label>
                Description
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Description du POI"
                />
            </label>

            <div className="readonly-field">
                <span>Latitude</span>
                <strong>{latitude ?? "Non renseignée"}</strong>
            </div>

            <div className="readonly-field">
                <span>Longitude</span>
                <strong>{longitude ?? "Non renseignée"}</strong>
            </div>

            <p className="form-help">
                Clique sur la carte pour déplacer ce point.
            </p>

            <div className="form-actions">
                <button
                    type="submit"
                    className="button-primary"
                    disabled={loading || deleting}
                >
                    {loading ? "Enregistrement..." : "Enregistrer"}
                </button>

                <button
                    type="button"
                    className="button-danger"
                    onClick={handleDelete}
                    disabled={loading || deleting}
                >
                    {deleting ? "Suppression..." : "Supprimer"}
                </button>
            </div>
        </form>
    );
}