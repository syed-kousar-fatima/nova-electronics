import { useEffect, useRef, useState } from 'react';
import { FiArrowUpRight, FiArrowDown, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import ProductCard from './ProductCard';
import { formatPrice } from '../utils/expandCatalog';

const categories = [
  { name: 'Mobiles', count: '01 / 07', note: 'Small device. Big energy.', brands: ['Apple', 'Samsung', 'Google', 'OnePlus'], image: 'https://i.pinimg.com/736x/f0/6e/7d/f06e7dbdee9a1698f9396a3424d8cdc7.jpg' },
  { name: 'Laptops', count: '02 / 07', note: 'Ideas, meet their match.', brands: ['Apple', 'Dell', 'Lenovo', 'ASUS'], image: 'https://i.pinimg.com/736x/6c/24/66/6c246671ef0eebf37beb0527675aad86.jpg' },
  { name: 'Headphones', count: '03 / 07', note: 'Tune everything else out.', brands: ['Sony', 'Apple', 'Bose', 'Sennheiser'], image: 'https://i.pinimg.com/1200x/d8/67/e2/d867e25416f27feca2d56e08b4ce7523.jpg' },
  { name: 'Smart TVs', count: '04 / 07', note: 'Stay in. Go everywhere.', brands: ['LG', 'Samsung', 'Sony', 'TCL'], image: 'https://i.pinimg.com/1200x/21/a3/21/21a321d8ce6e6be39c5029a0693c7ad5.jpg' },
  { name: 'Cameras', count: '05 / 07', note: 'See it. Feel it. Keep it.', brands: ['Canon', 'Sony', 'Nikon', 'Fujifilm'], image: 'https://i.pinimg.com/736x/2f/75/73/2f75738572e251c68c07340b24bbcb76.jpg' },
  { name: 'Smartwatches', count: '06 / 07', note: 'Your day, in good hands.', brands: ['Apple', 'Google', 'Samsung', 'Garmin'], image: 'https://i.pinimg.com/736x/53/b9/62/53b962b74d65273976b3fabfd23fca52.jpg' },
  { name: 'Accessories', count: '07 / 07', note: 'The little things. Nailed.', brands: ['Apple', 'Anker', 'Belkin', 'Logitech'], image: 'https://i.pinimg.com/1200x/f0/25/a8/f025a8720a0be78b8038aeb15fd3cc29.jpg' }
];
const slides = [
  { kicker: 'INTRODUCING THE NEW', title: <>Tomorrow,<br />in your <em>hands.</em></>, sub: 'Meet the devices moving everything forward.', action: 'Explore the new edit', image: 'https://i.pinimg.com/736x/60/7b/5f/607b5fba492430d113919dbc3b5c36b1.jpg', tone: 'violet' },
  { kicker: 'A LITTLE MORE IMMERSIVE', title: <>Your seat.<br />Your <em>universe.</em></>, sub: 'Cinematic picture. Sound that surrounds you.', action: 'Find your screen', image: 'https://i.pinimg.com/736x/36/01/42/360142391fa8fefebc58dfbe708772ce.jpg', tone: 'blue' },
  { kicker: 'FOR THE WAY YOU SEE', title: <>Keep the<br /><em>feeling.</em></>, sub: 'Camera gear for the stories you want to tell.', action: 'Discover cameras', image: 'https://i.pinimg.com/736x/39/b6/9d/39b69d4132f14ef655af6be654f09df6.jpg', tone: 'amber' }
];

export function Hero({ onCategory }) {
  const [active, setActive] = useState(0);
  useEffect(() => { const timer = window.setInterval(() => setActive((current) => (current + 1) % slides.length), 6500); return () => window.clearInterval(timer); }, []);
  const slide = slides[active];
  return <section className={`hero hero-${slide.tone}`} id="home"><div className="hero-image" key={active} style={{ backgroundImage: `url("${slide.image}")` }} /><div className="hero-grain" /><div className="hero-content" key={`content-${active}`}><span className="eyebrow hero-eyebrow"><span className="live-dot" />{slide.kicker}</span><h1>{slide.title}</h1><p>{slide.sub}</p><a href="#shop" className="button button-light" onClick={() => onCategory('All')}>{slide.action} <FiArrowUpRight /></a></div><div className="hero-side-note">GOOD DESIGN. BETTER DAYS. <FiArrowDown /></div><div className="hero-bottom"><span>01 — MADE FOR WHAT’S NEXT</span><div className="hero-pagination">{slides.map((item, i) => <button key={item.kicker} aria-label={`Show slide ${i + 1}`} className={i === active ? 'current' : ''} onClick={() => setActive(i)}><span /></button>)}</div><span>SCROLL TO EXPLORE <FiArrowDown /></span></div><div className="hero-stamp"><span>CURATED</span><b>✳</b><span>FOR THE CURIOUS</span></div></section>;
}

export function CategorySection({ onCategory, activeCategory }) {
  return <section id="categories" className="section category-section"><div className="section-header"><div><span className="eyebrow reveal">A GOOD PLACE TO START / 001</span><h2 className="section-title reveal">Find your <em>frequency.</em></h2></div><p className="section-caption reveal">Thoughtfully chosen tech for<br />whatever moves you.</p></div><div className="category-grid">{categories.map((category, i) => <button key={category.name} className={`category-card reveal ${activeCategory === category.name ? 'active' : ''}`} style={{ '--delay': `${i * 65}ms` }} onClick={() => onCategory(category.name)} aria-label={`Shop ${category.name} brands: ${category.brands.join(', ')}`}><img src={category.image} alt="" loading="lazy" /><span className="category-index">{category.count}</span><span className="category-text"><span>{category.brands.slice(0, 3).join(' · ')}</span><strong>{category.name}</strong><small>{category.note}</small><span className="category-brands">{category.brands.map((brand) => <i key={brand}>{brand}</i>)}</span></span><span className="category-arrow"><FiArrowUpRight /></span></button>)}</div></section>;
}

export function ProductSection({ products, wishList, onWishlist, onOpen, category, setCategory, query, setQuery, sort, setSort, showFilters, setShowFilters }) {
  const brands = ['All', ...new Set(products.filter((product) => category === 'All' || product.category === category).map((product) => product.brand))];
  const [brand, setBrand] = useState('All');
  const [maxPrice, setMaxPrice] = useState(500000);
  useEffect(() => setBrand('All'), [category]);
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      document.querySelectorAll('#shop .product-card.reveal').forEach((card) => card.classList.add('in-view'));
    });
    return () => window.cancelAnimationFrame(frame);
  }, [category, brand, maxPrice, query, sort]);
  const filtered = products.filter((p) => (category === 'All' || p.category === category) && (brand === 'All' || p.brand === brand) && p.price <= maxPrice && `${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(query.toLowerCase())).sort((a, b) => sort === 'price-low' ? a.price - b.price : sort === 'price-high' ? b.price - a.price : sort === 'rating' ? b.rating - a.rating : 0);
  return <section id="shop" className="section shop-section"><div className="section-header shop-heading"><div><span className="eyebrow reveal">THE GOOD STUFF / 002</span><h2 className="section-title reveal">Things worth <em>keeping.</em></h2><p className="catalog-context">{category === 'All' ? 'Shop the whole edit' : `${category} · choose a brand to refine the edit`}</p><small className="market-note">INR · indicative local market prices · live price feed not connected</small></div><div className="shop-tools"><button className={`filter-toggle ${showFilters ? 'on' : ''}`} onClick={() => setShowFilters(!showFilters)}>FILTERS <span>({category === 'All' ? '00' : '01'})</span></button><select aria-label="Sort products" value={sort} onChange={(e) => setSort(e.target.value)}><option value="featured">Sort: Featured</option><option value="price-low">Price: Low to high</option><option value="price-high">Price: High to low</option><option value="rating">Top rated</option></select></div></div><div className={`filters-panel ${showFilters || category !== 'All' ? 'visible' : ''}`}><div className="filter-group"><span>CATEGORY</span>{['All', ...categories.map((c) => c.name)].map((name) => <button className={category === name ? 'selected' : ''} onClick={() => setCategory(name)} key={name}>{name}</button>)}</div><div className="filter-group"><span>BRAND</span>{brands.map((name) => <button className={brand === name ? 'selected' : ''} onClick={() => setBrand(name)} key={name}>{name}</button>)}</div><div className="filter-group price-filter"><span>MAX PRICE <b>{formatPrice(maxPrice)}</b></span><input aria-label="Maximum price" type="range" min="5000" max="500000" step="5000" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} /></div></div><div className="product-grid">{filtered.length ? filtered.map((product, i) => <ProductCard key={product.id} product={product} index={i} wished={wishList.some((item) => item.id === product.id)} onWishlist={onWishlist} onOpen={onOpen} />) : <div className="no-results"><span>✳</span><h3>Nothing in this orbit.</h3><p>Try another search or loosen your filters.</p><button className="text-button" onClick={() => { setQuery(''); setCategory('All'); setMaxPrice(500000); setBrand('All'); }}>Clear filters <FiArrowUpRight /></button></div>}</div><div className="catalog-foot"><span>SHOWING {filtered.length.toString().padStart(2, '0')} OF {products.length.toString().padStart(2, '0')} FINDS</span><button onClick={() => { setCategory('All'); setQuery(''); setMaxPrice(500000); setBrand('All'); }}>VIEW ALL PRODUCTS <FiArrowUpRight /></button></div></section>;
}

export function UpcomingSection({ onNotify }) {
  const products = [
    { tag: 'EXPECTED · Q3 2026', name: 'Vision Pro 2', brand: 'Apple', desc: 'A new dimension of spatial computing.', offer: 'EARLY ACCESS · 10% OFF', image: 'https://i.pinimg.com/736x/b0/69/68/b06968723472b61cdcdba00d7f732836.jpg' },
    { tag: 'FIRST LOOK · COMING SOON', name: 'Pixel Fold 3', brand: 'Google', desc: 'A whole new way to open up.', offer: 'LAUNCH WEEK · 10% OFF', image: 'https://i.pinimg.com/736x/f5/be/ca/f5beca88ea570f83f3b7198912e43187.jpg' },
    { tag: 'ON THE HORIZON · 2026', name: 'PlayStation Portal 2', brand: 'Sony', desc: 'Your favorite worlds, ready when you are.', offer: 'EARLY ACCESS · MEMBER PRICE', image: 'https://i.pinimg.com/736x/41/b8/58/41b858184ae1adc121b37018a0828d36.jpg' },
    { tag: 'COMING SOON', name: 'Studio Buds Pro', brand: 'Beats', desc: 'A more personal kind of sound.', offer: 'LAUNCH OFFER · FREE SHIPPING', image: 'https://i.pinimg.com/1200x/2c/ee/c3/2ceec30749e7363998a10987b5a75a22.jpg' }
  ];
  return <section id="new" className="upcoming-section"><div className="upcoming-orbit orbit-one" /><div className="upcoming-orbit orbit-two" /><div className="section upcoming-inner"><div className="upcoming-heading"><div><span className="eyebrow reveal">JUST OVER THE HORIZON / 003</span><h2 className="section-title reveal">The next <em>big thing.</em></h2></div><p className="reveal">Not here quite yet. Already<br />on our radar.</p></div><div className="upcoming-grid">{products.map((item, i) => <article className="upcoming-card reveal" key={item.name} style={{ '--delay': `${i * 100}ms` }}><div className="upcoming-image"><img src={item.image} alt={item.name} loading="lazy" /><span className="coming-dot"><i /> {item.tag}</span></div><div className="upcoming-info"><div><span>{item.brand} / FIRST LOOK</span><h3>{item.name}</h3><p>{item.desc}</p><small className="upcoming-offer">{item.offer}</small></div><button onClick={() => onNotify(item.name)} aria-label={`Notify me about ${item.name}`}><FiArrowUpRight /></button></div></article>)}</div><div className="upcoming-deal reveal"><span>THE NOVA EARLY LOOK</span><strong>Good things come to those who get first dibs.</strong><p>Join the notification list on any upcoming release for launch offers and first access.</p><a href="#shop">Explore today’s offers <FiArrowUpRight /></a></div></div><div className="orbit-center">WHAT’S NEXT <span>✳</span></div></section>;
}

const quotes = [
  { quote: '“The rarest kind of shop: one that makes you feel understood before you even know what you need.”', name: 'JAMIE R.', role: 'CUSTOMER SINCE 2021', stars: '★★★★★' },
  { quote: '“Impeccable curation, thoughtful people, and the kind of unboxing you remember.”', name: 'MORGAN T.', role: 'PHOTOGRAPHER & NOVA MEMBER', stars: '★★★★★' },
  { quote: '“Finally, tech shopping that feels less like a spreadsheet and more like discovery.”', name: 'ALEX P.', role: 'CUSTOMER SINCE 2023', stars: '★★★★★' }
];
export function JournalSection({ products }) {
  const [index, setIndex] = useState(0);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const galleryTrackRef = useRef(null);
  const galleryProducts = products.slice(0, 10);
  const moveGallery = (amount) => {
    const track = galleryTrackRef.current;
    if (!track?.firstElementChild) return;
    const item = track.firstElementChild;
    const styles = window.getComputedStyle(track);
    const gap = parseFloat(styles.columnGap || styles.gap) || 0;
    const step = item.getBoundingClientRect().width + gap;
    const maxScroll = track.scrollWidth - track.clientWidth;
    let nextScroll = track.scrollLeft + step * amount;
    if (nextScroll > maxScroll + 1) nextScroll = 0;
    if (nextScroll < 0) nextScroll = maxScroll;
    track.scrollTo({ left: nextScroll, behavior: 'smooth' });
    setGalleryIndex(Math.min(galleryProducts.length - 1, Math.max(0, Math.round(nextScroll / step))));
  };
  useEffect(() => {
    const timer = window.setInterval(() => moveGallery(1), 3600);
    return () => window.clearInterval(timer);
  }, [galleryProducts.length]);
  return <section id="journal" className="section journal-section"><div className="section-header"><div><span className="eyebrow reveal">GOOD THINGS, WELL SAID / 004</span><h2 className="section-title reveal">Not just our <em>word.</em></h2></div><div className="quote-controls"><button aria-label="Previous testimonial" onClick={() => setIndex((index + quotes.length - 1) % quotes.length)}><FiArrowLeft /></button><button aria-label="Next testimonial" onClick={() => setIndex((index + 1) % quotes.length)}><FiArrowRight /></button></div></div><div className="journal-layout"><div className="quote-card" key={index}><span className="quote-mark">“</span><span className="quote-stars">{quotes[index].stars}</span><blockquote>{quotes[index].quote}</blockquote><div className="quote-person"><span className="quote-avatar">{quotes[index].name[0]}</span><div><strong>{quotes[index].name}</strong><span>{quotes[index].role}</span></div><span className="quote-count">0{index + 1} — 03</span></div></div><div className="journal-photo"><img src="https://i.pinimg.com/736x/1a/83/6c/1a836c4aabd0be7c51a372ec7b7c4449.jpg" alt="A beautifully made watch on a minimal desk" loading="lazy" /><div className="photo-caption"><span>A DAILY KIND OF EXTRAORDINARY</span><span>VIEW THE NOVA JOURNAL <FiArrowUpRight /></span></div><div className="photo-stamp">GOOD<br />THINGS<br /><em>LIVE HERE.</em></div></div></div><div className="gallery-heading"><div><span className="eyebrow reveal">A FEW THINGS WE LOVE / 005</span><h3 className="section-title reveal">Good tech. Good <em>company.</em></h3></div><div className="gallery-controls"><span className="gallery-note">{String(galleryIndex + 1).padStart(2, '0')} / {String(galleryProducts.length).padStart(2, '0')} · AUTO SLIDING</span><button aria-label="Previous gallery products" onClick={() => moveGallery(-1)}><FiArrowLeft /></button><button aria-label="Next gallery products" onClick={() => moveGallery(1)}><FiArrowRight /></button></div></div><div className="gallery-viewport"><div className="gallery-grid" ref={galleryTrackRef}>{galleryProducts.map((product) => <figure className="gallery-item reveal in-view" key={product.id}><img src={product.image} alt={product.name} loading="lazy" /><figcaption>{product.name}<span>{product.brand} · {product.category}</span></figcaption></figure>)}</div></div></section>;
}
