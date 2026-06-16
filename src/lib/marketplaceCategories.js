// Catégories principales de Facebook Marketplace (version française)
export const FACEBOOK_MARKETPLACE_CATEGORIES = [
  'Véhicules',
  'Locations de vacances',
  'Vêtements',
  'Électronique',
  'Divertissement',
  'Famille',
  'Jardin et extérieur',
  'Loisirs',
  'Articles ménagers',
  'Fournitures de bricolage',
  'Biens immobiliers à vendre',
  'Locations immobilières',
  'Instruments de musique',
  'Fournitures de bureau',
  'Articles pour animaux',
  'Articles de sport',
  'Jouets et jeux',
  'Petites annonces',
];

export const CATEGORY_SELECT_OPTIONS = FACEBOOK_MARKETPLACE_CATEGORIES.map((name) => ({
  value: name,
  label: name,
}));

export const FILTER_CATEGORIES = ['Toutes', ...FACEBOOK_MARKETPLACE_CATEGORIES];
