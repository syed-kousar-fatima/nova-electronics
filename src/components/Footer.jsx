import { useEffect, useState } from 'react';
import { FiArrowUp, FiArrowUpRight, FiFacebook, FiInstagram, FiLogOut, FiMessageCircle, FiX, FiYoutube } from 'react-icons/fi';
import BrandMark from './BrandMark';

export default function Footer({ onToast, onInfo }) {
  const [email, setEmail] = useState('');
  const submit = (event) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      onToast('Please enter a valid email address.');
      return;
    }
    onToast('You’re on the list. Keep an eye on your inbox.');
    setEmail('');
  };

  return <footer className="footer" id="footer">
    <div className="footer-top">
      <div className="footer-newsletter">
        <span className="eyebrow">A LITTLE GOOD IN YOUR INBOX</span>
        <h2>Future-facing.<br /><em>Never noisy.</em></h2>
        <p>Fresh finds, thoughtful stories, and the occasional very good deal.</p>
        <form onSubmit={submit}>
          <input aria-label="Email for newsletter" type="email" placeholder="Your email address" value={email} onChange={(event) => setEmail(event.target.value)} />
          <button aria-label="Subscribe"><FiArrowUpRight /></button>
        </form>
      </div>
      <div className="footer-links">
        <div><span>TAKE A LOOK</span><a href="#shop">Shop all <FiArrowUpRight /></a><a href="#categories">Categories <FiArrowUpRight /></a><a href="#new">New & offers <FiArrowUpRight /></a><a href="#journal">Gallery & stories <FiArrowUpRight /></a></div>
        <div><span>HERE FOR YOU</span><button type="button" onClick={() => onInfo('contact')}>Contact us <FiArrowUpRight /></button><button type="button" onClick={() => onInfo('support')}>Customer support <FiArrowUpRight /></button><button type="button" onClick={() => onInfo('faq')}>FAQs <FiArrowUpRight /></button><button type="button" onClick={() => onInfo('support')}>Shipping & returns <FiArrowUpRight /></button></div>
        <div><span>THE NOVA NOTE</span><p>Good design is a feeling.<br />Good tech makes it last.</p><button type="button" onClick={() => onInfo('about')}>About us <FiArrowUpRight /></button></div>
      </div>
    </div>
    <div className="footer-bottom">
      <a className="brand footer-brand" href="#home" aria-label="NOVA home"><BrandMark /><span className="brand-copy">NOVA<span>TECH, REIMAGINED.</span></span></a>
      <span>© 2026 NOVA. INDICATIVE MARKET PRICES IN INR.</span>
      <div className="social-links"><a href="https://www.instagram.com/" aria-label="Instagram" target="_blank" rel="noreferrer"><FiInstagram /></a><a href="https://www.facebook.com/" aria-label="Facebook" target="_blank" rel="noreferrer"><FiFacebook /></a><a href="https://www.youtube.com/" aria-label="YouTube" target="_blank" rel="noreferrer"><FiYoutube /></a></div>
    </div>
  </footer>;
}

export function FloatingControls({ onInfo, onSignOut }) {
  const [chatOpen, setChatOpen] = useState(false);
  const [showBackTop, setShowBackTop] = useState(false);

  useEffect(() => {
    const updateVisibility = () => setShowBackTop(window.scrollY > Math.max(420, window.innerHeight * 0.65));
    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });
    return () => window.removeEventListener('scroll', updateVisibility);
  }, []);

  return <>
    {showBackTop && <button className="back-top-float" aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><FiArrowUp /></button>}
    <div className="support-widget">
      {chatOpen && <section className="support-chat" aria-label="NOVA support and account actions">
        <div className="support-chat-heading"><span><i /> NOVA CARE</span><button type="button" aria-label="Close support panel" onClick={() => setChatOpen(false)}><FiX /></button></div>
        <p>Hi there. Need a hand with an order or your account?</p>
        <button type="button" className="support-chat-link" onClick={() => { setChatOpen(false); onInfo('support'); }}>Talk to customer support <FiArrowUpRight /></button>
        <button type="button" className="support-signout" onClick={onSignOut}><FiLogOut /> Sign out</button>
      </section>}
      <button type="button" className="support-launcher" aria-expanded={chatOpen} aria-label={chatOpen ? 'Close support chat' : 'Open support chat'} onClick={() => setChatOpen((open) => !open)}>
        {chatOpen ? <FiX /> : <FiMessageCircle />}<span>{chatOpen ? 'Close' : 'Chat with us'}</span>
      </button>
    </div>
  </>;
}
