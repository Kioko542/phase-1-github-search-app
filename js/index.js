document.addEventListener("DOMContentLoaded", () => {
    // Get references to HTML elements
    const githubForm = document.getElementById("github-form");
    const searchInput = document.getElementById("search");
    const userList = document.getElementById("user-list");
    const repoList = document.getElementById("repos-list");
  
    // Add an event listener to the form for user search
    githubForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = searchInput.value;
  
      if (username) {
        // Search for GitHub users by username
        const users = await searchGitHubUsers(username);
        displayUsers(users);
      }
    });
  
    // Add an event listener to the list of users for displaying their repositories
    userList.addEventListener("click", async (e) => {
      if (e.target.tagName === "A") {
        const username = e.target.dataset.username;
        // Get repositories for the selected user
        const repositories = await getUserRepositories(username);
        displayRepositories(repositories);
      }
    });
  
    // Function to search for GitHub users
    // Function to search for GitHub users
async function searchGitHubUsers(username) {
    try {
      const response = await fetch(`https://api.github.com/users/${username}`);
      if (response.ok) {
        const user = await response.json();
        if (Array.isArray(user)) {
          return user; // It's an array, return as is
        } else if (user.login) {
          // It's an object, wrap it in an array
          return [user];
        }
      }
      console.error("Error fetching user data");
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
    return []; // Return an empty array in case of an error
  }
  
  
    // Function to display the list of GitHub users
    function displayUsers(users) {
      userList.innerHTML = "";
      for (const user of users) {
        const userElement = document.createElement("li");
        userElement.innerHTML = `
          <a href="#" data-username="${user.login}">
            <img src="${user.avatar_url}" alt="${user.login}" />
            ${user.login}
          </a>
        `;
        userList.appendChild(userElement);
      }
    }
  
    // Function to get repositories for a GitHub user
    async function getUserRepositories(username) {
      const response = await fetch(`https://api.github.com/users/${username}/repos`);
      if (response.ok) {
        return await response.json();
      } else {
        console.error("Error fetching repositories");
        return [];
      }
    }
  
    // Function to display a list of repositories for a user
    function displayRepositories(repositories) {
      repoList.innerHTML = "";
      for (const repo of repositories) {
        const repoElement = document.createElement("li");
        repoElement.innerHTML = `
          <strong>${repo.name}</strong>
          <p>${repo.description || "No description"}</p>
          <p>URL: <a href="${repo.html_url}" target="_blank">${repo.html_url}</a></p>
        `;
        repoList.appendChild(repoElement);
      }
    }
  });
  