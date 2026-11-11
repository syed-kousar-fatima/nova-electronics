import { useState } from 'react';
import { FiSearch, FiHeart, FiUser, FiMenu, FiX, FiArrowUpRight, FiShoppingBag } from 'react-icons/fi';
import BrandMark from './BrandMark';

export default function Header({ cartCount, wishCount, onCart, onWishlist, onAuth, onInfo, search, setSearch, onSearch }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  return (
    <>
      <div className="announcement"><span>THE FUTURE, DELIVERED.</span><span>Complimentary express shipping over ₹12,500 <FiArrowUpRight /></span><span>MEMBERS GET 10% OFF · JOIN THE CLUB</span></div>
      <header className="site-header">
        <button className="icon-btn mobile-menu" aria-label="Toggle navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <FiX /> : <FiMenu />}</button>
        <a className="brand" href="#home" aria-label="NOVA home"><BrandMark /><span className="brand-copy">NOVA<span>TECH, REIMAGINED.</span></span></a>
        <nav className={menuOpen ? 'main-nav open' : 'main-nav'}>
          <a onClick={() => setMenuOpen(false)} href="#shop">Shop all</a><a onClick={() => setMenuOpen(false)} href="#categories">Categories</a><a onClick={() => setMenuOpen(false)} href="#new">New & offers</a><button type="button" className="nav-action" onClick={() => { setMenuOpen(false); onInfo('about'); }}>About us</button>
        </nav>
        <div className="header-actions">
          <label className={`search-box ${searchOpen ? 'mobile-expanded' : ''}`}><button type="button" className="search-trigger" aria-label="Open product search" onClick={() => { if (window.matchMedia('(max-width: 760px)').matches) setSearchOpen(!searchOpen); else document.querySelector('.search-box input')?.focus(); }}><FiSearch /></button><input aria-label="Search products" placeholder="Find your next thing..." value={search} onChange={(e) => { setSearch(e.target.value); onSearch(e.target.value); }} onKeyDown={(e) => { if (e.key === 'Enter') setSearchOpen(false); }} /><kbd>⌘ K</kbd></label>
          <button className="icon-btn" aria-label="Sign in" onClick={onAuth}><FiUser /></button>
          <button className="icon-btn count-btn" aria-label={`Wishlist, ${wishCount} items`} onClick={onWishlist}><FiHeart /><span className="count-badge">{wishCount}</span></button>
          <button className="icon-btn count-btn" aria-label={`Cart, ${cartCount} items`} onClick={onCart}><FiShoppingBag /><span className="count-badge">{cartCount}</span></button>
        </div>
      </header>
    </>
  );
}
