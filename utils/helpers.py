def safe_mode(series):
    if not series.empty:
        return series.mode()[0]
    return "Medium"


def calculate_score(avg_temp, avg_rain, temp, rain):
    score = 0

    score += max(0, 10 - abs(avg_temp - temp))
    score += max(0, 10 - abs(avg_rain - rain) / 20)

    return score