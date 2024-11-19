# mini-loan-app-backend

documentationURL-https://web.postman.co/api/:apiId/documentation/27224450-2e321aa6-c3ba-4325-9a8e-7d913e3f44ae/publish?workspaceId=0147f509-5120-4e08-853c-f8ca4778adfc&requestId=

Here's a clean and easy-to-read **README** documentation for your authentication and user management system:

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

## **Environment Variables**

Ensure the following environment variables are set in a `.env` file:

| Variable                       | Description                          | Example                     |
| ------------------------------ | ------------------------------------ | --------------------------- |
| `PORT`                         | Port number for the server           | `5000`                      |
| `JWT_ACCESS_TOKEN_SECRET`      | Secret for generating access tokens  | `your-access-token-secret`  |
| `JWT_REFRESH_TOKEN_SECRET`     | Secret for generating refresh tokens | `your-refresh-token-secret` |
| `EMAIL_SERVICE`                | Email service provider               | `Gmail`                     |
| `EMAIL_USER`                   | Email address to send emails         | `your-email@gmail.com`      |
| `EMAIL_PASS`                   | Password for the email               | `your-email-password`       |
| `FORGOT_PASSWORD_REDIRECT_URL` | URL to redirect for password reset   | `http://your-frontend.com`  |

---

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

# **Mini Loan Management API**

This module adds functionality to manage loans within the same project. It supports loan creation, approval, repayment handling, and retrieval of loan and repayment details.

---

## **API Endpoints**

### **1. Create Loan Request**

- **Endpoint:** `POST /api/v1/loans`
- **Middleware:** `verifyJWT`
- **Description:** Allows authenticated users to request a loan.
- **Request Body:**
  ```json
  {
    "amount": 1000, // Loan amount in currency
    "term": 4 // Loan term in weeks
  }
  ```
- **Response:**
  ```json
  {
    "status": 200,
    "data": { ... },
    "message": "Loan successfully created"
  }
  ```
- **Notes:**
  - Automatically schedules weekly repayments.
  - The last repayment includes any remainder from dividing the total amount by the term.

---

### **2. Approve Loan Request (Admin Only)**

- **Endpoint:** `POST /api/v1/loans/approve/:loanId`
- **Middleware:** `verifyJWT`
- **Description:** Allows admins to approve a loan request.
- **Path Parameters:**
  - `loanId`: The ID of the loan to approve.
- **Response:**
  ```json
  {
    "status": 200,
    "message": "Loan Status Approved"
  }
  ```
- **Notes:**
  - Only admins (`role: ADMIN`) can perform this action.
  - Loans already approved cannot be re-approved.

---

### **3. View Loan Details**

- **Endpoint:** `GET /api/v1/loans/view/:loanId`
- **Middleware:** `verifyJWT`
- **Description:** Retrieves detailed loan information, including repayment schedules.
- **Path Parameters:**
  - `loanId`: The ID of the loan to view.
- **Response:**
  ```json
  {
    "status": 200,
    "data": [
      {
        "_id": "loanId",
        "amount": 1000,
        "status": "PENDING",
        "repayments": [
          {
            "_id": "repaymentId",
            "dueDate": "YYYY-MM-DD",
            "amount": 250,
            "status": "PENDING"
          }
        ]
      }
    ],
    "message": "Loan successfully fetched"
  }
  ```
- **Notes:**
  - Admins and the loan owner can view loan details.
  - Aggregates loan data with repayment schedules.

---

### **4. Handle Loan Repayment**

- **Endpoint:** `POST /api/v1/loans/repayment/:repaymentId`
- **Middleware:** `verifyJWT`
- **Description:** Allows authenticated users or admins to mark a repayment as paid.
- **Path Parameters:**
  - `repaymentId`: The ID of the repayment to mark as paid.
- **Request Body:**
  ```json
  {
    "repaymentDate": "YYYY-MM-DD" // Optional, defaults to current date
  }
  ```
- **Response:**
  ```json
  {
    "status": 200,
    "message": "Repayment Status Updated"
  }
  ```
- **Notes:**
  - Only applies to approved loans.
  - Repayment status changes to "PAID" once processed.

---

### **5. View Repayment Details**

- **Endpoint:** `GET /api/v1/loans/repayment/:repaymentId`
- **Middleware:** `verifyJWT`
- **Description:** Fetches details of a specific repayment schedule.
- **Path Parameters:**
  - `repaymentId`: The ID of the repayment to view.
- **Response:**
  ```json
  {
    "status": 200,
    "data": {
      "_id": "repaymentId",
      "dueDate": "YYYY-MM-DD",
      "amount": 250,
      "status": "PENDING"
    },
    "message": "Repayment details fetched successfully"
  }
  ```
- **Notes:**
  - Admins and the loan owner can view repayment details.

---

## **Access Control**

- **Users:**
  - Can create loan requests.
  - Can view their loans and repayment schedules.
  - Can handle repayments for their loans.
- **Admins:**
  - Can approve loans.
  - Can view any loan or repayment details.
  - Can handle repayments on behalf of any user.

---

## **Error Handling**

The API uses structured error responses. Example:

```json
{
  "status": 400,
  "message": "Error message describing the issue"
}
```

## **Contributing**

1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature-name
   ```
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

Let me know if you’d like to include additional details, such as testing instructions or architectural diagrams!
