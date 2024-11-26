document.addEventListener('DOMContentLoaded', function () {
  const productList = document.querySelectorAll('.buy-now');  // Changed class to "buy-now"
  const currentProductList = document.getElementById('current-product-list');
  const totalPriceElement = document.getElementById('total-amount');
  let total = 0;

  // Helper function to format numbers with commas
  function formatCurrency(amount) {
      return amount.toLocaleString('en-PH', {
          style: 'currency',
          currency: 'PHP',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
      });
  }

  productList.forEach((button) => {
      button.addEventListener('click', function () {
          const productName = this.getAttribute('data-name');
          const productPrice = parseFloat(this.getAttribute('data-price'));

          const stockText = this.parentElement.querySelector('.card-text:nth-of-type(2)');
          const stockMatch = stockText.textContent.match(/Stock: (\d+)/);
          let stock = stockMatch ? parseInt(stockMatch[1], 10) : 0;

          if (stock <= 0) {
              alert(`${productName} is out of stock!`);
              return;
          }

          stock -= 1;  // Decrease the stock
          stockText.textContent = `Stock: ${stock}`;

          if (stock === 0) {
              this.disabled = true;
              this.textContent = 'Out of Stock';
          }

          let existingProduct = Array.from(currentProductList.children).find((item) =>
              item.querySelector('.product-name').textContent.includes(productName)
          );

          if (existingProduct) {
              const quantityElement = existingProduct.querySelector('.product-name');
              const priceElement = existingProduct.querySelector('.product-price');
              const quantityMatch = quantityElement.textContent.match(/^(\d+)/);
              let quantity = quantityMatch ? parseInt(quantityMatch[1], 10) : 1;

              quantity += 1;
              quantityElement.textContent = `${quantity} x ${productName}`;
              priceElement.textContent = formatCurrency(productPrice * quantity);  // Updated price format
          } else {
              const productItem = document.createElement('div');
              productItem.classList.add('current-product-item', 'd-flex', 'justify-content-between', 'mb-2');

              productItem.innerHTML = `
                  <span class="product-name">1 x ${productName}</span>
                  <span class="product-price">${formatCurrency(productPrice)}</span>  <!-- Formatted price -->
                  <button class="btn btn-sm btn-danger delete-btn">Delete</button>
              `;

              productItem.querySelector('.delete-btn').addEventListener('click', function () {
                  const quantityElement = productItem.querySelector('.product-name');
                  const quantityMatch = quantityElement.textContent.match(/^(\d+)/);
                  let quantity = quantityMatch ? parseInt(quantityMatch[1], 10) : 1;

                  stock += quantity;
                  stockText.textContent = `Stock: ${stock}`;
                  if (stock > 0) {
                      button.disabled = false;
                      button.textContent = 'Buy Now';
                  }

                  total -= productPrice * quantity;
                  totalPriceElement.textContent = formatCurrency(total);  // Updated total format

                  productItem.remove();
              });

              currentProductList.appendChild(productItem);
          }

          total += productPrice;
          totalPriceElement.textContent = formatCurrency(total);  // Updated total format
      });
  });

  document.querySelector('.checkout-btn').addEventListener('click', function () {
      currentProductList.innerHTML = '';
      total = 0;
      totalPriceElement.textContent = formatCurrency(0);  // Reset total format
      alert('Checkout successful!');
  });
});
