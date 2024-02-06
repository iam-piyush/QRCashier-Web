let rowNumber = 2; // Starting from the next row
let items = []; // Initialize an empty array to store items

document.getElementById("addItemBtn").addEventListener("click", function () {
  const table = document.getElementById("itemTable");
  const newRow = table.insertRow(-1);
  newRow.id = `row-${rowNumber}`;
  newRow.innerHTML = `
    <td>${rowNumber}</td>
    <td><input type="text" id="itemName-${rowNumber}" class="item-input"></td>
    <td><input type="text" id="itemPricePerUnit-${rowNumber}" class="item-input"></td>
    <td><input type="text" id="itemQuantity-${rowNumber}" class="item-input"></td>
    <td><input type="text" id="itemUnits-${rowNumber}" class="item-input"></td>
  `;

  rowNumber++;

  // Call the function to show the "Generate QR Code" button
  showGenerateQRButton();
});

document.getElementById("itemTable").addEventListener("input", function (event) {
  if (event.target.classList.contains("item-input")) {
    generateReceipt();
  }
});

// Get the customer input fields
const customerNameInput = document.getElementById("customerName");
const customerPhoneInput = document.getElementById("customerPhone");
const customerEmailInput = document.getElementById("customerEmail");

// Add event listeners to the customer input fields
customerNameInput.addEventListener("input", function () {
  generateReceipt();
});

customerPhoneInput.addEventListener("input", function () {
  generateReceipt();
});

customerEmailInput.addEventListener("input", function () {
  generateReceipt();
});

document.getElementById("itemTable").addEventListener("input", function (event) {
  if (event.target.classList.contains("item-input")) {
    generateReceipt();
  }
});


function generateReceipt() {
  const receiptDiv = document.getElementById("receipt");
  receiptDiv.innerHTML = "";
  

  const receiptHeader = document.createElement("h3");
  receiptHeader.textContent = "Receipt";
  receiptHeader.style.fontFamily = "Arial, sans-serif";
  receiptHeader.style.fontSize = "24px";
  receiptHeader.style.textAlign = "center"; 
  receiptHeader.style.textDecoration = "underline";
  receiptDiv.appendChild(receiptHeader);

  // Get current date and time
  const currentDate = new Date();
  const day = currentDate.getDate();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const monthIndex = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const formattedDate = `${day} ${monthNames[monthIndex]} ${year}`;

  const dateParagraph = document.createElement("p");
  dateParagraph.textContent = `Date: ${formattedDate}`;
  receiptDiv.appendChild(dateParagraph);

  const time = currentDate.toLocaleTimeString();
  const timeParagraph = document.createElement("p");
  timeParagraph.textContent = `Time: ${time}`;
  receiptDiv.appendChild(timeParagraph);
 
  //Style for receiptDiv
  receiptDiv.style.border = "1px solid #ddd";
  receiptDiv.style.marginTop = "20px";
  receiptDiv.style.padding = "10px";

  // Create a div for market details
  const marketDetailsDiv = document.createElement("div");
  marketDetailsDiv.classList.add("market-details");

  // Supermarket details
  const supermarketName = document.getElementById("supermarketName").textContent;
  const supermarketPhone = document.getElementById("supermarketPhone").textContent;
  const supermarketAddress = document.getElementById("supermarketAddress").textContent;

  // Add supermarket details to the market details div
  marketDetailsDiv.innerHTML += `<p><strong>Store Name:</strong> ${supermarketName}</p>`;
  marketDetailsDiv.innerHTML += `<p><strong>Store Ph.No:</strong> ${supermarketPhone}</p>`;
  marketDetailsDiv.innerHTML += `<p><strong>Store Address:</strong> ${supermarketAddress}</p>`;

  // Create a div for customer details
  const customerDetailsDiv = document.createElement("div");
  customerDetailsDiv.classList.add("customer-details");

  // Customer details
  const customerName = document.getElementById("customerName").value;
  const customerPhone = document.getElementById("customerPhone").value || 'NA';
  const customerEmail = document.getElementById("customerEmail").value || 'NA';

  // Add customer details to the customer details div
  customerDetailsDiv.innerHTML += `<p><strong>Customer Name:</strong> ${customerName}</p>`;
  customerDetailsDiv.innerHTML += `<p><strong>Customer Phone:</strong> ${customerPhone}</p>`;
  customerDetailsDiv.innerHTML += `<p><strong>Customer Email:</strong> ${customerEmail}</p>`;

  // Apply styles to market details div
  marketDetailsDiv.style.width = "45%";
  marketDetailsDiv.style.marginTop = "20px";
  marketDetailsDiv.style.marginBottom = "20px";

  // Apply styles to customer details div
  customerDetailsDiv.style.width = "45%";
  customerDetailsDiv.style.marginTop = "20px";
  customerDetailsDiv.style.marginBottom = "20px";

  // Create a flex container to display market-details and customer-details side by side
  const flexContainer = document.createElement("div");
  flexContainer.style.display = "flex";
  flexContainer.style.justifyContent = "space-between";

  // Append market-details and customer-details divs to the flex container
  flexContainer.appendChild(marketDetailsDiv);
  flexContainer.appendChild(customerDetailsDiv);

  // Append the flex container to the receipt
  receiptDiv.appendChild(flexContainer);

  let totalUnits = 0;
  let totalPrice = 0;

  const table = document.createElement("table");
  table.classList.add("receipt-table");

  const headerRow = document.createElement("tr");
  headerRow.innerHTML =
    "<th>S.No.</th><th>Product Name</th><th>Product Rate</th><th>Quantity</th><th>Units</th><th>Price</th>"; // Include the serial number column
  table.appendChild(headerRow);

  const rows = document.getElementById("itemTable").rows;

  items = []; // Clear the items array before repopulating

  for (let i = 1; i < rows.length; i++) {
    const itemName = document.getElementById(`itemName-${i}`).value;
    const itemPricePerUnit = parseFloat(document.getElementById(`itemPricePerUnit-${i}`).value) || 0;
    const itemQuantityInput = document.getElementById(`itemQuantity-${i}`).value.toLowerCase();
    const itemUnits = parseFloat(document.getElementById(`itemUnits-${i}`).value) || 1;

    // Extract numeric value and unit from the input
    const matches = itemQuantityInput.match(/([0-9.]+)\s*([a-z]+)/i);
    let itemEnteredQuantity = itemQuantityInput; // Store entered quantity as it is
    let itemQuantity = parseFloat(itemQuantityInput) || 0; // Initialize with entered value

    if (matches && matches.length >= 3) {
      // Extract numeric value and unit
      itemQuantity = parseFloat(matches[1]); // Extract numeric value
      const unit = matches[2].toLowerCase(); // Extract unit and convert to lowercase

      // Convert units to liters if necessary
      if (unit === "ml"  || unit === "mili"  || unit=== "mililiter") {
        itemQuantity /= 1000; // Convert milliliters to liters
      } else if (unit === "gm" || unit === "g" || unit === "gram") {
        itemQuantity /= 1000; // Convert grams to kilograms
      } else if (unit === "cm" || unit === "centi"  || unit === "centimeter"  ) {
        itemQuantity /= 100; // Convert centimeter to meter
      } else if (unit === "mm" || unit === "milimeter" ) {
        itemQuantity /= 1000; // Convert milimeter to meter
      }
    }

    const itemPrice = itemPricePerUnit * itemQuantity * itemUnits;

    if (itemName.trim() !== "" && itemPrice > 0) {
      totalUnits += itemUnits;
      totalPrice += itemPrice;

      items.push({
        rowNumber: i,
        itemName: itemName,
        itemEnteredQuantity: itemEnteredQuantity, // Store entered quantity as it is (e.g., "200ml")
        itemQuantity: itemQuantity, // Store converted quantity for calculation (e.g., 0.2 liters)
        itemUnits: itemUnits,
        itemPrice: itemPrice,
        itemPricePerUnit: itemPricePerUnit,
      });
    }
  }

  // Append items to the receipt table
  for (const item of items) {
    const row = document.createElement("tr");
    const pricePerUnit = item.itemPricePerUnit || 0;
    const totalPrice = (item.itemQuantity * item.itemUnits * pricePerUnit).toFixed(2);
    const pricePerUnitFormatted = pricePerUnit.toFixed(2);
    row.innerHTML = `<td>${item.rowNumber}</td><td>${item.itemName}</td><td>₹${pricePerUnitFormatted}</td><td>${item.itemEnteredQuantity}</td><td>${item.itemUnits}</td><td>₹${totalPrice}</td>`;
    table.appendChild(row);
  }



  receiptDiv.appendChild(table);

  // Display total units and total price
  receiptDiv.innerHTML += `<p><strong>Total Units:</strong> ${totalUnits}</p>`;
  receiptDiv.innerHTML += `<p><strong>Total Price:</strong> ₹${totalPrice.toFixed(2)}</p>`;

  // Call a function to show the "Generate QR Code" button
  showGenerateQRButton();
}

//capture starts here
function captureReceiptAsImage() {
  const receiptDiv = document.getElementById("receipt");

  // Use html2canvas to capture the content of the receiptDiv
  html2canvas(receiptDiv).then(function(canvas) {
      // Convert the canvas to data URL
      const dataURL = canvas.toDataURL("image/png");

      // Create a link element to download the image
      const downloadLink = document.createElement("a");
      downloadLink.href = dataURL;
      downloadLink.download = "receipt.png";

      // Append the link to the body and programmatically click it to trigger the download
      document.body.appendChild(downloadLink);
      downloadLink.click();

      // Remove the link from the DOM
      document.body.removeChild(downloadLink);
  });
}

const downloadReceiptImageBtn = document.getElementById("downloadReceiptImageBtn");

downloadReceiptImageBtn.addEventListener("click", function() {
    captureReceiptAsImage();
});


//ends here


function showGenerateQRButton() {
  const generateQRBtn = document.getElementById("generateQRBtn");
  generateQRBtn.style.display = "block";
}

const generateQRBtn = document.getElementById("generateQRBtn");

generateQRBtn.addEventListener("click", function () {
  const totalUnits = items.reduce((total, item) => total + parseFloat(item.itemUnits || 0), 0);
  const totalPrice = items.reduce((total, item) => total + (parseFloat(item.itemPrice) || 0), 0).toFixed(2);

  const currentDate = new Date();
  const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
  const currentTime = currentDate.toLocaleTimeString();

  const customerName = document.getElementById("customerName").value;
  const storeName = document.getElementById("supermarketName").textContent;

  const data = {
    items: items.map((item) => ({
      sNo: item.rowNumber,
      itemName: item.itemName,
      itemPricePerUnit: item.itemPricePerUnit,
      quantity: item.itemEnteredQuantity,
      units: item.itemUnits,
      price: item.itemPrice,
    })),
    totalUnits: totalUnits,
    totalPrice: `₹${totalPrice}`,
    date: formattedDate,
    time: currentTime,
    customerName: customerName,
    storeName: storeName,
  };

  generateQRCode(data);
});


function generateQRCode(data) {
  fetch("/process_qr", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      const qrCodeImg = document.getElementById("qrCode");
      qrCodeImg.src = "/static/qr.png";
      qrCodeImg.style.display = "block";

    })
    .catch((error) => console.error(error));
}

