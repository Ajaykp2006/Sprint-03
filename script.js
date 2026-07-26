const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const errorMsg = document.getElementById("error-msg");
const loadingSpinner = document.getElementById("loading-spinner");
const profileContent = document.querySelector(".profile-content");

const avatarImg = document.getElementById("profile-avatar");
const profileName = document.getElementById("profile-name");
const profileUsername = document.getElementById("profile-username");
const profileJoined = document.getElementById("profile-joined");
const profileBio = document.getElementById("profile-bio");
const reposList = document.getElementById("repos-list");

// Add your GitHub Personal Access Token here if you hit the 60 requests/hr rate limit
const GITHUB_TOKEN = ""; 

function getHeaders() {
    const headers = {};
    if (GITHUB_TOKEN) {
        headers["Authorization"] = `token ${GITHUB_TOKEN}`;
    }
    return headers;
}

// Event Listeners for Search
searchBtn.addEventListener("click", handleUserSearch);
searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleUserSearch();
});

async function handleUserSearch() {
    const username = searchInput.value.trim();
    if (!username) return;

    // Reset UI & Activate Loading State
    errorMsg.classList.add("hidden");
    loadingSpinner.classList.remove("hidden");
    profileContent.style.opacity = "0.3";

    try {
        // Execute Fetch Request
        const userResponse = await fetch(`https://api.github.com/users/${username}`, {
            headers: getHeaders()
        });

        if (!userResponse.ok) {
            throw new Error("User Not Found");
        }

        const userData = await userResponse.json();

        // Render Base Profile Data
        updateProfileUI(userData);

        // Execute Endpoint Chaining for Repositories
        if (userData.repos_url) {
            await fetchRepositories(userData.repos_url);
        }

    } catch (error) {
        console.error("Error fetching GitHub data:", error);
        showErrorUI();
    } finally {
        // Remove Loading State
        loadingSpinner.classList.add("hidden");
        profileContent.style.opacity = "1";
    }
}

function updateProfileUI(data) {
    // Populate Image and Name
    avatarImg.src = data.avatar_url || "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png";
    profileName.textContent = data.name || data.login;
    
    // Populate Username Link
    profileUsername.textContent = `@${data.login}`;
    profileUsername.href = data.html_url; 
    
    // Populate Bio
    profileBio.textContent = data.bio || "This profile has no bio specified.";
    
    // Format and Populate Date
    profileJoined.textContent = `Joined ${formatDate(data.created_at)}`;
}

async function fetchRepositories(reposUrl) {
    try {
        const repoResponse = await fetch(`${reposUrl}?sort=updated&per_page=5`, {
            headers: getHeaders()
        });
        
        if (!repoResponse.ok) throw new Error("Could not fetch repositories");
        
        const repos = await repoResponse.json();
        renderRepositories(repos);
    } catch (err) {
        reposList.innerHTML = `<li class="text-muted">Failed to load repositories.</li>`;
    }
}

function renderRepositories(repos) {
    reposList.innerHTML = "";
    
    if (!repos || repos.length === 0) {
        reposList.innerHTML = `<li class="text-muted">No public repositories available.</li>`;
        return;
    }

    repos.forEach(repo => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = repo.html_url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.textContent = repo.name;
        
        li.appendChild(a);
        reposList.appendChild(li);
    });
}

function formatDate(isoString) {
    if (!isoString) return "";
    const date = new Date(isoString);
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options);
}

function showErrorUI() {
    errorMsg.classList.remove("hidden");
    profileName.textContent = "Not Found";
    profileUsername.textContent = "@unknown";
    profileUsername.href = "#";
    profileBio.textContent = "The requested user account could not be located on GitHub. Verify spelling and try again.";
    avatarImg.src = "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png";
    reposList.innerHTML = `<li class="text-muted">No repositories to display.</li>`;
}

// --- Dark Mode Logic ---
const modeBtn = document.getElementById("mode-btn");
const modeText = modeBtn.querySelector("span");
const modeIcon = document.getElementById("mode-icon");

modeBtn.addEventListener("click", () => {
    // Toggle the dark-mode class on the body
    document.body.classList.toggle("dark-mode");
    
    // Update the UI text and icon based on the current state
    if (document.body.classList.contains("dark-mode")) {
        modeText.textContent = "LIGHT";
        modeIcon.textContent = "☀️";
    } else {
        modeText.textContent = "DARK";
        modeIcon.textContent = "🌙";
    }
});