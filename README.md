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
│   │   ├── App.js     # Main component
│   │   └── index.js   # Entry point
│   ├── .env           # Environment variables
│   └── package.json   # Frontend dependencies
│
└── README.md          # Project documentation
```

## Features

- RESTFUL API with Express
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

3. Create a `.env` file with the following variables:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/mern-blueprint
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=30d
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
   
## Proxy Configuration

> - Avoiding CORS Issues: It helps avoid Cross-Origin Resource Sharing (CORS) issues during development.
Since the requests appear to come from the same origin as the React app,
you don't need to configure CORS on your backend during development.
Simplified API Calls: It allows you to use relative paths in your API calls instead of absolute URLs.
For example, you can use axios.post('/api/users/login') instead of axios.post('http://localhost:5000/api/users/login').

## Best Practices Implemented

- **Clean Code**: Consistent formatting, meaningful variable names
- **DRY (Don't Repeat Yourself)**: Reusable components and utility functions
- **Modularity**: Separation of concerns with clear component structure
- **Scalability**: Organized folder structure for easy expansion
- **Testability**: Components designed for easy testing
- **Security**: Input validation, authentication, and authorization
- **Maintainability**: Comprehensive documentation and comments