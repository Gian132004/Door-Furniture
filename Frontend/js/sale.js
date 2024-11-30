document.addEventListener('DOMContentLoaded', () => {
    populateSalesTable();
});

// Fetch sales data from localStorage or backend
function getSalesData() {
    return JSON.parse(localStorage.getItem('sales')) || [];
}

// Save sales data to localStorage
function saveSalesData(sales) {
    localStorage.setItem('sales', JSON.stringify(sales));
}

// Populate the sales table
function populateSalesTable(sales = getSalesData()) {
    const salesTableBody = document.querySelector('#salesTable tbody');
    const totalSoldElement = document.getElementById('totalSold');
    let totalSold = 0;

    // Clear the table body
    salesTableBody.innerHTML = '';

    sales.forEach(sale => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${sale.title}</td>
            <td>${sale.date}</td>
            <td>${sale.quantity}</td>
        `;
        totalSold += sale.quantity;
        salesTableBody.appendChild(row);
    });

    // Update total sold
    totalSoldElement.textContent = totalSold;
}

// Filter sales data
function filterSales() {
    const dayFilter = document.getElementById('dayFilter').value;
    const monthFilter = document.getElementById('monthFilter').value;
    const yearFilter = document.getElementById('yearFilter').value;

    const sales = getSalesData();

    const filteredSales = sales.filter(sale => {
        const saleDate = new Date(sale.date);
        const matchesDay = !dayFilter || saleDate.getDate() === parseInt(dayFilter, 10);
        const matchesMonth = !monthFilter || saleDate.getMonth() + 1 === parseInt(monthFilter, 10);
        const matchesYear = !yearFilter || saleDate.getFullYear() === parseInt(yearFilter, 10);

        return matchesDay && matchesMonth && matchesYear;
    });

    populateSalesTable(filteredSales);
}

// Clear filters and show all sales
function clearFilters() {
    document.getElementById('dayFilter').value = '';
    document.getElementById('monthFilter').value = '';
    document.getElementById('yearFilter').value = '';
    populateSalesTable();
}

// Add sale data to localStorage (for POS integration)
function addSaleData(product, quantity, date) {
    const sales = getSalesData();
    sales.push({ title: product, quantity, date });
    saveSalesData(sales);
}
