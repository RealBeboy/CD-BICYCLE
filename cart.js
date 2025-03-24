// Cart functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart count
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        // Check local storage for cart items
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        cartCount.textContent = cartItems.length;
    }
    
    // Show/hide cart popup
    const cartButton = document.querySelector('.cart-button');
    const cartPopupOverlay = document.getElementById('cartPopup');
    
    if (cartButton && cartPopupOverlay) {
        cartButton.addEventListener('click', function(e) {
            e.preventDefault();
            cartPopupOverlay.style.display = 'flex';
            updateCartDisplay();
        });
        
        // Close popup when clicking outside
        cartPopupOverlay.addEventListener('click', function(e) {
            if (e.target === cartPopupOverlay) {
                cartPopupOverlay.style.display = 'none';
            }
        });
    }
    
    // Add product to cart
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            const productTitle = document.querySelector('.product-title').textContent;
            const productPrice = document.querySelector('.product-price').textContent;
            const colorSelect = document.querySelector('select[name="color"]');
            const sizeSelect = document.querySelector('select[name="size"]');
            
            const color = colorSelect ? colorSelect.value : '';
            const size = sizeSelect ? sizeSelect.value : '';
            
            // Create new cart item
            const newItem = {
                id: Date.now(),
                name: productTitle,
                price: productPrice,
                color: color,
                size: size,
                quantity: 1
            };
            
            // Get existing cart items
            let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
            
            // Add new item to cart
            cartItems.push(newItem);
            
            // Save cart items to local storage
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            
            // Update cart count
            if (cartCount) {
                cartCount.textContent = cartItems.length;
            }
            
            // Show cart popup
            if (cartPopupOverlay) {
                cartPopupOverlay.style.display = 'flex';
                updateCartDisplay();
            }
        });
    }
    
    // Update quantity buttons functionality
    function setupQuantityButtons() {
        const quantityBtns = document.querySelectorAll('.quantity-btn');
        quantityBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const input = this.parentElement.querySelector('.quantity-input');
                const itemId = this.closest('.cart-item').dataset.itemId;
                let value = parseInt(input.value);
                
                if (this.textContent === '+') {
                    value++;
                } else if (this.textContent === '-' && value > 1) {
                    value--;
                }
                
                input.value = value;
                
                // Update cart item quantity in local storage
                updateCartItemQuantity(itemId, value);
                updateCartSubtotal();
            });
        });
    }
    
    // Update cart item quantity in local storage
    function updateCartItemQuantity(itemId, newQuantity) {
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        
        cartItems = cartItems.map(item => {
            if (item.id == itemId) {
                item.quantity = newQuantity;
            }
            return item;
        });
        
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
    
    // Update cart subtotal
    function updateCartSubtotal() {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        let subtotal = 0;
        
        cartItems.forEach(item => {
            const price = parseFloat(item.price.replace(/[^\d.]/g, ''));
            subtotal += price * item.quantity;
        });
        
        const subtotalElement = document.querySelector('.subtotal');
        if (subtotalElement) {
            subtotalElement.textContent = `Subtotal ₱${subtotal.toFixed(2)}`;
        }
    }
    
    // Update cart display with items from local storage
    function updateCartDisplay() {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const cartItemsContainer = document.querySelector('.cart-items');
        
        if (cartItemsContainer) {
            // Clear current contents
            cartItemsContainer.innerHTML = '';
            
            if (cartItems.length > 0) {
                // Add each item to the display
                cartItems.forEach(item => {
                    const variant = item.color && item.size ? `${item.color} ${item.size}` : '';
                    
                    const itemElement = document.createElement('div');
                    itemElement.className = 'cart-item';
                    itemElement.dataset.itemId = item.id;
                    itemElement.innerHTML = `
                        <div class="item-image">103 × 76</div>
                        <div class="item-details">
                            <div class="item-name">${item.name}</div>
                            <div class="item-variant">${variant}</div>
                        </div>
                        <div class="item-quantity">
                            <button class="quantity-btn">+</button>
                            <input type="text" class="quantity-input" value="${item.quantity}" readonly>
                            <button class="quantity-btn">-</button>
                        </div>
                        <div class="item-price">${item.price}</div>
                    `;
                    
                    cartItemsContainer.appendChild(itemElement);
                });
                
                // Setup quantity buttons
                setupQuantityButtons();
                updateCartSubtotal();
            } else {
                // If cart is empty
                cartItemsContainer.innerHTML = '<div style="padding: 20px; text-align: center;">Your cart is empty</div>';
            }
        }
    }
    
    // Handle checkout button
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            alert('Proceeding to checkout!');
            // In a real implementation, this would navigate to checkout page
        });
    }
});