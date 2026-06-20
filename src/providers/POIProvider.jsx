// src/providers/POIProvider.jsx
import { createContext, useEffect, useState } from "react";
import { PoisDAO } from "../dao/PoisDAO";

export const POIContext = createContext(null);

export default function POIProvider({ children }) {
    const [pois, setPois] = useState([]);
    const [activePOI, setActivePOI] = useState(null);
    const [poiLoading, setPoiLoading] = useState(true);
    const [poiError, setPoiError] = useState("");
    const [isEditingPOI, setIsEditingPOI] = useState(false);
    const [editingLocation, setEditingLocation] = useState(null);

    const startPOIEdit = (poi) => {
        setActivePOI(poi);
        setIsEditingPOI(true);
        setEditingLocation({
            latitude: poi.latitude,
            longitude: poi.longitude,
        });
    };

    const stopPOIEdit = () => {
        setIsEditingPOI(false);
        setEditingLocation(null);
    };

    const updateEditingLocation = (latitude, longitude) => {
        setEditingLocation({
            latitude,
            longitude,
        });
    };

    const loadPOIs = async () => {
        setPoiLoading(true);
        setPoiError("");

        try {
            const data = await PoisDAO.getAll();
            console.log("POI chargés depuis Supabase :", data.length, data);
            setPois(data);
        } catch (error) {
            setPoiError(error.message);
            console.error("Erreur chargement POI :", error);
        } finally {
            setPoiLoading(false);
        }
    };

    const selectPOI = (poi) => {
        setActivePOI(poi);
    };

    const clearActivePOI = () => {
        setActivePOI(null);
    };

    useEffect(() => {
        loadPOIs();
    }, []);


    const updatePOI = async (id, poiData) => {
        setPoiError("");

        try {
            const updatedPOI = await PoisDAO.updateEditableFields(id, poiData);

            setPois((currentPois) =>
                currentPois.map((poi) =>
                    poi.id === id ? updatedPOI : poi
                )
            );

            setActivePOI(updatedPOI);

            return updatedPOI;
        } catch (error) {
            setPoiError(error.message);
            throw error;
        }
    };
    const deletePOI = async (id) => {
        setPoiError("");

        try {
            await PoisDAO.delete(id);

            setPois((currentPois) =>
                currentPois.filter((poi) => poi.id !== id)
            );

            setActivePOI((currentPOI) =>
                currentPOI?.id === id ? null : currentPOI
            );

            return true;
        } catch (error) {
            setPoiError(error.message);
            throw error;
        }
    };

    const value = {
        pois,
        activePOI,
        poiLoading,
        poiError,

        loadPOIs,
        refreshPOIs: loadPOIs,
        selectPOI,
        clearActivePOI,
        updatePOI,
        deletePOI,

        isEditingPOI,
        editingLocation,
        startPOIEdit,
        stopPOIEdit,
        updateEditingLocation,
    };
    return (
        <POIContext.Provider value={value}>
            {children}
        </POIContext.Provider>
    );
}