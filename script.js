// --- Standard UI Elements ---
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
const profilePortfolio = document.getElementById("profile-portfolio");
const reposList = document.getElementById("repos-list");

// --- Battle Mode UI Elements ---
const battleToggleBtn = document.getElementById("battle-toggle-btn");
const standardSearchContainer = document.getElementById(
  "standard-search-container",
);
const battleSearchContainer = document.getElementById(
  "battle-search-container",
);
const standardProfileCard = document.getElementById("standard-profile-card");
const battleResultsContainer = document.getElementById(
  "battle-results-container",
);
const battleBtn = document.getElementById("battle-btn");
const battleInput1 = document.getElementById("battle-input-1");
const battleInput2 = document.getElementById("battle-input-2");
const battleLoadingSpinner = document.getElementById("battle-loading-spinner");
const battleGrid = document.getElementById("battle-grid");

// Add your GitHub Personal Access Token here to prevent 403 Rate Limits
const GITHUB_TOKEN = "";
let isBattleMode = false;

function getHeaders() {
  const headers = {};
  if (GITHUB_TOKEN) headers["Authorization"] = `token ${GITHUB_TOKEN}`;
  return headers;
}

// --- Toggle Battle Mode State ---
battleToggleBtn.addEventListener("click", () => {
  isBattleMode = !isBattleMode;
  if (isBattleMode) {
    battleToggleBtn.textContent = "🔍 STANDARD MODE";
    standardSearchContainer.classList.add("hidden");
    standardProfileCard.classList.add("hidden");
    battleSearchContainer.classList.remove("hidden");
    battleResultsContainer.classList.remove("hidden");
  } else {
    battleToggleBtn.textContent = "⚔️ BATTLE MODE";
    battleSearchContainer.classList.add("hidden");
    battleResultsContainer.classList.add("hidden");
    standardSearchContainer.classList.remove("hidden");
    standardProfileCard.classList.remove("hidden");
  }
});

// --- Phase 1 & 2: Standard Search ---
searchBtn.addEventListener("click", handleUserSearch);
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleUserSearch();
});

async function handleUserSearch() {
  const username = searchInput.value.trim();
  if (!username) return;

  errorMsg.classList.add("hidden");
  loadingSpinner.classList.remove("hidden");
  profileContent.style.opacity = "0.3";

  try {
    const userResponse = await fetch(
      `https://api.github.com/users/${username}`,
      { headers: getHeaders() },
    );
    if (!userResponse.ok) throw new Error("User Not Found");

    const userData = await userResponse.json();
    updateProfileUI(userData);

    if (userData.repos_url) {
      await fetchRepositories(userData.repos_url);
    }
  } catch (error) {
    showErrorUI();
  } finally {
    loadingSpinner.classList.add("hidden");
    profileContent.style.opacity = "1";
  }
}

function updateProfileUI(data) {
  avatarImg.src =
    data.avatar_url ||
    "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png";
  profileName.textContent = data.name || data.login;
  profileUsername.textContent = `@${data.login}`;
  profileUsername.href = data.html_url;
  profileBio.textContent = data.bio || "This profile has no bio specified.";
  profileJoined.textContent = `Joined ${formatDate(data.created_at)}`;

  // Phase 1 Fix: Portfolio URL Integration
  if (data.blog) {
    let blogUrl = data.blog.startsWith("http")
      ? data.blog
      : `https://${data.blog}`;
    profilePortfolio.textContent = data.blog;
    profilePortfolio.href = blogUrl;
    profilePortfolio.classList.remove("text-muted");
  } else {
    profilePortfolio.textContent = "Not Available";
    profilePortfolio.removeAttribute("href");
    profilePortfolio.classList.add("text-muted");
  }
}

async function fetchRepositories(reposUrl) {
  try {
    const repoResponse = await fetch(`${reposUrl}?sort=updated&per_page=5`, {
      headers: getHeaders(),
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
  repos.forEach((repo) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = repo.html_url;
    a.target = "_blank";
    a.textContent = repo.name;
    li.appendChild(a);
    reposList.appendChild(li);
  });
}

// --- Phase 3: Battle Mode Logic ---
battleBtn.addEventListener("click", handleBattleSearch);

async function handleBattleSearch() {
  const user1 = battleInput1.value.trim();
  const user2 = battleInput2.value.trim();
  if (!user1 || !user2) return;

  battleGrid.classList.add("hidden");
  battleLoadingSpinner.classList.remove("hidden");

  try {
    // Execute simultaneous asynchronous requests
    const [res1, res2] = await Promise.all([
      fetch(`https://api.github.com/users/${user1}`, { headers: getHeaders() }),
      fetch(`https://api.github.com/users/${user2}`, { headers: getHeaders() }),
    ]);

    if (!res1.ok || !res2.ok) throw new Error("One or both users not found");

    const [data1, data2] = await Promise.all([res1.json(), res2.json()]);

    // Calculate stars concurrently
    const [stars1, stars2] = await Promise.all([
      calculateTotalStars(data1.repos_url),
      calculateTotalStars(data2.repos_url),
    ]);

    renderBattleUI(data1, stars1, data2, stars2);
  } catch (error) {
    alert("Error during battle: " + error.message);
  } finally {
    battleLoadingSpinner.classList.add("hidden");
    battleGrid.classList.remove("hidden");
  }
}

async function calculateTotalStars(reposUrl) {
  try {
    // Fetching up to 100 repositories to get a better star count for the calculation
    const response = await fetch(`${reposUrl}?per_page=100`, {
      headers: getHeaders(),
    });
    if (!response.ok) return 0;
    const repos = await response.json();

    // Phase 3 Requirement: Reduce/Calculate stargazers_count
    return repos.reduce((accumulator, currentRepo) => {
      return accumulator + currentRepo.stargazers_count;
    }, 0);
  } catch (error) {
    return 0;
  }
}

function renderBattleUI(p1Data, p1Stars, p2Data, p2Stars) {
  const p1Card = document.getElementById("player1-card");
  const p2Card = document.getElementById("player2-card");

  // Reset conditional styling
  p1Card.classList.remove("winner", "loser");
  p2Card.classList.remove("winner", "loser");

  // Populate Data
  document.getElementById("p1-avatar").src = p1Data.avatar_url;
  document.getElementById("p1-name").textContent = p1Data.login;
  document.getElementById("p1-stars").textContent = p1Stars;

  document.getElementById("p2-avatar").src = p2Data.avatar_url;
  document.getElementById("p2-name").textContent = p2Data.login;
  document.getElementById("p2-stars").textContent = p2Stars;

  // Evaluate Winner logic and apply conditional classes
  if (p1Stars > p2Stars) {
    p1Card.classList.add("winner");
    document.getElementById("p1-status").textContent = "Winner";
    p2Card.classList.add("loser");
    document.getElementById("p2-status").textContent = "Loser";
  } else if (p2Stars > p1Stars) {
    p2Card.classList.add("winner");
    document.getElementById("p2-status").textContent = "Winner";
    p1Card.classList.add("loser");
    document.getElementById("p1-status").textContent = "Loser";
  } else {
    document.getElementById("p1-status").textContent = "Tie";
    document.getElementById("p2-status").textContent = "Tie";
  }
}

// --- Utility Functions ---
function formatDate(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  const options = { day: "numeric", month: "short", year: "numeric" };
  return date.toLocaleDateString("en-GB", options);
}

function showErrorUI() {
  errorMsg.classList.remove("hidden");
  profileName.textContent = "Not Found";
  profileUsername.textContent = "@unknown";
  profileUsername.href = "#";
  profileBio.textContent =
    "The requested user account could not be located on GitHub. Verify spelling and try again.";
  avatarImg.src =
    "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png";
  profilePortfolio.textContent = "Not Available";
  profilePortfolio.removeAttribute("href");
  reposList.innerHTML = `<li class="text-muted">No repositories to display.</li>`;
}

// --- Dark Mode Logic ---
const modeBtn = document.getElementById("mode-btn");
const modeText = modeBtn.querySelector("span");
const modeIcon = document.getElementById("mode-icon");

modeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  if (document.body.classList.contains("dark-mode")) {
    modeText.textContent = "LIGHT";
    modeIcon.textContent = "☀️";
  } else {
    modeText.textContent = "DARK";
    modeIcon.textContent = "🌙";
  }
});
