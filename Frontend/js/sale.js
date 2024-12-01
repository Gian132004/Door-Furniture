document.addEventListener('DOMContentLoaded', fetchSales);

let salesData = []; // To store fetched sales data

// Fetch sales data from the API
async function fetchSales() {
    try {
        const response = await fetch('http://localhost:5500/api/sales/all');
        if (!response.ok) {
            throw new Error('Failed to fetch sales data');
        }

        salesData = await response.json();

        // Sort sales data by date (latest first)
        salesData.sort((a, b) => new Date(b.date) - new Date(a.date));

        displaySales(salesData);
    } catch (error) {
        console.error('Error fetching sales:', error);
        alert('Failed to load sales data');
    }
}

// Display sales data in the table
function displaySales(sales) {
    const salesTableBody = document.querySelector('#salesTable tbody');
    const totalSoldElement = document.getElementById('totalSold');

    salesTableBody.innerHTML = ''; // Clear previous sales
    let totalSold = 0;

    sales.forEach((sale) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${sale.title}</td>
            <td>${sale.date}</td>
            <td>${sale.quantity}</td>
        `;
        salesTableBody.appendChild(row);

        totalSold += sale.quantity;
    });

    totalSoldElement.textContent = totalSold;
}

// Apply filters to the sales data
function filterSales() {
    const day = document.getElementById('dayFilter').value;
    const month = document.getElementById('monthFilter').value;
    const year = document.getElementById('yearFilter').value;

    const filteredSales = salesData.filter((sale) => {
        const [saleYear, saleMonth, saleDay] = sale.date.split('-');
        return (
            (!day || saleDay === day.padStart(2, '0')) &&
            (!month || saleMonth === month.padStart(2, '0')) &&
            (!year || saleYear === year)
        );
    });

    // Sort filtered sales data by date (latest first)
    filteredSales.sort((a, b) => new Date(b.date) - new Date(a.date));

    displaySales(filteredSales);
}

// Clear filters and reset the table
function clearFilters() {
    document.getElementById('dayFilter').value = '';
    document.getElementById('monthFilter').value = '';
    document.getElementById('yearFilter').value = '';

    // Reset table with all sales data
    displaySales(salesData);
}
