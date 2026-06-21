const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_PUBLISHABLE_KEY
);

const samplePOIs = [
  {
    name: 'Eiffel Tower',
    description: 'Iconic iron lattice tower in Paris',
    latitude: 48.8584,
    longitude: 2.2945,
    category: 'Monument',
    address: '5 Avenue Anatole France, 75007 Paris'
  },
  {
    name: 'Louvre Museum',
    description: 'World\'s largest art museum',
    latitude: 48.8606,
    longitude: 2.3352,
    category: 'Museum',
    address: 'Rue de Rivoli, 75004 Paris'
  },
  {
    name: 'Arc de Triomphe',
    description: 'Monumental arch honoring those who fought for France',
    latitude: 48.8738,
    longitude: 2.2950,
    category: 'Monument',
    address: 'Place Charles de Gaulle, 75008 Paris'
  },
  {
    name: 'Notre-Dame de Reims',
    description: 'Gothic cathedral known for champagne',
    latitude: 49.2548,
    longitude: 4.0357,
    category: 'Religious Site',
    address: '3 Rue Guillaume de Machault, 51100 Reims'
  },
  {
    name: 'Mont Saint-Michel',
    description: 'Medieval abbey on tidal island',
    latitude: 48.6361,
    longitude: -1.5115,
    category: 'Historical',
    address: '50170 Le Mont-Saint-Michel'
  },
  {
    name: 'Sacré-Cœur',
    description: 'Romano-Byzantine basilica in Montmartre',
    latitude: 48.8867,
    longitude: 2.3431,
    category: 'Religious Site',
    address: '35 Rue du Chevalier de la Barre, 75018 Paris'
  },
  {
    name: 'Versailles Palace',
    description: 'Royal palace with stunning gardens',
    latitude: 48.8047,
    longitude: 2.1200,
    category: 'Palace',
    address: '78000 Versailles'
  },
  {
    name: 'Musée d\'Orsay',
    description: 'Impressionist and post-impressionist masterpieces',
    latitude: 48.8601,
    longitude: 2.3265,
    category: 'Museum',
    address: '1 Rue de la Légion d\'Honneur, 75007 Paris'
  }
];

async function seedPOIs() {
  try {
    console.log('Starting to seed POIs...');

    const { data, error } = await supabase
      .from('pois')
      .insert(samplePOIs);

    if (error) {
      console.error('Error seeding POIs:', error);
      process.exit(1);
    }

    console.log(`Successfully added ${samplePOIs.length} POIs to the database`);
    console.log('POIs added:', data);
    process.exit(0);
  } catch (err) {
    console.error('Unexpected error:', err);
    process.exit(1);
  }
}

seedPOIs();
