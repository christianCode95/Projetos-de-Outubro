document.addEventListener('DOMContentLoaded', () => {// --- DOM Elements ---
    const productCatalogEl = document.getElementById('product-catalog');
    const cartItemsEl = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const cartTotalEl = document.getElementById('cart-total');
    const clearCartBtn = document.getElementById('clear-cart-btn');
    const checkoutBtn = document.getElementById('checkout-btn');
    const messageBox = document.getElementById('message-box');
    const messageText = document.getElementById('message-text');
    const closeMessageBtn = document.getElementById('close-message-btn');
    const products = [
        { id: 'laptop', name: 'Notebook Ultrafino', 
    price: 3500.00, initialStock: 5, currentStock: 5,
      image: 'https://placehold.co/100x100/A0A0A0/FFFFFF?text=NOTEBOOK' },
        { id: 'mouse', name: 'Mouse Sem Fio', 
            price: 80.00, initialStock: 20, currentStock: 20,
       image: 'https://placehold.co/100x100/808080/FFFFFF?text=MOUSE' },
        { id: 'keyboard', name: 'Teclado Mecânico', 
            price: 250.00, initialStock: 10, currentStock: 10, 
      image: 'https://placehold.co/100x100/606060/FFFFFF?text=TECLADO' },
        { id: 'monitor', name: 'Monitor Gamer 27"', price: 1200.00, 
            initialStock: 3, currentStock: 3, 
      image: 'https://placehold.co/100x100/404040/FFFFFF?text=MONITOR' },
        { id: 'headset', name: 'Headset com Microfone', price: 150.00, 
            initialStock: 15, currentStock: 15,
     image: 'https://placehold.co/100x100/202020/FFFFFF?text=HEADSET' }
    ];
    let cart = [];

    function showMessage(message) {
        messageText.textContent = message;
        messageBox.style.display = 'flex';
    }
    function hideMessage() {
        messageBox.style.display = 'none';
    }
    function renderProductCatalog() {
        productCatalogEl.innerHTML = ''; // Clear existing products
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.dataset.productId = product.id; // Store product ID
            const stockMessage = product.currentStock > 0 
                ? `Estoque: ${product.currentStock}` 
                : 'Esgotado!';
            const stockClass = product.currentStock <= 3 &&
             product.currentStock > 0
                ? 'low-stock'
                : '';
            const addButtonDisabled = product.currentStock
             === 0 ? 'disabled' : '';
            productCard.innerHTML = `
                <img class="product-image" src="${product.image}" 
                alt="${product.name}">
                <p class="product-name">${product.name}</p>
                <p class="product-price">R$ ${product.price.toFixed(2)}</p>
                <p class="product-stock ${stockClass}">${stockMessage}</p>
                <button class="action-button primary add-to-cart-btn" 
                data-product-id="${product.id}" ${addButtonDisabled}
                Adicionar ao Carrinho</button>
            `;
            productCatalogEl.appendChild(productCard);
        });
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.dataset.productId;
                addToCart(productId);
            });
        });
    }
    function renderCart() {
        cartItemsEl.innerHTML = ''; // Clear existing cart items
        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block';
            clearCartBtn.disabled = true;
            checkoutBtn.disabled = true;
        } else {
            emptyCartMessage.style.display = 'none';
            clearCartBtn.disabled = false;
            checkoutBtn.disabled = false;
            cart.forEach(item => {
                const product = products.find(p => p.id === item.productId);
                if (!product) return; // Should not happen if product data is consistent
                const cartItemEl = document.createElement('div');
                cartItemEl.classList.add('cart-item');
                cartItemEl.dataset.productId = item.productId;
                cartItemEl.innerHTML = `
                    <div class="item-details">
     <p class="item-name">${item.quantity}x ${product.name}</p>
    <p class="item-price-quantity">R$ ${product.price.toFixed(2)} cada</p>
                    </div>
                    <div class="item-actions">
  <button class="adjust-quantity-btn" data-product-id="
  ${item.productId}" data-action="decrease">-</button>
                 <span>${item.quantity}</span>
 <button class="adjust-quantity-btn" data-product-id="${item.productId}" 
 data-action="increase">+</button>
    <button class="remove-all-btn" data-product-id="${item.productId}">
    Remover</button>
                    </div>
                `;
                cartItemsEl.appendChild(cartItemEl);
            });
            document.querySelectorAll('.adjust-quantity-btn').
            forEach(button => {
                button.addEventListener('click', (e) => {
                    const productId = e.target.dataset.productId;
                    const action = e.target.dataset.action;
                    if (action === 'increase') {
                        addToCart(productId);
                    } else {
                        removeFromCart(productId);
                    }
                });
            });
            document.querySelectorAll('.remove-all-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const productId = e.target.dataset.productId;
                    removeAllFromCart(productId);
                });
            });
        }
        updateCartTotal();
    }
    /**
     * Adds a product to the shopping cart and updates stock.
     * @param {string} productId - The ID of the product to add.
     */
    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) {
            showMessage('Produto não encontrado no catálogo.');
            return;
        }
        if (product.currentStock <= 0) {
            showMessage(`Desculpe, "${product.name}" está fora de estoque.`);
            return;
        }
        const existingItem = cart.find(item => item.productId === 
            productId);
        if (existingItem) {
            if (existingItem.quantity < product.currentStock) {
                existingItem.quantity++;
                product.currentStock--; // Decrease stock
                showMessage(`Mais um "${product.name}" 
                    adicionado ao carrinho.`);
            } else {
                showMessage(`Você já adicionou o estoque máximo 
                    disponível de
                     "${product.name}".`);
            }
        } else {
            cart.push({
                productId: product.id,
                quantity: 1
            });
            product.currentStock--; // Decrease stock
            showMessage(`"${product.name}" adicionado ao carrinho!`);
        }
        renderProductCatalog(); // Update catalog to reflect stock change
        renderCart(); // Update cart display
    }
    /**
     * @param {string} productId - The ID of the product to remove.
     */
    function removeFromCart(productId) {
        const itemIndex = cart.findIndex(item => item.productId === 
            productId);
        const product = products.find(p => p.id === productId);
        if (itemIndex > -1) {
            const itemToRemove = cart[itemIndex];
            if (itemToRemove.quantity > 1) {
                itemToRemove.quantity--;
                product.currentStock++; // Increase stock
                showMessage(`Uma unidade de "${product.name}" 
                    removida do carrinho.`);
            } else {
                cart.splice(itemIndex, 1); // Remove item completely
                product.currentStock++; // Increase stock
                showMessage(`"${product.name}" removido do carrinho.`);
            }
            renderProductCatalog(); // Update catalog to reflect stock change
            renderCart(); // Update cart display
        }
    }
    /**
     * @param {string} productId - The ID of the product to remove all units of.
     */
    function removeAllFromCart(productId) {
        const itemIndex = cart.findIndex(item => item.productId === 
            productId);
        const product = products.find(p => p.id === productId);
        if (itemIndex > -1) {
            const itemToRemove = cart[itemIndex];
            product.currentStock += itemToRemove.quantity; // Return all quantity to stock
            cart.splice(itemIndex, 1); // Remove item completely
            showMessage(`Todas as unidades de "${product.name}" 
                removidas do carrinho.`);
            renderProductCatalog(); // Update catalog to reflect stock change
            renderCart(); // Update cart display
        }
    }
    function updateCartTotal() {
        let total = 0;
        cart.forEach(item => {
            const product = products.find(p => p.id === item.productId);
            if (product) {
                total += item.quantity * product.price;
            }
        });
        cartTotalEl.textContent = `R$ ${total.toFixed(2)}`;
    }

    function clearAllCart() {
        if (cart.length === 0) {
            showMessage('Seu carrinho já está vazio.');
            return;
        }
        if (confirm('Tem certeza que deseja limpar todo o carrinho?')) {
            cart.forEach(item => {
                const product = products.find(p => p.id === item.productId);
                if (product) {
                    product.currentStock += item.quantity;
                }
            });
            cart = [];
            showMessage('Carrinho limpo!');
            renderProductCatalog(); // Update catalog to reflect stock changes
            renderCart(); // Update cart display
        }
    }
    function checkout() {
        if (cart.length === 0) {
showMessage('Seu carrinho está vazio. Adicione produtos antes de finalizar a compra.');
            return;
        }
        const total = cart.reduce((sum, item) => {
            const product = products.find(p => p.id === item.productId);
            return sum + (item.quantity * product.price);
        }, 0);
        if (confirm(`Finalizar compra? Total: R$ ${total.toFixed(2)}`)) {
            cart = [];
            showMessage(`Compra finalizada com sucesso! Total: R$ 
                ${total.toFixed(2)}. Obrigado por comprar!`);
            renderProductCatalog(); 
            renderCart(); // Clear cart display
        }
    }
    function initializeStore() {
        renderProductCatalog(); // Display initial products
        renderCart(); // Display initial empty cart
    }
    clearCartBtn.addEventListener('click', clearAllCart);
    checkoutBtn.addEventListener('click', checkout);
    closeMessageBtn.addEventListener('click', hideMessage);
    messageBox.addEventListener('click', (e) => {
        if (e.target === messageBox) {
            hideMessage();
        }
    });
    initializeStore();
});
