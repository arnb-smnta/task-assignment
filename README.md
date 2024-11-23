---
# **User Authentication API**

This API provides a comprehensive set of endpoints to handle user authentication, authorization, and profile management. It includes functionalities such as user registration, login, email verification, password reset, and role management.
---

## **Table of Contents**

- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Error Handling](#error-handling)
- [Contributing](#contributing)

---

## **Getting Started**

### **Installation**

1. Clone the repository:
   ```bash
   git clone <repo-url>
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```

---

```markdown
# **Environment Variables**

The application requires the following environment variables to function correctly. Set these in your `.env` file.

| **Variable**                  | **Description**                       | **Example**                                                        |
| ----------------------------- | ------------------------------------- | ------------------------------------------------------------------ |
| `PORT`                        | Port number for the server            | `8080`                                                             |
| `JWT_ACCESS_TOKEN_SECRET`     | Secret for generating access tokens   | `ffaf846b0f688de6a8220bb64a1e925b7257848968b8dd43e6265ce3af78a66f` |
| `JWT_REFRESH_TOKEN_SECRET`    | Secret for generating refresh tokens  | `0a5b4ad907034898093e69bede2b2f20f3c382342d8be300c06e3f95f2b1b90d` |
| `ACCESS_TOKEN_EXPIRY`         | Expiry time for access tokens         | `1D`                                                               |
| `REFRESH_TOKEN_EXPIRY`        | Expiry time for refresh tokens        | `10d`                                                              |
| `CORS_ORIGIN`                 | CORS origins to allow requests from   | `http://localhost:5173,*`                                          |
| `NODE_ENV`                    | Specify the environment               | `development`                                                      |
| `MONGODB_URI`                 | MongoDB connection string             | `yourmongodb-uri.net`                                              |
| `USER_TEMPORARY_TOKEN_EXPIRY` | Expiry time for temporary user tokens | `20 * 60 * 1000`                                                   |
| `EXPRESS_SESSION_SECRET`      | Secret for Express session management | `123456` `                                                         |
```

#### **For more details refer to .env.sample -file **

## **API Endpoints**

### **Authentication Routes**

#### **Register User**

- **Endpoint:** `POST /api/v1/users/register`
- **Description:** Registers a new user and sends a verification email.
- **Body Parameters:**
  ```json
  {
    "email": "string",
    "username": "string",
    "password": "string",
    "role": "string" // optional
  }
  ```
- **Response:**
  ```json
  {
    "status": 200,
    "message": "User registered successfully and verification email has been sent on your email.",
    "data": { "user": { ... } }
  }
  ```

#### **Login User**

- **Endpoint:** `POST /api/v1/users/login`
- **Description:** Logs in the user and returns access/refresh tokens.
- **Body Parameters:**
  ```json
  {
    "email": "string", // or
    "username": "string",
    "password": "string"
  }
  ```
- **Response:**
  ```json
  {
    "status": 200,
    "message": "User logged in successfully",
    "data": { "user": { ... }, "accessToken": "string", "refreshToken": "string" }
  }
  ```

#### **Logout User**

- **Endpoint:** `POST /api/v1/users/logout`
- **Description:** Logs out the user and clears tokens from cookies.

#### **Refresh Access Token**

- **Endpoint:** `POST /api/v1/users/refresh-token`
- **Description:** Refreshes the access token using a valid refresh token.
- **Body Parameters:**
  ```json
  {
    "refreshToken": "string"
  }
  ```

### **Email Verification**

#### **Verify Email**

- **Endpoint:** `GET /api/v1/users/verify-email/:verificationToken`
- **Description:** Verifies the user's email using the token in the URL.

#### **Resend Verification Email**

- **Endpoint:** `POST /api/v1/users/resend-email-verification`
- **Description:** Resends the email verification link to the user's email.

---

### **Password Management**

#### **Forgot Password Request**

- **Endpoint:** `POST /api/v1/users/forgot-password`
- **Description:** Sends a password reset link to the user's email.
- **Body Parameters:**
  ```json
  {
    "email": "string"
  }
  ```

#### **Reset Forgotten Password**

- **Endpoint:** `POST /api/v1/users/reset-password/:resetToken`
- **Description:** Resets the user's password using the reset token.
- **Body Parameters:**
  ```json
  {
    "newPassword": "string"
  }
  ```

#### **Change Current Password**

- **Endpoint:** `PATCH /api/v1/users/change-password`
- **Description:** Allows logged-in users to change their current password.
- **Body Parameters:**
  ```json
  {
    "oldPassword": "string",
    "newPassword": "string"
  }
  ```

---

### **User Management**

#### **Get Current User**

- **Endpoint:** `GET /api/v1/users/current`
- **Description:** Retrieves the currently logged-in user's details.

#### **Assign Role**

- **Endpoint:** `PATCH /api/v1/users/assign-role/:userId`
- **Description:** Assigns a new role to a user (Admin only).
- **Body Parameters:**
  ```json
  {
    "role": "string"
  }
  ```

#### **Update User Avatar**

- **Endpoint:** `PATCH /api/v1/users/update-avatar`
- **Description:** Allows users to update their profile avatar.
- **Body Parameters:** Form-data with an image file.

---

## **Error Handling**

The API uses a consistent error format. If an error occurs, the response will have:

```json
{
  "status": <error-code>,
  "message": "Error message",
  "errors": [ ...optional details ]
}
```

---

````

## **Contributing**

1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature-name
````

3. Commit your changes:
   ```bash
   git commit -m "Add feature description"
   ```
4. Push to your branch:
   ```bash
   git push origin feature-name
   ```
5. Create a pull request.

---

# Task Management Application

This repository contains a **Task Management Application** that allows users to create, view, edit, categorize, and manage tasks. The application uses **Node.js**, **Express**, and **MongoDB** to handle backend operations and **JWT** for authentication.

---

## Features

1. **Task Management:**

   - Create tasks with title, description, due date, and time.
   - View a list of all tasks associated with a user.
   - Mark tasks as completed.
   - Edit task details (title, description, due date, category, or time).
   - Delete tasks.
   - Categorize tasks into predefined categories: **WORK**, **PERSONAL**, **SHOPPING**, or **OTHERS**.

2. **Validation:**

   - Task titles and descriptions are required.
   - Due dates must be today or in the future.
   - Time, if provided, must follow the `HH:mm` format and not be in the past for the current day.
   - Tasks marked as "completed" cannot be edited or marked again.

3. **Persistence:**

   - Tasks are stored in **MongoDB** for retrieval and modification.

4. **Authentication:**

   - Each task is tied to a specific user (`userId`).
   - JWT-based authentication is used to protect routes.

5. **Error Handling:**

   - Comprehensive error handling with meaningful error messages.

6. **Bonus Features:**
   - Ability to set due dates for tasks.
   - Categorize tasks into predefined groups.

---

## Code Structure

The application is divided into logical modules to ensure clarity and maintainability:

1. **Models:**

   - `task-schema.js`: Defines the structure and validation logic for tasks.

2. **Controllers:**

   - `task.controllers.js`: Handles the core functionality for managing tasks, including:
     - Creating a task.
     - Viewing all tasks or task details.
     - Editing, marking as completed, and deleting tasks.
     - Filtering tasks by categories.

3. **Routes:**

   - `task.routes.js`: Defines the API endpoints for task-related operations.
   - Routes are protected using `verifyJWT` middleware for authenticated access.

4. **Utils:**

   - `ApiError.js`: For consistent error handling.
   - `ApiResponse.js`: Standardizes success response format.
   - `asyncHandler.js`: Simplifies async route handling.

5. **Validators:**
   - Custom validators ensure input data integrity, such as MongoDB ID validation and task creation checks.

---

## API Documentation

### Base URL

```
http://localhost:<PORT>/api/v1/tasks
```

### Endpoints

#### 1. **Create a Task**

**POST** `/`

- **Body:**
  ```json
  {
    "title": "Task Title",
    "description": "Task Description",
    "dueDate": "2024-11-24",
    "time": "14:30",
    "category": "WORK"
  }
  ```
- **Response:**
  ```json
  {
    "status": 200,
    "data": {
      "_id": "task-id",
      "title": "Task Title",
      "description": "Task Description",
      "dueDate": "2024-11-24T00:00:00.000Z",
      "time": "14:30",
      "category": "WORK",
      "completed": false,
      "userId": "user-id",
      "createdAt": "2024-11-23T12:00:00.000Z",
      "updatedAt": "2024-11-23T12:00:00.000Z"
    },
    "message": "Task created successfully"
  }
  ```

#### 2. **View All Tasks**

**GET** `/`

- **Response:**
  ```json
  {
    "status": 200,
    "data": [
      {
        "_id": "task-id",
        "title": "Task Title",
        "description": "Task Description",
        "dueDate": "2024-11-24T00:00:00.000Z",
        "time": "FULL_DAY",
        "category": "OTHERS",
        "completed": false,
        "userId": "user-id",
        "createdAt": "2024-11-23T12:00:00.000Z",
        "updatedAt": "2024-11-23T12:00:00.000Z"
      }
    ],
    "message": "Tasks fetched successfully"
  }
  ```

#### 3. **Mark Task as Completed**

**POST** `/:taskId`

- **Response:**
  ```json
  {
    "status": 200,
    "data": {},
    "message": "Task successfully updated"
  }
  ```

#### 4. **Edit a Task**

**PATCH** `/:taskId`

- **Body:** (Optional fields to update)
  ```json
  {
    "title": "Updated Title",
    "description": "Updated Description",
    "dueDate": "2024-11-25",
    "time": "15:00",
    "category": "PERSONAL"
  }
  ```
- **Response:**
  ```json
  {
    "status": 200,
    "data": { "task-object" },
    "message": "Task successfully edited"
  }
  ```

#### 5. **Delete a Task**

**DELETE** `/:taskId`

- **Response:**
  ```json
  {
    "status": 200,
    "data": {},
    "message": "Task deleted successfully"
  }
  ```

#### 6. **View Task Details**

**GET** `/:taskId`

- **Response:**
  ```json
  {
    "status": 200,
    "data": { "task-object" },
    "message": "Task fetched successfully"
  }
  ```

#### 7. **Get Tasks by Category**

**GET** `/category/:categoryId`

- **Response:**
  ```json
  {
    "status": 200,
    "data": [ { "task-object" } ],
    "message": "Tasks fetched successfully"
  }
  ```

---

## Key Decisions and Highlights

- **Validation:**
  - Integrated both schema-level and custom validation to ensure task integrity.
- **Authorization:**
  - Ensured users can only access or modify their own tasks.
- **Design:**
  - Followed RESTful conventions for API design.
- **Error Handling:**
  - Centralized error handling ensures uniform and meaningful error responses.

---

## Optional Enhancements

- Add a frontend for easier interaction.
- Implement unit tests using Jest or Mocha.
- Integrate CI/CD for automated testing and deployment.

---

## Submission

- [GitHub Repository Link](#)

---

## Contact

For queries or suggestions, reach out to the repository maintainer.

## **License**

This project is licensed under the [MIT License](LICENSE).

---
