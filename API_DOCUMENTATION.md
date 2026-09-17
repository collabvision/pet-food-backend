# 🚀 Complete MERN E-Commerce API Documentation

Welcome to the comprehensive API documentation for the **Pet Food & Supplies E-Commerce Backend**. This document contains every single endpoint, required headers, query parameters, path parameters, request payloads, sample JSON responses, and role permissions.

---

## ⚙️ Postman / Thunder Client Configuration

### Base Configuration
- **Base URL:** `http://localhost:5000/api/v1`
- **Environment Variables:**
  - `BASE_URL` = `http://localhost:5000/api/v1`
  - `ACCESS_TOKEN` = `your_jwt_access_token_here`

### Common Headers
- `Content-Type: application/json` (For all standard JSON endpoints)
- `Authorization: Bearer {{ACCESS_TOKEN}}` (For all authenticated endpoints)

---

## 🔐 1. Authentication Module (`/api/v1/auth`)

### 1.1 Register User
- **Method:** `POST`
- **Endpoint:** `{{BASE_URL}}/auth/register`
- **Auth:** Public
- **Headers:** `Content-Type: application/json`
- **Body:**
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "Password123!",
    "confirmPassword": "Password123!",
    "phone": "+919876543210"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "User registered successfully. Verification code sent to email.",
    "data": {
      "id": "66f1a8b4c9e1234567890abc",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "USER",
      "isEmailVerified": false
    }
  }
  ```

### 1.2 Verify Email
- **Method:** `POST`
- **Endpoint:** `{{BASE_URL}}/auth/verify-email`
- **Auth:** Public
- **Headers:** `Content-Type: application/json`
- **Body:**
  ```json
  {
    "email": "jane@example.com",
    "code": "482910"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Email verified successfully. You can now login."
  }
  ```

### 1.3 Resend Verification Email
- **Method:** `POST`
- **Endpoint:** `{{BASE_URL}}/auth/resend-verification`
- **Auth:** Public
- **Headers:** `Content-Type: application/json`
- **Body:**
  ```json
  {
    "email": "jane@example.com"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Verification code resent successfully to your email."
  }
  ```

### 1.4 Login User
- **Method:** `POST`
- **Endpoint:** `{{BASE_URL}}/auth/login`
- **Auth:** Public
- **Headers:** `Content-Type: application/json`
- **Body:**
  ```json
  {
    "email": "jane@example.com",
    "password": "Password123!"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "user": {
        "id": "66f1a8b4c9e1234567890abc",
        "name": "Jane Doe",
        "email": "jane@example.com",
        "role": "USER"
      },
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```

### 1.5 Refresh Access Token
- **Method:** `POST`
- **Endpoint:** `{{BASE_URL}}/auth/refresh`
- **Auth:** Public (uses HTTP-only cookie `refreshToken` or request body `refreshToken`)
- **Headers:** `Content-Type: application/json`
- **Body (Optional if cookie is set):**
  ```json
  {
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```

### 1.6 Logout
- **Method:** `POST`
- **Endpoint:** `{{BASE_URL}}/auth/logout`
- **Auth:** Required (`Bearer Token`)
- **Headers:** `Authorization: Bearer {{ACCESS_TOKEN}}`
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Logged out successfully"
  }
  ```

### 1.7 Forgot Password
- **Method:** `POST`
- **Endpoint:** `{{BASE_URL}}/auth/forgot-password`
- **Auth:** Public
- **Headers:** `Content-Type: application/json`
- **Body:**
  ```json
  {
    "email": "jane@example.com"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Password reset code sent to email."
  }
  ```

### 1.8 Reset Password
- **Method:** `POST`
- **Endpoint:** `{{BASE_URL}}/auth/reset-password`
- **Auth:** Public
- **Headers:** `Content-Type: application/json`
- **Body:**
  ```json
  {
    "email": "jane@example.com",
    "code": "819203",
    "newPassword": "NewPassword123!",
    "confirmNewPassword": "NewPassword123!"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Password reset successfully. You can now login with your new password."
  }
  ```

### 1.9 Change Password
- **Method:** `PATCH`
- **Endpoint:** `{{BASE_URL}}/auth/change-password`
- **Auth:** Required (`Bearer Token`)
- **Headers:** `Authorization: Bearer {{ACCESS_TOKEN}}`, `Content-Type: application/json`
- **Body:**
  ```json
  {
    "currentPassword": "Password123!",
    "newPassword": "NewPassword123!",
    "confirmNewPassword": "NewPassword123!"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Password changed successfully"
  }
  ```

### 1.10 Get Current User Profile
- **Method:** `GET`
- **Endpoint:** `{{BASE_URL}}/auth/me`
- **Auth:** Required (`Bearer Token`)
- **Headers:** `Authorization: Bearer {{ACCESS_TOKEN}}`
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "id": "66f1a8b4c9e1234567890abc",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "USER",
      "isEmailVerified": true
    }
  }
  ```

---

## 📦 2. Categories Module (`/api/v1/categories`)

### 2.1 Get All Categories
- **Method:** `GET`
- **Endpoint:** `{{BASE_URL}}/categories`
- **Auth:** Public
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "66f1a8b4c9e1234567890101",
        "name": "Dog Food",
        "slug": "dog-food",
        "description": "Nutritious dry and wet food for dogs",
        "isActive": true
      }
    ]
  }
  ```

### 2.2 Get Category By ID
- **Method:** `GET`
- **Endpoint:** `{{BASE_URL}}/categories/66f1a8b4c9e1234567890101`
- **Auth:** Public
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "_id": "66f1a8b4c9e1234567890101",
      "name": "Dog Food",
      "slug": "dog-food",
      "description": "Nutritious dry and wet food for dogs",
      "isActive": true
    }
  }
  ```

### 2.3 Create Category
- **Method:** `POST`
- **Endpoint:** `{{BASE_URL}}/categories`
- **Auth:** Required (`ADMIN` role)
- **Headers:** `Authorization: Bearer {{ACCESS_TOKEN}}`, `Content-Type: application/json`
- **Body:**
  ```json
  {
    "name": "Cat Supplies",
    "slug": "cat-supplies",
    "description": "Litter boxes, scratchers, and toys for cats",
    "isActive": true
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "data": {
      "_id": "66f1a8b4c9e1234567890102",
      "name": "Cat Supplies",
      "slug": "cat-supplies",
      "description": "Litter boxes, scratchers, and toys for cats",
      "isActive": true
    }
  }
  ```

### 2.4 Update Category
- **Method:** `PATCH`
- **Endpoint:** `{{BASE_URL}}/categories/66f1a8b4c9e1234567890102`
- **Auth:** Required (`ADMIN` role)
- **Headers:** `Authorization: Bearer {{ACCESS_TOKEN}}`, `Content-Type: application/json`
- **Body:**
  ```json
  {
    "name": "Cat Care & Supplies",
    "description": "Updated description for cat products"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "_id": "66f1a8b4c9e1234567890102",
      "name": "Cat Care & Supplies",
      "slug": "cat-supplies",
      "description": "Updated description for cat products",
      "isActive": true
    }
  }
  ```

### 2.5 Delete Category
- **Method:** `DELETE`
- **Endpoint:** `{{BASE_URL}}/categories/66f1a8b4c9e1234567890102`
- **Auth:** Required (`ADMIN` role)
- **Headers:** `Authorization: Bearer {{ACCESS_TOKEN}}`
- **Safety check:** Prevents deletion if products are linked to this category.
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Category deleted successfully"
  }
  ```

---

## 🛍️ 3. Products Module (`/api/v1/products`)

### 3.1 Get All Products
- **Method:** `GET`
- **Endpoint:** `{{BASE_URL}}/products?page=1&limit=10&search=kibble&category=66f1a8b4c9e1234567890101&minPrice=100&maxPrice=1000&sort=-createdAt`
- **Auth:** Public
- **Query Parameters:**
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
  - `search`: Search name, description, brand, or SKU
  - `category`: Category ObjectId filter
  - `minPrice`: Minimum price filter
  - `maxPrice`: Maximum price filter
  - `requiresPrescription`: `true` or `false`
  - `sort`: `-createdAt`, `price`, `-price`, `name`
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "products": [
        {
          "_id": "66f1a8b4c9e1234567890201",
          "name": "Organic Dog Kibble 5kg",
          "slug": "organic-dog-kibble-5kg",
          "description": "High-protein dry food for adult dogs.",
          "category": "66f1a8b4c9e1234567890101",
          "price": 850,
          "compareAtPrice": 999,
          "sku": "DOG-KIB-5KG",
          "brand": "PetCare Premium",
          "images": [
            { "url": "https://res.cloudinary.com/demo/image/upload/sample.jpg", "publicId": "sample" }
          ],
          "requiresPrescription": false,
          "isActive": true
        }
      ],
      "pagination": {
        "total": 1,
        "page": 1,
        "pages": 1,
        "limit": 10
      }
    }
  }
  ```

### 3.2 Get Product By Slug
- **Method:** `GET`
- **Endpoint:** `{{BASE_URL}}/products/slug/organic-dog-kibble-5kg`
- **Auth:** Public
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "_id": "66f1a8b4c9e1234567890201",
      "name": "Organic Dog Kibble 5kg",
      "slug": "organic-dog-kibble-5kg",
      "price": 850
    }
  }
  ```

### 3.3 Get Product By ID
- **Method:** `GET`
- **Endpoint:** `{{BASE_URL}}/products/66f1a8b4c9e1234567890201`
- **Auth:** Public
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "_id": "66f1a8b4c9e1234567890201",
      "name": "Organic Dog Kibble 5kg",
      "price": 850
    }
  }
  ```

### 3.4 Create Product
- **Method:** `POST`
- **Endpoint:** `{{BASE_URL}}/products`
- **Auth:** Required (`ADMIN` role)
- **Option A (JSON Payload):**
  - **Headers:** `Authorization: Bearer {{ACCESS_TOKEN}}`, `Content-Type: application/json`
  - **Body:**
    ```json
    {
      "name": "Organic Dog Kibble 5kg",
      "slug": "organic-dog-kibble-5kg",
      "description": "High-protein dry food for adult dogs.",
      "category": "66f1a8b4c9e1234567890101",
      "price": 850,
      "compareAtPrice": 999,
      "sku": "DOG-KIB-5KG",
      "barcode": "8901234567890",
      "brand": "PetCare Premium",
      "unit": "5kg",
      "isMedical": false,
      "requiresPrescription": false,
      "images": [
        { "url": "https://images.unsplash.com/photo-1589924691995-400dc9ecc119", "publicId": null }
      ]
    }
    ```
- **Option B (Multipart Form-Data File Upload):**
  - **Headers:** `Authorization: Bearer {{ACCESS_TOKEN}}`
  - **Body (`multipart/form-data`):**
    - `name`: "Organic Dog Kibble 5kg"
    - `slug`: "organic-dog-kibble-5kg"
    - `description`: "High-protein dry food"
    - `category`: "66f1a8b4c9e1234567890101"
    - `price`: 850
    - `sku`: "DOG-KIB-5KG"
    - `images` (File): Upload 1-5 image files (.png, .jpg, .webp)

### 3.5 Update Product
- **Method:** `PATCH`
- **Endpoint:** `{{BASE_URL}}/products/66f1a8b4c9e1234567890201`
- **Auth:** Required (`ADMIN` role)
- **Headers:** `Authorization: Bearer {{ACCESS_TOKEN}}`, `Content-Type: application/json`
- **Body:**
  ```json
  {
    "price": 800,
    "compareAtPrice": 950
  }
  ```

### 3.6 Delete Product
- **Method:** `DELETE`
- **Endpoint:** `{{BASE_URL}}/products/66f1a8b4c9e1234567890201`
- **Auth:** Required (`ADMIN` role)
- **Headers:** `Authorization: Bearer {{ACCESS_TOKEN}}`
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Product deleted successfully"
  }
  ```

---

## 🛒 4. Cart Module (`/api/v1/cart`)

### 4.1 Get My Cart
- **Method:** `GET`
- **Endpoint:** `{{BASE_URL}}/cart`
- **Auth:** Required (`Bearer Token`)
- **Headers:** `Authorization: Bearer {{ACCESS_TOKEN}}`
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "items": [
        {
          "product": {
            "_id": "66f1a8b4c9e1234567890201",
            "name": "Organic Dog Kibble 5kg",
            "price": 850,
            "sku": "DOG-KIB-5KG"
          },
          "quantity": 2,
          "price": 850,
          "subtotal": 1700
        }
      ],
      "totalAmount": 1700,
      "totalItems": 2
    }
  }
  ```

### 4.2 Add Item to Cart
- **Method:** `POST`
- **Endpoint:** `{{BASE_URL}}/cart/items`
- **Auth:** Required (`Bearer Token`)
- **Headers:** `Authorization: Bearer {{ACCESS_TOKEN}}`, `Content-Type: application/json`
- **Body:**
  ```json
  {
    "productId": "66f1a8b4c9e1234567890201",
    "quantity": 2
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Item added to cart",
    "data": { ...cartDetails }
  }
  ```

### 4.3 Update Cart Item Quantity
- **Method:** `PATCH`
- **Endpoint:** `{{BASE_URL}}/cart/items/66f1a8b4c9e1234567890201`
- **Auth:** Required (`Bearer Token`)
- **Headers:** `Authorization: Bearer {{ACCESS_TOKEN}}`, `Content-Type: application/json`
- **Body:**
  ```json
  {
    "quantity": 5
  }
  ```

### 4.4 Remove Item from Cart
- **Method:** `DELETE`
- **Endpoint:** `{{BASE_URL}}/cart/items/66f1a8b4c9e1234567890201`
- **Auth:** Required (`Bearer Token`)
- **Headers:** `Authorization: Bearer {{ACCESS_TOKEN}}`

### 4.5 Clear Cart
- **Method:** `DELETE`
- **Endpoint:** `{{BASE_URL}}/cart`
- **Auth:** Required (`Bearer Token`)
- **Headers:** `Authorization: Bearer {{ACCESS_TOKEN}}`

---

## 🚚 5. Orders Module (`/api/v1/orders`)

### 5.1 Create Order (Checkout)
- **Method:** `POST`
- **Endpoint:** `{{BASE_URL}}/orders`
- **Auth:** Required (`Bearer Token`)
- **Headers:** `Authorization: Bearer {{ACCESS_TOKEN}}`, `Content-Type: application/json`
- **Body:**
  ```json
  {
    "shippingAddress": {
      "fullName": "Jane Doe",
      "phone": "+919876543210",
      "street": "123 Pet Care Lane",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001",
      "country": "India"
    },
    "paymentMethod": "RAZORPAY",
    "prescriptionId": "66f1a8b4c9e1234567890501" 
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Order created successfully",
    "data": {
      "order": {
        "_id": "66f1a8b4c9e1234567890301",
        "orderNumber": "ORD-1726588800000-1234",
        "totalAmount": 1700,
        "orderStatus": "PENDING",
        "paymentStatus": "PENDING",
        "paymentMethod": "RAZORPAY"
      },
      "razorpayOrderId": "order_PKzX82h819a"
    }
  }
  ```

### 5.2 Get My Orders
- **Method:** `GET`
- **Endpoint:** `{{BASE_URL}}/orders`
- **Auth:** Required (`Bearer Token`)
- **Headers:** `Authorization: Bearer {{ACCESS_TOKEN}}`

### 5.3 Get Order by Order Number
- **Method:** `GET`
- **Endpoint:** `{{BASE_URL}}/orders/number/ORD-1726588800000-1234`
- **Auth:** Required (`Bearer Token`)
- **Headers:** `Authorization: Bearer {{ACCESS_TOKEN}}`

### 5.4 Get Order by ID
- **Method:** `GET`
- **Endpoint:** `{{BASE_URL}}/orders/66f1a8b4c9e1234567890301`
- **Auth:** Required (`Bearer Token`)
- **Headers:** `Authorization: Bearer {{ACCESS_TOKEN}}`

### 5.5 Cancel Order
- **Method:** `PATCH`
- **Endpoint:** `{{BASE_URL}}/orders/66f1a8b4c9e1234567890301/cancel`
- **Auth:** Required (`Bearer Token`)
- **Headers:** `Authorization: Bearer {{ACCESS_TOKEN}}`, `Content-Type: application/json`
- **Body:**
  ```json
  {
    "reason": "Ordered by mistake"
  }
  ```

### 5.6 Get All Orders (Admin)
- **Method:** `GET`
- **Endpoint:** `{{BASE_URL}}/orders/admin/all`
- **Auth:** Required (`ADMIN` role)
- **Headers:** `Authorization: Bearer {{ACCESS_TOKEN}}`

### 5.7 Update Order Status (Admin)
- **Method:** `PATCH`
- **Endpoint:** `{{BASE_URL}}/orders/admin/66f1a8b4c9e1234567890301/status`
- **Auth:** Required (`ADMIN` role)
- **Headers:** `Authorization: Bearer {{ACCESS_TOKEN}}`, `Content-Type: application/json`
- **Body:**
  ```json
  {
    "orderStatus": "SHIPPED",
    "note": "Package dispatched via BlueDart"
  }
  ```

---

## ⚕️ 6. Prescriptions Module (`/api/v1/prescriptions`)

### 6.1 Upload Prescription
- **Method:** `POST`
- **Endpoint:** `{{BASE_URL}}/prescriptions/upload`
- **Auth:** Required (`Bearer Token`)
- **Headers:** `Authorization: Bearer {{ACCESS_TOKEN}}`
- **Body (`multipart/form-data`):**
  - `file` (File): Select image/PDF file
  - `notes` (Text): "Prescription for Rex - Anti-allergy medication"

### 6.2 Get My Prescriptions
- **Method:** `GET`
- **Endpoint:** `{{BASE_URL}}/prescriptions`
- **Auth:** Required (`Bearer Token`)
- **Headers:** `Authorization: Bearer {{ACCESS_TOKEN}}`

### 6.3 Get Prescription By ID
- **Method:** `GET`
- **Endpoint:** `{{BASE_URL}}/prescriptions/66f1a8b4c9e1234567890501`
- **Auth:** Required (`Bearer Token`)
- **Headers:** `Authorization: Bearer {{ACCESS_TOKEN}}`

### 6.4 Get All Prescriptions (Admin)
- **Method:** `GET`
- **Endpoint:** `{{BASE_URL}}/prescriptions/admin/all`
- **Auth:** Required (`ADMIN` role)
- **Headers:** `Authorization: Bearer {{ACCESS_TOKEN}}`

### 6.5 Review Prescription (Admin)
- **Method:** `PATCH`
- **Endpoint:** `{{BASE_URL}}/prescriptions/admin/66f1a8b4c9e1234567890501/review`
- **Auth:** Required (`ADMIN` role)
- **Headers:** `Authorization: Bearer {{ACCESS_TOKEN}}`, `Content-Type: application/json`
- **Body:**
  ```json
  {
    "status": "APPROVED",
    "rejectionReason": ""
  }
  ```
  *(Status options: `APPROVED`, `REJECTED`)*

---

## 💳 7. Payments Module (`/api/v1/payments`)

### 7.1 Create Razorpay Order
- **Method:** `POST`
- **Endpoint:** `{{BASE_URL}}/payments/create-order`
- **Auth:** Required (`Bearer Token`)
- **Headers:** `Authorization: Bearer {{ACCESS_TOKEN}}`, `Content-Type: application/json`
- **Body:**
  ```json
  {
    "orderId": "66f1a8b4c9e1234567890301"
  }
  ```

### 7.2 Verify Razorpay Payment Signature
- **Method:** `POST`
- **Endpoint:** `{{BASE_URL}}/payments/verify`
- **Auth:** Required (`Bearer Token`)
- **Headers:** `Authorization: Bearer {{ACCESS_TOKEN}}`, `Content-Type: application/json`
- **Body:**
  ```json
  {
    "razorpay_order_id": "order_PKzX82h819a",
    "razorpay_payment_id": "pay_PKzY93k718b",
    "razorpay_signature": "4a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b"
  }
  ```

### 7.3 Get My Payments
- **Method:** `GET`
- **Endpoint:** `{{BASE_URL}}/payments`
- **Auth:** Required (`Bearer Token`)
- **Headers:** `Authorization: Bearer {{ACCESS_TOKEN}}`

### 7.4 Get Payment by Order ID
- **Method:** `GET`
- **Endpoint:** `{{BASE_URL}}/payments/order/66f1a8b4c9e1234567890301`
- **Auth:** Required (`Bearer Token`)
- **Headers:** `Authorization: Bearer {{ACCESS_TOKEN}}`

---

## 🏭 8. Inventory Module (`/api/v1/inventory`) [Admin Only]

### 8.1 Get Inventory List
- **Method:** `GET`
- **Endpoint:** `{{BASE_URL}}/inventory`
- **Auth:** Required (`ADMIN` role)
- **Headers:** `Authorization: Bearer {{ACCESS_TOKEN}}`

### 8.2 Get Product Inventory Detail
- **Method:** `GET`
- **Endpoint:** `{{BASE_URL}}/inventory/66f1a8b4c9e1234567890201`
- **Auth:** Required (`ADMIN` role)
- **Headers:** `Authorization: Bearer {{ACCESS_TOKEN}}`

### 8.3 Initialize Inventory for Product
- **Method:** `POST`
- **Endpoint:** `{{BASE_URL}}/inventory`
- **Auth:** Required (`ADMIN` role)
- **Headers:** `Authorization: Bearer {{ACCESS_TOKEN}}`, `Content-Type: application/json`
- **Body:**
  ```json
  {
    "productId": "66f1a8b4c9e1234567890201",
    "stock": 100,
    "lowStockThreshold": 10,
    "allowBackorder": false
  }
  ```

### 8.4 Add Stock
- **Method:** `POST`
- **Endpoint:** `{{BASE_URL}}/inventory/66f1a8b4c9e1234567890201/add-stock`
- **Auth:** Required (`ADMIN` role)
- **Headers:** `Authorization: Bearer {{ACCESS_TOKEN}}`, `Content-Type: application/json`
- **Body:**
  ```json
  {
    "quantity": 50,
    "reason": "New shipment received from supplier"
  }
  ```

### 8.5 Remove Stock
- **Method:** `POST`
- **Endpoint:** `{{BASE_URL}}/inventory/66f1a8b4c9e1234567890201/remove-stock`
- **Auth:** Required (`ADMIN` role)
- **Headers:** `Authorization: Bearer {{ACCESS_TOKEN}}`, `Content-Type: application/json`
- **Body:**
  ```json
  {
    "quantity": 5,
    "reason": "Damaged goods in warehouse"
  }
  ```

### 8.6 Reserve Stock
- **Method:** `POST`
- **Endpoint:** `{{BASE_URL}}/inventory/66f1a8b4c9e1234567890201/reserve`
- **Auth:** Required (`ADMIN` role)
- **Headers:** `Authorization: Bearer {{ACCESS_TOKEN}}`, `Content-Type: application/json`
- **Body:**
  ```json
  {
    "quantity": 2
  }
  ```

### 8.7 Release Reserved Stock
- **Method:** `POST`
- **Endpoint:** `{{BASE_URL}}/inventory/66f1a8b4c9e1234567890201/release-reservation`
- **Auth:** Required (`ADMIN` role)
- **Headers:** `Authorization: Bearer {{ACCESS_TOKEN}}`, `Content-Type: application/json`
- **Body:**
  ```json
  {
    "quantity": 2
  }
  ```

---

## 🔔 9. Notifications Module (`/api/v1/notifications`)

### 9.1 Get My Notifications
- **Method:** `GET`
- **Endpoint:** `{{BASE_URL}}/notifications`
- **Auth:** Required (`Bearer Token`)
- **Headers:** `Authorization: Bearer {{ACCESS_TOKEN}}`

### 9.2 Get Notifications for an Order
- **Method:** `GET`
- **Endpoint:** `{{BASE_URL}}/notifications/order/66f1a8b4c9e1234567890301`
- **Auth:** Required (`Bearer Token`)
- **Headers:** `Authorization: Bearer {{ACCESS_TOKEN}}`

### 9.3 Send Order Status Notification (Admin)
- **Method:** `POST`
- **Endpoint:** `{{BASE_URL}}/notifications/order-status`
- **Auth:** Required (`ADMIN` role)
- **Headers:** `Authorization: Bearer {{ACCESS_TOKEN}}`, `Content-Type: application/json`
- **Body:**
  ```json
  {
    "orderId": "66f1a8b4c9e1234567890301",
    "userId": "66f1a8b4c9e1234567890abc",
    "orderStatus": "SHIPPED",
    "email": "jane@example.com",
    "phone": "+919876543210",
    "orderNumber": "ORD-1726588800000-1234"
  }
  ```

---

## 🔄 10. Returns Module (`/api/v1/returns`)

### 10.1 Request Return
- **Method:** `POST`
- **Endpoint:** `{{BASE_URL}}/returns`
- **Auth:** Required (`Bearer Token`)
- **Headers:** `Authorization: Bearer {{ACCESS_TOKEN}}`, `Content-Type: application/json`
- **Body:**
  ```json
  {
    "orderId": "66f1a8b4c9e1234567890301",
    "reason": "DEFECTIVE",
    "comments": "The package seal was opened.",
    "items": [
      {
        "productId": "66f1a8b4c9e1234567890201",
        "quantity": 1
      }
    ]
  }
  ```
  *(Reason options: `DEFECTIVE`, `WRONG_ITEM`, `NOT_NEEDED`, `EXPIRED`, `OTHER`)*

### 10.2 Get My Returns
- **Method:** `GET`
- **Endpoint:** `{{BASE_URL}}/returns`
- **Auth:** Required (`Bearer Token`)
- **Headers:** `Authorization: Bearer {{ACCESS_TOKEN}}`

### 10.3 Get Return by Return Number
- **Method:** `GET`
- **Endpoint:** `{{BASE_URL}}/returns/number/RET-1726588800000-5678`
- **Auth:** Required (`Bearer Token`)
- **Headers:** `Authorization: Bearer {{ACCESS_TOKEN}}`

### 10.4 Get All Returns (Admin)
- **Method:** `GET`
- **Endpoint:** `{{BASE_URL}}/returns/admin/all`
- **Auth:** Required (`ADMIN` role)
- **Headers:** `Authorization: Bearer {{ACCESS_TOKEN}}`

### 10.5 Update Return Status (Admin)
- **Method:** `PATCH`
- **Endpoint:** `{{BASE_URL}}/returns/admin/66f1a8b4c9e1234567890601/status`
- **Auth:** Required (`ADMIN` role)
- **Headers:** `Authorization: Bearer {{ACCESS_TOKEN}}`, `Content-Type: application/json`
- **Body:**
  ```json
  {
    "status": "APPROVED",
    "adminComment": "Replacement or refund initiated"
  }
  ```
  *(Status options: `REQUESTED`, `APPROVED`, `REJECTED`, `ITEM_RECEIVED`, `REFUNDED`)*

---

## 🚛 11. Shipping Module (`/api/v1/shipping`)

### 11.1 Create Shipment (Admin)
- **Method:** `POST`
- **Endpoint:** `{{BASE_URL}}/shipping`
- **Auth:** Required (`ADMIN` role)
- **Headers:** `Authorization: Bearer {{ACCESS_TOKEN}}`, `Content-Type: application/json`
- **Body:**
  ```json
  {
    "orderId": "66f1a8b4c9e1234567890301",
    "carrier": "BlueDart",
    "trackingNumber": "BD123456789IN",
    "estimatedDeliveryDate": "2026-09-25T10:00:00.000Z"
  }
  ```

### 11.2 Get My Shipments
- **Method:** `GET`
- **Endpoint:** `{{BASE_URL}}/shipping`
- **Auth:** Required (`Bearer Token`)
- **Headers:** `Authorization: Bearer {{ACCESS_TOKEN}}`

### 11.3 Track Shipment by Tracking Number
- **Method:** `GET`
- **Endpoint:** `{{BASE_URL}}/shipping/tracking/BD123456789IN`
- **Auth:** Required (`Bearer Token`)
- **Headers:** `Authorization: Bearer {{ACCESS_TOKEN}}`

### 11.4 Get Shipment by ID
- **Method:** `GET`
- **Endpoint:** `{{BASE_URL}}/shipping/66f1a8b4c9e1234567890701`
- **Auth:** Required (`Bearer Token`)
- **Headers:** `Authorization: Bearer {{ACCESS_TOKEN}}`

### 11.5 Get All Shipments (Admin)
- **Method:** `GET`
- **Endpoint:** `{{BASE_URL}}/shipping/admin/all`
- **Auth:** Required (`ADMIN` role)
- **Headers:** `Authorization: Bearer {{ACCESS_TOKEN}}`

### 11.6 Update Shipment Status (Admin)
- **Method:** `PATCH`
- **Endpoint:** `{{BASE_URL}}/shipping/66f1a8b4c9e1234567890701/status`
- **Auth:** Required (`ADMIN` role)
- **Headers:** `Authorization: Bearer {{ACCESS_TOKEN}}`, `Content-Type: application/json`
- **Body:**
  ```json
  {
    "status": "DELIVERED",
    "location": "Mumbai Hub",
    "note": "Delivered to customer"
  }
  ```
  *(Status options: `LABEL_CREATED`, `PICKED_UP`, `IN_TRANSIT`, `OUT_FOR_DELIVERY`, `DELIVERED`, `FAILED_ATTEMPT`, `RETURNED_TO_SENDER`)*

---

## 📊 Complete Quick Reference Table

| Module | Method | Endpoint | Auth Level | Description |
|---|---|---|---|---|
| **Auth** | `POST` | `/api/v1/auth/register` | Public | Register new user account |
| **Auth** | `POST` | `/api/v1/auth/verify-email` | Public | Verify user email with OTP |
| **Auth** | `POST` | `/api/v1/auth/resend-verification` | Public | Resend OTP code |
| **Auth** | `POST` | `/api/v1/auth/login` | Public | Authenticate user & get JWT |
| **Auth** | `POST` | `/api/v1/auth/refresh` | Public | Refresh JWT access token |
| **Auth** | `POST` | `/api/v1/auth/logout` | User | Invalidate refresh session |
| **Auth** | `POST` | `/api/v1/auth/forgot-password` | Public | Send password reset code |
| **Auth** | `POST` | `/api/v1/auth/reset-password` | Public | Reset password using OTP |
| **Auth** | `PATCH` | `/api/v1/auth/change-password` | User | Change logged-in user password |
| **Auth** | `GET` | `/api/v1/auth/me` | User | Get user profile details |
| **Categories** | `GET` | `/api/v1/categories` | Public | Fetch all active categories |
| **Categories** | `GET` | `/api/v1/categories/:categoryId` | Public | Fetch single category by ID |
| **Categories** | `POST` | `/api/v1/categories` | Admin | Create a new category |
| **Categories** | `PATCH` | `/api/v1/categories/:categoryId` | Admin | Update category details |
| **Categories** | `DELETE` | `/api/v1/categories/:categoryId` | Admin | Delete category (checks linked products) |
| **Products** | `GET` | `/api/v1/products` | Public | List products (with search/filter/sort) |
| **Products** | `GET` | `/api/v1/products/slug/:slug` | Public | Get product by URL slug |
| **Products** | `GET` | `/api/v1/products/:productId` | Public | Get product by ObjectId |
| **Products** | `POST` | `/api/v1/products` | Admin | Create product (JSON or File upload) |
| **Products** | `PATCH` | `/api/v1/products/:productId` | Admin | Update product fields |
| **Products** | `DELETE` | `/api/v1/products/:productId` | Admin | Delete a product |
| **Cart** | `GET` | `/api/v1/cart` | User | View current active cart |
| **Cart** | `POST` | `/api/v1/cart/items` | User | Add item/quantity to cart |
| **Cart** | `PATCH` | `/api/v1/cart/items/:productId` | User | Set specific quantity for product |
| **Cart** | `DELETE` | `/api/v1/cart/items/:productId` | User | Remove item from cart |
| **Cart** | `DELETE` | `/api/v1/cart` | User | Empty entire user cart |
| **Orders** | `POST` | `/api/v1/orders` | User | Place order from cart |
| **Orders** | `GET` | `/api/v1/orders` | User | View order history |
| **Orders** | `GET` | `/api/v1/orders/number/:orderNumber` | User | Fetch order by human order number |
| **Orders** | `GET` | `/api/v1/orders/:orderId` | User | Fetch single order by ObjectId |
| **Orders** | `PATCH` | `/api/v1/orders/:orderId/cancel` | User | Cancel pending/processing order |
| **Orders** | `GET` | `/api/v1/orders/admin/all` | Admin | View all system orders |
| **Orders** | `PATCH` | `/api/v1/orders/admin/:orderId/status` | Admin | Update order status |
| **Prescriptions** | `POST` | `/api/v1/prescriptions/upload` | User | Upload prescription file |
| **Prescriptions** | `GET` | `/api/v1/prescriptions` | User | List user uploaded prescriptions |
| **Prescriptions** | `GET` | `/api/v1/prescriptions/:prescriptionId` | User | View prescription details |
| **Prescriptions** | `GET` | `/api/v1/prescriptions/admin/all` | Admin | View all uploaded prescriptions |
| **Prescriptions** | `PATCH` | `/api/v1/prescriptions/admin/:prescriptionId/review` | Admin | Approve or reject prescription |
| **Payments** | `POST` | `/api/v1/payments/create-order` | User | Initiate Razorpay payment order |
| **Payments** | `POST` | `/api/v1/payments/verify` | User | Verify payment signature |
| **Payments** | `GET` | `/api/v1/payments` | User | Get user payment transaction history |
| **Payments** | `GET` | `/api/v1/payments/order/:orderId` | User | Get payment details for order |
| **Payments** | `GET` | `/api/v1/payments/:paymentId` | User | Get payment transaction by ID |
| **Inventory** | `GET` | `/api/v1/inventory` | Admin | Get full stock status report |
| **Inventory** | `GET` | `/api/v1/inventory/:productId` | Admin | Get single product inventory |
| **Inventory** | `POST` | `/api/v1/inventory` | Admin | Initialize product inventory record |
| **Inventory** | `PATCH` | `/api/v1/inventory/:productId` | Admin | Modify stock/threshold settings |
| **Inventory** | `DELETE` | `/api/v1/inventory/:productId` | Admin | Remove inventory record |
| **Inventory** | `POST` | `/api/v1/inventory/:productId/add-stock` | Admin | Add physical stock count |
| **Inventory** | `POST` | `/api/v1/inventory/:productId/remove-stock` | Admin | Deduct stock count |
| **Inventory** | `POST` | `/api/v1/inventory/:productId/reserve` | Admin | Reserve stock for checkout |
| **Inventory** | `POST` | `/api/v1/inventory/:productId/release-reservation` | Admin | Release un-purchased reservation |
| **Notifications** | `GET` | `/api/v1/notifications` | User | Fetch user notifications |
| **Notifications** | `GET` | `/api/v1/notifications/order/:orderId` | User | Get notifications for specific order |
| **Notifications** | `GET` | `/api/v1/notifications/:notificationId` | User | Get notification by ID |
| **Notifications** | `GET` | `/api/v1/notifications/admin/all` | Admin | Get all system notifications |
| **Notifications** | `POST` | `/api/v1/notifications/order-status` | Admin | Dispatch manual order status notice |
| **Returns** | `POST` | `/api/v1/returns` | User | Submit return request |
| **Returns** | `GET` | `/api/v1/returns` | User | List user return requests |
| **Returns** | `GET` | `/api/v1/returns/number/:returnNumber` | User | Get return request by number |
| **Returns** | `GET` | `/api/v1/returns/:returnId` | User | Get single return request detail |
| **Returns** | `GET` | `/api/v1/returns/admin/all` | Admin | List all user return requests |
| **Returns** | `PATCH` | `/api/v1/returns/admin/:returnId/status` | Admin | Approve, reject, or refund return |
| **Shipping** | `POST` | `/api/v1/shipping` | Admin | Create shipment tracking record |
| **Shipping** | `GET` | `/api/v1/shipping` | User | List user shipments |
| **Shipping** | `GET` | `/api/v1/shipping/tracking/:trackingNumber` | User | Track package by tracking number |
| **Shipping** | `GET` | `/api/v1/shipping/:shipmentId` | User | Get shipment details by ID |
| **Shipping** | `GET` | `/api/v1/shipping/admin/all` | Admin | List all shipments in system |
| **Shipping** | `PATCH` | `/api/v1/shipping/:shipmentId/status` | Admin | Update shipment status/location |
