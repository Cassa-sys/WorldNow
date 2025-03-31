// netlify/functions/news-api.js
const fetch = require("node-fetch");

exports.handler = async (event, context) => {
  const apiKey = process.env.NEWS_API_KEY; // Get our API key from environment variables
  const { topic } = event.queryStringParameters; // Get parameters from the frontend request

  if (!topic) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Please provide a topic parameter." }),
    };
  }

  //Need our dates in the format YYYY-MM-DD
  let startDate = new Date();
  startDate.setDate(startDate.getDate() - 7); // 7 days ago
  const formattedStartDate = startDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  let endDate = new Date.now();
  const formattedEndDate = endDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  const url = `https://newsapi.org/v2/everything?qInTitle=${topic}&from=${formattedStartDate}&to=${formattedEndDate}&sortBy=popularity&apiKey=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("Error fetching news:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch news." }),
    };
  }
};
