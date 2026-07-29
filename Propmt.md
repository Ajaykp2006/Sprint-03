# Dev-Detective: AI Pair-Programming Prompts

This document outlines the prompts I used to understand the core asynchronous engineering concepts, debug logic, and implement the JavaScript features for the Dev-Detective sprint.

## Phase 1: Base MVP & Asynchronous Logic
**Prompt:** 
> "Explain how the native JavaScript `fetch()` API works with `async/await`. How do I make a GET request to the GitHub API, parse the JSON response, and properly handle a 404 'User Not Found' error so my application doesn't crash?"

**Concept Applied:** 
Using this explanation, I implemented the `try...catch...finally` block. I learned to check `!response.ok` to throw an error for 404s, and I used the `finally` block to guarantee that the loading spinner hides regardless of whether the promise resolves or rejects.

## Phase 2: Endpoint Chaining & Data Mutability
**Prompt:** 
> "I successfully fetched a GitHub user's profile, which contains a `repos_url`. How do I chain a second asynchronous fetch request to get their top 5 updated repositories? Also, how can I parse an ISO timestamp (like '2023-01-25T12:00:00Z') into a '25 Jan 2023' string format?"

**Concept Applied:** 
I learned how to write a secondary async function (`fetchRepositories`) triggered after the initial user fetch. I also utilized the JavaScript `Date` object and `toLocaleDateString('en-GB')` to mutate the API's timestamp into a clean, human-readable format.

## Phase 3: Concurrent Execution & Array Reduction
**Prompt:** 
> "I need to build a 'Battle Mode' that queries two GitHub usernames simultaneously. How does `Promise.all()` work for concurrent fetches? Once I have their repository arrays, how do I use the `.reduce()` method to calculate the total sum of their `stargazers_count`?"

**Concept Applied:** 
I learned that using `Promise.all()` prevents network blocking by allowing both HTTP requests to fire at the same time. I also learned how to set up an accumulator inside `.reduce()` to iterate through an array of objects and sum up a specific integer key.

## General UI & DOM State Management
**Prompt:** 
> "How do I build a UI toggle in vanilla JavaScript to switch between 'Standard Search' and 'Battle Mode'? I need to hide certain inputs and results containers based on a button click."

**Concept Applied:** 
I applied standard DOM manipulation, utilizing a boolean toggle state (`isBattleMode`) and `element.classList.add('hidden')` / `remove('hidden')` to dynamically swap out the user interface views without refreshing the page.
