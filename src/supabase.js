import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabasePublishableKey = process.env.REACT_APP_SUPABASE_PUBLISHABLE_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabasePublishableKey)
  : null;

// POI (Point of Interest) functions
export const poiService = {
  // Get all POIs
  async getAllPOIs() {
    const { data, error } = await supabase
      .from('pois')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get single POI by ID
  async getPOIById(id) {
    const { data, error } = await supabase
      .from('pois')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create new POI
  async createPOI(poiData) {
    const { data, error } = await supabase
      .from('pois')
      .insert([poiData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update existing POI
  async updatePOI(id, updates) {
    const { data, error } = await supabase
      .from('pois')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete POI
  async deletePOI(id) {
    const { error } = await supabase
      .from('pois')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Get POIs by category
  async getPOIsByCategory(category) {
    const { data, error } = await supabase
      .from('pois')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Search POIs by name
  async searchPOIs(searchTerm) {
    const { data, error } = await supabase
      .from('pois')
      .select('*')
      .ilike('name', `%${searchTerm}%`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
};
