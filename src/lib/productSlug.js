export function slugifyProductName(name) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

export function createProductSlug(id, name) {
  const slug = slugifyProductName(name);
  return slug ? `${id}-${slug}` : String(id);
}

export function parseProductIdFromSlug(slugOrId) {
  if (!slugOrId) return null;
  const match = String(slugOrId).match(/^(\d+)/);
  return match ? Number(match[1]) : Number(slugOrId);
}

export function getProductPath(product) {
  return `/annonce/${createProductSlug(product.id, product.name)}`;
}

export function getProductShareUrl(product) {
  return `${window.location.origin}${getProductPath(product)}`;
}
