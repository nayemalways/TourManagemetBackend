# Tourista 🍹⛱️

## A Full-Stack Tour Booking Application

**Status:** Still in progress...

Tourista is a full-stack tour booking system where users can browse available tours, book their preferred trips, and manage their travel experience through a smooth and user-friendly platform.

This project was built to strengthen my understanding of full-stack application development, especially backend architecture, authentication, error handling, API design, frontend state management, and real-world project structure.

---

## 🚀 Key Learning Highlights

Through this project, I learned and practiced several important full-stack development concepts:

* **Efficient Error & Exception Handling**
  Learned how to handle application errors in a structured and maintainable way.

* **Custom Error Handling with JavaScript Error Class**
  Created a custom `AppError` class by extending the built-in JavaScript `Error` class to manage operational errors with proper status codes and messages.

* **Graceful Application Shutdown**
  Learned how to gracefully shut down the application when an unhandled exception or server-level error occurs.

* **Centralized Async Error Handling**
  Implemented a reusable `catchAsync` wrapper to avoid writing repetitive `try-catch` blocks in every controller function.

* **Advanced Mongoose Concepts**
  Practiced Mongoose advanced features such as:

  * Pre hooks
  * Post hooks
  * Static methods
  * Schema-level logic

* **Frontend State Management**
  Learned Redux core concepts and used **RTK Query** for efficient API data fetching, caching, and state management.

* **Authentication Flow Improvement**
  Used an Axios interceptor to handle authenticated user session refresh logic more smoothly.

* **Full-Stack Project Confidence**
  After completing this project, I gained strong confidence in both backend and frontend development by building a practical, real-world application.

---

## ✨ Features

* Browse available tours
* View tour details
* Book tours
* User authentication
* Google authentication
* Role-based backend structure
* Secure API endpoints
* Input validation with Zod
* Centralized global error handling
* Payment and booking-related backend flow
* Frontend API integration with RTK Query
* Responsive UI design

---

## 🛠️ Tech Stack

### Backend

* Node.js
* Express.js
* TypeScript
* MongoDB
* Mongoose
* Passport.js
* Zod
* JWT
* Axios

### Frontend

* React.js
* Tailwind CSS
* Shadcn UI
* Redux
* RTK Query
* Axios

---

## 🔐 Application Security

* Custom authentication using Passport.js
* Google authentication using Passport.js
* Rate limiting to reduce abusive requests
* Global error handling with a custom `AppError` class
* Zod validation for request data
* TypeScript for better type safety
* Structured backend architecture for maintainability

---

## 📌 Project Purpose

The main purpose of this project was not only to build a tour booking application, but also to improve my real-world full-stack development skills.

By working on Tourista, I became more confident in building scalable backend APIs, handling errors professionally, managing authentication flows, working with advanced Mongoose features, and connecting the frontend with backend APIs using modern tools like Redux and RTK Query.

---

## 📖 Project Summary

Tourista is a full-stack tour booking platform built with the MERN stack. It allows users to explore tours, book trips, and enjoy a smooth travel booking experience.

This project helped me understand how a production-style full-stack application works, from backend API development to frontend state management and authentication handling.


Frontend Repository: [Visit Here](https://github.com/nayemalways/TouristaFrontend)
