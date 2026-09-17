# MERN E-Commerce API Documentation

This guide explains how to test the backend APIs using **Postman** or **Thunder Client**. 

Between implementing Swagger (which requires adding complex JSDoc annotations to every route and installing heavy dependencies) and using a Markdown guide with API clients, **this Markdown guide is the "less effort and highly effective" option**. You can easily copy these endpoints into Postman or Thunder Client.

---

## ⚙️ Initial Setup (Postman / Thunder Client)

1. **Base URL:** Set your base URL to `http://localhost:5000/api/v1`
2. **Environment Variables:** Create a new environment in Postman/Thunder Client and add two variables:
   - `BASE_URL`: `http://localhost:5000/api/v1`
   - `ACCESS_TOKEN`: (Leave blank for now, you will fill this after logging in)
3. **Authorization:** For protected routes, go to the **Auth** tab in your request, select **Bearer Token**, and use `{{ACCESS_TOKEN}}` as the value.

---

## 🔐 1. Authentication (`/auth`)

Before testing other modules, you must register and log in to get your `ACCESS_TOKEN`.

### Register a new User
- **Method:** `POST`
- **URL:** `{{BASE_URL}}/auth/register`
- **Body (JSON):**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password123!",
    "confirmPassword": "Password123!"
  }
  ```

### Login (Get Access Token)
- **Method:** `POST`
- **URL:** `{{BASE_URL}}/auth/login`
- **Body (JSON):**
  ```json
  {
    "email": "john@example.com",
    "password": "Password123!"
  }
  ```
> **Action:** Copy the `accessToken` from the response and paste it into your `ACCESS_TOKEN` environment variable in Postman.

---

## 📦 2. Categories (`/categories`)

### Get All Categories (Public)
- **Method:** `GET`
- **URL:** `{{BASE_URL}}/categories`

### Create Category (Admin Only)
- **Method:** `POST`
- **URL:** `{{BASE_URL}}/categories`
- **Headers:** Authorization: Bearer `{{ACCESS_TOKEN}}`
- **Body (JSON):**
  ```json
  {
    "name": "Dog Food",
    "slug": "dog-food",
    "description": "Premium dog food products"
  }
  ```

---

## 🛍️ 3. Products (`/products`)

### Get All Products (Public)
- **Method:** `GET`
- **URL:** `{{BASE_URL}}/products`

### Create Product (Admin Only)
- **Method:** `POST`
- **URL:** `{{BASE_URL}}/products`
- **Headers:** Authorization: Bearer `{{ACCESS_TOKEN}}`
- **Body (JSON):**
  ```json
  {
    "name": "Premium Kibble",
    "slug": "premium-kibble",
    "description": "Healthy dry food for adult dogs.",
    "category": "<CATEGORY_ID_FROM_PREVIOUS_STEP>",
    "price": 500,
    "compareAtPrice": 600,
    "sku": "KIBBLE-001",
    "brand": "PetCare"
  }
  ```

---

## 🛒 4. Cart (`/cart`)

### Get My Cart
- **Method:** `GET`
- **URL:** `{{BASE_URL}}/cart`
- **Headers:** Authorization: Bearer `{{ACCESS_TOKEN}}`

### Add Item to Cart
- **Method:** `POST`
- **URL:** `{{BASE_URL}}/cart/items`
- **Headers:** Authorization: Bearer `{{ACCESS_TOKEN}}`
- **Body (JSON):**
  ```json
  {
    "productId": "<PRODUCT_ID>",
    "quantity": 2
  }
  ```

---

## 🚚 5. Orders (`/orders`)

### Create Order (Checkout)
- **Method:** `POST`
- **URL:** `{{BASE_URL}}/orders`
- **Headers:** Authorization: Bearer `{{ACCESS_TOKEN}}`
- **Body (JSON):**
  ```json
  {
    "shippingAddress": {
      "street": "123 Pet Street",
      "city": "Mumbai",
      "state": "MH",
      "pincode": "400001",
      "country": "India"
    },
    "paymentMethod": "RAZORPAY"
  }
  ```

### Get My Orders
- **Method:** `GET`
- **URL:** `{{BASE_URL}}/orders/my-orders`
- **Headers:** Authorization: Bearer `{{ACCESS_TOKEN}}`

---

## ⚕️ 6. Prescriptions (`/prescriptions`)

### Upload Prescription
- **Method:** `POST`
- **URL:** `{{BASE_URL}}/prescriptions`
- **Headers:** Authorization: Bearer `{{ACCESS_TOKEN}}`
- **Body (multipart/form-data):**
  - Key: `file` (Type: File) -> Select an image/PDF
  - Key: `notes` (Type: Text) -> "For my dog's skin condition"

---

## 💳 7. Payments (`/payments`)

### Verify Razorpay Payment
After creating an order with `"paymentMethod": "RAZORPAY"`, the order returns a `razorpayOrderId`. You use that to complete the frontend payment, then hit this endpoint.
- **Method:** `POST`
- **URL:** `{{BASE_URL}}/payments/verify`
- **Headers:** Authorization: Bearer `{{ACCESS_TOKEN}}`
- **Body (JSON):**
  ```json
  {
    "razorpay_order_id": "order_XXXXX",
    "razorpay_payment_id": "pay_XXXXX",
    "razorpay_signature": "XXXXX"
  }
  ```

---

## 🔄 General Testing Flow

1. **Start the server:** Make sure `npm run dev` is running in your terminal.
2. **Register -> Login**: Get the JWT token.
3. **Set Token**: Put the token in Thunder Client / Postman headers.
4. **Create Data**: If you are an ADMIN, create Categories and Products.
5. **Shop**: Add items to the Cart.
6. **Checkout**: Hit the Create Order endpoint.

## 📊 Complete Endpoint Reference

| Module | Method | Endpoint | Description |
|--------|--------|----------|-------------|
| auth | `POST` | `/api/v1/auth/register` | |
| auth | `POST` | `/api/v1/auth/verify-email` | |
| auth | `POST` | `/api/v1/auth/resend-verification` | |
| auth | `POST` | `/api/v1/auth/login` | |
| auth | `POST` | `/api/v1/auth/refresh` | |
| auth | `POST` | `/api/v1/auth/logout` | |
| auth | `POST` | `/api/v1/auth/forgot-password` | |
| auth | `POST` | `/api/v1/auth/reset-password` | |
| auth | `PATCH` | `/api/v1/auth/change-password` | |
| auth | `GET` | `/api/v1/auth/me` | |
| cart | `GET` | `/api/v1/cart` | |
| cart | `POST` | `/api/v1/cart/items` | |
| cart | `PATCH` | `/api/v1/cart/items/:productId` | |
| cart | `DELETE` | `/api/v1/cart/items/:productId` | |
| cart | `DELETE` | `/api/v1/cart` | |
| categories | `GET` | `/api/v1/categories` | |
| categories | `GET` | `/api/v1/categories/:categoryId` | |
| categories | `POST` | `/api/v1/categories` | |
| categories | `PATCH` | `/api/v1/categories/:categoryId` | |
| categories | `DELETE` | `/api/v1/categories/:categoryId` | |
| inventory | `GET` | `/api/v1/inventory` | |
| inventory | `GET` | `/api/v1/inventory/:productId` | |
| inventory | `POST` | `/api/v1/inventory` | |
| inventory | `PATCH` | `/api/v1/inventory/:productId` | |
| inventory | `DELETE` | `/api/v1/inventory/:productId` | |
| inventory | `POST` | `/api/v1/inventory/:productId/add-stock` | |
| inventory | `POST` | `/api/v1/inventory/:productId/remove-stock` | |
| inventory | `POST` | `/api/v1/inventory/:productId/reserve` | |
| inventory | `POST` | `/api/v1/inventory/:productId/release-reservation` | |
| notifications | `POST` | `/api/v1/notifications/order-status` | |
| notifications | `GET` | `/api/v1/notifications` | |
| notifications | `GET` | `/api/v1/notifications/order/:orderId` | |
| notifications | `GET` | `/api/v1/notifications/admin/all` | |
| notifications | `GET` | `/api/v1/notifications/:notificationId` | |
| orders | `POST` | `/api/v1/orders` | |
| orders | `GET` | `/api/v1/orders` | |
| orders | `GET` | `/api/v1/orders/number/:orderNumber` | |
| orders | `GET` | `/api/v1/orders/:orderId` | |
| orders | `PATCH` | `/api/v1/orders/:orderId/cancel` | |
| orders | `GET` | `/api/v1/orders/admin/all` | |
| orders | `PATCH` | `/api/v1/orders/admin/:orderId/status` | |
| payments | `POST` | `/api/v1/payments/create-order` | |
| payments | `POST` | `/api/v1/payments/verify` | |
| payments | `GET` | `/api/v1/payments` | |
| payments | `GET` | `/api/v1/payments/order/:orderId` | |
| payments | `GET` | `/api/v1/payments/:paymentId` | |
| prescriptions | `POST` | `/api/v1/prescriptions/upload` | |
| prescriptions | `GET` | `/api/v1/prescriptions` | |
| prescriptions | `GET` | `/api/v1/prescriptions/admin/all` | |
| prescriptions | `PATCH` | `/api/v1/prescriptions/admin/:prescriptionId/review` | |
| prescriptions | `GET` | `/api/v1/prescriptions/:prescriptionId` | |
| products | `GET` | `/api/v1/products` | |
| products | `GET` | `/api/v1/products/slug/:slug` | |
| products | `GET` | `/api/v1/products/:productId` | |
| products | `POST` | `/api/v1/products` | |
| products | `PATCH` | `/api/v1/products/:productId` | |
| products | `DELETE` | `/api/v1/products/:productId` | |
| returns | `POST` | `/api/v1/returns` | |
| returns | `GET` | `/api/v1/returns` | |
| returns | `GET` | `/api/v1/returns/number/:returnNumber` | |
| returns | `GET` | `/api/v1/returns/admin/all` | |
| returns | `PATCH` | `/api/v1/returns/admin/:returnId/status` | |
| returns | `GET` | `/api/v1/returns/:returnId` | |
| shipping | `GET` | `/api/v1/shipping` | |
| shipping | `GET` | `/api/v1/shipping/tracking/:trackingNumber` | |
| shipping | `GET` | `/api/v1/shipping/:shipmentId` | |
| shipping | `POST` | `/api/v1/shipping` | |
| shipping | `PATCH` | `/api/v1/shipping/:shipmentId/status` | |
| shipping | `GET` | `/api/v1/shipping/admin/all` | |
