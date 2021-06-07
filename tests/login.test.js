const DButils = require("./project/utils/DButils");
const auth = require("../auth");
const { request } = require("express");
import auth from "../auth.js"

// Check regular login
test('check an existing user with correct password -> expects correct', async()=>{
    const response = await request(auth).post("/login").send({
        username: "fifaRep",
        password: "fifa123!"
    })
    expect((response.statusCode).toBe(200))
});

test('check that user exists', async()=>{
    const response = await request(auth).post("/login").send({
        username: "fifaRep",
        password: "fifa123!"
    })
    expect((response.statusCode).toBe(200))
})