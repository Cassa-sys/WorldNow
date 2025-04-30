// Three possible topics: Programming, Technology, Weather
async function fetchNews(topic) {
  try {
    // See if the topic has been cached before
    const cachedNews = localStorage.getItem(topic);
    let response;
    if (cachedNews) {
      console.log("Using cached data for topic:", topic);
      // Check if the cached data is still valid (not expired)
      const expirationTime = localStorage.getItem(`${topic}_expiration`);
      if (Date.now() > expirationTime) {
        // If expired, remove the cached data
        localStorage.removeItem(topic);
        localStorage.removeItem(`${topic}_expiration`);
      } else {
        // If cached, parse the cached data and display it
        const data = JSON.parse(cachedNews);
        data.articles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
        displayNews(data);
        return; // Exit the function to avoid fetching again
      }
    }

    response = await fetch(`/.netlify/functions/news-api?topic=${topic}`);


    // Check if the response is successful
    if (!response.ok) {
      throw new Error("Failed to fetch news");
    }

    // Parse the JSON response
    const data = await response.json();
    // Cache the news data in local storage for 1 hour (3600000 ms)
    localStorage.setItem(topic, JSON.stringify(data));
    // Set an expiration time for the cached data
    const expirationTime = Date.now() + 3600000; // 1 hour from now
    localStorage.setItem(`${topic}_expiration`, expirationTime);

    // Sort the articles by publishedAt date in descending order
    data.articles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    displayNews(data); //Display the news on the page
  } catch (error) {
    console.error("Error:", error);
    alert("Something went wrong while fetching the news.");
  }
}


function displayNews(data) {
    const newsContainer = document.getElementById("newsContainer");

    // Clear all child elements except the top row
    Array.from(newsContainer.children).forEach((child) => {
      if (child.id !== "topNewsContainer" && child.tagName !== "HR") {
          newsContainer.removeChild(child);
      }
    });
    

    // Display Articles from Data
    data.articles.forEach((article) => {
        const articleElement = document.createElement('div');
        articleElement.classList.add('article');
        
        const title = document.createElement('a');
        title.href = article.url; 
        title.target = "_blank";  //Opens the link in a new tab
        title.textContent = article.title;  

        const br = document.createElement("br");


        const date = document.createElement('span')
        const formattedDate = new Date(article.publishedAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric"
        });
        date.textContent = "Published on: " + formattedDate;
        
        const description = document.createElement('p');
        description.textContent = article.description;

        const author = document.createElement('span');
        author.textContent = "Author: " + article.author;
        author.classList.add('author'); // Add a class for styling
        
        const source = document.createElement('p');
        source.textContent = "Source: " + article.source.name;

        articleElement.appendChild(title);
        articleElement.appendChild(br); //Remove if title becomes header again
        articleElement.appendChild(source);
        if (article.author !== null) {
            articleElement.appendChild(author);
        }
        articleElement.appendChild(date);
        
        newsContainer.appendChild(articleElement);
    });
}