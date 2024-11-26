document.addEventListener('DOMContentLoaded', function() {
    const productList = document.querySelectorAll('.add-product');
    const currentProductList = document.getElementById('current-product-list');
    const totalPriceElement = document.getElementById('total-price');
    let total = 0;

    // Function to add product to the current list and update total
    productList.forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.getAttribute('data-name');
            const productPrice = parseFloat(this.getAttribute('data-price'));
            
            // Create a new list item for the product
            const productItem = document.createElement('div');
            productItem.classList.add('current-product-item', 'd-flex', 'justify-content-between', 'mb-2');
            
            const productText = document.createElement('span');
            productText.textContent = productName;
            
            const productPriceText = document.createElement('span');
            productPriceText.textContent = `Php ${productPrice.toFixed(2)}`;
            
            productItem.appendChild(productText);
            productItem.appendChild(productPriceText);
            
            // Add product item to the current product list
            currentProductList.appendChild(productItem);

            // Update the total price
            total += productPrice;
            totalPriceElement.textContent = `Total: Php ${total.toFixed(2)}`;
        });
    });
});
