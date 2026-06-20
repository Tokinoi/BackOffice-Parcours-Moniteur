// src/hooks/usePOI.js
import { useContext } from "react";
import { POIContext } from "../providers/POIProvider";

export default function usePOI() {
    const context = useContext(POIContext);

    if (!context) {
        throw new Error("usePOI doit être utilisé dans un POIProvider");
    }

    return context;
}