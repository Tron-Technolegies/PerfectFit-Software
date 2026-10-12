import os
import sys
import django
import json

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "perfectfitsoftware.settings")
django.setup()

from django.test import Client
from adminApp.models import Category, Product, PhysicalUnit

client = Client()

print("========================================")
print("TESTING PRODUCT MANAGEMENT & UPDATE FLOW")
print("========================================")

category, _ = Category.objects.get_or_create(name="Bridal Collection", prefix="BDL")

# TEST 1: Product Creation with Multiple Sizes (S: 5, M: 0, L: 8, XL: 2)
print("\n--- Test 1: Product Creation with Multiple Sizes ---")
create_payload = {
    "name": "Royal Lehenga",
    "category_id": category.id,
    "colour": "Ruby Red",
    "description": "Handcrafted bridal lehenga",
    "rental_price": 2500,
    "stock_data": [
        {"size": "S", "qty": 5},
        {"size": "M", "qty": 0},
        {"size": "L", "qty": 8},
        {"size": "XL", "qty": 2}
    ]
}

res = client.post('/api/items/create/', data=json.dumps(create_payload), content_type='application/json')
assert res.status_code == 200, f"Expected 200, got {res.status_code}: {res.content}"
data = res.json()
product_id = data["id"]
print(f"Product created with id {product_id}, code {data['code']}")
print(f"Total Stock: {data['total_stock']} (Expected: 15)")
assert data['total_stock'] == 15
print(f"Available Stock: {data['available_stock']} (Expected: 15)")
assert data['available_stock'] == 15

# Verify sizes in PhysicalUnit
units = list(PhysicalUnit.objects.filter(product_id=product_id))
assert len(units) == 15
s_units = [u for u in units if u.size == "S"]
m_units = [u for u in units if u.size == "M"]
l_units = [u for u in units if u.size == "L"]
xl_units = [u for u in units if u.size == "XL"]
assert len(s_units) == 5, f"Expected 5 S units, got {len(s_units)}"
assert len(m_units) == 0, f"Expected 0 M units, got {len(m_units)}"
assert len(l_units) == 8, f"Expected 8 L units, got {len(l_units)}"
assert len(xl_units) == 2, f"Expected 2 XL units, got {len(xl_units)}"
print("Physical units count per size verified!")

# TEST 2: GET /api/items/<id>/
print("\n--- Test 2: Fetch single product details ---")
res = client.get(f'/api/items/{product_id}/')
assert res.status_code == 200
p_data = res.json()
stock_data = p_data["stock_data"]
print("Stock data returned:", stock_data)
# Verify M is present with qty 0 and Out of Stock
m_variant = next(v for v in stock_data if v["size"] == "M")
assert m_variant["qty"] == 0
assert m_variant["stock_status"] == "Out of Stock"
s_variant = next(v for v in stock_data if v["size"] == "S")
assert s_variant["qty"] == 5
assert s_variant["stock_status"] == "In Stock"
print("Stock data variants correctly preserved with stock_status!")

# TEST 3: Update quantity only (without changing size)
print("\n--- Test 3: Update quantity only (S: 5 -> 7, M: 0 -> 3) ---")
update_payload = {
    "name": "Royal Lehenga Updated",
    "stock_data": [
        {"size": "S", "qty": 7, "original_size": "S"},
        {"size": "M", "qty": 3, "original_size": "M"},
        {"size": "L", "qty": 8, "original_size": "L"},
        {"size": "XL", "qty": 2, "original_size": "XL"}
    ]
}
res = client.put(f'/api/items/{product_id}/update/', data=json.dumps(update_payload), content_type='application/json')
assert res.status_code == 200, f"Update failed: {res.content}"
data = res.json()
print(f"Total Stock after qty increase: {data['total_stock']} (Expected: 20)")
assert data['total_stock'] == 20
assert data['available_stock'] == 20
m_units = PhysicalUnit.objects.filter(product_id=product_id, size="M")
assert m_units.count() == 3
s_units = PhysicalUnit.objects.filter(product_id=product_id, size="S")
assert s_units.count() == 7
print("Quantity update without changing size verified!")

# TEST 4: Update size only (without changing quantity: rename S -> Small)
print("\n--- Test 4: Update size only (rename S -> Small) ---")
update_payload = {
    "stock_data": [
        {"size": "Small", "qty": 7, "original_size": "S"},
        {"size": "M", "qty": 3, "original_size": "M"},
        {"size": "L", "qty": 8, "original_size": "L"},
        {"size": "XL", "qty": 2, "original_size": "XL"}
    ]
}
res = client.put(f'/api/items/{product_id}/update/', data=json.dumps(update_payload), content_type='application/json')
assert res.status_code == 200, f"Update failed: {res.content}"
data = res.json()
assert data['total_stock'] == 20
small_units = PhysicalUnit.objects.filter(product_id=product_id, size="Small")
assert small_units.count() == 7
old_s_units = PhysicalUnit.objects.filter(product_id=product_id, size="S")
assert old_s_units.count() == 0
print("Size renaming without changing quantity verified!")

# TEST 5: Set quantity to 0 (Small: 7 -> 0 => Out of Stock)
print("\n--- Test 5: Set quantity to 0 (Small -> 0) ---")
update_payload = {
    "stock_data": [
        {"size": "Small", "qty": 0, "original_size": "Small"},
        {"size": "M", "qty": 3, "original_size": "M"},
        {"size": "L", "qty": 8, "original_size": "L"},
        {"size": "XL", "qty": 2, "original_size": "XL"}
    ]
}
res = client.put(f'/api/items/{product_id}/update/', data=json.dumps(update_payload), content_type='application/json')
assert res.status_code == 200
data = res.json()
print(f"Total Stock: {data['total_stock']} (Expected: 13)")
assert data['total_stock'] == 13
small_variant = next(v for v in data['stock_data'] if v["size"] == "Small")
assert small_variant["qty"] == 0
assert small_variant["stock_status"] == "Out of Stock"
print("Setting quantity to 0 correctly derives Out of Stock and removes available units!")

# TEST 6: Update non-stock field only (rental_price, colour) without stock_data
print("\n--- Test 6: Update only price and colour without sending stock_data ---")
update_payload = {
    "rental_price": 3200,
    "colour": "Deep Maroon"
}
res = client.put(f'/api/items/{product_id}/update/', data=json.dumps(update_payload), content_type='application/json')
assert res.status_code == 200
data = res.json()
assert data['rental_price'] == 3200
assert data['colour'] == "Deep Maroon"
# Units and stock must be preserved!
assert data['total_stock'] == 13
print("Updating metadata without stock_data preserves all existing stock & units!")

# TEST 7: Set ALL quantities to 0 -> Product becomes overall Out of Stock
print("\n--- Test 7: All quantities set to 0 -> Overall Out of Stock ---")
update_payload = {
    "stock_data": [
        {"size": "Small", "qty": 0},
        {"size": "M", "qty": 0},
        {"size": "L", "qty": 0},
        {"size": "XL", "qty": 0}
    ]
}
res = client.put(f'/api/items/{product_id}/update/', data=json.dumps(update_payload), content_type='application/json')
assert res.status_code == 200
data = res.json()
assert data['total_stock'] == 0
assert data['available_stock'] == 0
assert data['is_available'] == False
assert data['condition'] == "out_of_stock"
print(f"Condition: {data['condition']}, is_available: {data['is_available']} (Expected out_of_stock, False)")

# TEST 8: Re-stock from 0 -> Product becomes In Stock
print("\n--- Test 8: Re-stock (M: 5) -> In Stock ---")
update_payload = {
    "stock_data": [
        {"size": "Small", "qty": 0},
        {"size": "M", "qty": 5},
        {"size": "L", "qty": 0},
        {"size": "XL", "qty": 0}
    ]
}
res = client.put(f'/api/items/{product_id}/update/', data=json.dumps(update_payload), content_type='application/json')
assert res.status_code == 200
data = res.json()
assert data['total_stock'] == 5
assert data['available_stock'] == 5
assert data['is_available'] == True
assert data['condition'] == "ready"
print("Restocked product derived is_available=True, condition='ready'!")

# TEST 9: Empty/null size defaults to 'Free Size'
print("\n--- Test 9: Empty/null size handling ---")
update_payload = {
    "stock_data": [
        {"size": "", "qty": 4}
    ]
}
res = client.put(f'/api/items/{product_id}/update/', data=json.dumps(update_payload), content_type='application/json')
assert res.status_code == 200
data = res.json()
assert data['total_stock'] == 4
free_size = next(v for v in data['stock_data'] if v["size"] == "Free Size")
assert free_size["qty"] == 4
print("Empty size defaulted to 'Free Size' successfully!")

# TEST 10: Clean up test product
print("\n--- Test 10: Delete Product ---")
del_res = client.delete(f'/api/items/{product_id}/delete/')
assert del_res.status_code == 200
assert not Product.objects.filter(id=product_id).exists()
assert not PhysicalUnit.objects.filter(product_id=product_id).exists()
print("Product and units deleted successfully!")

print("\n========================================")
print("ALL TESTS PASSED SUCCESSFULLY! 100% OK")
print("========================================")
