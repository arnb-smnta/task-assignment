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

## **License**

This project is licensed under the [MIT License](LICENSE).

---
