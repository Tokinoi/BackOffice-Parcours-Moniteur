
import { supabase } from '../supabase';

const TABLE_NAME = 'users';

export const UserDAO = {
    /**
     * Récupérer le profil utilisateur par son id
     * L'id doit correspondre à auth.users.id
     */
    async getById(userId) {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            throw new Error(`Erreur lors du chargement du profil : ${error.message}`);
        }

        return data;
    },

    /**
     * Récupérer tous les utilisateurs
     * Utile pour une interface admin
     */
    async getAll() {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            throw new Error(`Erreur lors du chargement des utilisateurs : ${error.message}`);
        }

        return data || [];
    },

    /**
     * Créer un profil utilisateur dans la table users
     * À utiliser après une inscription si le profil n'est pas créé automatiquement côté Supabase
     */
    async create(user) {
        const payload = {
            id: user.id,
            email: user.email,
            first_name: user.first_name ?? null,
            last_name: user.last_name ?? null,
            avatar_url: user.avatar_url ?? null,
            is_active: user.is_active ?? true,
            is_admin: user.is_admin ?? false,
        };

        const { data, error } = await supabase
            .from(TABLE_NAME)
            .insert([payload])
            .select()
            .single();

        if (error) {
            throw new Error(`Erreur lors de la création du profil : ${error.message}`);
        }

        return data;
    },

    /**
     * Mettre à jour les informations d'un utilisateur
     */
    async update(userId, profileData) {
        const payload = {
            ...profileData,
            updated_at: new Date().toISOString(),
        };

        const { data, error } = await supabase
            .from(TABLE_NAME)
            .update(payload)
            .eq('id', userId)
            .select()
            .single();

        if (error) {
            throw new Error(`Erreur lors de la mise à jour du profil : ${error.message}`);
        }

        return data;
    },

    /**
     * Activer / désactiver un utilisateur
     */
    async setActive(userId, isActive) {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .update({
                is_active: isActive,
                updated_at: new Date().toISOString(),
            })
            .eq('id', userId)
            .select()
            .single();

        if (error) {
            throw new Error(`Erreur lors du changement de statut utilisateur : ${error.message}`);
        }

        return data;
    },

    /**
     * Donner / retirer les droits admin
     */
    async setAdmin(userId, isAdmin) {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .update({
                is_admin: isAdmin,
                updated_at: new Date().toISOString(),
            })
            .eq('id', userId)
            .select()
            .single();

        if (error) {
            throw new Error(`Erreur lors du changement des droits admin : ${error.message}`);
        }

        return data;
    },

    /**
     * Récupérer ou créer automatiquement le profil utilisateur
     * Pratique au login si la ligne users n'existe pas encore
     */
    async getOrCreateFromAuthUser(authUser) {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .eq('id', authUser.id)
            .maybeSingle();

        if (error) {
            throw new Error(`Erreur lors du chargement du profil : ${error.message}`);
        }

        if (data) {
            return data;
        }

        return this.create({
            id: authUser.id,
            email: authUser.email,
            first_name: authUser.user_metadata?.first_name ?? null,
            last_name: authUser.user_metadata?.last_name ?? null,
            avatar_url: authUser.user_metadata?.avatar_url ?? null,
            is_active: true,
            is_admin: false,
        });
    },

    /**
     * Helpers métier
     */
    isAdmin(profile) {
        return profile?.is_admin === true;
    },

    canEdit(profile) {
        return profile?.is_admin === true;
    },

    isActive(profile) {
        return profile?.is_active === true;
    },
};