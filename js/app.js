/* ========================================
   JMC Laptop Services - App Logic
   ======================================== */

// ---- Product Data ----
const products = [
    { id: 1, name: 'ASUS ROG Strix G16', cat: 'gaming', price: 62999, oldPrice: 69999, img: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=400&h=300&fit=crop', specs: 'Intel i7 · RTX 4060 · 16GB · 512GB SSD', badge: 'sale' },
    { id: 2, name: 'Lenovo Legion 5 Pro', cat: 'gaming', price: 72999, oldPrice: null, img: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=300&fit=crop', specs: 'AMD R7 · RTX 4070 · 16GB · 1TB SSD', badge: 'new' },
    { id: 3, name: 'Dell XPS 15', cat: 'premium', price: 71999, oldPrice: 79999, img: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop', specs: 'Intel i7 · RTX 3050 · 16GB · 512GB SSD', badge: 'sale' },
    { id: 4, name: 'MacBook Air M2', cat: 'premium', price: 64999, oldPrice: null, img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop', specs: 'Apple M2 · 8-core GPU · 8GB · 256GB SSD', badge: 'new' },
    { id: 5, name: 'Acer Aspire 5', cat: 'student', price: 28999, oldPrice: null, img: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&h=300&fit=crop', specs: 'Intel i5 · Iris Xe · 8GB · 256GB SSD', badge: null },
    { id: 6, name: 'HP Pavilion 15', cat: 'student', price: 32999, oldPrice: 35999, img: 'https://images.unsplash.com/photo-1589561084283-930aa7b1ce50?w=400&h=300&fit=crop', specs: 'Intel i5 · Iris Xe · 8GB · 512GB SSD', badge: 'sale' },
    { id: 7, name: 'Lenovo ThinkPad E14', cat: 'business', price: 45999, oldPrice: null, img: 'https://images.unsplash.com/photo-1630794180018-433d915c34ac?w=400&h=300&fit=crop', specs: 'Intel i7 · Iris Xe · 16GB · 512GB SSD', badge: null },
    { id: 8, name: 'HP EliteBook 840', cat: 'business', price: 52999, oldPrice: null, img: 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=400&h=300&fit=crop', specs: 'Intel i7 · Iris Xe · 16GB · 512GB SSD', badge: 'new' },
    { id: 9, name: 'Acer Nitro V 15', cat: 'gaming', price: 42999, oldPrice: 47999, img: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=300&fit=crop', specs: 'Intel i5 · RTX 4050 · 8GB · 512GB SSD', badge: 'sale' },
    { id: 10, name: 'ASUS VivoBook 15', cat: 'budget', price: 22999, oldPrice: null, img: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop', specs: 'Intel i3 · UHD Graphics · 4GB · 128GB SSD', badge: null },
    { id: 11, name: 'Lenovo IdeaPad 3', cat: 'budget', price: 19999, oldPrice: 22999, img: 'https://images.unsplash.com/photo-1544099858-75feeb57f01b?w=400&h=300&fit=crop', specs: 'AMD R3 · Vega 3 · 4GB · 128GB SSD', badge: 'sale' },
    { id: 12, name: 'Dell Inspiron 14', cat: 'student', price: 34999, oldPrice: null, img: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&h=300&fit=crop', specs: 'Intel i5 · Iris Xe · 8GB · 256GB SSD', badge: null },
];

// ---- State ----
let currentFilter = 'all';
let currentSort = 'default';
let searchQuery = '';
let cart = JSON.parse(localStorage.getItem('jmc_cart') || '[]');
let wishlist = JSON.parse(localStorage.getItem('jmc_wish') || '[]');

// ---- Format Currency ----
const fmt = n => '₱' + n.toLocaleString();

// ---- Render Products ----
function renderProducts() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;
    let list = [...products];
    if (currentFilter !== 'all') list = list.filter(p => p.cat === currentFilter);
    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        list = list.filter(p => p.name.toLowerCase().includes(q) || p.specs.toLowerCase().includes(q));
    }
    if (currentSort === 'low') list.sort((a, b) => a.price - b.price);
    else if (currentSort === 'high') list.sort((a, b) => b.price - a.price);
    else if (currentSort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));

    if (list.length === 0) {
        grid.innerHTML = '<p class="text-center text-gray-400 text-sm col-span-full py-12">No products found.</p>';
        return;
    }

    grid.innerHTML = list.map(p => {
        const inWish = wishlist.includes(p.id);
        let badgeHtml = '';
        if (p.badge === 'sale' && p.oldPrice) {
            const pct = Math.round((1 - p.price / p.oldPrice) * 100);
            badgeHtml = `<span class="badge-sale absolute top-3 left-3 z-10">-${pct}%</span>`;
        } else if (p.badge === 'new') {
            badgeHtml = `<span class="badge-new absolute top-3 left-3 z-10">New</span>`;
        }
        return `<div class="card overflow-hidden reveal active" style="animation:fadeInUp .4s ease forwards">
      <div class="product-img-wrap relative">
        ${badgeHtml}
        <img src="${p.img}" alt="${p.name}" loading="lazy">
        <button onclick="toggleWish(${p.id})" class="heart-btn absolute top-3 right-3 z-10 ${inWish ? 'active' : ''}" style="background:none;border:none">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="${inWish ? '#E11D48' : 'none'}" stroke="${inWish ? '#E11D48' : '#9CA3AF'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </button>
      </div>
      <div class="p-4">
        <p class="text-[10px] font-semibold text-gray-300 uppercase tracking-wider mb-1">${p.cat}</p>
        <h3 class="text-sm font-semibold text-gray-900 mb-1 truncate">${p.name}</h3>
        <p class="text-xs text-gray-400 mb-3">${p.specs}</p>
        <div class="flex items-center justify-between">
          <div class="flex items-baseline gap-1.5">
            <span class="text-base font-bold text-gray-900">${fmt(p.price)}</span>
            ${p.oldPrice ? `<span class="text-xs text-gray-300 line-through">${fmt(p.oldPrice)}</span>` : ''}
          </div>
        </div>
        <div class="flex gap-2 mt-3">
          <button onclick="addToCart(${p.id})" class="btn-primary flex-1" style="padding:8px 12px;font-size:0.75rem">Add to Cart</button>
          <button onclick="openQuickView(${p.id})" class="btn-ghost" style="padding:8px 12px;font-size:0.75rem">View</button>
        </div>
      </div>
    </div>`;
    }).join('');
}

// ---- Filter ----
function setFilter(cat) {
    currentFilter = cat;
    document.querySelectorAll('.filter-chip').forEach(el => {
        el.classList.toggle('active', el.dataset.cat === cat);
    });
    renderProducts();
}

// ---- Search ----
function handleSearch(val) {
    searchQuery = val;
    renderProducts();
}

// ---- Sort ----
function setSort(val) {
    currentSort = val;
    renderProducts();
}

// ---- Cart ----
function addToCart(id) {
    const existing = cart.find(c => c.id === id);
    if (existing) existing.qty++;
    else cart.push({ id, qty: 1 });
    saveCart();
    showToast('Added to cart');
}

function removeFromCart(id) {
    cart = cart.filter(c => c.id !== id);
    saveCart();
}

function updateQty(id, delta) {
    const item = cart.find(c => c.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) cart = cart.filter(c => c.id !== id);
    saveCart();
}

function saveCart() {
    localStorage.setItem('jmc_cart', JSON.stringify(cart));
    updateCartCount();
    renderCart();
}

function updateCartCount() {
    const count = cart.reduce((s, c) => s + c.qty, 0);
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = count;
        el.style.display = count > 0 ? 'flex' : 'none';
    });
}

function renderCart() {
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    if (!container) return;
    if (cart.length === 0) {
        container.innerHTML = '<p class="text-center text-gray-400 text-sm py-12">Your cart is empty</p>';
        if (totalEl) totalEl.textContent = '₱0';
        return;
    }
    let total = 0;
    container.innerHTML = cart.map(c => {
        const p = products.find(pr => pr.id === c.id);
        if (!p) return '';
        total += p.price * c.qty;
        return `<div class="flex gap-4 py-4 border-b border-gray-100">
      <img src="${p.img}" alt="${p.name}" class="w-16 h-16 object-cover rounded-lg flex-shrink-0">
      <div class="flex-1 min-w-0">
        <h4 class="text-sm font-semibold text-gray-900 truncate">${p.name}</h4>
        <p class="text-xs text-gray-400">${fmt(p.price)}</p>
        <div class="flex items-center gap-2 mt-2">
          <button onclick="updateQty(${p.id},-1)" style="background:none;border:1px solid #E5E7EB;width:24px;height:24px;border-radius:6px;cursor:pointer;font-size:14px;color:#6B7280">−</button>
          <span class="text-sm font-medium w-6 text-center">${c.qty}</span>
          <button onclick="updateQty(${p.id},1)" style="background:none;border:1px solid #E5E7EB;width:24px;height:24px;border-radius:6px;cursor:pointer;font-size:14px;color:#6B7280">+</button>
          <button onclick="removeFromCart(${p.id})" style="background:none;border:none;color:#9CA3AF;cursor:pointer;margin-left:auto;font-size:14px" title="Remove">✕</button>
        </div>
      </div>
    </div>`;
    }).join('');
    if (totalEl) totalEl.textContent = fmt(total);
}

function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    if (!sidebar) return;
    const isOpen = sidebar.classList.contains('open');
    sidebar.classList.toggle('open');
    overlay.classList.toggle('open');
    document.body.style.overflow = isOpen ? '' : 'hidden';
}

// ---- Wishlist ----
function toggleWish(id) {
    const idx = wishlist.indexOf(id);
    if (idx > -1) { wishlist.splice(idx, 1); showToast('Removed from wishlist', 'info'); }
    else { wishlist.push(id); showToast('Added to wishlist'); }
    localStorage.setItem('jmc_wish', JSON.stringify(wishlist));
    updateWishCount();
    renderProducts();
}

function updateWishCount() {
    document.querySelectorAll('.wish-count').forEach(el => {
        el.textContent = wishlist.length;
        el.style.display = wishlist.length > 0 ? 'flex' : 'none';
    });
}

function toggleWishModal() {
    const modal = document.getElementById('wishlist-modal');
    const overlay = document.getElementById('wishlist-overlay');
    if (!modal) return;
    const isOpen = modal.classList.contains('open');
    modal.classList.toggle('open');
    overlay.classList.toggle('open');
    document.body.style.overflow = isOpen ? '' : 'hidden';
    if (!isOpen) renderWishlist();
}

function renderWishlist() {
    const container = document.getElementById('wishlist-items');
    if (!container) return;
    if (wishlist.length === 0) {
        container.innerHTML = '<p class="text-center text-gray-400 text-sm py-12">Your wishlist is empty</p>';
        return;
    }
    container.innerHTML = wishlist.map(id => {
        const p = products.find(pr => pr.id === id);
        if (!p) return '';
        return `<div class="flex gap-4 py-3 border-b border-gray-100">
      <img src="${p.img}" alt="${p.name}" class="w-14 h-14 object-cover rounded-lg flex-shrink-0">
      <div class="flex-1 min-w-0">
        <h4 class="text-sm font-semibold text-gray-900 truncate">${p.name}</h4>
        <p class="text-xs text-gray-400">${fmt(p.price)}</p>
      </div>
      <div class="flex items-center gap-2 flex-shrink-0">
        <button onclick="addToCart(${p.id})" class="btn-primary" style="padding:6px 12px;font-size:0.7rem">Add</button>
        <button onclick="toggleWish(${p.id});renderWishlist()" style="background:none;border:none;color:#9CA3AF;cursor:pointer;font-size:14px">✕</button>
      </div>
    </div>`;
    }).join('');
}

// ---- Quick View ----
function openQuickView(id) {
    const p = products.find(pr => pr.id === id);
    if (!p) return;
    const modal = document.getElementById('quickview-modal');
    const content = document.getElementById('qv-content');
    if (!modal || !content) return;
    content.innerHTML = `<div class="grid md:grid-cols-2 gap-8">
    <img src="${p.img}" alt="${p.name}" class="w-full aspect-[4/3] object-cover rounded-xl">
    <div>
      <p class="text-[10px] font-semibold text-gray-300 uppercase tracking-wider mb-2">${p.cat}</p>
      <h3 class="text-xl font-bold text-gray-900 mb-2">${p.name}</h3>
      <p class="text-sm text-gray-400 mb-4">${p.specs}</p>
      <div class="flex items-baseline gap-2 mb-6">
        <span class="text-2xl font-bold text-gray-900">${fmt(p.price)}</span>
        ${p.oldPrice ? `<span class="text-sm text-gray-300 line-through">${fmt(p.oldPrice)}</span>` : ''}
      </div>
      <div class="space-y-2 mb-6 text-sm text-gray-500">
        <p>✓ Free diagnosis</p>
        <p>✓ 30-day warranty</p>
        <p>✓ Genuine parts</p>
      </div>
      <div class="flex gap-3">
        <button onclick="addToCart(${p.id});closeQuickView()" class="btn-primary flex-1">Add to Cart</button>
        <button onclick="toggleWish(${p.id})" class="btn-ghost" style="padding:12px 16px">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="${wishlist.includes(p.id) ? '#E11D48' : 'none'}" stroke="${wishlist.includes(p.id) ? '#E11D48' : '#9CA3AF'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </button>
      </div>
    </div>
  </div>`;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeQuickView() {
    const modal = document.getElementById('quickview-modal');
    if (modal) modal.classList.remove('open');
    document.body.style.overflow = '';
}

// ---- Toast ----
function showToast(msg, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const colors = { success: '#059669', info: '#2563EB', error: '#E11D48' };
    const icons = { success: '✓', info: 'ℹ', error: '✕' };
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.style.cssText = `display:flex;align-items:center;gap:10px;padding:12px 18px;background:#fff;border:1px solid #E5E7EB;border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,0.08);font-size:0.8125rem;color:#111;`;
    toast.innerHTML = `<span style="width:22px;height:22px;border-radius:50%;background:${colors[type]};color:#fff;display:flex;align-items:center;justify-content:center;font-size:11px;flex-shrink:0">${icons[type]}</span>${msg}`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// ---- FAQ ----
function toggleFaq(btn) {
    const answer = btn.nextElementSibling;
    const chevron = btn.querySelector('.faq-chevron');
    if (!answer) return;
    const isOpen = answer.classList.contains('open');
    // Close all
    document.querySelectorAll('.faq-answer').forEach(a => a.classList.remove('open'));
    document.querySelectorAll('.faq-chevron').forEach(c => c.classList.remove('open'));
    if (!isOpen) {
        answer.classList.add('open');
        if (chevron) chevron.classList.add('open');
    }
}

// ---- Mobile Menu ----
function toggleMobile() {
    document.getElementById('mobile-menu')?.classList.toggle('hidden');
}

// ---- Booking ----
function closeBookingModal() {
    const modal = document.getElementById('booking-success');
    if (modal) modal.classList.remove('open');
    document.body.style.overflow = '';
}

// ---- Countdown Timer ----
function startCountdown() {
    const hEl = document.getElementById('cd-h');
    const mEl = document.getElementById('cd-m');
    const sEl = document.getElementById('cd-s');
    if (!hEl || !mEl || !sEl) return;

    // Set end time 24h from first visit
    let endTime = localStorage.getItem('jmc_countdown');
    if (!endTime) {
        endTime = Date.now() + 24 * 60 * 60 * 1000;
        localStorage.setItem('jmc_countdown', endTime);
    }
    endTime = Number(endTime);

    function tick() {
        let diff = Math.max(0, endTime - Date.now());
        if (diff <= 0) {
            endTime = Date.now() + 24 * 60 * 60 * 1000;
            localStorage.setItem('jmc_countdown', endTime);
            diff = endTime - Date.now();
        }
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        hEl.textContent = String(h).padStart(2, '0');
        mEl.textContent = String(m).padStart(2, '0');
        sEl.textContent = String(s).padStart(2, '0');
    }
    tick();
    setInterval(tick, 1000);
}

// ---- Scroll Reveal ----
function initReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ---- Navbar Scroll ----
function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('navbar-scrolled', window.scrollY > 20);
    });
}

// ---- Back to Top ----
function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;
    window.addEventListener('scroll', () => {
        btn.classList.toggle('show', window.scrollY > 400);
    });
}

// ---- Booking Form ----
function initBookingForm() {
    const form = document.getElementById('booking-form');
    if (!form) return;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const modal = document.getElementById('booking-success');
        if (modal) {
            modal.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
        form.reset();
    });
}

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartCount();
    updateWishCount();
    renderCart();
    startCountdown();
    initReveal();
    initNavbar();
    initBackToTop();
    initBookingForm();
});
