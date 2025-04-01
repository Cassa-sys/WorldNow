const fetch = require("node-fetch");

exports.handler = async function(event) {
    const API_KEY = process.env.WEATHER_API_KEY; // Uses Netlify environment variable
    const city = event.queryStringParameters.city;

    if (!city) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "City is required" })
        };
    }

    const url = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&aqi=no`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Error fetching weather data" })
        };
    }
};
