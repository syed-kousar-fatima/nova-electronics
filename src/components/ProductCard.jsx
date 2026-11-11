import { FiHeart, FiArrowUpRight, FiSliders } from 'react-icons/fi';
import { formatPrice } from '../utils/expandCatalog';

export default function ProductCard({ product, wished, onWishlist, onOpen, index = 0 }) {
  return (
    <article className="product-card reveal" style={{ '--delay': `${(index % 4) * 70}ms` }}>
      <button className="product-visual" onClick={() => onOpen(product)} aria-label={`View ${product.name}`}>
        <img src={product.image} alt={product.name} loading="lazy" />
        <span className="product-badge">{product.badge}</span>
        <span className="product-quick"><FiArrowUpRight /></span>
      </button>
      <div className="product-info">
        <div className="product-meta"><span>{product.brand} <i>·</i> {product.category}</span><button aria-label={`${wished ? 'Remove' : 'Add'} ${product.name} ${wished ? 'from' : 'to'} wishlist`} className={`heart-btn ${wished ? 'active' : ''}`} onClick={() => onWishlist(product)}><FiHeart /></button></div>
        <button className="product-name" onClick={() => onOpen(product)}>{product.name}</button>
        <div className="product-buy"><div><strong>{formatPrice(product.price)}</strong><del>{formatPrice(product.oldPrice)}</del></div><button className="add-btn" aria-label={`Choose options for ${product.name}`} onClick={() => onOpen(product)}><FiSliders /></button></div>
        <div className="product-rating"><span>★★★★★</span> <b>{product.rating}</b> <small>({product.reviews.toLocaleString()})</small></div>
      </div>
    </article>
  );
}
