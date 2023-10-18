document.addEventListener("DOMContentLoaded", () => {
    const githubForm = document.getElementById("github-form");
    const searchInput = document.getElementById("search");
    const userList = document.getElementById("user-list");
    const repoList = document.getElementById("repos-list");
    githubForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = searchInput.value;
  
      if (username) {
        const users = await searchGitHubUsers(username);
        displayUsers(users);
      }
    });
  
    userList.addEventListener("click", async (e) => {
      if (e.target.tagName === "A") {
        const username = e.target.dataset.username;
        const repositories = await getUserRepositories(username);
        displayRepositories(repositories);
      }
    });
  
async function searchGitHubUsers(username) {
    try {
      const response = await fetch(`https://api.github.com/users/${username}`);
      if (response.ok) {
        const user = await response.json();
        if (Array.isArray(user)) {
          return user; 
        } else if (user.login) {
          return [user];
        }
      }
      console.error("Error fetching user data");
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
    return []; 
  }
  
  
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
  
    async function getUserRepositories(username) {
      const response = await fetch(`https://api.github.com/users/${username}/repos`);
      if (response.ok) {
        return await response.json();
      } else {
        console.error("Error fetching repositories");
        return [];
      }
    }
  
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
  