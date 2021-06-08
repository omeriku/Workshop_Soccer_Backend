// const auth = require("../routes/auth");
//var express = require("express");
// const { request } = require("express");
// var router = express.Router();
//const { request } = require("express");
// const request = require('supertest');
// const express = require('express')
// const app = express

const axios = require('axios')
const localhost = "http://localhost:3000"

test('test successfull login', async () => {
    const res =await axios.post(`${localhost}/login`,{
        "username": "fifaRep",
        "password": "fifa123!"
    });
    expect(res.status).toBe(200);
});

test('test unseccessfull login with wrong username', async () => {
    let con = 1
    try{
        res =await axios.post(`${localhost}/login`,{
            "username": "fifaRepppppp",
            "password": "fifa123!"
        });
    } catch(error){
        con = 2;
    }
    console.log("TOTOTOTOOOOOOOOOOOOOOOOOOOOOOOOOO")
    // console.log(res)
    expect(con).toBe(2);
});




// describe('Check login', () => {
//     it('regular login works', async () => {      
//       const response = await request(app).post('/login').send({
//         username: "fifaRep",
//         password: "fifa123!"
//       })      
//         expect(response.status).toBe(200)
//     })
//   })

// Check regular login
// test('check an existing user with correct password -> expects correct', async()=>{
//     const response = await router.post("/login").send({
//         username: "fifaRep",
//         password: "fifa123!"
//     })
//     expect((response.status).toBe(200))
// });

describe('Sample Test', () => {
    it('should test that true === true', () => {
      expect(true).toBe(true)
    })
  })