// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
    setupTheme();

    const locationBtn = document.getElementById("locationBtn");
    const enterBtn = document.getElementById("enterBtn");

    if (locationBtn) {
        locationBtn.addEventListener("click", getLocation);
    }

    if (enterBtn) {
        enterBtn.addEventListener("click", () => {
            const place = document.getElementById("placeInput").value.trim();

            if (!place) {
                alert("Enter place or use location");
                return;
            }

            fetchWeatherByPlace(place);
        });
    }
});


// ================= THEME =================
function setupTheme() {
    const toggleBtn = document.getElementById("themeToggle");

    if (!toggleBtn) return;

    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
        toggleBtn.innerText = "🌞";
    }

    toggleBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");

        if (document.body.classList.contains("dark-mode")) {
            localStorage.setItem("theme", "dark");
            toggleBtn.innerText = "🌞";
        } else {
            localStorage.setItem("theme", "light");
            toggleBtn.innerText = "🌙";
        }
    });
}


// ================= LOCATION =================
function getLocation() {
    if (!navigator.geolocation) {
        alert("Geolocation not supported");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (pos) => {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;
            fetchWeather(lat, lon);
        },
        () => {
            alert("Location permission denied");
        }
    );
}


// ================= WEATHER (GPS) =================
async function fetchWeather(lat, lon) {
    try {
        const apiKey = "c4b0e7d7413621aadfc1c650255af7d4";

        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        );

        const data = await res.json();

        if (!data.main) {
            alert("Weather data not available");
            return;
        }

        const temp = data.main.temp;
        const rain = data.rain ? data.rain["1h"] || 50 : 50;

        const inputPlace = document.getElementById("placeInput").value.trim();
        const place = inputPlace ? inputPlace : data.name;

        document.getElementById("weatherInfo").innerText =
            `📍 ${place} | 🌡️ ${temp}°C | 🌧️ ${rain} mm`;

        const soil = document.getElementById("soil").value;

        sendToBackend(temp, rain, soil, place);

    } catch (err) {
        console.error(err);
        alert("Failed to fetch weather data");
    }
}


// ================= WEATHER (MANUAL) =================
async function fetchWeatherByPlace(place) {
    try {
        const apiKey = "c4b0e7d7413621aadfc1c650255af7d4";

        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(place)}&appid=${apiKey}&units=metric`
        );

        const data = await res.json();

        if (!data.main) {
            alert("Weather not found for this place");
            return;
        }

        const temp = data.main.temp;
        const rain = data.rain ? data.rain["1h"] || 50 : 50;

        document.getElementById("weatherInfo").innerText =
            `📍 ${data.name} | 🌡️ ${temp}°C | 🌧️ ${rain} mm`;

        const soil = document.getElementById("soil").value;

        sendToBackend(temp, rain, soil, data.name);

    } catch (err) {
        console.error(err);
        alert("Failed to fetch weather data");
    }
}


// ================= BACKEND =================
async function sendToBackend(temp, rain, soil, place) {
    try {
        const res = await fetch("/analyze", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ temp, rain, soil, place })
        });

        const data = await res.json();
        showResult(data);

    } catch (err) {
        console.error(err);
    }
}


// ================= RESULT =================
function showResult(data) {
    const resultEl = document.getElementById("result");

    if (!data.recommendation || data.recommendation.length === 0) {
        resultEl.innerText = "No suitable crop found";
        clearCharts();
        return;
    }

    resultEl.innerText =
        "Recommended: " + data.recommendation[0].crop;

    const t = data.trends;

    renderChart("rainChart", "Rainfall", t.years, t.rainfall);
    renderChart("tempChart", "Temperature", t.years, t.temperature);
    renderChart("priceChart", "Price", t.years, t.price);
}


// ================= CHART =================
let charts = {};

function renderChart(id, label, labels, data) {
    const ctx = document.getElementById(id);
    if (!ctx) return;

    if (charts[id]) charts[id].destroy();

    charts[id] = new Chart(ctx, {
        type: "line",
        data: {
            labels,
            datasets: [{
                label,
                data,
                borderWidth: 2,
                tension: 0.3
            }]
        }
    });
}


// ================= CLEAR =================
function clearCharts() {
    Object.values(charts).forEach(c => c.destroy());
    charts = {};
}