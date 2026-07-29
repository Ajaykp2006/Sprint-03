# Dev-Detective | GitHub Search Client

Welcome to the **Dev-Detective** project! This is a client-side application built as part of the Sprint 03 engineering pipeline at Prodesk IT. It interfaces with the official GitHub REST API to fetch remote data via HTTP requests and renders it asynchronously to the DOM.

## 🚀 Live Demo & Preview

* **Live Demo:** (https://sprint-03-psi.vercel.app/)
* **Demo Video:** (https://drive.google.com/file/d/1LehWGVTLwBqW6V-70smlShBAehWkiH_U/view?usp=sharing)

### Screenshots

<img width="1917" height="1087" alt="Screenshot 2026-07-30 022319" src="https://github.com/user-attachments/assets/997a2440-b103-4646-84c0-de25aef52c3c" />


## 🎯 Project Objectives

*   **Frontend Foundation:** Build a responsive profile card component using HTML and CSS.
*   **Asynchronous JavaScript:** Utilize `fetch()`, Promises, and `async/await` to handle API requests.
*   **Data Parsing:** Parse JSON responses and dynamically update the DOM.
*   **State Management:** Implement proper loading indicators and fallback UI for unhandled API responses (e.g., 404 User Not Found).
*   **Endpoint Chaining:** Execute subsequent API calls based on initial data (fetching user repositories).

## 🛠️ Tech Stack

*   **HTML5:** Semantic structure.
*   **CSS3:** Custom styling, CSS variables for theme toggling, Flexbox layout.
*   **JavaScript (ES6+):** Async logic, DOM manipulation, Event handling.
*   **API:** [GitHub REST API](https://docs.github.com/en/rest)

## 📋 Features Implemented

*   **User Search:** Fetches and displays GitHub profile details (Avatar, Name, Username, Join Date, Bio).
*   **Repository Chaining:** Automatically fetches and displays the user's top 5 most recently updated public repositories as clickable links.
*   **Error Handling:** Robust 404 error catching that prevents the application from crashing and displays a friendly "User Not Found" UI.
*   **Loading State:** A visual spinner indicates active network requests.
*   **Dark Mode Toggle:** A seamless theme switcher utilizing CSS variables and JavaScript class toggling.
*   **Data Formatting:** Parses ISO timestamp strings into human-readable dates (e.g., "Joined 25 Jan 2011").

## 💻 Local Setup & Execution

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/Dev-Detective.git
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd Dev-Detective
    ```
3.  **Run the application:**
    *   Open `index.html` directly in your browser.
    *   *Recommended:* Use a local server like the **Live Server** extension in VS Code to avoid minor CORS issues.

**Note on API Rate Limits:**
GitHub restricts unauthenticated API requests to 60 per hour. If you experience `403 Forbidden` errors, you have hit the limit. You can bypass this by generating a Personal Access Token (PAT) on GitHub and adding it to the `GITHUB_TOKEN` variable in `script.js`.

## 🧑‍💻 Author

**Ajay** 
*Associate Software Engineer | Prodesk IT*# Sprint-03
