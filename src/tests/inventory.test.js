import assert from "node:assert/strict";
import test, {
    before,
    after
} from "node:test";

import mongoose from "mongoose";

import { connectDB } from "../config/db.js";
import app from "../app.js";

import { User } from "../modules/users/user.model.js";
import { Category } from "../modules/categories/category.model.js";
import { Product } from "../modules/products/product.model.js";
import { Inventory } from "../modules/inventory/inventory.model.js";


const BASE_URL = "http://localhost:5000";

let adminAccessToken;
let userAccessToken;

let categoryId;
let productId;


const adminUser = {
    name: "Inventory Admin",
    email: `inventory-admin-${Date.now()}@example.com`,
    password: "Admin@12345"
};


const normalUser = {
    name: "Inventory User",
    email: `inventory-user-${Date.now()}@example.com`,
    password: "User@12345"
};


async function request(
    method,
    path,
    body = undefined,
    token = undefined
) {
    const options = {
        method,
        headers: {}
    };

    if (body !== undefined) {
        options.headers["Content-Type"] =
            "application/json";

        options.body =
            JSON.stringify(body);
    }

    if (token) {
        options.headers.Authorization =
            `Bearer ${token}`;
    }

    const response =
        await fetch(
            `${BASE_URL}${path}`,
            options
        );

    let responseBody = {};

    try {
        responseBody =
            await response.json();
    } catch {
        responseBody = {};
    }

    return {
        status: response.status,
        body: responseBody
    };
}


function assertSuccess(
    response,
    expectedStatus = 200
) {
    assert.equal(
        response.status,
        expectedStatus,
        `Expected ${expectedStatus}, got ${response.status}: ${JSON.stringify(response.body)}`
    );

    assert.equal(
        response.body.success,
        true
    );
}


function assertFailure(
    response,
    expectedStatus
) {
    assert.equal(
        response.status,
        expectedStatus,
        `Expected ${expectedStatus}, got ${response.status}: ${JSON.stringify(response.body)}`
    );

    assert.equal(
        response.body.success,
        false
    );
}


before(async () => {
    await connectDB();

    await Inventory.deleteMany({});

    await Product.deleteMany({
        slug: "inventory-test-product"
    });

    await Category.deleteMany({
        slug: "inventory-test-category"
    });

    await User.deleteMany({
        email: {
            $in: [
                adminUser.email,
                normalUser.email
            ]
        }
    });


    const adminRegister =
        await request(
            "POST",
            "/api/v1/auth/register",
            adminUser
        );

    assertSuccess(
        adminRegister,
        201
    );


    const adminVerify =
        await request(
            "POST",
            "/api/v1/auth/verify-email",
            {
                email: adminUser.email,
                code: "123456"
            }
        );

    assertSuccess(
        adminVerify
    );


    await User.updateOne(
        {
            email: adminUser.email
        },
        {
            $set: {
                role: "ADMIN"
            }
        }
    );


    const adminLogin =
        await request(
            "POST",
            "/api/v1/auth/login",
            {
                email: adminUser.email,
                password: adminUser.password
            }
        );

    assertSuccess(
        adminLogin
    );

    adminAccessToken =
        adminLogin.body.data.accessToken;


    const userRegister =
        await request(
            "POST",
            "/api/v1/auth/register",
            normalUser
        );

    assertSuccess(
        userRegister,
        201
    );


    const userVerify =
        await request(
            "POST",
            "/api/v1/auth/verify-email",
            {
                email: normalUser.email,
                code: "123456"
            }
        );

    assertSuccess(
        userVerify
    );


    const userLogin =
        await request(
            "POST",
            "/api/v1/auth/login",
            {
                email: normalUser.email,
                password: normalUser.password
            }
        );

    assertSuccess(
        userLogin
    );

    userAccessToken =
        userLogin.body.data.accessToken;


    const category =
        await Category.create({
            name: "Inventory Test Category",
            slug: "inventory-test-category",
            isActive: true
        });

    categoryId =
        category._id.toString();


    const product =
        await Product.create({
            name: "Inventory Test Product",
            slug: "inventory-test-product",
            description:
                "Product for inventory tests",
            category: categoryId,
            price: 500,
            sku: "INVENTORY-TEST-001",
            isActive: true
        });

    productId =
        product._id.toString();
});


after(async () => {
    await Inventory.deleteMany({
        product: productId
    });

    await Product.deleteMany({
        _id: productId
    });

    await Category.deleteMany({
        _id: categoryId
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


test(
    "1. Get inventory without authentication should fail",
    async () => {
        const response =
            await request(
                "GET",
                "/api/v1/inventory"
            );

        assertFailure(
            response,
            401
        );
    }
);


test(
    "2. USER cannot get inventory",
    async () => {
        const response =
            await request(
                "GET",
                "/api/v1/inventory",
                undefined,
                userAccessToken
            );

        assertFailure(
            response,
            403
        );
    }
);


test(
    "3. ADMIN can get inventory",
    async () => {
        const response =
            await request(
                "GET",
                "/api/v1/inventory",
                undefined,
                adminAccessToken
            );

        assertSuccess(response);

        assert.ok(
            Array.isArray(
                response.body.data
            )
        );
    }
);


test(
    "4. Create inventory as ADMIN",
    async () => {
        const response =
            await request(
                "POST",
                "/api/v1/inventory",
                {
                    product: productId,
                    quantity: 100,
                    reservedQuantity: 0,
                    lowStockThreshold: 10
                },
                adminAccessToken
            );

        assertSuccess(
            response,
            201
        );

        assert.equal(
            response.body.data.quantity,
            100
        );

        assert.equal(
            response.body.data.reservedQuantity,
            0
        );
    }
);


test(
    "5. Duplicate inventory should fail",
    async () => {
        const response =
            await request(
                "POST",
                "/api/v1/inventory",
                {
                    product: productId,
                    quantity: 50
                },
                adminAccessToken
            );

        assertFailure(
            response,
            409
        );
    }
);


test(
    "6. Get inventory by product",
    async () => {
        const response =
            await request(
                "GET",
                `/api/v1/inventory/${productId}`,
                undefined,
                adminAccessToken
            );

        assertSuccess(response);

        assert.equal(
            response.body.data.product._id,
            productId
        );
    }
);


test(
    "7. Update inventory",
    async () => {
        const response =
            await request(
                "PATCH",
                `/api/v1/inventory/${productId}`,
                {
                    quantity: 120,
                    lowStockThreshold: 15
                },
                adminAccessToken
            );

        assertSuccess(response);

        assert.equal(
            response.body.data.quantity,
            120
        );

        assert.equal(
            response.body.data.lowStockThreshold,
            15
        );
    }
);


test(
    "8. Reserved quantity cannot exceed quantity",
    async () => {
        const response =
            await request(
                "PATCH",
                `/api/v1/inventory/${productId}`,
                {
                    reservedQuantity: 200
                },
                adminAccessToken
            );

        assertFailure(
            response,
            400
        );
    }
);


test(
    "9. Add stock",
    async () => {
        const response =
            await request(
                "POST",
                `/api/v1/inventory/${productId}/add-stock`,
                {
                    quantity: 30
                },
                adminAccessToken
            );

        assertSuccess(response);

        assert.equal(
            response.body.data.quantity,
            150
        );
    }
);


test(
    "10. Reserve stock",
    async () => {
        const response =
            await request(
                "POST",
                `/api/v1/inventory/${productId}/reserve`,
                {
                    quantity: 40
                },
                adminAccessToken
            );

        assertSuccess(response);

        assert.equal(
            response.body.data.reservedQuantity,
            40
        );
    }
);


test(
    "11. Remove stock",
    async () => {
        const response =
            await request(
                "POST",
                `/api/v1/inventory/${productId}/remove-stock`,
                {
                    quantity: 50
                },
                adminAccessToken
            );

        assertSuccess(response);

        assert.equal(
            response.body.data.quantity,
            100
        );
    }
);


test(
    "12. Cannot remove more available stock",
    async () => {
        const response =
            await request(
                "POST",
                `/api/v1/inventory/${productId}/remove-stock`,
                {
                    quantity: 100
                },
                adminAccessToken
            );

        assertFailure(
            response,
            400
        );
    }
);


test(
    "13. Release reserved stock",
    async () => {
        const response =
            await request(
                "POST",
                `/api/v1/inventory/${productId}/release-reservation`,
                {
                    quantity: 20
                },
                adminAccessToken
            );

        assertSuccess(response);

        assert.equal(
            response.body.data.reservedQuantity,
            20
        );
    }
);


test(
    "14. Cannot release more reserved stock",
    async () => {
        const response =
            await request(
                "POST",
                `/api/v1/inventory/${productId}/release-reservation`,
                {
                    quantity: 50
                },
                adminAccessToken
            );

        assertFailure(
            response,
            400
        );
    }
);


test(
    "15. Delete inventory",
    async () => {
        const response =
            await request(
                "DELETE",
                `/api/v1/inventory/${productId}`,
                undefined,
                adminAccessToken
            );

        assertSuccess(response);
    }
);


test(
    "16. Deleted inventory should not exist",
    async () => {
        const response =
            await request(
                "GET",
                `/api/v1/inventory/${productId}`,
                undefined,
                adminAccessToken
            );

        assertFailure(
            response,
            404
        );
    }
);