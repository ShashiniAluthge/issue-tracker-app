# Issue Tracker Web Application - FixFlow

A full-stack Issue Tracker system built to manage software issues with complete CRUD operations, authentication, filtering, and data export functionality. Designed with strong focus on UI/UX, reusable components, and scalable architecture.

# Tech Stack
# Frontend

React

TypeScript

Tailwind CSS

React Hook Form + Zod validation

Zustand (State Management)

Axios

Recharts (Dashboard visualization)

React Icons

# Backend

Node.js

Express.js

MySQL

JWT Authentication

bcrypt.js (Password hashing)

Express Validator

dotenv

CORS

# Core Features

  # Authentication & Authorization

    User registration & login
    Secure password hashing
    JWT-based authentication
    Protected routes

  # Issue Management (CRUD)

    Create new issues (title, description, priority, severity)
    View all issues with status badges
    Detailed issue view
    Edit & update issues
    Delete issues

# Dashboard & UX Enhancements

Issue count by status (Open, In Progress, Resolved)

Visual indicators with colors & icons

Clean responsive UI

Reusable component architecture


# Search & Filtering

Filter by title, status, priority

Optimized API calls for smooth UX


# Export Functionality

Export issue list as: CSV

Print issue list as PDF 


# Installation & Setup

1. Clone the Repository

       git clone https://github.com/your-username/issue-tracker.git

       cd issue-tracker

2. Backend Setup
   
       cd backend

       npm install

  Create a .env file:

    PORT=5000

    DB_HOST=localhost

    DB_USER=root

    DB_PASSWORD=yourpassword

    DB_NAME=issue_tracker

    JWT_SECRET=your_secret_key

   Run backend server:

    npm run dev


3. Frontend Setup
   
       cd frontend
       npm install
       npm run dev
   
5. Database Setup (MySQL)

       Create database:

       CREATE DATABASE issue_tracker;


# Frontend Dependencies
    {
    "@hookform/resolvers": "^5.2.2",
    "axios": "^1.13.5",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hook-form": "^7.71.1",
    "react-icons": "^5.5.0",
    "react-router-dom": "^7.13.0",
    "recharts": "^2.12.7",
    "zod": "^4.3.6",
    "zustand": "^5.0.11"
    }

# Backend Dependencies
    {
    "express": "^4.18.2",
    "mysql2": "^3.6.5",
    "dotenv": "^16.3.1",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "cors": "^2.8.5",
    "express-validator": "^7.0.1"
    }
   
