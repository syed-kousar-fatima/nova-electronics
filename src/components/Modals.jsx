import { useEffect, useState } from 'react';
import { FiX, FiMinus, FiPlus, FiTrash2, FiArrowUpRight, FiCheck, FiLock, FiShoppingBag } from 'react-icons/fi';
import { formatPrice } from '../utils/expandCatalog';

export function DemoLoginGate({ onLogin }) {
  const [email, setEmail] = useState('demo@novatech.store');
  const [password, setPassword] = useState('nova1234');
  const [error, setError] = useState('');

  const submit = (event) => {
    event.preventDefault();
    if (email.trim().toLowerCase() !== 'demo@novatech.store' || password !== 'nova1234') {
      setError('Those details do not match the demo account. Try the credentials shown below.');
      return;
    }
    setError('');
    onLogin(email.trim());
  };

  return <main className="login-gate">
    <div className="login-orbit login-orbit-one" /><div className="login-orbit login-orbit-two" />
    <section className="login-card">
      <a className="brand login-brand" href="#login" aria-label="NOVA home"><span className="brand-mark"><FiShoppingBag /></span><span className="brand-copy">NOVA<span>TECH, REIMAGINED.</span></span></a>
      <span className="eyebrow">YOUR NEXT GOOD THING STARTS HERE</span>
      <h1>Good to have<br />you <em>here.</em></h1>
      <p className="login-intro">Sign in to step into a more considered world of tech.</p>
      <div className="demo-credentials"><span>DEMO ACCESS</span><p>Email <strong>demo@novatech.store</strong></p><p>Password <strong>nova1234</strong></p></div>
      <form className="login-form" onSubmit={submit} noValidate>
        <label>Email address<input type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
        <label>Password<input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
        {error && <span className="form-error" role="alert">{error}</span>}
        <button className="button button-primary full-button" type="submit">Enter NOVA <FiArrowUpRight /></button>
      </form>
      <span className="login-footnote"><FiLock /> Demo experience · No real account required</span>
    </section>
  </main>;
}

export function ProductModal({ product, onClose, onAdd }) {
  const [ram, setRam] = useState('');
  const [rom, setRom] = useState('');
  useEffect(() => {
    if (!product) return;
    setRam(product.category === 'Mobiles' ? '8 GB' : '16 GB');
    setRom(product.category === 'Mobiles' ? '256 GB' : '512 GB');
  }, [product]);
  if (!product) return null;
  const hasMemoryOptions = product.category === 'Mobiles' || product.category === 'Laptops';
  const ramOptions = product.category === 'Mobiles' ? ['8 GB', '12 GB', '16 GB'] : ['16 GB', '32 GB', '64 GB'];
  const romOptions = product.category === 'Mobiles' ? ['128 GB', '256 GB', '512 GB', '1 TB'] : ['512 GB', '1 TB', '2 TB'];
  const selectedPrice = product.price
    + (product.category === 'Mobiles' ? (ram === '12 GB' ? 5000 : ram === '16 GB' ? 10000 : 0) : (ram === '32 GB' ? 18000 : ram === '64 GB' ? 42000 : 0))
    + (product.category === 'Mobiles' ? (rom === '256 GB' ? 5000 : rom === '512 GB' ? 15000 : rom === '1 TB' ? 30000 : 0) : (rom === '1 TB' ? 12000 : rom === '2 TB' ? 32000 : 0));
  const selectedProduct = {
    ...product,
    id: hasMemoryOptions ? `${product.id}-${ram}-${rom}` : product.id,
    name: hasMemoryOptions ? `${product.name} · ${ram} / ${rom}` : product.name,
    price: selectedPrice,
    configuration: hasMemoryOptions ? `${ram} RAM · ${rom} storage` : undefined
  };
  return <div className="overlay" onClick={onClose}><section className="product-modal modal-panel" onClick={(e) => e.stopPropagation()}><button className="modal-close" onClick={onClose} aria-label="Close"><FiX /></button><div className="modal-image"><img src={product.image} alt={product.name} /></div><div className="modal-content"><span className="eyebrow">{product.brand} / {product.category}</span><h2>{product.name}</h2><div className="product-rating"><span>★★★★★</span> <b>{product.rating}</b> <small>({product.reviews.toLocaleString()} reviews)</small></div><p>{product.description}</p><ul>{product.specs.map((spec) => <li key={spec}><FiCheck />{spec}</li>)}</ul>{hasMemoryOptions && <div className="memory-options"><label>MEMORY (RAM)<select value={ram} onChange={(event) => setRam(event.target.value)}>{ramOptions.map((option) => <option key={option}>{option}</option>)}</select></label><label>STORAGE (ROM)<select value={rom} onChange={(event) => setRom(event.target.value)}>{romOptions.map((option) => <option key={option}>{option}</option>)}</select></label></div>}<div className="modal-price"><strong>{formatPrice(selectedPrice)}</strong><del>{formatPrice(product.oldPrice)}</del><span>MARKET PRICE</span></div><button className="button button-primary full-button" onClick={() => { onAdd(selectedProduct); onClose(); }}>Add selected option to bag <FiArrowUpRight /></button><span className="secure-note"><FiLock /> Indicative India pricing · Free 30-day returns</span></div></section></div>;
}

export function CartDrawer({ open, cart, onClose, onQuantity, onRemove, onCheckout }) {
  if (!open) return null;
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return <div className="overlay drawer-overlay" onClick={onClose}><aside className="cart-drawer" onClick={(e) => e.stopPropagation()}><div className="drawer-heading"><div><span className="eyebrow">YOUR EDIT</span><h2>Shopping bag <sup>{cart.reduce((n, item) => n + item.quantity, 0)}</sup></h2></div><button className="modal-close" onClick={onClose} aria-label="Close bag"><FiX /></button></div>{cart.length ? <><div className="cart-items">{cart.map((item) => <div className="cart-item" key={item.id}><img src={item.image} alt={item.name} /><div className="cart-item-info"><span>{item.brand}</span><strong>{item.name}</strong>{item.configuration && <small>{item.configuration}</small>}<small>{formatPrice(item.price)}</small><div className="quantity-control"><button aria-label="Decrease quantity" onClick={() => onQuantity(item.id, -1)}><FiMinus /></button><span>{item.quantity}</span><button aria-label="Increase quantity" onClick={() => onQuantity(item.id, 1)}><FiPlus /></button></div></div><button className="remove-btn" aria-label={`Remove ${item.name}`} onClick={() => onRemove(item.id)}><FiTrash2 /></button></div>)}</div><div className="cart-summary"><div className="shipping-note"><span>Complimentary express shipping</span><span>ON US</span></div><div className="subtotal"><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div><small>Taxes calculated at checkout.</small><button className="button button-primary full-button" onClick={onCheckout}>Continue to checkout <FiArrowUpRight /></button><button className="continue-shopping" onClick={onClose}>Continue exploring</button></div></> : <div className="empty-cart"><span className="empty-icon">✳</span><h3>Your next favorite is out there.</h3><p>Your bag is taking a well-deserved break.</p><button className="button button-primary" onClick={onClose}>Explore the edit <FiArrowUpRight /></button></div>}</aside></div>;
}

export function AuthModal({ open, onClose, onSuccess }) {
  const [mode, setMode] = useState('signin');
  const [error, setError] = useState('');
  if (!open) return null;
  const submit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const password = data.get('password')?.toString() || '';
    if (mode === 'signup' && !data.get('name')?.toString().trim()) { setError('Please enter your name.'); return; }
    if (password.length < 8) { setError('Use at least 8 characters for your password.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.get('email')?.toString() || '')) { setError('Enter a valid email address.'); return; }
    setError(''); onSuccess(data.get('email')); onClose();
  };
  return <div className="overlay" onClick={onClose}><section className="auth-modal modal-panel" onClick={(e) => e.stopPropagation()}><button className="modal-close" onClick={onClose} aria-label="Close"><FiX /></button><span className="brand-mark auth-mark"><FiShoppingBag /></span><span className="eyebrow">WELCOME TO NOVA</span><h2>{mode === 'signin' ? 'Good to have you back.' : 'Make room for wonder.'}</h2><p>{mode === 'signin' ? 'Sign in to pick up right where you left off.' : 'Create an account for a little more extraordinary.'}</p><form onSubmit={submit} noValidate>{mode === 'signup' && <label>Your name<input name="name" required placeholder="Alex Morgan" autoComplete="name" /></label>}<label>Email address<input name="email" type="email" required placeholder="you@example.com" autoComplete="email" /></label><label>Password<input name="password" type="password" required minLength="8" placeholder="At least 8 characters" autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} /></label>{error && <span className="form-error" role="alert">{error}</span>}<button className="button button-primary full-button" type="submit">{mode === 'signin' ? 'Sign in' : 'Create account'} <FiArrowUpRight /></button></form><p className="auth-switch">{mode === 'signin' ? 'New around here?' : 'Already part of the club?'} <button onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); }}>{mode === 'signin' ? 'Create an account' : 'Sign in'}</button></p></section></div>;
}

export function CheckoutModal({ open, onClose, total, onComplete }) {
  const [method, setMethod] = useState('cod');
  const [error, setError] = useState('');
  useEffect(() => { if (open) { setMethod('cod'); setError(''); } }, [open]);
  if (!open) return null;
  const submit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) { form.reportValidity(); setError('Please complete your delivery details.'); return; }
    if (method === 'netbanking' && !form.elements.bank.value) { setError('Choose a bank to continue.'); return; }
    setError('');
    onComplete({
      name: form.elements.name.value.trim(),
      email: form.elements.email.value.trim(),
      payment: method
    });
  };
  return <div className="overlay" onClick={onClose}><section className="checkout-modal modal-panel" onClick={(e) => e.stopPropagation()}><button className="modal-close" onClick={onClose} aria-label="Close"><FiX /></button><span className="eyebrow">ALMOST YOURS</span><h2>Make it official.</h2><p className="checkout-subtitle">A few details, then it’s on its way.</p><form onSubmit={submit} noValidate><div className="checkout-fields"><label>Full name<input name="name" required autoComplete="name" placeholder="Alex Morgan" /></label><label>Email<input name="email" type="email" required autoComplete="email" placeholder="you@example.com" /></label><label className="field-wide">Delivery address<input name="address" required autoComplete="street-address" placeholder="Street address" /></label><label>City<input name="city" required autoComplete="address-level2" placeholder="City" /></label><label>Postal code<input name="postal" required pattern="[A-Za-z0-9 -]{3,10}" autoComplete="postal-code" placeholder="Postal code" /></label></div><span className="payment-label">HOW WOULD YOU LIKE TO PAY?</span><label className={`payment-option ${method === 'cod' ? 'selected' : ''}`}><input type="radio" name="payment" value="cod" checked={method === 'cod'} onChange={() => setMethod('cod')} /><span className="payment-radio" /><span><b>Cash on delivery</b><small>Pay when your order arrives</small></span><i>COD</i></label><label className={`payment-option ${method === 'netbanking' ? 'selected' : ''}`}><input type="radio" name="payment" value="netbanking" checked={method === 'netbanking'} onChange={() => setMethod('netbanking')} /><span className="payment-radio" /><span><b>Net banking</b><small>Secure payment through your bank</small></span><i>⇄</i></label>{method === 'netbanking' && <label className="bank-select">Choose your bank<select name="bank" defaultValue=""><option value="" disabled>Select a bank</option><option>HDFC Bank</option><option>ICICI Bank</option><option>State Bank of India</option><option>Axis Bank</option></select></label>}{error && <span className="form-error" role="alert">{error}</span>}<div className="checkout-total"><span>Total</span><strong>{formatPrice(total)}</strong></div><button className="button button-primary full-button" type="submit">Place order <FiArrowUpRight /></button><small className="secure-note"><FiLock /> Your details are encrypted and secure</small></form></section></div>;
}

export function OrderConfirmation({ order, onClose }) {
  if (!order) return null;
  return <div className="overlay" role="presentation"><section className="order-modal modal-panel" role="dialog" aria-modal="true" aria-labelledby="order-title">
    <span className="order-success-mark"><FiCheck /></span><span className="eyebrow">ORDER CONFIRMED · {order.id}</span>
    <h2 id="order-title">Your good thing<br />is on its way.</h2>
    <p className="order-message">Thanks, <strong>{order.name}</strong>. Order placed successfully; details are on their way to <strong>{order.email}</strong>.</p>
    <div className="order-receipt"><span>{order.payment}</span><strong>{formatPrice(order.total)}</strong></div>
    <div className="tracking-card"><div className="tracking-top"><span>ESTIMATED DELIVERY</span><strong>{order.deliveryDate}</strong></div><div className="tracking-progress"><span className="tracking-step done"><i /><b>Order placed</b><small>Today</small></span><span className="tracking-step"><i /><b>Preparing</b><small>1–2 days</small></span><span className="tracking-step"><i /><b>On its way</b><small>Tracking soon</small></span><span className="tracking-step"><i /><b>Delivered</b><small>{order.deliveryWindow}</small></span></div></div>
    <p className="tracking-note">Your tracking link will be available once the parcel ships. You can close this window and keep browsing.</p>
    <button className="button button-primary full-button" onClick={onClose}>Continue shopping <FiArrowUpRight /></button>
  </section></div>;
}

const infoPanels = {
  about: {
    eyebrow: 'THE NOVA NOTE',
    title: 'Tech with a little more thought.',
    body: 'NOVA brings together useful, well-designed electronics from brands we believe in. We want discovering your next everyday essential to feel considered, clear, and genuinely enjoyable.'
  },
  contact: {
    eyebrow: 'SAY HELLO',
    title: 'We’d love to hear from you.',
    body: 'For general questions, product advice, or anything else on your mind, email our team. We’re here on weekdays, 9am–6pm IST.',
    email: 'hello@novatech.example'
  },
  support: {
    eyebrow: 'NOVA CARE',
    title: 'Here when you need us.',
    body: 'Need help with an order, delivery, returns, or a product? Our customer care team is available on weekdays, 9am–6pm IST.',
    email: 'support@novatech.example'
  }
};

export function InfoModal({ topic, onClose }) {
  useEffect(() => {
    if (!topic) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [topic, onClose]);

  if (!topic) return null;
  const panel = infoPanels[topic];
  return <div className="overlay info-overlay" onClick={onClose}>
    <section className="info-modal modal-panel" role="dialog" aria-modal="true" aria-labelledby="info-title" onClick={(event) => event.stopPropagation()}>
      <button className="modal-close" type="button" onClick={onClose} aria-label="Close"><FiX /></button>
      {topic === 'faq' ? <>
        <span className="eyebrow">GOOD TO KNOW</span>
        <h2 id="info-title">A few answers.</h2>
        <div className="info-faqs">
          <details open><summary>How long does delivery take?</summary><p>Most orders arrive in 4–6 business days. Tracking details are shared after dispatch.</p></details>
          <details><summary>Can I return an item?</summary><p>Eligible items can be returned within 30 days. Contact customer support to get started.</p></details>
          <details><summary>How can I track my order?</summary><p>After dispatch, we’ll share tracking information using the email address provided at checkout.</p></details>
          <details><summary>How do I get product or order help?</summary><p>Our customer care team can help at <a href="mailto:support@novatech.example">support@novatech.example</a>.</p></details>
        </div>
      </> : <>
        <span className="eyebrow">{panel.eyebrow}</span>
        <h2 id="info-title">{panel.title}</h2>
        <p>{panel.body}</p>
        {panel.email && <a className="info-email" href={`mailto:${panel.email}`}>{panel.email} <FiArrowUpRight /></a>}
      </>}
      <button type="button" className="button button-primary full-button info-close" onClick={onClose}>Got it <FiArrowUpRight /></button>
    </section>
  </div>;
}
