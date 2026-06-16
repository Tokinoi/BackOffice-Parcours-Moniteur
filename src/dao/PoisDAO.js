// src/dao/PoisDAO.js
import { supabase } from "../supabase.js";

const TABLE_NAME = "pois";

export class PoisDAO {
    /**
     * Récupérer tous les POIs
     */
    static async getAll() {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            throw new Error(`Erreur lors de la récupération des POIs : ${error.message}`);
        }

        return data;
    }

    /**
     * Récupérer un POI par son id
     */
    static async getById(id) {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select("*")
            .eq("id", id)
            .single();

        if (error) {
            throw new Error(`Erreur lors de la récupération du POI : ${error.message}`);
        }

        return data;
    }

    /**
     * Créer un POI
     */
    static async create(poi) {
        const payload = {
            name: poi.name,
            description: poi.description ?? null,
            type: poi.type ?? null,
            status: poi.status ?? null,
            latitude: poi.latitude,
            longitude: poi.longitude,
            created_by: poi.created_by ?? null,
        };

        const { data, error } = await supabase
            .from(TABLE_NAME)
            .insert(payload)
            .select()
            .single();

        if (error) {
            throw new Error(`Erreur lors de la création du POI : ${error.message}`);
        }

        return data;
    }

    /**
     * Modifier un POI
     */
    static async update(id, poi) {
        const payload = {
            name: poi.name,
            description: poi.description ?? null,
            type: poi.type ?? null,
            status: poi.status ?? null,
            latitude: poi.latitude,
            longitude: poi.longitude,
            updated_at: new Date().toISOString(),
        };

        const { data, error } = await supabase
            .from(TABLE_NAME)
            .update(payload)
            .eq("id", id)
            .select()
            .single();

        if (error) {
            throw new Error(`Erreur lors de la modification du POI : ${error.message}`);
        }

        return data;
    }

    /**
     * Supprimer un POI
     */
    static async delete(id) {
        const { error } = await supabase
            .from(TABLE_NAME)
            .delete()
            .eq("id", id);

        if (error) {
            throw new Error(`Erreur lors de la suppression du POI : ${error.message}`);
        }

        return true;
    }

    /**
     * Récupérer les POIs par type
     */
    static async getByType(type) {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select("*")
            .eq("type", type)
            .order("created_at", { ascending: false });

        if (error) {
            throw new Error(`Erreur lors de la récupération des POIs par type : ${error.message}`);
        }

        return data;
    }
    /**
     * Modifier uniquement les champs éditables d'un POI
     */
    static async updateEditableFields(id, poi) {
        const payload = {
            name: poi.name,
            description: poi.description ?? null,
            type: poi.type ?? null,
            status: poi.status ?? null,
            updated_at: new Date().toISOString(),
        };

        const { data, error } = await supabase
            .from(TABLE_NAME)
            .update(payload)
            .eq("id", id)
            .select()
            .single();

        if (error) {
            throw new Error(`Erreur lors de la modification du POI : ${error.message}`);
        }

        return data;
    }
    /**
     * Récupérer les POIs par status
     */
    static async getByStatus(status) {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select("*")
            .eq("status", status)
            .order("created_at", { ascending: false });

        if (error) {
            throw new Error(`Erreur lors de la récupération des POIs par status : ${error.message}`);
        }

        return data;
    }
}