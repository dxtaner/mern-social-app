🚀 Social App API (MERN Backend)
================================

Node.js Express.js MongoDB JWT REST API

This project is a robust **RESTful API** developed using the **Node.js, Express, and MongoDB** ecosystem, providing all the essential features required for a modern social media application.

📌 Key Features
---------------

*   **🔐 Secure Authentication:** JWT and `httpOnly` cookie-based authorization system.
*   **👤 User Management:** Profile viewing, updating, and account deletion.
*   **📝 Feed & Posts:** Create, list, and manage social media posts.
*   **💬 Engagement:** Integrated comment system for posts.
*   **🔔 Notifications:** Real-time tracking for user interactions.
*   **🖼️ Static File Serving:** Server-side support for profile and post images.

🛠️ Technology Stack
--------------------

Technology

Description

**Node.js**

JavaScript Runtime Environment

**MongoDB**

NoSQL Database (Mongoose ODM)

**Bcrypt**

Password Hashing & Security

**JWT**

Secure Token Management

📂 Project Structure
--------------------

    ├── config/         # Database connection settings
    ├── routes/         # API endpoints (auth, users, posts...)
    ├── public/         # Static files (images)
    ├── .env            # Environment variables
    ├── server.js       # Application entry point
    └── package.json    # Dependencies and scripts

⚙️ Installation & Setup
-----------------------

### 1\. Install Dependencies

    npm install

### 2\. Run the Application

For development mode (with nodemon):

    npm run dev

📡 API Endpoints
----------------

Method

Endpoint

Description

`POST`

/api/auth/register

Register a new user

`POST`

/api/auth/login

Login and receive cookie

`GET`

/api/users/:id

Fetch user profile details

`POST`

/api/posts

Create a new post

* * *

👨‍💻 Developer
---------------

**Taner Özer**

*   GitHub: [@dxtaner](https://github.com/dxtaner)
*   Medium: [@dxtaner](https://medium.com/@dxtaner)

Licensed under the MIT License.
