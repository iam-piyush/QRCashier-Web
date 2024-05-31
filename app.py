import os
import qrcode
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Optionally, set environment variables directly
# os.environ['VARIABLE_NAME'] = 'value'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/process_qr', methods=['POST'])
def process_qr():
    data = request.get_json()

    qr = qrcode.QRCode(
        version=8,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=25,
        border=2,
    )

    qr.add_data(f"Date: {data['date']}")
    qr.add_data("\n")
    qr.add_data(f"Time: {data['time']}")
    qr.add_data("\n")
    qr.add_data(f"{data['customerName']}")

    qr.add_data("\n\n")

    # Add item details to the QR code
    for item in data['items']:
        item_info = f"{item['sNo']}.   {item['itemName']}   Rate: ₹{item['itemPricePerUnit']}   Bought: {item['quantity']}   Units: {item['units']}   Price: ₹{round(item['price'], 3)}"
        qr.add_data(item_info)
        qr.add_data("\n\n")

    # Add total units and total price to the QR code
    qr.add_data(f"Total Units: {data['totalUnits']}")
    qr.add_data("\n")
    qr.add_data(f"Total Price: {data['totalPrice']}")
    qr.add_data("\n")
    qr.add_data(f"{data['storeName'].strip()}")

    qr.make(fit=True)

    # Save the receipt as an image
    receipt_image_path = os.path.join("static", "qr.png")
    img = qr.make_image(fill_color="black", back_color="white")
    img.save(receipt_image_path)

    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
