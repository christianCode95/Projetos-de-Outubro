document.addEventListener("DOMContentLoaded", function () {
  const menuItems = [
    { id: "hamburger", name: "Hamburguer", price: 10.0 },
    { id: "fries", name: "Batata Frita", price: 5.0 },
    { id: "soda", name: "Refrigerante", price: 3.0 },
    { id: "pizza", name: "Pizza", price: 15.0 },
    { id: "hotdog", name: "Cachorro-Quente", price: 7.0 },
    { id: "icecream", name: "Sorvete", price: 4.0 },
  ];

  const itemList = document.getElementById("item-list");
  const totalElement = document.getElementById("total"); // 🛑 CORREÇÃO: Usar 'paid-amount' (como no HTML)
  const paidAmountInput = document.getElementById("paid-amount");
  const checkoutBtn = document.getElementById("checkout-btn"); // 🛑 CORREÇÃO: Usar 'change-due' (como no HTML)
  const changeDueElement = document.getElementById("change-due"); // 1. Gera o cardápio dinamicamente

  function renderMenu() {
    menuItems.forEach((item) => {
      const itemDiv = document.createElement("div");
      itemDiv.classList.add("item");
      itemDiv.innerHTML = `
                <span>${item.name} - R$ ${item.price.toFixed(2)}</span>
                <input type="number" min="0" value="0" data-price="${
        item.price
      }">
            `;
      itemList.appendChild(itemDiv);
    });
  } // 2. Atualiza o total

  function updateTotal() {
    let total = 0;
    const quantityInputs = itemList.querySelectorAll('input[type="number"]');
    quantityInputs.forEach((input) => {
      const quantity = parseInt(input.value) || 0;
      const price = parseFloat(input.dataset.price) || 0;
      total += quantity * price;
    });
    totalElement.textContent = `R$ ${total.toFixed(2)}`; // Reseta o troco ao mudar o total
    changeDueElement.textContent = "R$ 0.00";
    changeDueElement.classList.remove("error");
  } // 3. Finalizar pedido e calcular o troco

  function handleCheckout() {
    const totalText = totalElement.textContent.replace("R$ ", "");
    const total = parseFloat(totalText) || 0;
    const paidAmount = parseFloat(paidAmountInput.value) || 0;
    if (paidAmount < total) {
      changeDueElement.textContent = "Valor pago insuficiente";
      changeDueElement.classList.add("error");
      return;
    }
    const change = paidAmount - total;
    changeDueElement.textContent = `R$ ${change.toFixed(2)}`;
    changeDueElement.classList.remove("error");
  } // Inicialização

  renderMenu(); // Adicionar Event Listeners
  itemList.addEventListener("input", updateTotal);
  checkoutBtn.addEventListener("click", handleCheckout);
});
