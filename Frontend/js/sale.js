// Function to calculate and update the total sold
function updateTotalSold() {
  var rows = document.getElementById('salesTable').getElementsByTagName('tr');
  var totalSold = 0;

  // Iterate over each row (skip the header and total row)
  for (var i = 1; i < rows.length - 1; i++) {
      var soldCell = rows[i].getElementsByTagName('td')[2]; // The third column (No. of Sold)
      var sold = parseInt(soldCell.textContent || soldCell.innerText, 10);
      totalSold += sold; // Add to total sold
  }

  // Update the total sold in the Total Sold row
  var totalSoldCell = document.querySelector("#totalSold");
  if (totalSoldCell) {
      totalSoldCell.textContent = totalSold; // Update with the calculated total sold
  }
}

// Helper function to extract month from date in 'YYYY-MM-DD' format
function extractMonthFromDate(date) {
  return date.slice(5, 7) + '-' + date.slice(0, 4); // Extracts MM-YYYY (e.g. 11-2024)
}

// Function to filter sales by the selected month and update the total sales
function filterSalesByMonth() {
  // Get the selected month from the dropdown
  var selectedMonth = document.getElementById('monthFilter').value;

  // Get all table rows (skip header and the total row)
  var rows = document.getElementById('salesTable').getElementsByTagName('tr');

  var totalSold = 0;
  var anyVisibleRow = false; // Flag to check if any row is visible

  // Iterate over each row (skip the header and footer)
  for (var i = 1; i < rows.length - 1; i++) { // row[0] is the header, and row[rows.length-1] is the Total Sold row
      var dateCell = rows[i].getElementsByTagName('td')[1]; // The second column (date)
      var soldCell = rows[i].getElementsByTagName('td')[2]; // The third column (No. of Sold)

      // Extract the date from the row and the number of items sold
      var date = dateCell.textContent || dateCell.innerText;
      var sold = parseInt(soldCell.textContent || soldCell.innerText, 10);

      // Get the month from the date
      var rowMonth = extractMonthFromDate(date);

      // Show or hide the row based on the selected month
      if (selectedMonth === "all" || selectedMonth === rowMonth) {
          rows[i].style.display = ""; // Show the row
          totalSold += sold; // Add to total sold
          anyVisibleRow = true;
      } else {
          rows[i].style.display = "none"; // Hide the row
      }
  }

  // Update the total sold in the Total Sold row
  var totalSoldCell = document.querySelector("#totalSold");
  if (totalSoldCell) {
      totalSoldCell.textContent = totalSold; // Update with the calculated total sold
  }

  // If no rows are visible after filtering, you could display a "No data" message (optional)
  if (!anyVisibleRow) {
      document.getElementById('totalSoldRow').style.display = 'none'; // Hide the total row if no data
  } else {
      document.getElementById('totalSoldRow').style.display = ''; // Show the total row if there's data
  }
}

// Initial call to update the total when the page loads
window.onload = function() {
  updateTotalSold();
  filterSalesByMonth(); // Optional: To apply initial filter (if needed)
};
