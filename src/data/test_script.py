# src/data/test_script.py

# Sample crop price data
crop = "Wheat"
prices = [2000, 2100, 2200, 2150]

# Calculate average price
avg_price = sum(prices) / len(prices)

# Find max and min
max_price = max(prices)
min_price = min(prices)

# Print results
print("Crop:", crop)
print("Average Price:", avg_price)
print("Max Price:", max_price)
print("Min Price:", min_price)