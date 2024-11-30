document.addEventListener('DOMContentLoaded', function () {
  const productList = document.querySelectorAll('.add-product');
  const currentProductList = document.getElementById('current-product-list');
  const totalPriceElement = document.getElementById('total-amount');
  let total = 0;

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

          stock -= 1;
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
              priceElement.textContent = `Php ${(productPrice * quantity).toFixed(2)}`;
          } else {
              const productItem = document.createElement('div');
              productItem.classList.add('current-product-item', 'd-flex', 'justify-content-between', 'mb-2');

              productItem.innerHTML = `
                  <span class="product-name">1 x ${productName}</span>
                  <span class="product-price">Php ${productPrice.toFixed(2)}</span>
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
                      button.textContent = 'Add Product';
                  }

                  total -= productPrice * quantity;
                  totalPriceElement.textContent = `Php ${total.toFixed(2)}`;

                  productItem.remove();
              });

              currentProductList.appendChild(productItem);
          }

          total += productPrice;
          totalPriceElement.textContent = `Php ${total.toFixed(2)}`;
      });
  });

  document.querySelector('.checkout-btn').addEventListener('click', function () {
      const sales = JSON.parse(localStorage.getItem('sales')) || [];
      const products = Array.from(currentProductList.children).map(productItem => {
          const productNameElement = productItem.querySelector('.product-name');
          const priceElement = productItem.querySelector('.product-price');

          const quantityMatch = productNameElement.textContent.match(/^(\d+)/);
          const quantity = quantityMatch ? parseInt(quantityMatch[1], 10) : 1;

          const productName = productNameElement.textContent.replace(/^\d+ x /, '');
          const price = parseFloat(priceElement.textContent.replace('Php ', ''));

          // Save each product as a sale record
          sales.push({
              title: productName,
              quantity: quantity,
              date: new Date().toISOString().split('T')[0] // Save date in YYYY-MM-DD format
          });

          return {
              name: productName,
              quantity,
              price
          };
      });

      localStorage.setItem('sales', JSON.stringify(sales));

      currentProductList.innerHTML = '';
      total = 0;
      totalPriceElement.textContent = 'Php 0.00';

      alert('Checkout successful!');
  });
});
