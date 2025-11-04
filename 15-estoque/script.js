document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const productNameInput = document.getElementById('product-name');
    const productQuantityInput = document.getElementById('product-quantity');
    const addProductBtn = document.getElementById('add-product-btn');
    const barcodeProductNameSpan = document.getElementById
    ('barcode-product-name');
    const barcodeSvg = document.getElementById('barcode-svg');
    const copyBarcodeBtn = document.getElementById('copy-barcode-btn');
    const barcodeInput = document.getElementById('barcode-input');
    const operationQuantityInput = document.getElementById
    ('operation-quantity');
    const entryBtn = document.getElementById('entry-btn');
    const exitBtn = document.getElementById('exit-btn');
    const inventoryListUl = document.getElementById('inventory-list');
    const messageBox = document.getElementById('message-box');
    const messageText = document.getElementById('message-text');
    const closeMessageBtn = document.getElementById('close-message-btn');
    let inventory = [];
    /**
     * Generates a unique 12-digit barcode (EAN-13 like structure, simplified).
     * @returns {string} A unique barcode string.
     */
    function generateBarcode() {
return Date.now().toString() + Math.floor(Math.random() * 1000).toString
().padStart(3, '0');
    }
    /**
     * Displays a barcode using JsBarcode library.
     * @param {string} barcode - The barcode string to display.
     * @param {string} productName - The name of the product associated with the barcode.
     */
    function displayBarcode(barcode, productName) {
        barcodeProductNameSpan.textContent = productName;
        JsBarcode("#barcode-svg", barcode, {
            format: "CODE128", // Common barcode format
            displayValue: true,
            fontSize: 18,
            height: 80,
            width: 1.5
        });
        copyBarcodeBtn.disabled = false;
    }
    /**
     * Shows a message box with a given message.
     * @param {string} message - The message to display.
     */
    function showMessage(message) {
        messageText.textContent = message;
        messageBox.style.display = 'flex';
    }
    function hideMessage() {
        messageBox.style.display = 'none';
    }
    function renderInventory() {
        inventoryListUl.innerHTML = ''; // Clear existing list
        if (inventory.length === 0) {
            const emptyMessage = document.createElement('li');
            emptyMessage.classList.add('empty-inventory-message');
            emptyMessage.textContent = 'Nenhum produto no estoque.';
            inventoryListUl.appendChild(emptyMessage);
            return;
        }
        inventory.forEach(product => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="product-name-display">$
                {product.name}</span>
                <span class="product-barcode-display">$
                {product.barcode}</span>
                <span class="product-quantity-display">
                Qtd: ${product.quantity}</span>
            `;
            inventoryListUl.appendChild(li);
        });
    }
    function saveInventory() {
        localStorage.setItem
        ('stockSimulatorInventory', JSON.stringify(inventory));
    }
    function loadInventory() {
        const savedInventory = localStorage.getItem
        ('stockSimulatorInventory');
        if (savedInventory) {
            inventory = JSON.parse(savedInventory);
            renderInventory();
        }
    }
    function handleAddProduct() {
        const name = productNameInput.value.trim();
        const quantity = parseInt(productQuantityInput.value);
        if (!name) {
            showMessage('Por favor, insira o nome do produto.');
            return;
        }
        if (isNaN(quantity) || quantity <= 0) {
            showMessage('Por favor, insira uma quantidade inicial válida (maior que 0).');
            return;
        }
        const newBarcode = generateBarcode();
        const newProduct = {
            barcode: newBarcode,
            name: name,
            quantity: quantity
        };
        inventory.push(newProduct);
        saveInventory();
        renderInventory();
        displayBarcode(newBarcode, name); // Display the generated barcode for the new product

        productNameInput.value = ''; // Clear input fields
        productQuantityInput.value = 1;
        showMessage(`Produto "${name}" 
            adicionado com sucesso! Código: ${newBarcode}`);
    }
    function handleProductEntry() {
        const barcode = barcodeInput.value.trim();
        const quantity = parseInt(operationQuantityInput.value);
        if (!barcode) {
            showMessage('Por favor, digite ou cole um código de barras.');
            return;
        }
        if (isNaN(quantity) || quantity <= 0) {
            showMessage
('Por favor, insira uma quantidade válida para a entrada (maior que 0).');
            return;
        }
        const product = inventory.find(p => p.barcode === barcode);
        if (product) {
            product.quantity += quantity;
            saveInventory();
            renderInventory();
            showMessage(`Entrada de ${quantity}
                 unidades de "${product.name}" 
                 registrada. Novo estoque: ${product.quantity}`);
        } else {
            showMessage(`Produto com código ${barcode} 
                não encontrado no estoque.`);
        }
        barcodeInput.value = ''; // Clear input
        operationQuantityInput.value = 1;
    }
    function handleProductExit() {
        const barcode = barcodeInput.value.trim();
        const quantity = parseInt(operationQuantityInput.value);
        if (!barcode) {
            showMessage('Por favor, digite ou cole um código de barras.');
            return;
        }
        if (isNaN(quantity) || quantity <= 0) {
            showMessage
('Por favor, insira uma quantidade válida para a saída (maior que 0).');
            return;
        }
        const product = inventory.find(p => p.barcode === barcode);
        if (product) {
            if (product.quantity >= quantity) {
                product.quantity -= quantity;
                saveInventory();
                renderInventory();
                showMessage(`Saída de ${quantity} unidades de "$
                    {product.name}" registrada. Novo estoque: $
                    {product.quantity}`);
            } else {
                showMessage(`Estoque insuficiente para "$
                    {product.name}". Disponível: ${product.quantity}`);
            }
        } else {
            showMessage(`Produto com código ${barcode}
                não encontrado no estoque.`);
        }
        barcodeInput.value = ''; // Clear input
        operationQuantityInput.value = 1;
    }
    function copyBarcodeToClipboard() {
        const barcodeText = barcodeSvg.querySelector('text').textContent; // Get text from SVG
        if (barcodeText) {
            const tempInput = document.createElement('textarea');
            tempInput.value = barcodeText;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            showMessage
    ('Código de barras copiado para a área de transferência!');
        } else {
            showMessage('Nenhum código de barras para copiar.');
        }
    }
    // --- Event Listeners ---
    addProductBtn.addEventListener('click', handleAddProduct);
    entryBtn.addEventListener('click', handleProductEntry);
    exitBtn.addEventListener('click', handleProductExit);
    copyBarcodeBtn.addEventListener('click', copyBarcodeToClipboard);
    closeMessageBtn.addEventListener('click', hideMessage);
    // Allow pressing Enter in barcode input to trigger entry/exit
    barcodeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            // Default to entry if Enter is pressed
            handleProductEntry(); 
        }
    });
    // --- Initialization ---
    loadInventory(); // Load inventory when the page loads
    renderInventory(); // Render initial inventory (or empty message)
});
