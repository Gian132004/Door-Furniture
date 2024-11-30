document.addEventListener('DOMContentLoaded', () => {
    populateSalesTable();
    addFilterListeners();
});

// Fetch sales data from localStorage or backend
function getSalesData() {
    const sales = JSON.parse(localStorage.getItem('sales')) || [];
    return sales;
}

// Save sales data to localStorage
function saveSalesData(sales) {
    localStorage.setItem('sales', JSON.stringify(sales));
}

// Populate sales table
function populateSalesTable() {
    const sales = getSalesData();
    const salesTableBody = document.querySelector('#salesTable tbody');
    const totalSoldRow = document.querySelector('#totalSoldRow');
    let totalSold = 0;

    // Clear table before populating
    salesTableBody.innerHTML = '';

    sales.forEach(sale => {
        const row = document.createElement('tr');
        row.dataset.date = sale.date;

        row.innerHTML = `
            <td>${sale.title}</td>
            <td>${sale.date}</td>
            <td>${sale.quantity}</td>
        `;

        totalSold += sale.quantity;
        salesTableBody.appendChild(row);
    });

    // Append total sold row at the end
    totalSoldRow.querySelector('#totalSold').textContent = totalSold;
}

// Filter sales by date
function addFilterListeners() {
    const monthFilter = document.getElementById('monthFilter');
    const dayFilter = document.getElementById('dayFilter');
    const yearFilter = document.getElementById('yearFilter');

    monthFilter.addEventListener('change', () => filterSales());
    dayFilter?.addEventListener('change', () => filterSales());
    yearFilter?.addEventListener('change', () => filterSales());
}

// Filter sales data and update table
function filterSales() {
    const sales = getSalesData();
    const salesTableBody = document.querySelector('#salesTable tbody');
    const totalSoldRow = document.querySelector('#totalSoldRow');
    const monthFilter = document.getElementById('monthFilter').value;
    const dayFilter = document.getElementById('dayFilter')?.value;
    const yearFilter = document.getElementById('yearFilter')?.value;
    let totalSold = 0;

    // Clear table
    salesTableBody.innerHTML = '';

    const filteredSales = sales.filter(sale => {
        const saleDate = new Date(sale.date);

        const matchesMonth = monthFilter === 'all' || `${saleDate.getMonth() + 1}-${saleDate.getFullYear()}` === monthFilter;
        const matchesDay = !dayFilter || saleDate.getDate() === parseInt(dayFilter, 10);
        const matchesYear = !yearFilter || saleDate.getFullYear() === parseInt(yearFilter, 10);

        return matchesMonth && matchesDay && matchesYear;
    });

    filteredSales.forEach(sale => {
        const row = document.createElement('tr');
        row.dataset.date = sale.date;

        row.innerHTML = `
            <td>${sale.title}</td>
            <td>${sale.date}</td>
            <td>${sale.quantity}</td>
        `;

        totalSold += sale.quantity;
        salesTableBody.appendChild(row);
    });

    // Update total sold
    totalSoldRow.querySelector('#totalSold').textContent = totalSold;
}

// Add sale data to localStorage (called from POS checkout)
function addSaleData(product, quantity, date) {
    const sales = getSalesData();
    sales.push({ title: product, quantity, date });
    saveSalesData(sales);
}
