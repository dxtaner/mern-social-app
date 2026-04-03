📱 Social Media App - Architecture
==================================

This application implements a robust **routing and authentication system** using React and React Router v6. It ensures a secure user experience by managing access levels based on the user's authentication state.

* * *

🚀 Key Features
---------------

*   **Dynamic Navigation:** Seamless page transitions using `react-router-dom`.
*   **Global Auth State:** Centralized user management via `Context API`.
*   **Route Protection:** Preventing unauthorized access to sensitive pages.
*   **Smart Redirects:** Automatically sending logged-in users away from Login/Register pages.

🛠️ Tech Stack
--------------

Technology

Purpose

React.js

Frontend UI Library

React Router v6

Client-side Routing

Context API

State Management

📂 Route Definition & Permissions
---------------------------------

Path

Component

Access Type

`/`

Home

🔒 Private

`/profile/:id`

Profile

🔒 Private

`/post/:id`

PostDetails

🔒 Private

`/login`

Login

🔓 Public

`/register`

Register

🔓 Public

🛡️ Guard Logic
---------------

### 1\. PrivateRoute

Restricts access to authenticated users only. Unauthenticated visitors are redirected to `/login`.

### 2\. PublicRoute

Reserved for guests. If an authenticated user tries to access these, they are redirected to the `Home` page.

💻 How to Run
-------------

\# Install dependencies
npm install react-router-dom

# Start the development server
npm start
