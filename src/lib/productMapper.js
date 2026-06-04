const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const STATUT_TO_STATUS = {
  DISPONIBLE: 'Disponible',
  RESERVE: 'Réservé',
  INDISPONIBLE: 'Indisponible',
};

const STATUS_TO_STATUT = {
  Disponible: 'DISPONIBLE',
  Réservé: 'RESERVE',
  Indisponible: 'INDISPONIBLE',
};

export function getProductImageUrl(product) {
  if (!product) return '';
  if (product.imageUrl) return product.imageUrl;
  if (product.image?.startsWith('http') || product.image?.startsWith('data:')) {
    return product.image;
  }
  if (product.image) {
    return `data:image/jpeg;base64,${product.image}`;
  }
  return `${API_BASE}/api/produits/${product.id}/image`;
}

export function mapProduitFromApi(apiProduct) {
  const mapped = {
    id: apiProduct.id,
    name: apiProduct.name,
    description: apiProduct.description,
    price: apiProduct.price,
    views: apiProduct.views,
    status: STATUT_TO_STATUS[apiProduct.statut] || 'Disponible',
    isNew: apiProduct.nouveau,
    whatsapp: apiProduct.whatsapp,
    image: apiProduct.image,
    datePublished: apiProduct.datePublication,
    brand: apiProduct.brand,
    isFeatured: apiProduct.misEnAvant,
    category: apiProduct.categorieNom,
    categorieId: apiProduct.categorieId,
    vendeurId: apiProduct.vendeurId,
    sellerName: apiProduct.vendeurName,
  };
  mapped.imageUrl = getProductImageUrl(mapped);
  return mapped;
}

export function mapStatusToStatut(status) {
  return STATUS_TO_STATUT[status] || 'DISPONIBLE';
}

export function buildProductFormData(productData, imageFile) {
  const formData = new FormData();
  formData.append('name', productData.name);
  formData.append('description', productData.description);
  formData.append('price', String(productData.price));
  formData.append('categorieNom', productData.category);
  formData.append('brand', productData.brand);
  formData.append('whatsapp', productData.whatsapp);
  formData.append('statut', mapStatusToStatut(productData.status));
  formData.append('nouveau', String(productData.isNew));
  if (imageFile) {
    formData.append('image', imageFile);
  }
  return formData;
}
