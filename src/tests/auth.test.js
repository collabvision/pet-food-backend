// import test, { before, after } from "node:test";
// import assert from "node:assert/strict";
// import bcrypt from "bcryptjs";

// import { User } from "../modules/users/user.model.js";
// import { connectDB } from "../config/db.js";

// const BASE_URL = "http://localhost:5000";

// const testUser = {
//     name: "API Test User",
//     email: `apitest${Date.now()}@example.com`,
//     password: "TestPassword123!",
//     newPassword: "NewPassword123!"
// };

// let accessToken;
// let refreshToken;

// async function request(method, path, body = undefined, token = undefined) {
//     const headers = {
//         "Content-Type": "application/json"
//     };

//     if (token) {
//         headers.Authorization = `Bearer ${token}`;
//     }

//     const options = {
//         method,
//         headers
//     };

//     if (body !== undefined) {
//         options.body = JSON.stringify(body);
//     }

//     const response = await fetch(`${BASE_URL}${path}`, options);

//     let data;

//     try {
//         data = await response.json();
//     } catch {
//         data = {};
//     }

//     return {
//         status: response.status,
//         body: data
//     };
// }

// function assertSuccess(response, expectedStatus = 200) {
//     assert.equal(
//         response.status,
//         expectedStatus,
//         `Expected ${expectedStatus}, got ${response.status}: ${JSON.stringify(
//             response.body
//         )}`
//     );

//     assert.equal(
//         response.body.success,
//         true,
//         `Expected success=true: ${JSON.stringify(response.body)}`
//     );
// }

// function assertFailure(response, expectedStatus) {
//     assert.equal(
//         response.status,
//         expectedStatus,
//         `Expected ${expectedStatus}, got ${response.status}: ${JSON.stringify(
//             response.body
//         )}`
//     );

//     assert.equal(
//         response.body.success,
//         false,
//         `Expected success=false: ${JSON.stringify(response.body)}`
//     );
// }

// before(async () => {
//     await connectDB();

//     await User.deleteOne({
//         email: testUser.email
//     });

//     const passwordHash = await bcrypt.hash(testUser.password, 12);

//     await User.create({
//         name: testUser.name,
//         email: testUser.email,
//         passwordHash,
//         role: "USER",
//         isEmailVerified: true,
//         isActive: true
//     });

//     console.log("\n========================================");
//     console.log("AUTH API TESTS STARTED");
//     console.log("========================================\n");
// });

// after(async () => {
//     await User.deleteOne({
//         email: testUser.email
//     });

//     console.log("\n========================================");
//     console.log("AUTH API TESTS COMPLETED");
//     console.log("========================================\n");
// });

// /*
// |--------------------------------------------------------------------------
// | 1. Login successfully
// |--------------------------------------------------------------------------
// */

// test("1. Login successfully", async () => {
//     const response = await request(
//         "POST",
//         "/api/v1/auth/login",
//         {
//             email: testUser.email,
//             password: testUser.password
//         }
//     );

//     assertSuccess(response, 200);

//     assert.ok(
//         response.body.data,
//         "Login response should contain data"
//     );

//     assert.ok(
//         response.body.data.user,
//         "Login response should contain user"
//     );

//     assert.ok(
//         response.body.data.accessToken,
//         "Login response should contain access token"
//     );

//     assert.ok(
//         response.body.data.refreshToken,
//         "Login response should contain refresh token"
//     );

//     assert.equal(
//         response.body.data.user.email,
//         testUser.email
//     );

//     assert.equal(
//         response.body.data.user.role,
//         "USER"
//     );

//     accessToken = response.body.data.accessToken;
//     refreshToken = response.body.data.refreshToken;
// });

// /*
// |--------------------------------------------------------------------------
// | 2. Wrong password
// |--------------------------------------------------------------------------
// */

// test("2. Login with wrong password should fail", async () => {
//     const response = await request(
//         "POST",
//         "/api/v1/auth/login",
//         {
//             email: testUser.email,
//             password: "WrongPassword123!"
//         }
//     );

//     assertFailure(response, 401);
// });

// /*
// |--------------------------------------------------------------------------
// | 3. Unknown email
// |--------------------------------------------------------------------------
// */

// test("3. Login with unknown email should fail", async () => {
//     const response = await request(
//         "POST",
//         "/api/v1/auth/login",
//         {
//             email: "unknown-user@example.com",
//             password: testUser.password
//         }
//     );

//     assertFailure(response, 401);
// });

// /*
// |--------------------------------------------------------------------------
// | 4. Get current user
// |--------------------------------------------------------------------------
// */

// test("4. Get current user", async () => {
//     assert.ok(accessToken, "Access token should exist");

//     const response = await request(
//         "GET",
//         "/api/v1/auth/me",
//         undefined,
//         accessToken
//     );

//     assertSuccess(response, 200);

//     assert.ok(
//         response.body.data,
//         "Response should contain user data"
//     );

//     assert.equal(
//         response.body.data.email,
//         testUser.email
//     );

//     assert.equal(
//         response.body.data.role,
//         "USER"
//     );

//     assert.equal(
//         response.body.data.isEmailVerified,
//         true
//     );
// });

// /*
// |--------------------------------------------------------------------------
// | 5. /me without token
// |--------------------------------------------------------------------------
// */

// test("5. /me without token should fail", async () => {
//     const response = await request(
//         "GET",
//         "/api/v1/auth/me"
//     );

//     assertFailure(response, 401);
// });

// /*
// |--------------------------------------------------------------------------
// | 6. /me with invalid token
// |--------------------------------------------------------------------------
// */

// test("6. /me with invalid token should fail", async () => {
//     const response = await request(
//         "GET",
//         "/api/v1/auth/me",
//         undefined,
//         "invalid-access-token"
//     );

//     assertFailure(response, 401);
// });

// /*
// |--------------------------------------------------------------------------
// | 7. Invalid authorization header
// |--------------------------------------------------------------------------
// */

// test("7. Invalid authorization header should fail", async () => {
//     const response = await fetch(
//         `${BASE_URL}/api/v1/auth/me`,
//         {
//             method: "GET",
//             headers: {
//                 Authorization: "InvalidToken"
//             }
//         }
//     );

//     const data = await response.json();

//     const result = {
//         status: response.status,
//         body: data
//     };

//     assertFailure(result, 401);
// });

// /*
// |--------------------------------------------------------------------------
// | 8. Refresh access token
// |--------------------------------------------------------------------------
// */

// test("8. Refresh access token", async () => {
//     assert.ok(
//         refreshToken,
//         "Refresh token should exist"
//     );

//     const response = await request(
//         "POST",
//         "/api/v1/auth/refresh",
//         {
//             refreshToken
//         }
//     );

//     assertSuccess(response, 200);

//     assert.ok(
//         response.body.data,
//         "Refresh response should contain data"
//     );

//     assert.ok(
//         response.body.data.accessToken,
//         "Refresh should generate an access token"
//     );

//     assert.equal(
//         typeof response.body.data.accessToken,
//         "string"
//     );

//     /*
//      * Do NOT require the new access token to be different.
//      *
//      * JWTs generated within the same second can legitimately
//      * contain the same iat/exp values and therefore be identical.
//      */

//     accessToken = response.body.data.accessToken;

//     assert.ok(
//         accessToken.length > 20,
//         "Access token should contain a valid JWT-like value"
//     );
// });

// /*
// |--------------------------------------------------------------------------
// | 9. Invalid refresh token
// |--------------------------------------------------------------------------
// */

// test("9. Invalid refresh token should fail", async () => {
//     const response = await request(
//         "POST",
//         "/api/v1/auth/refresh",
//         {
//             refreshToken: "invalid-refresh-token"
//         }
//     );

//     assertFailure(response, 401);
// });

// /*
// |--------------------------------------------------------------------------
// | 10. Missing refresh token
// |--------------------------------------------------------------------------
// */

// test("10. Missing refresh token should fail", async () => {
//     const response = await request(
//         "POST",
//         "/api/v1/auth/refresh",
//         {}
//     );

//     assertFailure(response, 400);
// });

// /*
// |--------------------------------------------------------------------------
// | 11. Change password
// |--------------------------------------------------------------------------
// */

// test("11. Change password", async () => {
//     assert.ok(
//         accessToken,
//         "Access token should exist"
//     );

//     const response = await request(
//         "PATCH",
//         "/api/v1/auth/change-password",
//         {
//             currentPassword: testUser.password,
//             newPassword: testUser.newPassword
//         },
//         accessToken
//     );

//     assertSuccess(response, 200);
// });

// /*
// |--------------------------------------------------------------------------
// | 12. Old password should no longer work
// |--------------------------------------------------------------------------
// */

// test("12. Old password should no longer work", async () => {
//     const response = await request(
//         "POST",
//         "/api/v1/auth/login",
//         {
//             email: testUser.email,
//             password: testUser.password
//         }
//     );

//     assertFailure(response, 401);
// });

// /*
// |--------------------------------------------------------------------------
// | 13. Login with new password
// |--------------------------------------------------------------------------
// */

// test("13. Login with new password", async () => {
//     const response = await request(
//         "POST",
//         "/api/v1/auth/login",
//         {
//             email: testUser.email,
//             password: testUser.newPassword
//         }
//     );

//     assertSuccess(response, 200);

//     assert.ok(
//         response.body.data.accessToken,
//         "New login should return access token"
//     );

//     assert.ok(
//         response.body.data.refreshToken,
//         "New login should return refresh token"
//     );

//     accessToken = response.body.data.accessToken;
//     refreshToken = response.body.data.refreshToken;
// });

// /*
// |--------------------------------------------------------------------------
// | 14. Wrong current password
// |--------------------------------------------------------------------------
// */

// test("14. Change password with wrong current password should fail", async () => {
//     const response = await request(
//         "PATCH",
//         "/api/v1/auth/change-password",
//         {
//             currentPassword: "WrongCurrentPassword123!",
//             newPassword: "AnotherPassword123!"
//         },
//         accessToken
//     );

//     assertFailure(response, 400);
// });

// /*
// |--------------------------------------------------------------------------
// | 15. Change password without valid token
// |--------------------------------------------------------------------------
// */

// test("15. Change password without valid token should fail", async () => {
//     const response = await request(
//         "PATCH",
//         "/api/v1/auth/change-password",
//         {
//             currentPassword: testUser.newPassword,
//             newPassword: "AnotherPassword123!"
//         },
//         "invalid-access-token"
//     );

//     assertFailure(response, 401);
// });

// /*
// |--------------------------------------------------------------------------
// | 16. Logout
// |--------------------------------------------------------------------------
// */

// test("16. Logout successfully", async () => {
//     assert.ok(
//         accessToken,
//         "Access token should exist"
//     );

//     const response = await request(
//         "POST",
//         "/api/v1/auth/logout",
//         undefined,
//         accessToken
//     );

//     assertSuccess(response, 200);
// });

// /*
// |--------------------------------------------------------------------------
// | 17. Refresh after logout
// |--------------------------------------------------------------------------
// */

// test("17. Refresh token after logout should fail", async () => {
//     assert.ok(
//         refreshToken,
//         "Refresh token should exist"
//     );

//     const response = await request(
//         "POST",
//         "/api/v1/auth/refresh",
//         {
//             refreshToken
//         }
//     );

//     assertFailure(response, 401);
// });