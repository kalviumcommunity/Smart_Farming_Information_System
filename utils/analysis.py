def get_trends(filtered_df, crop_name):
    crop_data = filtered_df[filtered_df["crop"] == crop_name]

    return {
        "years": crop_data["year"].tolist(),
        "rainfall": crop_data["rainfall"].tolist(),
        "temperature": crop_data["temperature"].tolist(),
        "price": crop_data["price"].tolist()
    }


def get_growth_trend(prices):
    if len(prices) < 2:
        return "Stable"

    if prices[-1] > prices[0]:
        return "Increasing 📈"
    elif prices[-1] < prices[0]:
        return "Decreasing 📉"
    else:
        return "Stable ➖"