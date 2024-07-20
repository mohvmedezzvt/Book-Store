# Book-Store Backend
## Overview

This repository contains the backend code for a Book-Store. The backend is built with Node.js and Express, providing APIs for user authentication, book and author management, and password recovery.

## Project Structure

```
.
├── config
│   └── db.js
├── controllers
│   ├── authController.js
│   ├── authorController.js
│   ├── bookController.js
│   ├── passwordController.js
│   └── userController.js
├── middlewares
│   ├── errors.js
│   ├── logger.js
│   └── verifyToken.js
├── models
│   ├── Author.js
│   ├── Book.js
│   └── User.js
├── routes
│   ├── auth.js
│   ├── authors.js
│   ├── books.js
│   ├── password.js
│   └── users.js
├── views
│   └── ...
├── .env
├── app.js
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

Ensure you have the following installed:
- Node.js
- npm
- MongoDB

### Installation

1. Clone the repository:
```
git clone https://github.com/mohvmedezzvt/Book-Store.git
cd Book-Store
```

2. Install dependencies:
```
npm install
```

3. Create a .env file in the root directory and add the following environment variables:
```
MONGO_URI=
PORT=5000
NODE_ENV=development
JWT_SECRET=

EMAIL=
PASSWORD=
```

4. Start the server:
```
npm start
```

The server should now be running on http://localhost:5000.

## API Endpoints

### Authentication

- Register: POST /api/auth/register
- Login: POST /api/auth/login

### Authors

- Get All Authors: GET /api/authors
- Add Author: POST /api/authors (Admin only)
- Get Author By ID: GET /api/authors/:id
- Update Author: PUT /api/authors/:id (Admin only)
- Delete Author: DELETE /api/authors/:id (Admin only)

### Books

- Get All Books: GET /api/books
- Add Book: POST /api/books (Admin only)
- Get Book By ID: GET /api/books/:id
- Update Book: PUT /api/books/:id (Admin only)
- Delete Book: DELETE /api/books/:id (Admin only)

### Password Recovery

- Forgot Password: GET /password/forgot-password
- Send Forgot Password Link: POST /password/forgot-password
- Reset Password View: GET /password/reset-password/:userId/:token
- Reset Password: POST /password/reset-password/:userId/:token

### Users

- Get All Users: GET /api/users (Admin only)
- Get User By ID: GET /api/users/:id
- Update User: PUT /api/users/:id
- Delete User: DELETE /api/users/:id

### Middlewares

- Logger: Logs request details.
- Helmet: Adds security headers to the requests.
- CORS: Enables Cross-Origin Resource Sharing.
- Error Handling: Custom error handling for not found and general errors.
- Token Verification: Verifies JWT tokens for protected routes.

### Views

The views are rendered using EJS templates, primarily for password recovery forms.

### Contributing

We welcome contributions! Please open an issue or submit a pull request.

### License

This project is licensed under the MIT License.
