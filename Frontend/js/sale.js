document.addEventListener('DOMContentLoaded', fetchSales);

let salesData = []; // Store all sales data
let currentPage = 1; // Current page for pagination
const itemsPerPage = 10; // Items per page

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

        updateTotalSold();
        displaySales(salesData);
    } catch (error) {
        console.error('Error fetching sales:', error);
        alert('Failed to load sales data');
    }
}

// Update total sold count
function updateTotalSold() {
    const totalSoldElement = document.getElementById('totalSold');
    const totalSold = salesData.reduce((sum, sale) => sum + sale.quantity, 0);
    totalSoldElement.textContent = totalSold;
}

// Display sales data in the table with pagination
function displaySales(sales) {
    const salesTableBody = document.querySelector('#salesTable tbody');
    salesTableBody.innerHTML = ''; // Clear previous sales

    // Calculate start and end index for current page
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const salesToDisplay = sales.slice(start, end);

    salesToDisplay.forEach((sale) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${sale.title}</td>
            <td>${sale.date}</td>
            <td>${sale.quantity}</td>
        `;
        salesTableBody.appendChild(row);
    });

    updatePaginationButtons(sales);
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

    currentPage = 1; // Reset to the first page
    displaySales(filteredSales);
}

// Clear filters and reset the table
function clearFilters() {
    document.getElementById('dayFilter').value = '';
    document.getElementById('monthFilter').value = '';
    document.getElementById('yearFilter').value = '';

    currentPage = 1; // Reset to the first page
    displaySales(salesData);
}

// Update the pagination buttons
function updatePaginationButtons(sales) {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = ''; // Clear existing buttons

    // Back button
    if (currentPage > 1) {
        const backButton = document.createElement('button');
        backButton.className = 'btn btn-secondary me-2';
        backButton.textContent = 'Back';
        backButton.onclick = () => {
            currentPage--;
            displaySales(sales);
        };
        paginationContainer.appendChild(backButton);
    }

    // Next button
    if (currentPage * itemsPerPage < sales.length) {
        const nextButton = document.createElement('button');
        nextButton.className = 'btn btn-secondary';
        nextButton.textContent = 'Next';
        nextButton.onclick = () => {
            currentPage++;
            displaySales(sales);
        };
        paginationContainer.appendChild(nextButton);
    }
}
