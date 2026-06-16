export const COUNTRIES = [
  { code: 'TG', name: 'Togo', dial: '228' },
  { code: 'BJ', name: 'Bénin', dial: '229' },
  { code: 'CI', name: "Côte d'Ivoire", dial: '225' },
  { code: 'SN', name: 'Sénégal', dial: '221' },
  { code: 'BF', name: 'Burkina Faso', dial: '226' },
  { code: 'ML', name: 'Mali', dial: '223' },
  { code: 'NE', name: 'Niger', dial: '227' },
  { code: 'GH', name: 'Ghana', dial: '233' },
  { code: 'NG', name: 'Nigeria', dial: '234' },
  { code: 'CM', name: 'Cameroun', dial: '237' },
  { code: 'GA', name: 'Gabon', dial: '241' },
  { code: 'CG', name: 'Congo', dial: '242' },
  { code: 'CD', name: 'RD Congo', dial: '243' },
  { code: 'MA', name: 'Maroc', dial: '212' },
  { code: 'DZ', name: 'Algérie', dial: '213' },
  { code: 'TN', name: 'Tunisie', dial: '216' },
  { code: 'FR', name: 'France', dial: '33' },
  { code: 'BE', name: 'Belgique', dial: '32' },
  { code: 'CH', name: 'Suisse', dial: '41' },
  { code: 'DE', name: 'Allemagne', dial: '49' },
  { code: 'GB', name: 'Royaume-Uni', dial: '44' },
  { code: 'US', name: 'États-Unis', dial: '1' },
  { code: 'CA', name: 'Canada', dial: '1' },
];

export const SEXE_OPTIONS = [
  { value: 'MASCULIN', label: 'Masculin' },
  { value: 'FEMININ', label: 'Féminin' },
  { value: 'AUTRE', label: 'Autre' },
];

export function getCountryByCode(code) {
  return COUNTRIES.find((c) => c.code === code) || COUNTRIES[0];
}

export function buildFullPhone(countryCode, localNumber) {
  const country = getCountryByCode(countryCode);
  let digits = (localNumber || '').replace(/\D/g, '');
  if (digits.startsWith('0')) digits = digits.slice(1);
  if (digits.startsWith(country.dial)) return digits;
  return country.dial + digits;
}

export const COUNTRY_SELECT_OPTIONS = COUNTRIES.map((c) => ({
  value: c.code,
  label: `${c.name} (+${c.dial})`,
}));
