import { useEffect, useMemo, useState } from 'react';
import { FiArrowUpRight, FiCheck, FiHeart, FiShoppingBag, FiX } from 'react-icons/fi';
import productData from './data/products.json';
import brandModels from './data/brandModels.json';
import productImages from './data/productImages';
import { expandCatalog, formatPrice } from './utils/expandCatalog';
import { useStoredState } from './hooks/useStore';
import Header from './components/Header';
import { Hero, CategorySection, ProductSection, UpcomingSection, JournalSection } from './components/Sections';
import { AuthModal, CartDrawer, CheckoutModal, DemoLoginGate, InfoModal, OrderConfirmation, ProductModal } from './components/Modals';
import Footer, { FloatingControls } from './components/Footer';
import './index.css';

const products = expandCatalog(productData, brandModels, productImages);

export default function App() {
  const [cart, setCart] = useStoredState('nova-cart-inr-v2', []);
  const [wishList, setWishList] = useStoredState('nova-wishlist-inr-v2', []);
  const [notifications, setNotifications] = useStoredState('nova-notifications', []);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);
  const [toast, setToast] = useState('');
  const [infoTopic, setInfoTopic] = useState(null);
  const [orderConfirmation, setOrderConfirmation] = useState(null);
  const [welcome, setWelcome] = useState(() => !sessionStorage.getItem('nova-splash-inr-v2'));
  const [authenticated, setAuthenticated] = useState(() => sessionStorage.getItem('nova-authenticated-inr-v2') === 'true');
  const total = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);

  useEffect(() => {
    if (!welcome) return undefined;
    const timer = window.setTimeout(() => {
      sessionStorage.setItem('nova-splash-inr-v2', 'true');
      setWelcome(false);
    }, 2400);
    return () => window.clearTimeout(timer);
  }, [welcome]);
  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(''), 3400);
    return () => window.clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    if (!authenticated) return undefined;
    let observer;
    const frame = window.requestAnimationFrame(() => {
      observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      }), { threshold: 0.12 });
      document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
    });
    return () => {
      window.cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [authenticated]);
  useEffect(() => {
    const listener = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        document.querySelector('.search-box input')?.focus();
      }
    };
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, []);

  const addToCart = (product) => {
    setCart((items) => {
      const existing = items.find((item) => item.id === product.id);
      return existing
        ? items.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...items, { ...product, quantity: 1 }];
    });
    setToast(`${product.name} added to your bag.`);
  };
  const toggleWish = (product) => {
    const exists = wishList.some((item) => item.id === product.id);
    setWishList((items) => exists ? items.filter((item) => item.id !== product.id) : [...items, product]);
    setToast(exists ? 'Removed from your wishlist.' : `${product.name} saved for later.`);
  };
  const adjustQuantity = (id, amount) => setCart((items) => items.map((item) => item.id === id ? { ...item, quantity: item.quantity + amount } : item).filter((item) => item.quantity > 0));
  const finishOrder = (details) => {
    const placedAt = new Date();
    const deliveryDate = new Date(placedAt);
    deliveryDate.setDate(deliveryDate.getDate() + 5);
    const orderId = `NV-${Date.now().toString().slice(-8)}`;
    setCart([]);
    setCheckoutOpen(false);
    setDrawer(false);
    setOrderConfirmation({
      id: orderId,
      name: details.name,
      email: details.email,
      payment: details.payment === 'cod' ? 'Cash on delivery' : 'Net banking',
      total,
      deliveryDate: new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }).format(deliveryDate),
      deliveryWindow: '4–6 days'
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const openCart = () => { setWishlistOpen(false); setDrawer(true); };
  const openWishlist = () => { setDrawer(false); setWishlistOpen(true); };
  const enterStore = (email) => {
    sessionStorage.setItem('nova-authenticated-inr-v2', 'true');
    sessionStorage.setItem('nova-user-email', email);
    setAuthenticated(true);
  };
  const signOut = () => {
    sessionStorage.removeItem('nova-authenticated-inr-v2');
    sessionStorage.removeItem('nova-user-email');
    setAuthenticated(false);
    setInfoTopic(null);
    setToast('');
  };
  const selectCategory = (value) => {
    setCategory(value);
    setSearch('');
    setShowFilters(true);
    window.requestAnimationFrame(() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }));
  };

  return <div className="app-shell">
    {welcome && <div className="splash-screen"><div className="splash-orbit" /><div className="splash-content"><span className="splash-symbol"><FiShoppingBag /></span><div className="splash-wordmark">NOVA</div><span className="splash-tagline">TECH, REIMAGINED.</span><div className="splash-progress"><i /></div><span className="splash-caption">A LITTLE MORE EXTRAORDINARY STARTS HERE</span><button className="splash-enter" onClick={() => { sessionStorage.setItem('nova-splash-inr-v2', 'true'); setWelcome(false); }}>STEP INSIDE <FiArrowUpRight /></button></div></div>}
    {!welcome && !authenticated && <DemoLoginGate onLogin={enterStore} />}
    {authenticated && <>
      <Header cartCount={cart.reduce((count, item) => count + item.quantity, 0)} wishCount={wishList.length} onCart={openCart} onWishlist={openWishlist} onAuth={() => setAuthOpen(true)} onInfo={setInfoTopic} search={search} setSearch={setSearch} onSearch={(value) => { setCategory('All'); if (value) document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }); }} />
      <main>
        <Hero onCategory={selectCategory} />
        <div className="ticker" aria-label="NOVA service promises"><div className="ticker-track">{Array.from({ length: 4 }, (_, index) => <span key={index}><b>✳</b> GOOD DESIGN, BETTER DAYS <i>·</i> COMPLIMENTARY EXPRESS SHIPPING <i>·</i> 30-DAY TRY-IT-OUT <i>·</i> HUMAN HELP, ALWAYS <i>·</i></span>)}</div></div>
        <CategorySection onCategory={selectCategory} activeCategory={category} />
        <ProductSection products={products} wishList={wishList} onWishlist={toggleWish} onOpen={setActiveProduct} category={category} setCategory={setCategory} query={search} setQuery={setSearch} sort={sort} setSort={setSort} showFilters={showFilters} setShowFilters={setShowFilters} />
        <UpcomingSection onNotify={(name) => {
          const alreadySubscribed = notifications.includes(name);
          if (!alreadySubscribed) setNotifications((items) => [...items, name]);
          setToast(alreadySubscribed ? `You’re already on the list for ${name}.` : `You’re on the list for ${name}.`);
        }} />
        <JournalSection products={products} />
      </main>
      <Footer onToast={setToast} onInfo={setInfoTopic} />
      <FloatingControls onInfo={setInfoTopic} onSignOut={signOut} />
      {toast && <div className="toast-message" role="status"><span><FiCheck /></span>{toast}<button onClick={() => setToast('')} aria-label="Dismiss notification"><FiX /></button></div>}
      <ProductModal product={activeProduct} onClose={() => setActiveProduct(null)} onAdd={addToCart} />
      <CartDrawer open={drawer} cart={cart} onClose={() => setDrawer(false)} onQuantity={adjustQuantity} onRemove={(id) => setCart((items) => items.filter((item) => item.id !== id))} onCheckout={() => { setDrawer(false); setCheckoutOpen(true); }} />
      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} total={total} onComplete={finishOrder} />
      <OrderConfirmation order={orderConfirmation} onClose={() => setOrderConfirmation(null)} />
      <InfoModal topic={infoTopic} onClose={() => setInfoTopic(null)} />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} onSuccess={(email) => setToast(`Welcome to NOVA, ${email}.`)} />
      {wishlistOpen && <div className="overlay drawer-overlay" onClick={() => setWishlistOpen(false)}><aside className="cart-drawer" onClick={(event) => event.stopPropagation()}><div className="drawer-heading"><div><span className="eyebrow">YOUR SAVED EDIT</span><h2>Wishlist <sup>{wishList.length}</sup></h2></div><button className="modal-close" onClick={() => setWishlistOpen(false)} aria-label="Close wishlist"><FiX /></button></div>{wishList.length ? <div className="cart-items">{wishList.map((product) => <div className="cart-item" key={product.id}><img src={product.image} alt={product.name} /><div className="cart-item-info"><span>{product.brand}</span><strong>{product.name}</strong><small>{formatPrice(product.price)}</small><button className="text-button" onClick={() => { addToCart(product); setWishlistOpen(false); }}>Add to bag <FiArrowUpRight /></button></div><button className="remove-btn" aria-label={`Remove ${product.name} from wishlist`} onClick={() => toggleWish(product)}><FiHeart /></button></div>)}</div> : <div className="empty-cart"><span className="empty-icon"><FiHeart /></span><h3>A place for the almosts.</h3><p>Save what catches your eye. Come back when it feels right.</p><button className="button button-primary" onClick={() => setWishlistOpen(false)}>Explore the edit <FiArrowUpRight /></button></div>}</aside></div>}
    </>}
  </div>;
}
