const INR_PER_USD_REFERENCE = 84;

export function expandCatalog(products, brandModels, productImages = {}) {
  const completeCatalog = products.flatMap((product) => {
    const models = brandModels[product.category]?.[product.brand] || [];
    return [
      { ...product, image: productImages[product.name] || product.image },
      ...models.map(([name, multiplier, image], index) => {
        const id = 10000 + product.id * 10 + index;
        const imageSearch = encodeURIComponent(`${name} ${product.category}`);
        return {
          ...product,
          id,
          name,
          image: productImages[name] || image || `https://loremflickr.com/800/800/${imageSearch}?lock=${id}`,
          price: Math.round(product.price * multiplier),
          oldPrice: Math.round(product.oldPrice * multiplier),
          badge: 'CURATED FIND',
          description: `${name} — ${product.description}`,
          specs: [name, ...product.specs.slice(1)]
        };
      })
    ];
  });

  return completeCatalog.map((product) => ({
    ...product,
    price: Math.round(product.price * INR_PER_USD_REFERENCE / 100) * 100,
    oldPrice: Math.round(product.oldPrice * INR_PER_USD_REFERENCE / 100) * 100
  }));
}

export function formatPrice(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}
