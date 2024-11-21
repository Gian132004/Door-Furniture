document.addEventListener('DOMContentLoaded', function() {
    const productList = document.querySelectorAll('.add-product');
    const currentProductList = document.getElementById('current-product-list');
    const totalPriceElement = document.getElementById('total-amount');
    let total = 0;

    productList.forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.getAttribute('data-name');
            const productPrice = parseFloat(this.getAttribute('data-price'));

            const productItem = document.createElement('div');
            productItem.classList.add('current-product-item', 'd-flex', 'justify-content-between', 'mb-2');

            const productText = document.createElement('span');
            productText.classList.add('product-name');
            productText.textContent = productName;

            const productPriceText = document.createElement('span');
            productPriceText.classList.add('product-price');
            productPriceText.textContent = `Php ${productPrice.toFixed(2)}`;

            productItem.appendChild(productText);
            productItem.appendChild(productPriceText);

            currentProductList.appendChild(productItem);

            total += productPrice;
            totalPriceElement.textContent = `Php ${total.toFixed(2)}`;
        });
    });
});
