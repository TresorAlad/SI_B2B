export function formatViewsLabel(count) {
  const n = Number(count) || 0;
  return n <= 1 ? `${n} vue` : `${n} vues`;
}

export function hasViewedInSession(productId) {
  try {
    return sessionStorage.getItem(`b2b_viewed_${productId}`) === '1';
  } catch {
    return false;
  }
}

export function markViewedInSession(productId) {
  try {
    sessionStorage.setItem(`b2b_viewed_${productId}`, '1');
  } catch {
    // ignore
  }
}
