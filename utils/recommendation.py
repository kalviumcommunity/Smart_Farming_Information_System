from utils.helpers import calculate_score, safe_mode
from utils.analysis import get_growth_trend


def recommend_crops(df, market_df, temp, rain, soil, place):

    if place:
        filtered = df[df["state"].str.contains(place)]
    else:
        filtered = df.copy()

    filtered = filtered[
        filtered["soil"].str.contains(soil.split()[0])
    ]

    if filtered.empty:
        filtered = df.copy()

    results = []

    for crop in filtered["crop"].unique():

        crop_data = filtered[filtered["crop"] == crop]

        avg_temp = crop_data["temperature"].mean()
        avg_rain = crop_data["rainfall"].mean()
        demand = safe_mode(crop_data["demand"])

        market_rows = market_df[
            (market_df["crop"] == crop) &
            (market_df["state"].str.contains(place) if place else True)
        ]

        if not market_rows.empty:
            market_price = market_rows["avg_market_price"].mean()
            market_demand = safe_mode(market_rows["avg_demand"])
        else:
            market_price = 0
            market_demand = "Medium"

        # 🔥 SMART SCORE
        score = calculate_score(avg_temp, avg_rain, temp, rain)

        # bonuses
        if soil in crop_data["soil"].iloc[0]:
            score += 5

        if demand == "High":
            score += 5
        elif demand == "Medium":
            score += 3

        if market_demand == "High":
            score += 5
        elif market_demand == "Medium":
            score += 3

        # 🔥 REAL ANALYTICS ADD
        price_trend = get_growth_trend(crop_data["price"].tolist())

        results.append({
            "crop": crop,
            "score": round(score, 2),
            "trend": price_trend,
            "reason": f"Temp≈{round(avg_temp,1)}°C, Rain≈{round(avg_rain)}mm, Demand={demand}, Market={market_demand}",
            "market_price": market_price
        })

    return sorted(results, key=lambda x: x["score"], reverse=True)