import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import bcrypt from "bcryptjs";

import { User } from "../modules/users/user.model.js";
import { Category } from "../modules/categories/category.model.js";
import { Product } from "../modules/products/product.model.js";
import { connectDB } from "../config/db.js";

const BASE_URL = "http://localhost:5000";

const adminUser = {
    name: "Product Admin",
    email: `productadmin${Date.now()}@example.com`,
    password: "AdminPassword123!"
};

const normalUser = {
    name: "Product User",
    email: `productuser${Date.now()}@example.com`,
    password: "UserPassword123!"
};

let adminAccessToken;
let userAccessToken;
let categoryId;
let productId;

async function request(
    method,
    path,
    body = undefined,
    token = undefined
) {
    const headers = {
        "Content-Type": "application/json"
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const options = {
        method,
        headers
    };

    if (body !== undefined) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(
        `${BASE_URL}${path}`,
        options
    );

    let data;

    try {
        data = await response.json();
    } catch {
        data = {};
    }

    return {
        status: response.status,
        body: data
    };
}

function assertSuccess(
    response,
    expectedStatus = 200
) {
    assert.equal(
        response.status,
        expectedStatus,
        `Expected ${expectedStatus}, got ${response.status}: ${JSON.stringify(
            response.body
        )}`
    );

    assert.equal(
        response.body.success,
        true,
        `Expected success=true: ${JSON.stringify(
            response.body
        )}`
    );
}

function assertFailure(
    response,
    expectedStatus
) {
    assert.equal(
        response.status,
        expectedStatus,
        `Expected ${expectedStatus}, got ${response.status}: ${JSON.stringify(
            response.body
        )}`
    );

    assert.equal(
        response.body.success,
        false,
        `Expected success=false: ${JSON.stringify(
            response.body
        )}`
    );
}

before(async () => {
    await connectDB();

    await User.deleteMany({
        email: {
            $in: [
                adminUser.email,
                normalUser.email
            ]
        }
    });

    await Category.deleteMany({
        slug: "product-test-category"
    });

    await Product.deleteMany({
        slug: {
            $in: [
                "test-product",
                "updated-test-product"
            ]
        }
    });

    const adminPasswordHash =
        await bcrypt.hash(
            adminUser.password,
            12
        );

    await User.create({
        name: adminUser.name,
        email: adminUser.email,
        passwordHash: adminPasswordHash,
        role: "ADMIN",
        isEmailVerified: true,
        isActive: true
    });

    const userPasswordHash =
        await bcrypt.hash(
            normalUser.password,
            12
        );

    await User.create({
        name: normalUser.name,
        email: normalUser.email,
        passwordHash: userPasswordHash,
        role: "USER",
        isEmailVerified: true,
        isActive: true
    });

    const adminLogin = await request(
        "POST",
        "/api/v1/auth/login",
        {
            email: adminUser.email,
            password: adminUser.password
        }
    );

    assertSuccess(adminLogin);

    adminAccessToken =
        adminLogin.body.data.accessToken;

    const userLogin = await request(
        "POST",
        "/api/v1/auth/login",
        {
            email: normalUser.email,
            password: normalUser.password
        }
    );

    assertSuccess(userLogin);

    userAccessToken =
        userLogin.body.data.accessToken;

    const category =
        await Category.create({
            name: "Product Test Category",
            slug: "product-test-category",
            description: "Category for product tests",
            isActive: true
        });

    categoryId = category._id.toString();
});

after(async () => {
    await Product.deleteMany({
        slug: {
            $in: [
                "test-product",
                "updated-test-product"
            ]
        }
    });

    await Category.deleteMany({
        slug: "product-test-category"
    });

    await User.deleteMany({
        email: {
            $in: [
                adminUser.email,
                normalUser.email
            ]
        }
    });

    await mongoose.connection.close();
});

/*
|--------------------------------------------------------------------------
| 1. Get products publicly
|--------------------------------------------------------------------------
*/

test("1. Get products publicly", async () => {
    const response = await request(
        "GET",
        "/api/v1/products"
    );

    assertSuccess(response);

    assert.ok(
        Array.isArray(response.body.data),
        "Products should be an array"
    );
});

/*
|--------------------------------------------------------------------------
| 2. Create product without authentication
|--------------------------------------------------------------------------
*/

test("2. Create product without authentication should fail", async () => {
    const response = await request(
        "POST",
        "/api/v1/products",
        {
            name: "Test Product",
            slug: "test-product",
            description: "Test product description",
            category: categoryId,
            price: 500,
            sku: "TEST-SKU-001"
        }
    );

    assertFailure(response, 401);
});

/*
|--------------------------------------------------------------------------
| 3. Create product as USER
|--------------------------------------------------------------------------
*/

test("3. Create product as USER should fail", async () => {
    const response = await request(
        "POST",
        "/api/v1/products",
        {
            name: "Test Product",
            slug: "test-product",
            description: "Test product description",
            category: categoryId,
            price: 500,
            sku: "TEST-SKU-001"
        },
        userAccessToken
    );

    assertFailure(response, 403);
});

/*
|--------------------------------------------------------------------------
| 4. Create product as ADMIN
|--------------------------------------------------------------------------
*/

test("4. Create product as ADMIN", async () => {
    const response = await request(
        "POST",
        "/api/v1/products",
        {
            name: "Test Product",
            slug: "test-product",
            description: "Test product description",
            category: categoryId,
            price: 500,
            compareAtPrice: 600,
            sku: "TEST-SKU-001",
            barcode: "123456789",
            brand: "Test Brand",
            unit: "1 Pack",
            isMedical: false,
            requiresPrescription: false
        },
        adminAccessToken
    );

    assertSuccess(response, 201);

    assert.ok(response.body.data);

    assert.equal(
        response.body.data.name,
        "Test Product"
    );

    assert.equal(
        response.body.data.slug,
        "test-product"
    );

    assert.equal(
        response.body.data.sku,
        "TEST-SKU-001"
    );

    productId =
        response.body.data._id;
});

/*
|--------------------------------------------------------------------------
| 5. Duplicate slug
|--------------------------------------------------------------------------
*/

test("5. Duplicate product slug should fail", async () => {
    const response = await request(
        "POST",
        "/api/v1/products",
        {
            name: "Another Product",
            slug: "test-product",
            description: "Duplicate slug",
            category: categoryId,
            price: 400,
            sku: "TEST-SKU-002"
        },
        adminAccessToken
    );

    assertFailure(response, 409);
});

/*
|--------------------------------------------------------------------------
| 6. Duplicate SKU
|--------------------------------------------------------------------------
*/

test("6. Duplicate product SKU should fail", async () => {
    const response = await request(
        "POST",
        "/api/v1/products",
        {
            name: "Another Product",
            slug: "another-product",
            description: "Duplicate SKU",
            category: categoryId,
            price: 400,
            sku: "TEST-SKU-001"
        },
        adminAccessToken
    );

    assertFailure(response, 409);
});

/*
|--------------------------------------------------------------------------
| 7. Invalid category
|--------------------------------------------------------------------------
*/

test("7. Product with invalid category should fail", async () => {
    const response = await request(
        "POST",
        "/api/v1/products",
        {
            name: "Invalid Category Product",
            slug: "invalid-category-product",
            description: "Invalid category",
            category: "507f1f77bcf86cd799439011",
            price: 500,
            sku: "TEST-SKU-003"
        },
        adminAccessToken
    );

    assertFailure(response, 404);
});

/*
|--------------------------------------------------------------------------
| 8. Compare price validation
|--------------------------------------------------------------------------
*/

test("8. Compare-at price lower than price should fail", async () => {
    const response = await request(
        "POST",
        "/api/v1/products",
        {
            name: "Invalid Price Product",
            slug: "invalid-price-product",
            description: "Invalid compare price",
            category: categoryId,
            price: 500,
            compareAtPrice: 400,
            sku: "TEST-SKU-004"
        },
        adminAccessToken
    );

    assertFailure(response, 400);
});

/*
|--------------------------------------------------------------------------
| 9. Prescription validation
|--------------------------------------------------------------------------
*/

test("9. Prescription requirement without medical product should fail", async () => {
    const response = await request(
        "POST",
        "/api/v1/products",
        {
            name: "Invalid Prescription Product",
            slug: "invalid-prescription-product",
            description: "Invalid prescription setting",
            category: categoryId,
            price: 500,
            sku: "TEST-SKU-005",
            isMedical: false,
            requiresPrescription: true
        },
        adminAccessToken
    );

    assertFailure(response, 400);
});

/*
|--------------------------------------------------------------------------
| 10. Get product by ID
|--------------------------------------------------------------------------
*/

test("10. Get product by ID", async () => {
    const response = await request(
        "GET",
        `/api/v1/products/${productId}`
    );

    assertSuccess(response);

    assert.equal(
        response.body.data._id,
        productId
    );
});

/*
|--------------------------------------------------------------------------
| 11. Get product by slug
|--------------------------------------------------------------------------
*/

test("11. Get product by slug", async () => {
    const response = await request(
        "GET",
        "/api/v1/products/slug/test-product"
    );

    assertSuccess(response);

    assert.equal(
        response.body.data.slug,
        "test-product"
    );
});

/*
|--------------------------------------------------------------------------
| 12. Update without authentication
|--------------------------------------------------------------------------
*/

test("12. Update product without authentication should fail", async () => {
    const response = await request(
        "PATCH",
        `/api/v1/products/${productId}`,
        {
            name: "Updated Product"
        }
    );

    assertFailure(response, 401);
});

/*
|--------------------------------------------------------------------------
| 13. Update as USER
|--------------------------------------------------------------------------
*/

test("13. Update product as USER should fail", async () => {
    const response = await request(
        "PATCH",
        `/api/v1/products/${productId}`,
        {
            name: "Updated Product"
        },
        userAccessToken
    );

    assertFailure(response, 403);
});

/*
|--------------------------------------------------------------------------
| 14. Update as ADMIN
|--------------------------------------------------------------------------
*/

test("14. Update product as ADMIN", async () => {
    const response = await request(
        "PATCH",
        `/api/v1/products/${productId}`,
        {
            name: "Updated Test Product",
            slug: "updated-test-product",
            price: 700
        },
        adminAccessToken
    );

    assertSuccess(response);

    assert.equal(
        response.body.data.name,
        "Updated Test Product"
    );

    assert.equal(
        response.body.data.slug,
        "updated-test-product"
    );

    assert.equal(
        response.body.data.price,
        700
    );
});

/*
|--------------------------------------------------------------------------
| 15. Empty update body
|--------------------------------------------------------------------------
*/

test("15. Empty update body should fail", async () => {
    const response = await request(
        "PATCH",
        `/api/v1/products/${productId}`,
        {},
        adminAccessToken
    );

    assertFailure(response, 400);
});

/*
|--------------------------------------------------------------------------
| 16. Delete without authentication
|--------------------------------------------------------------------------
*/

test("16. Delete product without authentication should fail", async () => {
    const response = await request(
        "DELETE",
        `/api/v1/products/${productId}`
    );

    assertFailure(response, 401);
});

/*
|--------------------------------------------------------------------------
| 17. Delete as USER
|--------------------------------------------------------------------------
*/

test("17. Delete product as USER should fail", async () => {
    const response = await request(
        "DELETE",
        `/api/v1/products/${productId}`,
        undefined,
        userAccessToken
    );

    assertFailure(response, 403);
});

/*
|--------------------------------------------------------------------------
| 18. Delete as ADMIN
|--------------------------------------------------------------------------
*/

test("18. Delete product as ADMIN", async () => {
    const response = await request(
        "DELETE",
        `/api/v1/products/${productId}`,
        undefined,
        adminAccessToken
    );

    assertSuccess(response);

    assert.equal(
        response.body.data._id,
        productId
    );
});

/*
|--------------------------------------------------------------------------
| 19. Deleted product should not exist
|--------------------------------------------------------------------------
*/

test("19. Deleted product should no longer exist", async () => {
    const response = await request(
        "GET",
        `/api/v1/products/${productId}`
    );

    assertFailure(response, 404);
});