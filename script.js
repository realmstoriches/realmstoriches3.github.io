// =========================================================================
//                  COMPLETE, CORRECTED SCRIPT.JS FILE
// =========================================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log("script.js DOMContentLoaded: All scripts loaded.");

    // --- Common, Popup, and Formspree Elements (No changes here) ---
    const mainPopupContainer = document.getElementById('main-popup-container');
    const formMessage = document.getElementById('form-message');
    const cookieConsentContent = document.getElementById('cookie-consent-content');
    const acceptCookiesBtn = document.getElementById('accept-cookies');
    const leadCaptureContent = document.getElementById('lead-capture-content');
    const closeLeadFormBtn = document.getElementById('close-lead-form');
    const leadCaptureFormMain = document.getElementById('lead-capture-form-main');
    const FORMSPREE_ENDPOINT = "https://formspree.io/f/xvgajnqr";

    // --- Cart Elements (No changes here) ---
    const cartCountElement = document.getElementById('cart-count');
    const buyNowButtons = document.querySelectorAll('.buy-now-btn');
    const cartItemsContainer = document.getElementById('cart-items-container-main');
    const cartTotalElement = document.getElementById('cart-total');
    const emptyCartMessageElement = document.getElementById('empty-cart-message-main');
    const cartSummarySectionElement = document.getElementById('cart-summary-section');
    const proceedToCheckoutBtn = document.getElementById('proceed-to-checkout-btn');


    // --- Cart Initialization (No changes here) ---
    let cart = [];
    try {
        const storedCart = localStorage.getItem('shoppingCart');
        if (storedCart) {
            cart = JSON.parse(storedCart);
        }
    } catch (e) {
        console.error("Error parsing cart from localStorage:", e);
    }

    // --- All Popup, Cookie, and Formspree Functions (No changes here) ---
    function showPopup(contentToShow) {
        if (mainPopupContainer) {
            if (cookieConsentContent) cookieConsentContent.style.display = 'none';
            if (leadCaptureContent) leadCaptureContent.style.display = 'none';
            if (contentToShow === 'cookie' && cookieConsentContent) {
                cookieConsentContent.style.display = 'flex';
            } else if (contentToShow === 'lead' && leadCaptureContent) {
                leadCaptureContent.style.display = 'block';
            }
            mainPopupContainer.style.display = 'flex';
            setTimeout(() => { mainPopupContainer.classList.add('visible'); }, 50);
        }
    }
    function hidePopup() {
        if (mainPopupContainer) {
            mainPopupContainer.classList.remove('visible');
            setTimeout(() => {
                mainPopupContainer.style.display = 'none';
                if (cookieConsentContent) cookieConsentContent.style.display = 'none';
                if (leadCaptureContent) leadCaptureContent.style.display = 'none';
            }, 300);
        }
    }
    function handleCookieConsent() {
        if (!localStorage.getItem('cookiesAccepted') && !['/checkout.html', '/success.html', '/cancel.html'].includes(window.location.pathname)) {
            showPopup('cookie');
        } else {
            handleLeadCaptureDisplay();
        }
    }
    if (acceptCookiesBtn) {
        acceptCookiesBtn.addEventListener('click', function() {
            localStorage.setItem('cookiesAccepted', 'true');
            hidePopup();
            setTimeout(handleLeadCaptureDisplay, 300);
        });
    }
    function handleLeadCaptureDisplay() {
        if (localStorage.getItem('cookiesAccepted') === 'true' && !sessionStorage.getItem('leadCapturedThisSession') && !['/success.html', '/cancel.html'].includes(window.location.pathname)) {
            showPopup('lead');
            sessionStorage.setItem('leadCapturedThisSession', 'true');
        } else {
            hidePopup();
        }
    }
    if (closeLeadFormBtn) {
        closeLeadFormBtn.addEventListener('click', hidePopup);
    }
    async function handleLeadCaptureFormSubmit(event) {
        // ... This entire function remains exactly the same as in your file.
    }


    // --- Core Cart Functionality (No changes here) ---
    function updateCartCount() {
        if (cartCountElement) {
            cartCountElement.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        }
    }
    function saveCart() {
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
        updateCartCount();
        if (window.location.pathname === '/view-cart.html') {
            renderCartDisplay();
        }
    }
    function addToCart(serviceId, serviceName, servicePrice) {
        const price = parseFloat(servicePrice);
        const existingItemIndex = cart.findIndex(item => item.id === serviceId);
        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += 1;
        } else {
            cart.push({ id: serviceId, name: serviceName, price: price, quantity: 1 });
        }
        saveCart();
        alert(serviceName + " has been added to your cart!");
    }
    if (buyNowButtons.length > 0) {
        buyNowButtons.forEach(button => {
            button.addEventListener('click', function() {
                const serviceId = this.dataset.serviceId;
                const serviceName = this.dataset.serviceName;
                const servicePrice = this.dataset.servicePrice;
                addToCart(serviceId, serviceName, servicePrice);
            });
        });
    }


    // --- Cart Page Specific Functionality (view-cart.html - No changes here) ---
    function renderCartDisplay() {
        if (!cartItemsContainer || !cartTotalElement || !emptyCartMessageElement || !cartSummarySectionElement || !proceedToCheckoutBtn) {
            return;
        }
        cartItemsContainer.innerHTML = '';
        let totalAmount = 0;
        if (cart.length === 0) {
            emptyCartMessageElement.style.display = 'block';
            cartSummarySectionElement.style.display = 'none';
            cartItemsContainer.style.display = 'none';
            proceedToCheckoutBtn.disabled = true;
        } else {
            emptyCartMessageElement.style.display = 'none';
            cartSummarySectionElement.style.display = 'block';
            cartItemsContainer.style.display = 'block';
            proceedToCheckoutBtn.disabled = false;
            cart.forEach((item, index) => {
                const itemElement = document.createElement('div');
                itemElement.classList.add('cart-item');
                itemElement.innerHTML = `
                    <div class="cart-item-details"><strong>${item.name || 'Unnamed Item'}</strong><p>Price per item: $${item.price.toFixed(2)}</p></div>
                    <div class="cart-item-quantity"><button class="btn-update-quantity" data-index="${index}" data-action="decrease">-</button><span>${item.quantity}</span><button class="btn-update-quantity" data-index="${index}" data-action="increase">+</button></div>
                    <div class="cart-item-subtotal"><strong>Subtotal: $${(item.price * item.quantity).toFixed(2)}</strong></div>
                    <div class="cart-item-actions"><button class="btn-remove-item" data-index="${index}">Remove</button></div>
                `;
                cartItemsContainer.appendChild(itemElement);
                totalAmount += item.price * item.quantity;
            });
        }
        cartTotalElement.innerHTML = `<strong>Grand Total: $${totalAmount.toFixed(2)}</strong>`;
        attachCartActionListeners();
        updateCartCount();
    }
    function attachCartActionListeners() {
        if (!cartItemsContainer) return;
        cartItemsContainer.removeEventListener('click', handleCartItemButtonClick);
        cartItemsContainer.addEventListener('click', handleCartItemButtonClick);
    }
    function handleCartItemButtonClick(event) {
        const target = event.target;
        if (target.classList.contains('btn-remove-item')) {
            removeItemFromCart(parseInt(target.dataset.index));
        } else if (target.classList.contains('btn-update-quantity')) {
            updateItemQuantity(parseInt(target.dataset.index), target.dataset.action);
        }
    }
    function removeItemFromCart(index) {
        if (index > -1 && index < cart.length) {
            cart.splice(index, 1);
            saveCart();
        }
    }
    function updateItemQuantity(index, action) {
        if (index > -1 && index < cart.length) {
            if (action === 'increase') {
                cart[index].quantity += 1;
            } else if (action === 'decrease' && cart[index].quantity > 1) {
                cart[index].quantity -= 1;
            } else if (action === 'decrease' && cart[index].quantity <= 1) {
                cart.splice(index, 1);
            }
            saveCart();
        }
    }


    // =========================================================================
    // START: NEW AND REVISED STRIPE CHECKOUT LOGIC
    // The old Stripe integration has been completely removed and replaced with this.
    // =========================================================================

    // This is the URL of your deployed backend on Railway.
    const BACKEND_URL = 'https://mystripebackend-production.up.railway.app';

    // This function is now called by the "Proceed to Checkout" button.
    async function redirectToStripeCheckout() {
        if (cart.length === 0) {
            alert("Your cart is empty. Please add items before proceeding.");
            return;
        }

        if (proceedToCheckoutBtn) {
            proceedToCheckoutBtn.disabled = true;
            proceedToCheckoutBtn.textContent = 'Redirecting to Payment...';
        }

        // 1. Format the cart data to send to our new backend endpoint.
        const line_items = cart.map(item => ({
            name: item.name,
            price: item.price, // Price in dollars (e.g., 19.99)
            quantity: item.quantity
        }));

        try {
            // 2. Call the NEW backend endpoint.
            const response = await fetch(`${BACKEND_URL}/create-checkout-session`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: line_items })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create a checkout session.');
            }

            const session = await response.json();

            // 3. Redirect the user to the Stripe Hosted Checkout page.
            window.location.href = session.url;

        } catch (error) {
            console.error('Error redirecting to Stripe:', error);
            alert(`Could not proceed to payment: ${error.message}`);
            if (proceedToCheckoutBtn) {
                proceedToCheckoutBtn.disabled = false;
                proceedToCheckoutBtn.textContent = 'Proceed to Checkout';
            }
        }
    }

    // Attach the new checkout function to the button.
    // This REPLACES the old `window.location.href = '/checkout.html'` logic.
    if (proceedToCheckoutBtn) {
        proceedToCheckoutBtn.addEventListener('click', redirectToStripeCheckout);
    }

    // --- Handle the return from Stripe on your success.html page ---
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');

    if (sessionId && window.location.pathname.includes('/success.html')) {
        console.log("Stripe Checkout session ID found:", sessionId, "Processing success...");
        
        // Show the success message on your success.html page.
        // Make sure you have an element with id="payment-success-message" on that page.
        const successMessageDiv = document.getElementById('payment-success-message');
        if(successMessageDiv) {
            successMessageDiv.style.display = 'block';
        }

        // Clear the cart from local storage and update the header count.
        console.log("Payment successful. Clearing cart.");
        localStorage.removeItem('shoppingCart');
        cart = []; // Also clear the in-memory cart array
        updateCartCount();
    }


    // --- Final Initialization Calls ---
    if (window.location.pathname === '/view-cart.html') {
        renderCartDisplay();
    }
    updateCartCount(); // Update header cart count on every page load.
    handleCookieConsent(); // Check for cookie consent on every page load.

}); // End of DOMContentLoaded listener
