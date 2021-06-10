const DButils = require('../routes/utils/DButils')
const auth_utils = require('../routes/utils/auth_utils')
const request = require('supertest');
const app = require('../main')
const sql = require('mssql')
var user = request.agent(app)
require("dotenv").config();
const axios = require('axios');
const { compare } = require('bcryptjs');
const { response } = require('express');
const localhost = "http://localhost:3000"

////////////////// Unit Testing //////////////////

describe("getUser", () =>{
        
    describe("Returns User", ()=>{
        test("Positive test", async() =>{
            let isPassed = true
            const user = await auth_utils.getUser('fifaRep')
            if(!user){
                isPassed = false
            }
            expect(isPassed).toBe(true)
        })
    })

    describe("suppose to returns User", ()=>{
        test("Negative test", async() =>{
            let isPassed = false
            const user = await auth_utils.getUser('fifaRep123!')
            if(user.length === 0){
                isPassed = true
            }
            expect(isPassed).toBe(true)
        })
    })

    describe("check if there are two similar usernames", ()=>{
        test("not two usernames", async() =>{
            let isPassed = false
            const user = await DButils.execQuery(`SELECT username, COUNT(*) FROM dbo.users GROUP BY username Having COUNT(username) > 1`)             
            if(user.length === 0 ){
                isPassed = true
            }
            expect(isPassed).toBe(true)
        })
    })
})

////////////////// Acceptence tests - Testing Endpoint //////////////////
describe("Login",()=>{
 
    describe("positive login",()=>{
        test("positive login", async()=>{
            let response = await axios.post('http://localhost:3000/login',{
                "username": 'fifaRep',
                "password": 'fifa123!'
            });
            expect(response.status).toBe(200)
        },30000)
    })

    describe("wrong username login",()=>{
        test("login wrong username", async()=>{
            
            await axios.post('http://localhost:3000/login',{
              "username": 'Wrong',
              "password": 'OmerTest1!'
            })
            .catch(error => {
              expect(error.response.status).toBe(401);
            })
            // console.log("BEGINNNNNNNN")
            // let response = await axios.post("http://localhost:3000/login",{
            //     "username": 'fifaRepppppppppppppp',
            //     "password": 'fifa123!'
            // });
            // console.log("RESSSSS: ", response)
            // expect(response.status).toBe(401);
        },30000)
        
    })

    describe("wrong password login",()=>{
        test("login user", async()=>{
            await axios.post('http://localhost:3000/login',{
              "username": 'fifaRep',
              "password": 'WrongPass1!'
            })
            .catch(error => {
              expect(error.response.status).toBe(401);
            })
        },30000)
    })


    describe("with no username",()=>{
        test("login user", async()=>{
            await axios.post('http://localhost:3000/login',{
              "username": '',
              "password": 'fifa123!'
            })
            .catch(error => {
              expect(error.response.status).toBe(401);
            })
        },30000)
    })


    describe("with no password",()=>{
        test("login user", async()=>{
            await axios.post('http://localhost:3000/login',{
              "username": 'fifaRep',
              "password": ''
            })
            .catch(error => {
              expect(error.response.status).toBe(401);
            })
        },30000)
    })  
    
})










// const auth = require("../routes/auth");
//var express = require("express");
// const { request } = require("express");
// var router = express.Router();
//const { request } = require("express");
// const request = require('supertest');
// const express = require('express')
// const app = express

// const axios = require('axios')
// const localhost = "http://localhost:3000"

// test('test successfull login', async () => {
//     const res =await axios.post(`${localhost}/login`,{
//         "username": "fifaRep",
//         "password": "fifa123!"
//     });
//     expect(res.status).toBe(200);
// });

// test('test unseccessfull login with wrong username', async () => {
//     let con = 1
//     try{
//         res =await axios.post(`${localhost}/login`,{
//             "username": "fifaRepppppp",
//             "password": "fifa123!"
//         });
//     } catch(error){
//         con = 2;
//     }
//     console.log("TOTOTOTOOOOOOOOOOOOOOOOOOOOOOOOOO")
//     // console.log(res)
//     expect(con).toBe(2);
// });

