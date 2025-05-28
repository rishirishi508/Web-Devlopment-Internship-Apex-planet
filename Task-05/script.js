const products = [
    {
        id: 1,
        name: "Premium Wireless Headphones",
        price: 299.99,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop&crop=center",
        description: "High-quality wireless headphones with noise cancellation"
    },
    {
        id: 2,
        name: "Smart Watch Pro",
        price: 399.99,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=300&fit=crop&crop=center",
        description: "Advanced fitness tracking and smart notifications"
    },
    {
        id: 3,
        name: "Designer Jacket",
        price: 149.99,
        category: "fashion",
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop&crop=center",
        description: "Stylish and comfortable designer jacket"
    },
    {
        id: 5,
        name: "Luxury Handbag",
        price: 249.99,
        category: "fashion",
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=300&fit=crop&crop=center",
        description: "Premium leather handbag with elegant design"
    },
    {
        id: 6,
        name: "Smart Home Speaker",
        price: 129.99,
        category: "home",
        image: "https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=400&h=300&fit=crop&crop=center",
        description: "Voice-controlled smart speaker with premium sound"
    },
    {
        id: 7,
        name: "Athletic Sneakers",
        price: 179.99,
        category: "fashion",
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop&crop=center",
        description: "Comfortable and stylish athletic footwear"
    },
    {
        id: 8,
        name: "Coffee Maker Pro",
        price: 199.99,
        category: "home",
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop&crop=center",
        description: "Professional-grade coffee maker for perfect brews"
    },
    {
        id: 9,
        name: "Gaming Laptop",
        price: 1299.99,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=300&fit=crop&crop=center",
        description: "High-performance gaming laptop with latest specs"
    },
    {
        id: 10,
        name: "Wireless Earbuds",
        price: 199.99,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400&h=300&fit=crop&crop=center",
        description: "Premium wireless earbuds with crystal clear sound"
    },
    {
        id: 11,
        name: "Elegant Watch",
        price: 349.99,
        category: "fashion",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop&crop=center",
        description: "Luxury timepiece with premium materials"
    },
    {
        id: 12,
        name: "Modern Table Lamp",
        price: 89.99,
        category: "home",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=center",
        description: "Stylish LED table lamp for modern homes"
    }
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentFilter = 'all';

const productsGrid = document.getElementById('productsGrid');
const cartSidebar = document.getElementById('cartSidebar');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.querySelector('.cart-count');
const checkoutModal = document.getElementById('checkoutModal');
const checkoutForm = document.getElementById('checkoutForm');

document.addEventListener('DOMContentLoaded', function() {
    displayProducts();
    updateCartUI();
    setupEventListeners();
});


function setupEventListeners() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.category;
            displayProducts();
        });
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            const target = this.getAttribute('href');
            if (target.startsWith('#')) {
                document.querySelector(target).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });


    checkoutForm.addEventListener('submit', handleCheckout);

    const cardNumberInput = checkoutForm.querySelector('input[placeholder="Card Number"]');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || '';
            if (value.length <= 16) {
                e.target.value = formattedValue;
            }
        });
    }

    const expiryInput = checkoutForm.querySelector('input[placeholder="MM/YY"]');
    if (expiryInput) {
        expiryInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }
}

function displayProducts() {
    const filteredProducts = currentFilter === 'all' 
        ? products 
        : products.filter(product => product.category === currentFilter);

    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none'; this.parentNode.innerHTML='<div style=\\'display:flex;align-items:center;justify-content:center;height:100%;font-size:3rem;color:#9ca3af;\\'>📦</div>'">
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <p class="product-description">${product.description}</p>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
    saveCart();
    showAddToCartFeedback(productId);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    saveCart();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartUI();
            saveCart();
        }
    }
}
function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    cartCount.textContent = totalItems;
    cartTotal.textContent = totalPrice.toFixed(2);

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h4>Your cart is empty</h4>
                <p>Add some products to get started!</p>
            </div>
        `;
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 0.5rem;" onerror="this.style.display='none'; this.parentNode.innerHTML='<div style=\\'display:flex;align-items:center;justify-content:center;height:100%;font-size:1.5rem;\\'>📦</div>'">
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">
                            <i class="fas fa-plus"></i>
                        </button>
                        <button class="quantity-btn" onclick="removeFromCart(${item.id})" style="margin-left: 10px; background: #ef4444;">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

function toggleCart() {
    cartSidebar.classList.toggle('open');
}

function showCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    checkoutModal.classList.add('show');
    toggleCart();
}

function closeCheckout() {
    checkoutModal.classList.remove('show');
}

function handleCheckout(e) {
    e.preventDefault();
    
    const formData = new FormData(checkoutForm);
    const orderData = Object.fromEntries(formData);
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const submitBtn = checkoutForm.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Processing...';
    submitBtn.disabled = true;

    setTimeout(() => {
        alert(`🎉 Order Successful!\n\nTotal: $${totalAmount.toFixed(2)}\nItems: ${cart.length}\n\nThank you for your purchase!\nA confirmation email will be sent shortly.`);

        cart = [];
        updateCartUI();
        saveCart();
        closeCheckout();
        checkoutForm.reset();
        
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function showAddToCartFeedback(productId) {
    const productCard = document.querySelector(`[data-product-id="${productId}"]`);
    const button = productCard.querySelector('.add-to-cart-btn');
    const originalText = button.innerHTML;
    
    button.innerHTML = '<i class="fas fa-check"></i> Added!';
    button.style.background = '#10b981';
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.style.background = '#2563eb';
    }, 1500);
}

function scrollToProducts() {
    document.getElementById('products').scrollIntoView({
        behavior: 'smooth'
    });
}

document.addEventListener('click', function(e) {
    if (!cartSidebar.contains(e.target) && !e.target.closest('.cart-btn') && cartSidebar.classList.contains('open')) {
        toggleCart();
    }
});
checkoutModal.addEventListener('click', function(e) {
    if (e.target === checkoutModal) {
        closeCheckout();
    }
});
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});
