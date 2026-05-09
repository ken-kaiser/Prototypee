/* ========================================
   JMC Laptop Services - App Logic
   ======================================== */

// ---- Product Data ----
const products = [
    { id: 1, name: 'ASUS ROG Strix G16', cat: 'gaming', price: 62999, oldPrice: 69999, img: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=400&h=300&fit=crop', specs: 'Intel i7 · RTX 4060 · 16GB · 512GB SSD', badge: 'sale', stock: 'in' },
    { id: 2, name: 'Lenovo Legion 5 Pro', cat: 'gaming', price: 72999, oldPrice: null, img: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=300&fit=crop', specs: 'AMD R7 · RTX 4070 · 16GB · 1TB SSD', badge: 'new', stock: 'low' },
    { id: 3, name: 'Dell XPS 15', cat: 'premium', price: 71999, oldPrice: 79999, img: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop', specs: 'Intel i7 · RTX 3050 · 16GB · 512GB SSD', badge: 'sale', stock: 'in' },
    { id: 4, name: 'MacBook Air M2', cat: 'macbook', price: 64999, oldPrice: null, img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop', specs: 'Apple M2 · 8-core GPU · 8GB · 256GB SSD', badge: 'new', stock: 'in' },
    { id: 5, name: 'Acer Aspire 5', cat: 'student', price: 28999, oldPrice: null, img: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&h=300&fit=crop', specs: 'Intel i5 · Iris Xe · 8GB · 256GB SSD', badge: null, stock: 'in' },
    { id: 6, name: 'HP Pavilion 15', cat: 'student', price: 32999, oldPrice: 35999, img: 'https://images.unsplash.com/photo-1589561084283-930aa7b1ce50?w=400&h=300&fit=crop', specs: 'Intel i5 · Iris Xe · 8GB · 512GB SSD', badge: 'sale', stock: 'in' },
    { id: 7, name: 'Lenovo ThinkPad E14', cat: 'business', price: 45999, oldPrice: null, img: 'https://images.unsplash.com/photo-1630794180018-433d915c34ac?w=400&h=300&fit=crop', specs: 'Intel i7 · Iris Xe · 16GB · 512GB SSD', badge: null, stock: 'in' },
    { id: 8, name: 'HP EliteBook 840', cat: 'business', price: 52999, oldPrice: null, img: 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=400&h=300&fit=crop', specs: 'Intel i7 · Iris Xe · 16GB · 512GB SSD', badge: 'new', stock: 'low' },
    { id: 9, name: 'MacBook Pro 14" M3', cat: 'macbook', price: 99990, oldPrice: 105990, img: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400&h=300&fit=crop', specs: 'Apple M3 Pro · 14-core GPU · 18GB · 512GB SSD', badge: 'sale', stock: 'in' },
    { id: 10, name: 'MacBook Air M1', cat: 'macbook', price: 44990, oldPrice: null, img: 'https://images.unsplash.com/photo-1606248897732-2c5ffa8f54ef?w=400&h=300&fit=crop', specs: 'Apple M1 · 7-core GPU · 8GB · 256GB SSD', badge: null, stock: 'in' }
];

// ---- State ----
let currentFilter = 'all';
let currentSort = 'default';
let searchQuery = '';
let cart = JSON.parse(localStorage.getItem('jmc_cart') || '[]');
let wishlist = JSON.parse(localStorage.getItem('jmc_wish') || '[]');
let currentSlide = 0;
let carouselInterval;

const fmt = n => '₱' + n.toLocaleString();

// ---- Sidebar ----
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('-translate-x-full');
    document.getElementById('sidebar-overlay').classList.toggle('open');
}

// ---- Products ----
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
        grid.innerHTML = '<p class="col-span-full text-center text-slate-400 py-12">No products found.</p>';
        return;
    }

    grid.innerHTML = list.map(p => {
        const inWish = wishlist.includes(p.id);
        let badgeHtml = '';
        if (p.badge === 'sale' && p.oldPrice) {
            const pct = Math.round((1 - p.price / p.oldPrice) * 100);
            badgeHtml = `<span class="badge-sale">-${pct}%</span>`;
        } else if (p.badge === 'new') {
            badgeHtml = `<span class="badge-sale bg-slate-900">New</span>`;
        }

        return `
    <div class="product-card reveal active">
      <div class="product-img-wrap">
        ${badgeHtml}
        <img src="${p.img}" alt="${p.name}" loading="lazy">
        <div class="product-actions">
          <button onclick="toggleWish(${p.id})" class="action-btn ${inWish ? 'active-heart' : ''}" title="Wishlist">
            <i class="fa-solid fa-heart"></i>
          </button>
          <button class="action-btn" title="Quick View">
            <i class="fa-solid fa-eye"></i>
          </button>
        </div>
      </div>
      <div class="p-4 flex flex-col flex-1">
        <div class="flex justify-between items-start mb-1">
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">${p.cat}</p>
          
        </div>
        <h3 class="text-sm font-bold text-slate-900 mb-1 truncate" title="${p.name}">${p.name}</h3>
        <br>
        <p class="text-[11px] text-slate-500 bg-slate-100 p-2 rounded-md mb-4 flex-1 line-clamp-2">${p.specs}</p>
        <div class="flex items-end justify-between mt-auto">
          <div>
            ${p.oldPrice ? `<p class="text-xs text-slate-400 line-through">${fmt(p.oldPrice)}</p>` : ''}
            <p class="text-base font-bold text-slate-800">${fmt(p.price)}</p>
          </div>
          <button onclick="addToCart(${p.id})" class="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-indigo-600 transition shadow-md">
            <i class="fa-solid fa-plus text-[12px]"></i>
          </button>
        </div>
      </div>
    </div>`;
    }).join('');
}

function setFilter(cat) {
    currentFilter = cat;
    renderProducts();
}

function handleSearch(val) {
    searchQuery = val;
    renderProducts();
}

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
    renderCheckout();
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
    const subtotalEl = document.getElementById('cart-subtotal');
    const totalEl = document.getElementById('cart-total');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `
      <div class="flex flex-col items-center justify-center h-full text-slate-400 opacity-60 mt-10">
        <i class="fa-solid fa-cart-arrow-down text-6xl mb-4"></i>
        <p class="text-sm font-medium">Your cart is empty</p>
      </div>`;
        if (subtotalEl) subtotalEl.textContent = '₱0';
        if (totalEl) totalEl.textContent = '₱0';
        return;
    }

    let total = 0;
    container.innerHTML = cart.map(c => {
        const p = products.find(pr => pr.id === c.id);
        if (!p) return '';
        total += p.price * c.qty;
        return `
    <div class="flex gap-4 p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
      <img src="${p.img}" alt="${p.name}" class="w-20 h-20 object-cover rounded-lg flex-shrink-0 bg-slate-50">
      <div class="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div class="flex justify-between items-start">
            <h4 class="text-sm font-bold text-slate-900 truncate pr-2">${p.name}</h4>
            <button onclick="removeFromCart(${p.id})" class="text-slate-300 hover:text-indigo-500 transition"><i class="fa-solid fa-trash-can"></i></button>
          </div>
          <p class="text-xs font-bold text-indigo-600 mt-1">${fmt(p.price)}</p>
        </div>
        <div class="flex items-center gap-3 mt-2">
          <div class="flex items-center border border-slate-200 rounded-md">
            <button onclick="updateQty(${p.id},-1)" class="w-7 h-7 flex items-center justify-center text-slate-500 hover:bg-slate-50"><i class="fa-solid fa-minus text-[10px]"></i></button>
            <span class="w-8 text-center text-xs font-bold text-slate-900">${c.qty}</span>
            <button onclick="updateQty(${p.id},1)" class="w-7 h-7 flex items-center justify-center text-slate-500 hover:bg-slate-50"><i class="fa-solid fa-plus text-[10px]"></i></button>
          </div>
        </div>
      </div>
    </div>`;
    }).join('');

    if (subtotalEl) subtotalEl.textContent = fmt(total);
    if (totalEl) totalEl.textContent = fmt(total);
}

function toggleCart() {
    document.getElementById('cart-sidebar').classList.toggle('open');
    document.getElementById('cart-overlay').classList.toggle('open');
}

// ---- Notifications ----
const notifications = [
    { id: 1, title: 'Order Shipped!', msg: 'Your order for ASUS ROG Strix G16 has been shipped.', time: '2 hours ago', read: false },
    { id: 2, title: 'Flash Sale Alert', msg: 'Up to 30% off on gaming laptops ends today!', time: '5 hours ago', read: false },
    { id: 3, title: 'Welcome to JMC', msg: 'Thanks for joining us. Check out our latest arrivals.', time: '1 day ago', read: false }
];

function toggleNotifications() {
    document.getElementById('notif-sidebar').classList.toggle('open');
    document.getElementById('notif-overlay').classList.toggle('open');
    renderNotifications();
}

function renderNotifications() {
    const container = document.getElementById('notif-items');
    if (!container) return;

    if (notifications.length === 0) {
        container.innerHTML = '<p class="text-center text-slate-400 py-10">No notifications</p>';
        return;
    }

    container.innerHTML = notifications.map(n => `
        <div class="p-4 rounded-xl border transition ${n.read ? 'border-slate-100 bg-white' : 'border-indigo-100 bg-indigo-50'}">
            <div class="flex justify-between items-start mb-1">
                <h4 class="text-sm font-bold ${n.read ? 'text-slate-900' : 'text-indigo-700'}">${n.title}</h4>
                <span class="text-[10px] font-semibold text-slate-400">${n.time}</span>
            </div>
            <p class="text-xs text-slate-600">${n.msg}</p>
        </div>
    `).join('');

    // Mark as read after rendering
    notifications.forEach(n => n.read = true);

    // Hide notification count badge
    const countBadge = document.getElementById('notif-count');
    if (countBadge) countBadge.style.display = 'none';
}

// ---- Checkout ----
function openCheckout() {
    if (cart.length === 0) {
        showToast('Your cart is empty!', 'error');
        return;
    }
    toggleCart(); // Close cart
    renderCheckout();
    document.getElementById('checkout-modal').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeCheckout() {
    document.getElementById('checkout-modal').classList.remove('open');
    document.body.style.overflow = '';
}

function renderCheckout() {
    const container = document.getElementById('checkout-items');
    const subtotalEl = document.getElementById('co-subtotal');
    const totalEl = document.getElementById('co-total');
    if (!container) return;

    let total = 0;
    container.innerHTML = cart.map(c => {
        const p = products.find(pr => pr.id === c.id);
        if (!p) return '';
        total += p.price * c.qty;
        return `
    <div class="flex gap-3 items-center">
      <div class="relative">
        <img src="${p.img}" class="w-14 h-14 object-cover rounded-lg border border-slate-200">
        <span class="absolute -top-2 -right-2 w-5 h-5 bg-slate-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center">${c.qty}</span>
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-bold text-slate-900 truncate">${p.name}</p>
        <p class="text-xs text-slate-500">${p.cat}</p>
      </div>
      <p class="text-sm font-bold text-slate-900">${fmt(p.price * c.qty)}</p>
    </div>`;
    }).join('');

    if (subtotalEl) subtotalEl.textContent = fmt(total);
    if (totalEl) totalEl.textContent = fmt(total);
}

function updatePaymentSelection(radio) {
    document.querySelectorAll('.payment-card').forEach(el => el.classList.remove('active'));
    radio.closest('.payment-card').classList.add('active');
}

function selectPaymentCard(card) {
    const radio = card.querySelector('input[name="payment"]');
    if (radio && !radio.checked) {
        radio.checked = true;
        updatePaymentSelection(radio);
    }
}

function placeOrder() {
    const form = document.getElementById('checkout-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // Success
    closeCheckout();
    cart = [];
    saveCart();
    document.getElementById('success-modal').classList.add('open');
}

function closeSuccess() {
    document.getElementById('success-modal').classList.remove('open');
    document.body.style.overflow = '';
}

// ---- Wishlist ----
function toggleWish(id) {
    const idx = wishlist.indexOf(id);
    if (idx > -1) { wishlist.splice(idx, 1); showToast('Removed from wishlist'); }
    else { wishlist.push(id); showToast('Added to wishlist'); }
    localStorage.setItem('jmc_wish', JSON.stringify(wishlist));
    renderProducts();
    renderWishlist();
}

function toggleWishModal() {
    document.getElementById('wishlist-overlay').classList.toggle('open');
    renderWishlist();
}

function renderWishlist() {
    const container = document.getElementById('wishlist-items');
    if (!container) return;
    if (wishlist.length === 0) {
        container.innerHTML = '<p class="col-span-full text-center text-slate-400 py-10">Your wishlist is empty</p>';
        return;
    }
    container.innerHTML = wishlist.map(id => {
        const p = products.find(pr => pr.id === id);
        if (!p) return '';
        return `
    <div class="flex gap-4 p-4 border border-slate-100 rounded-xl items-center">
      <img src="${p.img}" class="w-16 h-16 object-cover rounded-lg">
      <div class="flex-1 min-w-0">
        <h4 class="text-sm font-bold text-slate-900 truncate">${p.name}</h4>
        <p class="text-xs text-indigo-600 font-bold">${fmt(p.price)}</p>
      </div>
      <div class="flex flex-col gap-2">
        <button onclick="addToCart(${p.id})" class="text-xs font-bold bg-slate-900 text-white px-3 py-1.5 rounded-md hover:bg-indigo-600 transition">Add</button>
        <button onclick="toggleWish(${p.id})" class="text-xs text-slate-400 hover:text-indigo-500">Remove</button>
      </div>
    </div>`;
    }).join('');
}

// ---- Carousel ----
function initCarousel() {
    const inner = document.getElementById('carousel-inner');
    const indicatorsContainer = document.getElementById('carousel-indicators');
    if (!inner || !indicatorsContainer) return;

    const items = inner.querySelectorAll('.carousel-item');
    if (items.length === 0) return;

    indicatorsContainer.innerHTML = Array.from(items).map((_, i) =>
        `<div class="indicator ${i === 0 ? 'active' : ''}" onclick="goToSlide(${i})"></div>`
    ).join('');

    startCarousel();
}

function updateCarousel() {
    const inner = document.getElementById('carousel-inner');
    const indicators = document.querySelectorAll('.indicator');
    if (!inner) return;

    inner.style.transform = `translateX(-${currentSlide * 100}%)`;
    indicators.forEach((ind, i) => ind.classList.toggle('active', i === currentSlide));
}

function moveCarousel(dir) {
    const items = document.querySelectorAll('.carousel-item');
    currentSlide = (currentSlide + dir + items.length) % items.length;
    updateCarousel();
    resetCarouselTimer();
}

function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
    resetCarouselTimer();
}

function startCarousel() {
    carouselInterval = setInterval(() => moveCarousel(1), 5000);
}

function resetCarouselTimer() {
    clearInterval(carouselInterval);
    startCarousel();
}

// ---- Toast ----
function showToast(msg, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const icon = type === 'success' ? '<i class="fa-solid fa-check text-emerald-500 bg-emerald-100 p-1.5 rounded-full text-[10px]"></i>' : '<i class="fa-solid fa-circle-exclamation text-indigo-500 bg-indigo-100 p-1.5 rounded-full text-[10px]"></i>';

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `${icon} <span class="text-sm font-medium text-slate-700">${msg}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
}

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartCount();
    renderCart();
    initCarousel();

    // Scroll Reveal
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});
