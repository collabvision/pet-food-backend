# MASTER PROMPT — MERN E-COMMERCE BACKEND

You are working on a production-oriented MERN e-commerce backend.

The backend must be designed as a **modular monolith with clean boundaries**, so individual modules can be developed, tested, replaced, and integrated without tightly coupling business logic to third-party providers.

The project uses:

* Node.js
* Express.js
* MongoDB
* Mongoose
* JavaScript ES Modules
* JWT authentication
* bcryptjs
* Zod validation
* Nodemailer / email provider abstraction
* Razorpay payment gateway
* Sharp for image processing
* Cloudinary for product image storage
* Third-party inventory provider abstraction
* Third-party shipping provider abstraction
* WhatsApp notification provider abstraction
* Event bus for inter-module communication

DO NOT use TypeScript.

Use JavaScript only.

---

# 1. CORE DEVELOPMENT RULE

The backend should be developed **module-by-module**.

The preferred workflow is:

1. Implement one module.
2. Add all required files for that module.
3. Run/import-test the module.
4. Add exactly ONE test file for that module.
5. Test important success and failure cases.
6. Fix the module until its test passes.
7. Only then move to the next module.

Do not jump to the next module while the current module is broken.

When asked for the "next module", provide only the next required module and its implementation unless additional context is necessary.

---

# 2. CODING PREFERENCES

Use:

* JavaScript
* ES modules
* async/await
* Express
* Mongoose
* Zod
* clean service/repository/controller separation

Avoid:

* TypeScript
* unnecessary abstractions
* unnecessary frameworks
* business logic inside controllers
* database logic inside routes
* provider-specific code directly inside business services

The architecture must make it possible to replace:

* Gmail/Outlook
* WhatsApp provider
* Razorpay
* Cloudinary
* inventory provider
* shipping provider

without rewriting the core business logic.

---

# 3. PROJECT STRUCTURE

The target structure is:

```text
backend/
│
├── .env
├── .env.example
├── package.json
├── package-lock.json
│
├── src/
│   │
│   ├── app.js
│   ├── server.js
│   │
│   ├── config/
│   │   ├── db.js
│   │   ├── env.js
│   │   └── logger.js
│   │
│   ├── events/
│   │   ├── eventBus.js
│   │   ├── inventory.events.js
│   │   ├── order.events.js
│   │   └── payment.events.js
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   ├── rateLimit.middleware.js
│   │   ├── role.middleware.js
│   │   ├── upload.middleware.js
│   │   └── validate.middleware.js
│   │
│   ├── modules/
│   │   │
│   │   ├── auth/
│   │   │   ├── auth.model.js
│   │   │   ├── auth.repository.js
│   │   │   ├── auth.validation.js
│   │   │   ├── auth.service.js
│   │   │   ├── auth.controller.js
│   │   │   └── auth.routes.js
│   │   │
│   │   ├── users/
│   │   │
│   │   ├── categories/
│   │   │
│   │   ├── products/
│   │   │
│   │   ├── cart/
│   │   │
│   │   ├── orders/
│   │   │
│   │   ├── payments/
│   │   │
│   │   ├── inventory/
│   │   │
│   │   ├── shipping/
│   │   │
│   │   ├── returns/
│   │   │
│   │   ├── prescriptions/
│   │   │
│   │   ├── notifications/
│   │   │
│   │   └── billing/
│   │
│   ├── providers/
│   │   ├── email/
│   │   ├── whatsapp/
│   │   ├── payment/
│   │   ├── inventory/
│   │   ├── shipping/
│   │   └── storage/
│   │
│   ├── utils/
│   │   ├── ApiError.js
│   │   ├── asyncHandler.js
│   │   ├── crypto.js
│   │   ├── pagination.js
│   │   └── response.js
│   │
│   └── tests/
│
└── uploads/
```

---

# 4. USER ROLES

There are ONLY two roles:

```text
USER
ADMIN
```

Do not create additional roles.

## USER

A USER can:

* register
* verify email
* login
* logout
* refresh token
* forgot password
* reset password
* change password
* view own profile
* browse products
* browse categories
* manage cart
* create orders
* view own orders
* cancel eligible orders
* make payments
* track own shipments
* request defective-product returns
* view own returns
* upload prescription
* view/download their approved prescription
* receive order notifications

A USER must never access another user's:

* profile
* cart
* order
* payment
* prescription
* return
* private data

---

# 5. ADMIN

ADMIN can:

* manage products
* manage categories
* manage inventory
* view all users where appropriate
* view all orders
* update order status
* view payments
* manage shipments
* view all returns
* approve/reject returns
* review prescriptions
* approve/reject prescriptions
* manage inventory synchronization
* monitor provider failures
* perform administrative operations

ADMIN must not automatically have unrestricted access to sensitive user information unless required by the operation.

---

# 6. AUTHENTICATION SYSTEM

Authentication uses:

```text
JWT Access Token
JWT Refresh Token
```

Passwords must never be stored as plaintext.

Use:

```text
bcryptjs
```

for password hashing.

---

# 7. REGISTRATION FLOW

Registration:

```text
USER
 ↓
POST /auth/register
 ↓
validate input
 ↓
check existing user
 ↓
hash password
 ↓
create pending registration
 ↓
generate verification code
 ↓
store hashed verification code
 ↓
send verification email
 ↓
USER verifies code
 ↓
create actual USER account
```

Do not create the final account before email verification if the architecture is using pending registration.

The verification code should be stored hashed.

Never store the plaintext verification code in MongoDB.

---

# 8. REGISTRATION EDGE CASES

Handle:

### Duplicate email

If the email already belongs to an active user:

```text
400/409
Email already registered
```

### Existing pending registration

Do not create unlimited pending registrations.

Either:

* update existing pending registration
* replace verification code
* reset expiration

### Expired verification code

Reject it.

### Incorrect verification code

Reject it.

### Verification after expiration

Reject it.

### Verification after successful verification

Reject it.

### Email sending failure

Do not leave the system in an inconsistent state.

If appropriate:

```text
create pending registration
send email
if email fails:
    cleanup pending registration
    return error
```

### Resend verification

Generate a new code.

Invalidate the previous code.

Do not allow an old verification code to work after a new one has been generated.

---

# 9. LOGIN

Login:

```text
email
password
 ↓
find user
 ↓
verify password
 ↓
check account active
 ↓
check email verified
 ↓
generate access token
 ↓
generate refresh token
```

Do not return password hashes.

---

# 10. AUTH EDGE CASES

Handle:

* nonexistent email
* incorrect password
* unverified email
* inactive user
* expired access token
* invalid access token
* expired refresh token
* invalid refresh token
* refresh token reuse
* logout
* missing Authorization header
* malformed Authorization header
* wrong role
* password reset
* expired password reset token
* invalid password reset token
* password change

---

# 11. EMAIL SYSTEM

Email must use a provider abstraction.

Core business logic should NOT know whether email is sent using:

* Outlook
* Gmail
* Brevo
* SMTP
* another provider

Example:

```text
EmailProvider
    ↓
ConsoleEmailProvider
    ↓
OutlookProvider
    ↓
GmailProvider
```

For development, use:

```text
ConsoleEmailProvider
```

instead of sending real emails.

The console provider should return:

```js
{
    success: true,
    channel: "email"
}
```

and log:

* recipient
* subject
* message

---

# 12. EMAIL USE CASES

Email is required for:

### Authentication

* registration verification
* resend verification
* forgot password
* password reset
* password changed

### Orders

* order created
* payment successful
* payment failed
* order processing
* order shipped
* order delivered
* order cancelled
* return status

The exact notification events should be handled through the notification/event architecture.

---

# 13. WHATSAPP SYSTEM

WhatsApp must also use a provider abstraction.

Development provider:

```text
ConsoleWhatsAppProvider
```

Production provider can later be:

* Meta WhatsApp Cloud API
* Twilio
* another provider

For now, DO NOT require a real WhatsApp provider.

Console provider must return:

```js
{
    success: true,
    channel: "whatsapp"
}
```

---

# 14. WHATSAPP RULE

WhatsApp notifications are required ONLY for order status-related notifications.

Recipients:

```text
USER phone number
ADMIN phone number
```

Do not send unrelated authentication notifications through WhatsApp unless explicitly added later.

---

# 15. NOTIFICATION MODULE

The notification module is responsible for:

* creating notification records
* selecting notification channel
* calling email provider
* calling WhatsApp provider
* tracking notification status
* preventing unnecessary duplicate notifications

Potential notification model:

```text
userId
type
channel
recipient
subject
message
status
referenceType
referenceId
sentAt
failureReason
timestamps
```

Possible statuses:

```text
PENDING
SENT
FAILED
```

---

# 16. NOTIFICATION EDGE CASES

Handle:

* email provider failure
* WhatsApp provider failure
* invalid recipient
* duplicate notification
* notification for nonexistent order
* notification for unauthorized user
* notification for admin
* provider timeout
* retry
* notification failure logging

A notification failure should not necessarily roll back the main business transaction.

Example:

Order successfully created.

Email fails.

Order must remain created.

Notification should become:

```text
FAILED
```

and can be retried.

---

# 17. CATEGORIES

Category CRUD is required.

ADMIN:

```text
create
read
update
delete
```

USER:

```text
read
```

Prevent:

* duplicate category names
* invalid category IDs
* deleting a category still used by products unless explicitly handled
* unauthorized modification

---

# 18. PRODUCTS

Products are publicly readable.

Login is NOT required to browse products.

ADMIN controls:

```text
create product
update product
delete product
view products
```

Product should support:

```text
name
description
category
price
discount
GST/tax information
stock reference
images
prescriptionRequired
active/status
timestamps
```

---

# 19. PRODUCT VALIDATION

Prevent:

* negative price
* negative quantity
* invalid category
* invalid GST percentage
* invalid discount
* duplicate product identifiers
* invalid image references
* malformed IDs

Product prices must be controlled by the backend.

---

# 20. CART

Cart belongs to exactly one user.

Structure:

```text
userId
items[]
```

Each item:

```text
productId
quantity
```

Routes:

```text
GET    /api/v1/cart/
POST   /api/v1/cart/items
PATCH  /api/v1/cart/items/:productId
DELETE /api/v1/cart/items/:productId
DELETE /api/v1/cart/
```

---

# 21. CART RULES

When adding product:

* product must exist
* product must be active
* quantity must be positive
* quantity must be valid
* stock should be checked where appropriate

Do NOT reserve inventory merely because an item is added to cart.

Inventory reservation happens during checkout/order processing.

---

# 22. CART EDGE CASES

Handle:

* nonexistent product
* inactive product
* quantity 0
* negative quantity
* extremely large quantity
* duplicate item
* updating nonexistent item
* deleting nonexistent item
* unauthorized cart access
* user A trying to access user B's cart

If product price changes after adding to cart, checkout must use the current server-side price.

---

# 23. ORDER SYSTEM

Order creation is a critical transaction.

Order contains:

```text
orderNumber
userId
items
shippingAddress
subtotal
shippingCharge
discount
totalAmount
paymentStatus
orderStatus
paymentId
shipmentId
statusHistory
placedAt
deliveredAt
cancelledAt
```

Order item should store a snapshot of important product data, such as:

```text
productId
name
price
quantity
tax
discount
```

This protects historical order data when product information changes later.

---

# 24. ORDER STATUS

Supported statuses:

```text
PENDING
CONFIRMED
PROCESSING
SHIPPED
DELIVERED
CANCELLED
RETURN_REQUESTED
RETURNED
```

Do not allow arbitrary status strings.

---

# 25. ORDER STATUS HISTORY

Every important status change must be recorded.

Example:

```text
PENDING
 ↓
CONFIRMED
 ↓
PROCESSING
 ↓
SHIPPED
 ↓
DELIVERED
```

History should contain:

```text
status
timestamp
changedBy
note/reason
```

This allows complete order tracking.

---

# 26. ORDER CREATION FLOW

Correct conceptual flow:

```text
USER
 ↓
checkout
 ↓
server loads cart
 ↓
server loads products
 ↓
server validates product availability
 ↓
server calculates prices
 ↓
server calculates GST
 ↓
server calculates discount
 ↓
server calculates shipping
 ↓
server calculates final amount
 ↓
prescription validation
 ↓
inventory reservation
 ↓
create order
 ↓
create payment order
 ↓
USER pays
 ↓
payment verification/webhook
 ↓
payment successful
 ↓
inventory confirmation/deduction
 ↓
shipment creation
 ↓
notifications
```

Do NOT trust client-provided:

```text
price
subtotal
tax
discount
total
```

All financial values must be recalculated on the backend.

---

# 27. ORDER CANCELLATION

Cancellation must be state-dependent.

For example, cancellation may be allowed while order is:

```text
PENDING
CONFIRMED
PROCESSING
```

but not after:

```text
DELIVERED
```

or after an irreversible shipping state, depending on business rules.

When cancellation happens:

```text
order status → CANCELLED
```

Then handle inventory:

```text
reserved stock → released
```

If payment has already occurred, refund handling may be required.

---

# 28. ORDER EDGE CASES

Handle:

* empty cart
* invalid product
* inactive product
* insufficient stock
* inventory provider failure
* prescription missing
* prescription rejected
* price changed
* product deleted
* invalid shipping address
* duplicate order request
* duplicate payment
* payment timeout
* payment failure
* cancellation after shipment
* cancellation after delivery
* notification failure
* shipping provider failure

---

# 29. INVENTORY SYSTEM

Inventory is a separate module.

Required concepts:

```text
available
reserved
sold
```

Core operations:

```text
getStock
reserveStock
releaseStock
deductStock
restoreStock
adjustStock
```

---

# 30. INVENTORY BUSINESS FLOW

Do NOT reserve stock when the user adds an item to cart.

At checkout:

```text
available
   ↓
reserved
```

After successful payment:

```text
reserved
   ↓
sold
```

If payment fails:

```text
reserved
   ↓
available
```

If an already-sold item is returned and accepted:

```text
sold
   ↓
available
```

depending on whether the returned product is actually resalable.

---

# 31. THIRD-PARTY INVENTORY

Inventory must support both:

```text
Local inventory
Third-party inventory
```

Use:

```text
InventoryProvider
```

Do not directly call a third-party inventory API from business logic.

---

# 32. INITIAL INVENTORY SYNC

When integration starts:

```text
third-party inventory
        ↓
fetch ALL inventory
        ↓
validate data
        ↓
map external IDs
        ↓
create/update local inventory
```

This gives local MongoDB a synchronized baseline.

---

# 33. INVENTORY SYNC AFTER OPERATIONS

After initial synchronization, every relevant inventory operation should synchronize with the third-party system.

Example:

```text
reserve local stock
       ↓
third-party reserve
       ↓
success
```

If third-party operation fails:

```text
detect failure
↓
record failure
↓
retry / reconciliation
```

Do not silently ignore external inventory failures.

---

# 34. INVENTORY FAILURE CASES

Handle:

* third-party timeout
* third-party 400
* third-party 401
* third-party 500
* network failure
* insufficient external stock
* local/external stock mismatch
* duplicate external request
* partial success
* retry
* stale synchronization
* unknown external product
* external product deleted

Operations must be designed to avoid double reservation/deduction.

---

# 35. BILLING / GST

Billing must be a separate responsibility.

Backend calculates:

```text
product price
× quantity
= item subtotal

item subtotal
- discount
= taxable base

GST
+ shipping
= final payable
```

The exact tax formula must follow the application's configured GST rules.

Support:

```text
GST percentage
CGST
SGST
IGST
taxable amount
discount
shipping charge
final payable
```

---

# 36. BILLING SECURITY

NEVER trust:

```text
client subtotal
client GST
client total
client product price
```

The server must load the actual product prices from MongoDB.

Example:

Client sends:

```json
{
    "productId": "...",
    "quantity": 2,
    "price": 10
}
```

Backend must ignore the supplied price.

If database price is:

```text
₹100
```

calculation must use:

```text
₹100 × 2
```

not:

```text
₹10 × 2
```

---

# 37. BILLING EDGE CASES

Handle:

* zero quantity
* negative quantity
* product deleted
* product inactive
* price changed
* invalid discount
* discount greater than subtotal
* invalid GST
* floating-point precision
* shipping charge negative
* empty cart
* prescription-required product
* tax calculation mismatch

Use integer minor units where appropriate for monetary precision.

For INR:

```text
paise
```

can be used internally for payment calculations.

---

# 38. PRESCRIPTION PRODUCTS

Some products require prescriptions.

Product field:

```text
prescriptionRequired: true
```

If a cart/order contains such a product:

```text
prescription is required
```

before order completion.

---

# 39. PRESCRIPTION FLOW

```text
USER
 ↓
upload prescription
 ↓
store private file
 ↓
create prescription record
 ↓
ADMIN reviews
 ↓
APPROVED / REJECTED
 ↓
USER can use approved prescription
```

---

# 40. PRESCRIPTION SECURITY

Prescription files contain sensitive information.

Do NOT expose them as public URLs.

Access must be controlled.

Only:

```text
owner USER
ADMIN
```

should access appropriate prescription data.

User must be able to download an approved prescription to their machine.

The download route must verify ownership.

Example:

```text
GET /prescriptions/:id/download
```

Before sending file:

```text
verify authentication
verify ownership OR ADMIN
verify prescription exists
verify approval if required
```

---

# 41. PRESCRIPTION EDGE CASES

Handle:

* unsupported file type
* oversized file
* corrupted file
* missing file
* nonexistent prescription
* unauthorized download
* another user's prescription
* rejected prescription
* pending prescription
* duplicate upload
* admin reviewing nonexistent prescription

---

# 42. PRODUCT IMAGE SYSTEM

Product images must be processed before storage.

Required processing:

```text
original image
 ↓
detect format
 ↓
if already WebP:
    preserve WebP path
else:
    convert to WebP
 ↓
compress
 ↓
preserve acceptable visual quality
 ↓
upload to Cloudinary
 ↓
save returned URL/public ID in MongoDB
```

---

# 43. IMAGE PROVIDER

Use:

```text
StorageProvider
```

or equivalent abstraction.

Example:

```text
ConsoleStorageProvider
CloudinaryStorageProvider
```

Core product logic should not depend directly on Cloudinary SDK.

---

# 44. IMAGE EDGE CASES

Handle:

* invalid file
* non-image file
* corrupted image
* huge image
* WebP input
* JPEG
* PNG
* GIF where appropriate
* unsupported image format
* Cloudinary upload failure
* Sharp conversion failure
* partial upload
* database update failure after Cloudinary upload
* deleting old image
* replacing image
* multiple images
* duplicate upload

Important:

If Cloudinary upload succeeds but MongoDB update fails, do not silently leak orphaned files.

Provide cleanup/reconciliation strategy.

---

# 45. PRODUCT IMAGE SCALE

The system should be designed to support:

```text
7000+ products
```

and potentially multiple images per product.

Do not store raw image binaries directly inside MongoDB.

Store references such as:

```text
url
publicId
width
height
format
```

---

# 46. CLOUDINARY

Cloudinary is used for product images.

Expected environment variables may include:

```text
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
```

Do not expose the API secret to frontend code.

---

# 47. SHIPPING SYSTEM

Shipping must use a provider abstraction.

Example:

```text
ShippingProvider
```

Production implementation can later be connected to a real courier/shipping provider.

Required capabilities:

```text
getRates
createShipment
getShipment
getTracking
getLabel
cancelShipment
handleWebhook
```

---

# 48. SHIPPING FLOW

After successful payment:

```text
order confirmed
 ↓
create shipment
 ↓
receive external shipment ID
 ↓
store shipment
 ↓
receive tracking number
 ↓
notify user/admin
```

Tracking:

```text
provider
 ↓
tracking updates
 ↓
local shipment
 ↓
order status
 ↓
notification
```

---

# 49. SHIPPING STATUS

Support:

```text
PENDING
READY_TO_SHIP
SHIPPED
IN_TRANSIT
OUT_FOR_DELIVERY
DELIVERED
CANCELLED
RETURNED
```

Do not accept arbitrary statuses.

---

# 50. SHIPPING EDGE CASES

Handle:

* shipment creation failure
* invalid address
* provider timeout
* tracking number missing
* duplicate shipment
* cancellation failure
* shipment already delivered
* invalid status transition
* webhook duplicate
* webhook signature validation
* provider outage
* tracking unavailable

---

# 51. PAYMENT SYSTEM

Payment gateway:

```text
Razorpay
```

But payment business logic must use:

```text
PaymentProvider
```

Example:

```text
RazorpayProvider
```

---

# 52. PAYMENT FLOW

```text
USER checkout
 ↓
server calculates final amount
 ↓
create order
 ↓
create Razorpay order
 ↓
send Razorpay order details to frontend
 ↓
user completes payment
 ↓
frontend receives payment response
 ↓
backend verifies payment signature
 ↓
webhook reconciliation
 ↓
payment becomes final
 ↓
order payment status updated
 ↓
inventory finalized
 ↓
shipping created
 ↓
notifications sent
```

---

# 53. PAYMENT STATUSES

Payment records can use:

```text
CREATED
AUTHORIZED
CAPTURED
FAILED
REFUNDED
```

Order payment status:

```text
PENDING
AUTHORIZED
PAID
FAILED
REFUNDED
```

---

# 54. PAYMENT SECURITY

Never trust:

```text
frontend payment success
```

alone.

Backend must verify Razorpay signature.

Webhook must also be validated.

Do not expose Razorpay secret to frontend.

---

# 55. PAYMENT EDGE CASES

Handle:

* invalid signature
* duplicate verification
* payment failure
* payment timeout
* webhook before frontend verification
* frontend verification before webhook
* duplicate webhook
* webhook out of order
* already captured payment
* refund
* partial failure
* order not found
* payment not found
* mismatched amount
* mismatched order ID

Payment processing must be idempotent.

---

# 56. PAYMENT + INVENTORY

Correct logic:

```text
checkout
 ↓
reserve stock
 ↓
payment
```

If payment succeeds:

```text
reserved → sold
```

If payment fails:

```text
reserved → available
```

Do not permanently deduct stock before successful payment unless the architecture explicitly requires it.

---

# 57. PAYMENT + ORDER

Payment status and order status are different concepts.

Example:

```text
paymentStatus = PAID
orderStatus = PROCESSING
```

Do not incorrectly use one field for both.

---

# 58. RETURNS

Returns are allowed ONLY for:

```text
DEFECTIVE PRODUCT
```

Do not implement general "I don't want this anymore" returns.

---

# 59. RETURN FLOW

```text
USER
 ↓
select delivered order
 ↓
select product
 ↓
provide defective reason
 ↓
request return
 ↓
RETURN_REQUESTED
 ↓
ADMIN reviews
 ↓
APPROVED / REJECTED
 ↓
product returned
 ↓
RETURNED
```

---

# 60. RETURN VALIDATION

Verify:

* order belongs to user
* order exists
* product belongs to order
* order is delivered where required
* product has not already been returned
* reason is provided
* return quantity is valid
* return is for defective product only

---

# 61. RETURN EDGE CASES

Handle:

* another user's order
* nonexistent order
* nonexistent product
* product not in order
* duplicate return
* return before delivery
* invalid quantity
* return already completed
* return already rejected
* unauthorized admin action

---

# 62. EVENT BUS

Modules should communicate through events where appropriate.

Example events:

```text
OrderCreated
PaymentSuccessful
PaymentFailed
OrderShipped
OrderDelivered
OrderCancelled
```

Potential inventory events:

```text
StockReserved
StockReleased
StockDeducted
StockRestored
```

---

# 63. EVENT FLOW

Example:

```text
PaymentSuccessful
        ↓
EventBus
        ↓
Inventory listener
        ↓
deduct stock

        ↓
Order listener
        ↓
update order

        ↓
Shipping listener
        ↓
create shipment

        ↓
Notification listener
        ↓
email + WhatsApp
```

This prevents Order, Payment, Inventory, Shipping and Notification modules from becoming tightly coupled.

---

# 64. EVENT FAILURE

Event handlers should be designed carefully.

If:

```text
OrderCreated
```

fires and notification fails:

```text
Order remains created.
```

Notification failure must not automatically destroy the order.

If inventory operation fails:

```text
critical business failure
```

must be handled explicitly.

For important events, consider:

* idempotency
* retry
* failure logging
* reconciliation

---

# 65. EVENT IDEMPOTENCY

The same event may be delivered more than once.

Example:

```text
PaymentSuccessful
PaymentSuccessful
```

must NOT:

```text
deduct stock twice
send duplicate shipment
create two shipments
```

Handlers should be idempotent.

---

# 66. ADMIN ORDER STATUS

Admin can update order status, but status transitions must be validated.

Do not allow arbitrary transitions such as:

```text
DELIVERED → PENDING
```

unless explicitly supported.

Every transition should create history.

Every relevant transition should trigger notifications.

---

# 67. API AUTHORIZATION

Public:

```text
GET products
GET categories
```

USER:

```text
cart
orders
payments
returns
prescriptions
```

ADMIN:

```text
product management
category management
inventory management
all orders
all returns
prescription review
shipment management
```

Middleware should enforce:

```text
authenticate
authorize(USER)
authorize(ADMIN)
```

---

# 68. VALIDATION

Use Zod validation for request input.

Validate:

* body
* params
* query
* pagination
* IDs
* email
* passwords
* quantities
* prices where relevant
* status enums

Validation errors should produce consistent API errors.

---

# 69. ERROR HANDLING

Use a centralized error middleware.

Errors should have:

```text
statusCode
message
optional details
```

Do not expose:

* stack traces in production
* password hashes
* JWT secrets
* API secrets
* database credentials
* provider credentials

---

# 70. SECURITY

Use:

```text
helmet
cors
rate limiting
JWT
bcrypt
input validation
```

Protect:

* auth endpoints
* password reset
* verification resend
* payment endpoints
* admin endpoints

Use rate limits for:

```text
login
register
verification
resend verification
forgot password
```

---

# 71. DATABASE

MongoDB + Mongoose.

Use indexes where required:

```text
email
orderNumber
trackingNumber
external IDs
userId
category name
```

Avoid unnecessary indexes.

Ensure unique fields are actually protected at database level.

---

# 72. API RESPONSE FORMAT

Use a consistent response utility.

Example:

```json
{
    "success": true,
    "message": "Operation successful",
    "data": {}
}
```

Errors:

```json
{
    "success": false,
    "message": "Something went wrong"
}
```

Do not expose internal stack traces.

---

# 73. PAGINATION

Large collections must support pagination.

Use:

```text
page
limit
skip
```

or cursor pagination where appropriate.

Admin endpoints especially require pagination:

```text
products
orders
users
returns
prescriptions
notifications
inventory
```

Prevent unreasonable limits.

Example:

```text
limit <= 100
```

---

# 74. DATABASE TRANSACTIONS

Use MongoDB transactions when multiple database writes must succeed together.

Examples:

```text
create order + related payment state
return processing
inventory local updates
```

However, external provider calls cannot participate in MongoDB transactions.

Therefore use:

```text
transaction
+
provider operation
+
reconciliation
```

rather than pretending external APIs are transactional.

---

# 75. IDEMPOTENCY

Critical operations should support idempotency.

Especially:

```text
order creation
payment verification
webhooks
inventory deduction
shipment creation
refund
notifications
```

Example:

If frontend sends:

```text
POST /payments/verify
```

twice:

the second request must NOT create duplicate payment records or perform duplicate business operations.

---

# 76. THIRD-PARTY PROVIDER ABSTRACTIONS

Every external integration must have a boundary.

Required:

```text
providers/email/
providers/whatsapp/
providers/payment/
providers/inventory/
providers/shipping/
providers/storage/
```

Core modules should depend on interfaces/classes/contracts rather than vendor-specific implementation details.

---

# 77. DEVELOPMENT MODE

For development:

```text
Email → ConsoleEmailProvider
WhatsApp → ConsoleWhatsAppProvider
Inventory → Mock/Console provider if real provider unavailable
Shipping → Mock/Console provider if real provider unavailable
Storage → local/mock provider if Cloudinary unavailable
Payment → Razorpay test mode
```

The business logic should still behave as if the provider exists.

---

# 78. TESTING STRATEGY

There should be exactly ONE primary test file per module.

Tests must verify:

1. module imports
2. model/repository/service availability
3. validation
4. success flow
5. authentication
6. authorization
7. invalid input
8. missing resources
9. edge cases
10. provider failures where relevant

---

# 79. AUTH TESTS

Test:

```text
register
verify email
resend verification
login
refresh
logout
forgot password
reset password
change password
get profile
```

Test failures:

```text
duplicate email
invalid verification code
expired verification code
wrong password
unverified email
invalid token
expired token
invalid reset token
```

---

# 80. CATEGORY TESTS

Test:

```text
create
read
update
delete
```

and:

```text
duplicate name
invalid ID
USER trying ADMIN operation
delete category in use
```

---

# 81. PRODUCT TESTS

Test:

```text
create
read
update
delete
public access
admin access
```

and:

```text
invalid price
invalid GST
invalid category
inactive product
invalid ID
duplicate identifier
```

---

# 82. CART TESTS

Test:

```text
add item
get cart
update quantity
remove item
clear cart
```

and:

```text
invalid product
quantity 0
negative quantity
unauthorized access
duplicate item
```

---

# 83. ORDER TESTS

Test:

```text
create order
get order
get by order number
list user orders
cancel order
admin list
admin status update
```

and:

```text
empty cart
insufficient stock
invalid product
price manipulation
prescription missing
unauthorized access
invalid status transition
duplicate order
```

---

# 84. PAYMENT TESTS

Test:

```text
create payment order
verify payment
get payment
get payment by order
```

and:

```text
invalid signature
duplicate verification
wrong amount
wrong order
payment failure
already captured payment
```

---

# 85. INVENTORY TESTS

Test:

```text
get stock
reserve
release
deduct
restore
adjust
sync
```

and:

```text
insufficient stock
duplicate reservation
external failure
network failure
local/external mismatch
duplicate deduction
```

---

# 86. SHIPPING TESTS

Test:

```text
create shipment
get shipment
get tracking
update status
cancel shipment
```

and:

```text
invalid order
provider failure
invalid status
duplicate shipment
delivered cancellation
duplicate webhook
```

---

# 87. RETURN TESTS

Test:

```text
request return
get my returns
get return
admin list
admin update
```

and:

```text
non-defective reason
not delivered
wrong user
product not in order
duplicate return
invalid quantity
```

---

# 88. PRESCRIPTION TESTS

Test:

```text
upload
get own
get by ID
admin list
admin review
download
```

and:

```text
invalid file
too large
unauthorized access
wrong user
rejected prescription
pending prescription
missing file
```

---

# 89. NOTIFICATION TESTS

Test:

```text
email
WhatsApp
order notification
payment notification
shipping notification
delivery notification
cancellation notification
```

and:

```text
provider failure
duplicate notification
invalid recipient
```

---

# 90. IMAGE TESTS

Test:

```text
WebP upload
JPEG → WebP
PNG → WebP
compression
Cloudinary upload
MongoDB reference
```

and:

```text
invalid file
corrupted image
oversized image
Sharp failure
Cloudinary failure
database failure after upload
```

---

# 91. BILLING TESTS

Test:

```text
subtotal
discount
GST
CGST
SGST
IGST
shipping
final payable
```

and:

```text
negative quantity
invalid discount
discount > subtotal
invalid GST
client price manipulation
client total manipulation
floating-point issues
```

---

# 92. FINAL BACKEND READINESS TEST

Create a final test:

```text
src/tests/backend-readiness.test.js
```

This is NOT intended to replace module tests.

It is the final gate.

It should verify that the entire backend architecture is present.

---

# 93. FINAL READINESS CHECKLIST

The readiness test should check:

### Foundation

```text
app.js
server.js
database
environment configuration
middleware
```

### Authentication

```text
auth model
auth service
auth routes
JWT
verification
password reset
```

### Roles

```text
USER
ADMIN
```

### Categories

```text
CRUD
```

### Products

```text
CRUD
images
GST
prescription requirement
```

### Cart

```text
CRUD
```

### Orders

```text
create
read
cancel
status
history
```

### Payments

```text
provider abstraction
Razorpay
signature verification
webhook
```

### Inventory

```text
local
provider abstraction
sync
reserve
release
deduct
restore
adjust
```

### Shipping

```text
provider abstraction
create
tracking
label
cancel
webhook
```

### Returns

```text
defective only
user request
admin review
status
```

### Prescriptions

```text
upload
private storage
approval
download
```

### Notifications

```text
email
WhatsApp
order events
```

### Billing

```text
price
discount
GST
shipping
final total
server-side calculation
```

### Images

```text
Sharp
WebP
compression
Cloudinary
storage abstraction
```

### Events

```text
OrderCreated
PaymentSuccessful
PaymentFailed
OrderShipped
OrderDelivered
OrderCancelled
```

### External dependencies

```text
email provider
WhatsApp provider
payment provider
inventory provider
shipping provider
storage provider
```

---

# 94. COMPLETE END-TO-END USER FLOW

The complete USER flow must work conceptually as follows:

```text
REGISTER
   ↓
EMAIL VERIFICATION
   ↓
LOGIN
   ↓
BROWSE CATEGORIES
   ↓
BROWSE PRODUCTS
   ↓
VIEW PRODUCT
   ↓
ADD TO CART
   ↓
UPDATE CART
   ↓
CHECKOUT
   ↓
SERVER VALIDATES PRODUCTS
   ↓
SERVER CALCULATES BILL
   ↓
GST CALCULATION
   ↓
PRESCRIPTION CHECK
   ↓
RESERVE INVENTORY
   ↓
CREATE ORDER
   ↓
CREATE RAZORPAY ORDER
   ↓
USER PAYMENT
   ↓
RAZORPAY VERIFICATION
   ↓
WEBHOOK RECONCILIATION
   ↓
PAYMENT SUCCESS
   ↓
INVENTORY:
RESERVED → SOLD
   ↓
ORDER:
PENDING → CONFIRMED/PROCESSING
   ↓
CREATE SHIPMENT
   ↓
TRACKING NUMBER
   ↓
EMAIL + WHATSAPP
   ↓
SHIPPED
   ↓
IN TRANSIT
   ↓
OUT FOR DELIVERY
   ↓
DELIVERED
   ↓
EMAIL + WHATSAPP
```

---

# 95. PAYMENT FAILURE FLOW

```text
CHECKOUT
 ↓
RESERVE INVENTORY
 ↓
CREATE ORDER
 ↓
PAYMENT
 ↓
PAYMENT FAILED
 ↓
release inventory
 ↓
reserved → available
 ↓
order/payment status updated
 ↓
notification sent
```

The system must not leave stock permanently reserved.

---

# 96. ORDER CANCELLATION FLOW

```text
USER/ADMIN cancellation
 ↓
validate status
 ↓
update order status
 ↓
release inventory if still reserved
 ↓
refund if required
 ↓
create status history
 ↓
emit OrderCancelled
 ↓
email
 ↓
WhatsApp
```

---

# 97. DELIVERY FLOW

```text
ShippingProvider
 ↓
DELIVERED
 ↓
shipping module updates shipment
 ↓
OrderDelivered event
 ↓
order status = DELIVERED
 ↓
deliveredAt = now
 ↓
notification
 ↓
return window can become eligible
```

---

# 98. RETURN FLOW

```text
DELIVERED ORDER
 ↓
USER reports defective product
 ↓
request return
 ↓
RETURN_REQUESTED
 ↓
ADMIN review
 ↓
APPROVED
 ↓
return shipment/process
 ↓
RETURNED
 ↓
inventory restore if resalable
 ↓
refund
 ↓
notification
```

---

# 99. PRESCRIPTION CHECKOUT FLOW

If:

```text
product.prescriptionRequired === true
```

then:

```text
check user's approved prescription
```

If no approved prescription exists:

```text
block checkout
```

If approved:

```text
continue checkout
```

Do not allow frontend to bypass this check.

---

# 100. ADMIN FLOW

ADMIN:

```text
LOGIN
 ↓
PRODUCT MANAGEMENT
 ↓
CATEGORY MANAGEMENT
 ↓
INVENTORY MANAGEMENT
 ↓
VIEW ORDERS
 ↓
UPDATE ORDER STATUS
 ↓
VIEW PRESCRIPTIONS
 ↓
APPROVE/REJECT PRESCRIPTIONS
 ↓
VIEW RETURNS
 ↓
APPROVE/REJECT RETURNS
 ↓
MANAGE SHIPPING
 ↓
MONITOR PROVIDER EVENTS
```

---

# 101. CRITICAL SECURITY RULES

Never trust the frontend for:

```text
role
price
GST
discount
total
payment success
inventory availability
prescription approval
order ownership
admin status
```

All must be verified server-side.

---

# 102. USER DATA ISOLATION

Every user-specific query must enforce:

```text
userId === authenticatedUser.id
```

Examples:

```text
GET /orders/:id
GET /payments/:id
GET /prescriptions/:id
GET /returns/:id
GET /cart
```

A USER must not be able to modify an ID in the URL and retrieve another user's data.

---

# 103. ADMIN DATA ACCESS

ADMIN endpoints can query across users only when the operation explicitly requires it.

Never accidentally expose:

```text
passwordHash
refreshTokenHash
verificationTokenHash
passwordResetTokenHash
```

---

# 104. ENVIRONMENT VARIABLES

Expected environment configuration may include:

```env
PORT=5000
MONGO_URI=...

JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...

JWT_ACCESS_EXPIRES_IN=...
JWT_REFRESH_EXPIRES_IN=...

CLIENT_URL=...

RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=...

CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

ADMIN_PHONE=...
```

Email variables depend on selected provider.

Never commit `.env`.

Maintain:

```text
.env.example
```

without real secrets.

---

# 105. LOGGING

Use structured logging.

Log:

```text
server start
database connection
provider calls
provider failures
important business events
webhooks
retries
```

Do NOT log:

```text
password
JWT
refresh token
API secret
Cloudinary secret
Razorpay secret
verification token
password reset token
```

---

# 106. RETRY STRATEGY

Retries should be used carefully.

Good candidates:

```text
email
WhatsApp
inventory synchronization
shipping API
Cloudinary where safe
```

Do not blindly retry non-idempotent operations.

For example:

```text
create shipment
```

must have idempotency protection before retrying.

---

# 107. WEBHOOK SECURITY

For:

```text
Razorpay
Shipping Provider
```

webhooks must:

```text
verify signature
validate payload
check event type
check duplicate event
process idempotently
store/reconcile event
```

Never blindly trust webhook request bodies.

---

# 108. PRODUCTION-READY THINKING

The backend should eventually support:

```text
failure recovery
reconciliation
idempotency
logging
monitoring
rate limiting
validation
authorization
provider replacement
database consistency
transaction boundaries
```

Do not assume external APIs are always available.

---

# 109. CURRENT DEVELOPMENT APPROACH

During development, external integrations can be mocked.

For example:

```text
ConsoleEmailProvider
ConsoleWhatsAppProvider
MockInventoryProvider
MockShippingProvider
MockStorageProvider
```

This allows the complete business flow to be tested before production credentials are configured.

---

# 110. TEST EXECUTION

Each module test should be executable independently.

Example:

```bash
node --test src/tests/cart.test.js
```

Final readiness:

```bash
node --test src/tests/backend-readiness.test.js
```

Eventually run:

```bash
npm test
```

to run the full test suite.

---

# 111. IMPORTANT TEST INTERPRETATION

The readiness test is a **structural/integration gate**, not a perfect percentage measure of total business completion.

For example:

```text
13 / 19 = 68.4%
```

means:

```text
13 readiness test groups passed
out of 19
```

It does NOT automatically mean:

```text
68.4% of the entire backend is complete
```

A missing critical module such as:

```text
billing
inventory provider
storage
notification
```

can have much greater business impact than a simple structural check.

---

# 112. CURRENT KNOWN ARCHITECTURE GAPS

When continuing from the current implementation, verify these areas carefully.

Known issues from the current readiness run include:

### Notification model

The readiness test expects:

```text
modules/notifications/notification.model.js
```

and the notification repository currently depends on that model.

This must be implemented/fixed.

### Auth model naming

The current project historically used:

```text
modules/users/user.model.js
```

as the actual user/auth model.

If the final architecture requires:

```text
modules/auth/auth.model.js
```

either move/refactor carefully or make the readiness test reflect the actual architecture.

Do not create duplicate models accidentally.

### Orders

The repository/service API names must be consistent.

Expected business operations include:

```text
createOrder
getOrder
getOrders
getOrderByNumber
cancelOrder
updateOrder
updateOrderStatus
```

Do not let readiness tests pass merely because files exist while the actual service exports are missing.

### Shipping

Expected service boundaries should include equivalent operations for:

```text
create shipment
get shipment
tracking
status update
cancel
admin listing
```

Names should be consistent between:

```text
repository
service
controller
routes
tests
```

### Billing

A dedicated billing/checkout calculation layer is still required.

### Storage

A storage abstraction is required.

### Inventory Provider

A third-party inventory provider abstraction is required.

---

# 113. DO NOT CHEAT THE READINESS TEST

The goal is NOT simply to make the readiness test green.

The goal is:

```text
correct architecture
+
correct business logic
+
correct security
+
correct edge cases
+
correct integrations
+
passing tests
```

Do not create empty placeholder functions just to satisfy import checks.

Do not export fake methods that do nothing.

Every readiness item must correspond to real functionality.

---

# 114. FINAL INTEGRATION TEST

After all modules are complete, create a final end-to-end integration test covering at minimum:

## USER

```text
register
verify
login
browse
cart
checkout
billing
prescription
inventory reservation
payment
payment verification
order
shipping
tracking
delivery
return
```

## ADMIN

```text
login
product CRUD
category CRUD
inventory
order management
prescription review
return review
shipping
```

---

# 115. FINAL FAILURE TESTS

The final integration suite must intentionally test failures:

```text
invalid login
unauthorized admin operation
invalid product
insufficient stock
invalid price manipulation
missing prescription
payment failure
payment signature failure
inventory provider failure
shipping provider failure
notification provider failure
duplicate webhook
duplicate payment verification
duplicate order
unauthorized order access
unauthorized prescription download
invalid return
```

---

# 116. FINAL ACCEPTANCE CRITERIA

The backend is considered ready only when:

```text
all modules exist
AND
all module tests pass
AND
readiness test passes
AND
USER flow works
AND
ADMIN flow works
AND
payment flow works
AND
inventory flow works
AND
shipping flow works
AND
notification flow works
AND
prescription flow works
AND
billing/GST calculation works
AND
image processing works
AND
third-party provider boundaries exist
AND
important failure cases are handled
AND
security checks pass
AND
no critical secrets are exposed
```

---

# 117. FINAL ARCHITECTURE PRINCIPLE

The most important principle is:

```text
CORE BUSINESS LOGIC
        |
        v
MODULE SERVICE
        |
        v
PROVIDER ABSTRACTION
        |
        +---- Email
        +---- WhatsApp
        +---- Razorpay
        +---- Inventory API
        +---- Shipping API
        +---- Cloudinary
```

Never:

```text
OrderService
    ↓
directly call Cloudinary SDK
```

Never:

```text
OrderService
    ↓
directly call WhatsApp API
```

Never:

```text
InventoryService
    ↓
directly depend on one specific inventory vendor
```

Instead:

```text
OrderService
    ↓
NotificationService
    ↓
EmailProvider / WhatsAppProvider
```

and:

```text
InventoryService
    ↓
InventoryProvider
    ↓
VendorInventoryProvider
```

and:

```text
ProductImageService
    ↓
StorageProvider
    ↓
CloudinaryStorageProvider
```

This keeps the backend replaceable, testable and maintainable.

---

# 118. RESPONSE STYLE FOR FUTURE DEVELOPMENT

When I ask you to implement a module:

1. First understand its place in the architecture.
2. Do not break existing modules.
3. Provide complete JavaScript code.
4. Use the existing project conventions.
5. Do not use TypeScript.
6. Keep provider integrations abstract.
7. Include validation.
8. Include authorization.
9. Handle important edge cases.
10. Provide exactly one test file for the module.
11. Tell me exactly how to run the test.
12. After implementation, tell me the API endpoints and how to test them with Postman/Thunder Client when applicable.

When I say:

> "next module"

continue from the current project state and implement only the next necessary module.

When a test fails, diagnose the actual implementation/test mismatch instead of creating fake exports or bypassing the test.

The objective is to finish a **real, secure, modular MERN e-commerce backend**, not merely a collection of files that compile.
