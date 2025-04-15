# MERN Blueprint Project

A simple CRUD application built with the MERN stack (MongoDB, Express, React, Node.js) following best practices.

## Project Structure

```
├── backend/           # Node.js and Express server
│   ├── config/        # Configuration files
│   ├── controllers/   # Request handlers
│   ├── middleware/    # Express middleware
│   ├── models/        # Mongoose models
│   ├── routes/        # API routes
│   ├── utils/         # Utility functions
│   ├── .env           # Environment variables
│   ├── package.json   # Backend dependencies
│   └── server.js      # Entry point
│
├── frontend/          # React client
│   ├── public/        # Static files
│   ├── src/           # React source code
│   │   ├── components/# Reusable components
│   │   ├── pages/     # Page components
│   │   ├── services/  # API service calls
│   │   ├── utils/     # Utility functions
│   │   ├── App.js     # Main component
│   │   └── index.js   # Entry point
│   ├── .env           # Environment variables
│   └── package.json   # Frontend dependencies
│
└── README.md          # Project documentation
```

## Features

- RESTful API with Express
- MongoDB database with Mongoose ODM
- React frontend with modern hooks
- Complete CRUD operations
- Form validation
- Error handling
- Responsive design

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas)

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in backend folders with the following variables:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/mern-blueprint
   JWT_SECRET=your_jwt_secret
   ```

4. Start the server:
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```
   npm start
   ```

## Best Practices Implemented

- **Clean Code**: Consistent formatting, meaningful variable names
- **DRY (Don't Repeat Yourself)**: Reusable components and utility functions
- **Modularity**: Separation of concerns with clear component structure
- **Scalability**: Organized folder structure for easy expansion
- **Testability**: Components designed for easy testing
- **Security**: Input validation, authentication, and authorization
- **Maintainability**: Comprehensive documentation and comments