import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import { User } from "../modules/users/user.model.js";
import { Category } from "../modules/categories/category.model.js";
import { connectDB } from "../config/db.js";

const BASE_URL = "http://localhost:5000";

const adminUser = {
    name: "Category Admin",
    email: `categoryadmin${Date.now()}@example.com`,
    password: "AdminPassword123!"
};

const normalUser = {
    name: "Category User",
    email: `categoryuser${Date.now()}@example.com`,
    password: "UserPassword123!"
};

let adminAccessToken;
let userAccessToken;
let categoryId;

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

function assertSuccess(response, expectedStatus = 200) {
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
        `Expected success=true: ${JSON.stringify(response.body)}`
    );
}

function assertFailure(response, expectedStatus) {
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
        `Expected success=false: ${JSON.stringify(response.body)}`
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
        slug: {
            $in: [
                "test-category",
                "updated-test-category"
            ]
        }
    });

    const passwordHash = await bcrypt.hash(
        adminUser.password,
        12
    );

    await User.create({
        name: adminUser.name,
        email: adminUser.email,
        passwordHash,
        role: "ADMIN",
        isEmailVerified: true,
        isActive: true
    });

    const userPasswordHash = await bcrypt.hash(
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

    assertSuccess(adminLogin, 200);

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

    assertSuccess(userLogin, 200);

    userAccessToken =
        userLogin.body.data.accessToken;
});

after(async () => {
    if (categoryId) {
        await Category.deleteOne({
            _id: categoryId
        });
    }

    await Category.deleteMany({
        slug: {
            $in: [
                "test-category",
                "updated-test-category"
            ]
        }
    });

    await User.deleteMany({
        email: {
            $in: [
                adminUser.email,
                normalUser.email
            ]
        }
    });

    if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.close();
    }
});

/*
|--------------------------------------------------------------------------
| 1. Get categories publicly
|--------------------------------------------------------------------------
*/

test("1. Get categories publicly", async () => {
    const response = await request(
        "GET",
        "/api/v1/categories"
    );

    assertSuccess(response, 200);

    assert.ok(
        Array.isArray(response.body.data),
        "Categories response should be an array"
    );
});

/*
|--------------------------------------------------------------------------
| 2. Create category without authentication
|--------------------------------------------------------------------------
*/

test("2. Create category without authentication should fail", async () => {
    const response = await request(
        "POST",
        "/api/v1/categories",
        {
            name: "Test Category",
            slug: "test-category",
            description: "Test category"
        }
    );

    assertFailure(response, 401);
});

/*
|--------------------------------------------------------------------------
| 3. Create category as USER
|--------------------------------------------------------------------------
*/

test("3. Create category as USER should fail", async () => {
    const response = await request(
        "POST",
        "/api/v1/categories",
        {
            name: "Test Category",
            slug: "test-category",
            description: "Test category"
        },
        userAccessToken
    );

    assertFailure(response, 403);
});

/*
|--------------------------------------------------------------------------
| 4. Create category as ADMIN
|--------------------------------------------------------------------------
*/

test("4. Create category as ADMIN", async () => {
    const response = await request(
        "POST",
        "/api/v1/categories",
        {
            name: "Test Category",
            slug: "test-category",
            description: "Test category"
        },
        adminAccessToken
    );

    assertSuccess(response, 201);

    assert.ok(
        response.body.data,
        "Category should be returned"
    );

    assert.equal(
        response.body.data.name,
        "Test Category"
    );

    assert.equal(
        response.body.data.slug,
        "test-category"
    );

    categoryId =
        response.body.data._id;
});

/*
|--------------------------------------------------------------------------
| 5. Duplicate category should fail
|--------------------------------------------------------------------------
*/

test("5. Duplicate category should fail", async () => {
    const response = await request(
        "POST",
        "/api/v1/categories",
        {
            name: "Another Test Category",
            slug: "test-category",
            description: "Duplicate slug"
        },
        adminAccessToken
    );

    assertFailure(response, 409);
});

/*
|--------------------------------------------------------------------------
| 6. Get category by ID
|--------------------------------------------------------------------------
*/

test("6. Get category by ID", async () => {
    const response = await request(
        "GET",
        `/api/v1/categories/${categoryId}`
    );

    assertSuccess(response, 200);

    assert.equal(
        response.body.data._id,
        categoryId
    );
});

/*
|--------------------------------------------------------------------------
| 7. Get invalid category
|--------------------------------------------------------------------------
*/

test("7. Get non-existing category should fail", async () => {
    const response = await request(
        "GET",
        "/api/v1/categories/507f1f77bcf86cd799439011"
    );

    assertFailure(response, 404);
});

/*
|--------------------------------------------------------------------------
| 8. Update category without authentication
|--------------------------------------------------------------------------
*/

test("8. Update category without authentication should fail", async () => {
    const response = await request(
        "PATCH",
        `/api/v1/categories/${categoryId}`,
        {
            name: "Updated Test Category"
        }
    );

    assertFailure(response, 401);
});

/*
|--------------------------------------------------------------------------
| 9. Update category as USER
|--------------------------------------------------------------------------
*/

test("9. Update category as USER should fail", async () => {
    const response = await request(
        "PATCH",
        `/api/v1/categories/${categoryId}`,
        {
            name: "Updated Test Category"
        },
        userAccessToken
    );

    assertFailure(response, 403);
});

/*
|--------------------------------------------------------------------------
| 10. Update category as ADMIN
|--------------------------------------------------------------------------
*/

test("10. Update category as ADMIN", async () => {
    const response = await request(
        "PATCH",
        `/api/v1/categories/${categoryId}`,
        {
            name: "Updated Test Category",
            slug: "updated-test-category"
        },
        adminAccessToken
    );

    assertSuccess(response, 200);

    assert.equal(
        response.body.data.name,
        "Updated Test Category"
    );

    assert.equal(
        response.body.data.slug,
        "updated-test-category"
    );
});

/*
|--------------------------------------------------------------------------
| 11. Invalid update body
|--------------------------------------------------------------------------
*/

test("11. Empty update body should fail", async () => {
    const response = await request(
        "PATCH",
        `/api/v1/categories/${categoryId}`,
        {},
        adminAccessToken
    );

    assertFailure(response, 400);
});

/*
|--------------------------------------------------------------------------
| 12. Delete category without authentication
|--------------------------------------------------------------------------
*/

test("12. Delete category without authentication should fail", async () => {
    const response = await request(
        "DELETE",
        `/api/v1/categories/${categoryId}`
    );

    assertFailure(response, 401);
});

/*
|--------------------------------------------------------------------------
| 13. Delete category as USER
|--------------------------------------------------------------------------
*/

test("13. Delete category as USER should fail", async () => {
    const response = await request(
        "DELETE",
        `/api/v1/categories/${categoryId}`,
        undefined,
        userAccessToken
    );

    assertFailure(response, 403);
});

/*
|--------------------------------------------------------------------------
| 14. Delete category as ADMIN
|--------------------------------------------------------------------------
*/

test("14. Delete category as ADMIN", async () => {
    const response = await request(
        "DELETE",
        `/api/v1/categories/${categoryId}`,
        undefined,
        adminAccessToken
    );

    assertSuccess(response, 200);

    assert.equal(
        response.body.data._id,
        categoryId
    );
});

/*
|--------------------------------------------------------------------------
| 15. Deleted category should not exist
|--------------------------------------------------------------------------
*/

test("15. Deleted category should no longer exist", async () => {
    const response = await request(
        "GET",
        `/api/v1/categories/${categoryId}`
    );

    assertFailure(response, 404);
});