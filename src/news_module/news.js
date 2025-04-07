// Three possible topics: Programming, Technology, Weather
async function fetchNews(topic) {
  try {
    const response = await fetch(`/.netlify/functions/news-api?topic=${topic}`);

    // Check if the response is successful
    if (!response.ok) {
      throw new Error("Failed to fetch news");
    }

    // Parse the JSON response
    const data = await response.json();

    displayNews(data); //Display the news on the page
  } catch (error) {
    console.error("Error:", error);
    alert("Something went wrong while fetching the news.");
  }
}


function displayNews(data) {
    const newsContainer = document.getElementById("newsContainer");

    newsContainer.innerHTML = '';

    // Display Articles from Data
    data.articles.forEach((article) => {
        const articleElement = document.createElement('div');
        articleElement.classList.add('article');
        
        const title = document.createElement('a');
        title.href = article.url; 
        title.target = "_blank";  //Opens the link in a new tab
        title.textContent = article.title;  

        const br = document.createElement("br");


        // TODO: FORMAT DATE
        const date = document.createElement('span')
        date.textContent = "Published on: " + article.publishedAt
        
        const description = document.createElement('p');
        description.textContent = article.description;
        
        articleElement.appendChild(title);
        articleElement.appendChild(br); //Remove if title becomes header again
        articleElement.appendChild(date);
        articleElement.appendChild(description);
        
        newsContainer.appendChild(articleElement);
    });
}