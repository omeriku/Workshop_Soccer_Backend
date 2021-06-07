const auth = require("../routes/auth");
const { request } = require("express");
// import { TestWatcher } from "@jest/core";

// // Check regular login
test('check an existing user with correct password -> expects correct', async()=>{
    const response = await request(auth).post("/login").send({
        username: "fifaRep",
        password: "fifa123!"
    })
    expect((response.statusCode).toBe(200))
});