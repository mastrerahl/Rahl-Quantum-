// plugins/weather.js — 🌤️ Royal Weather Oracle
const axios = require("axios");

module.exports = async function weatherPlugin(client, message) {
  const input = message.body.trim().split(/ +/);
  const city = input.slice(1).join(" ");

  if (!city) {
    return client.sendText(
      message.from,
      "☁️ *Royal Weather Oracle*\n\nPlease provide a city name:\n`.weather Nairobi`"
    );
  }

  try {
    const apiKey = "7e35cc1e1df6f54749dbd6b13cbf8c2f"; // You can use your own key from OpenWeather
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    const res = await axios.get(url);
    const data = res.data;

    const report = `
🌍 *Weather in ${data.name}, ${data.sys.country}*
🌡️ Temp: ${data.main.temp}°C
💧 Humidity: ${data.main.humidity}%
🌬️ Wind: ${data.wind.speed} m/s
☁️ Sky: ${data.weather[0].description}

🔮 *Blessings from the Royal Skywatcher*  
— Powered by Rahl Intelligence 👑
    `;

    await client.sendText(message.from, report);
  } catch (err) {
    console.error("❌ Weather Error:", err.message);
    client.sendText(
      message.from,
      "⚠️ Unable to fetch royal weather. Perhaps the skies are silent. Try a valid city name."
    );
  }
};
