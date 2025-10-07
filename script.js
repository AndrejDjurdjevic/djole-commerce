// ========== PRODUCTS DATA ==========
const products = [
    {
        id: 1,
        name: 'Čaša za Nutribullet 0.5l',
        price: 1500,
        oldPrice: 2000,
        image: 'https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?w=400',
        badge: 'Sale'
    },
    {
        id: 2,
        name: 'Čaša za Nutribullet 0.7l',
        price: 1790,
        oldPrice: 2400,
        image: 'https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=400',
        badge: 'Sale'
    },
    {
        id: 3,
        name: 'Čaša za Nutribullet 0.9l',
        price: 1990,
        oldPrice: 2800,
        image: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=400',
        badge: 'Sale'
    },
    {
        id: 4,
        name: 'Nutribullet Oštrica',
        price: 1599,
        oldPrice: 2200,
        image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=400',
        badge: 'Sale'
    },
    {
        id: 5,
        name: 'Nutribullet Poklopac (običan)',
        price: 699,
        oldPrice: 900,
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
        badge: 'Sale'
    },
    {
        id: 6,
        name: 'Nutribullet Poklopac (sa otvorom)',
        price: 999,
        oldPrice: 1400,
        image: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=400',
        badge: 'Sale'
    }
];

// ========== GLOBAL VARIABLES ==========
let cart = [];
let currentProduct = null;

// ========== LOAD PRODUCTS ==========
function loadProducts(containerId, limit = null) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const productsToShow = limit ? products.slice(0, limit) : products;
    
    container.innerHTML = productsToShow.map(product => `
        <div class="product-card" onclick="openOrderModal(${product.id})">
            <div style="position: relative;">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">
                    <span class="price-current">${product.price} RSD</span>
                    ${product.oldPrice ? `<span class="price-old">${product.oldPrice} RSD</span>` : ''}
                </div>
                <button class="btn btn-primary" onclick="event.stopPropagation(); openOrderModal(${product.id})">
                    Poruči Odmah
                </button>
            </div>
        </div>
    `).join('');
}

// ========== OPEN ORDER MODAL ==========
function openOrderModal(productId) {
    currentProduct = products.find(p => p.id === productId);
    if (!currentProduct) return;

    const modal = document.getElementById('orderModal');
    const summary = document.getElementById('product-summary');
    
    summary.innerHTML = `
        <img src="${currentProduct.image}" alt="${currentProduct.name}">
        <div class="product-summary-info">
            <h3>${currentProduct.name}</h3>
            <p>${currentProduct.price} RSD</p>
        </div>
    `;
    
    document.getElementById('quantity').value = 1;
    updateTotal();
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// ========== CLOSE ORDER MODAL ==========
function closeOrderModal() {
    const modal = document.getElementById('orderModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    document.getElementById('orderForm').reset();
}

// ========== UPDATE TOTAL ==========
function updateTotal() {
    if (!currentProduct) return;
    
    const quantity = parseInt(document.getElementById('quantity').value) || 1;
    const total = currentProduct.price * quantity;
    
    document.getElementById('orderTotal').textContent = total.toLocaleString('sr-RS');
}

// ========== SUBMIT ORDER ==========
function submitOrder(event) {
    event.preventDefault();
    
    const formData = {
        product: currentProduct.name,
        productPrice: currentProduct.price,
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        zip: document.getElementById('zip').value,
        quantity: parseInt(document.getElementById('quantity').value),
        notes: document.getElementById('notes').value,
        total: currentProduct.price * parseInt(document.getElementById('quantity').value)
    };
    
    showConfirmModal(formData);
}

// ========== SHOW CONFIRM MODAL ==========
function showConfirmModal(data) {
    closeOrderModal();
    
    const modal = document.getElementById('confirmModal');
    const details = document.getElementById('confirmDetails');
    
    details.innerHTML = `
        <p><strong>Proizvod:</strong> <span>${data.product}</span></p>
        <p><strong>Količina:</strong> <span>${data.quantity}</span></p>
        <p><strong>Ime i prezime:</strong> <span>${data.firstName} ${data.lastName}</span></p>
        <p><strong>Email:</strong> <span>${data.email}</span></p>
        <p><strong>Telefon:</strong> <span>${data.phone}</span></p>
        <p><strong>Adresa:</strong> <span>${data.address}</span></p>
        <p><strong>Grad:</strong> <span>${data.city} ${data.zip}</span></p>
        ${data.notes ? `<p><strong>Napomena:</strong> <span>${data.notes}</span></p>` : ''}
        <hr style="margin: 20px 0; border: none; border-top: 2px solid var(--border);">
        <p style="font-size: 20px;"><strong>UKUPNO:</strong> <span style="color: var(--primary); font-size: 24px;">${data.total.toLocaleString('sr-RS')} RSD</span></p>
    `;
    
    // Store data for final submission
    window.pendingOrder = data;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// ========== CLOSE CONFIRM MODAL ==========
function closeConfirmModal() {
    const modal = document.getElementById('confirmModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// ========== FINALIZE ORDER ==========
function finalizeOrder() {
    const orderData = window.pendingOrder;
    
    // Generate order number
    const orderNumber = 'NF' + Date.now().toString().slice(-8);
    
    // Here you would normally send data to server
    console.log('Order submitted:', orderData);
    
    // Show success modal
    closeConfirmModal();
    showSuccessModal(orderNumber);
    
    // Clear form
    currentProduct = null;
    window.pendingOrder = null;
}

// ========== SHOW SUCCESS MODAL ==========
function showSuccessModal(orderNumber) {
    const modal = document.getElementById('successModal');
    document.getElementById('orderNumber').textContent = orderNumber;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// ========== CLOSE SUCCESS MODAL ==========
function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// ========== SORT PRODUCTS ==========
function sortProducts() {
    const sortValue = document.getElementById('sort-select').value;
    let sortedProducts = [...products];
    
    switch(sortValue) {
        case 'price-low':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        default:
            sortedProducts = products;
    }
    
    const container = document.getElementById('products-grid');
    container.innerHTML = sortedProducts.map(product => `
        <div class="product-card" onclick="openOrderModal(${product.id})">
            <div style="position: relative;">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            </div>
            <div class="product-info">
                                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">
                    <span class="price-current">${product.price} RSD</span>
                    ${product.oldPrice ? `<span class="price-old">${product.oldPrice} RSD</span>` : ''}
                </div>
                <button class="btn btn-primary" onclick="event.stopPropagation(); openOrderModal(${product.id})">
                    Poruči Odmah
                </button>
            </div>
        </div>
    `).join('');
}

// ========== TOGGLE SEARCH ==========
function toggleSearch() {
    alert('Pretraga - funkcionalnost u razvoju');
}

// ========== TOGGLE CART ==========
function toggleCart() {
    alert('Korpa - funkcionalnost u razvoju');
}

// ========== CLOSE MODAL ON OUTSIDE CLICK ==========
window.onclick = function(event) {
    const orderModal = document.getElementById('orderModal');
    const confirmModal = document.getElementById('confirmModal');
    const successModal = document.getElementById('successModal');
    
    if (event.target === orderModal) {
        closeOrderModal();
    }
    if (event.target === confirmModal) {
        closeConfirmModal();
    }
    if (event.target === successModal) {
        closeSuccessModal();
    }
}

// ========== INITIALIZE ON PAGE LOAD ==========
document.addEventListener('DOMContentLoaded', function() {
    // Load featured products on homepage (first 4)
    loadProducts('featured-grid', 4);
    
    // Load all products on products page
    loadProducts('products-grid');
    
    // Update cart count
    document.getElementById('cart-count').textContent = cart.length;
});

// ========== FORM VALIDATION ==========
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('orderForm');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (!this.value.trim()) {
                this.style.borderColor = 'var(--accent)';
            } else {
                this.style.borderColor = 'var(--secondary)';
            }
        });
    });
});

