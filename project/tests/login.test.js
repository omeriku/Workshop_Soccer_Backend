const DButils = require('../routes/utils/DButils')
const auth_utils = require('../routes/utils/auth_utils')
const request = require('supertest');
const app = require('../main')
const sql = require('mssql')
var user = request.agent(app)
require("dotenv").config();
const axios = require('axios');
const bcryptjs = require('bcryptjs');
const { response } = require('express');
const localhost = "http://localhost:3000"

////////////////// Unit Testing //////////////////

describe("getUser", () =>{

    // beforeAll(async()=>{

    //     let hashedPass = bcryptjs.hashSync('OmerTest1!',parseInt(process.env.bcrypt_saltRounds))
    
    //     await DButils.execQuery(
    //         `INSERT INTO dbo.users (username, password, firstname, lastname, email, country, imageUrl) VALUES ('OmerTest', ${hashedPass} , 'Omer', 'Niv', 'omerniv123@gmail.com', 'Israel', 'www.facebook.com')`
    //     );
    // })    
            
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

    // afterAll(async()=>{
    //     await DButils.execQuery(`DELETE FROM dbo.users WHERE username = 'OmerTest`)
    // })


})

////////////////// Acceptence tests - Testing Endpoint //////////////////
describe("Login",()=>{
 
    describe("positive login",()=>{

        it('login successfully', () => {
            return request(app)
                .post("/login")
                .send(
                    {
                        username: 'fifaRep',
                        password: 'fifa123!'
                    }
                ).expect(200)
        });


        // test("positive login", async()=>{
        //     let response = await axios.post('http://localhost:3000/login',{
        //         "username": 'fifaRep',
        //         "password": 'fifa123!'
        //     });
        //     expect(response.status).toBe(200)        
    })

    describe("wrong username login",()=>{
        
        it('bad request', () => {
            return request(app)
                .post("/login")
                .send(
                    {
                        username: 'Wrong',
                        password: 'fifa123!'
                    }
                ).expect(401)
        });
        
    })   
        // test("login wrong username", async()=>{
            
        //     await axios.post('http://localhost:3000/login',{
        //       "username": 'Wrong',
        //       "password": 'OmerTest1!'
        //     })
        //     .catch(error => {
        //       expect(error.response.status).toBe(401);
        //     })
            
        // },30000)
        
    

    describe("wrong password login",()=>{

        it('bad request', () => {
            return request(app)
                .post("/login")
                .send(
                    {
                        username: 'fifaRep',
                        password: 'Wrong!'
                    }
                ).expect(401)
        });

        // test("login user", async()=>{
        //     await axios.post('http://localhost:3000/login',{
        //       "username": 'fifaRep',
        //       "password": 'WrongPass1!'
        //     })
        //     .catch(error => {
        //       expect(error.response.status).toBe(401);
        //     })
        // },30000)
    })


    describe("with no username",()=>{
        it('bad request', () => {
            return request(app)
                .post("/login")
                .send(
                    {
                        username: '',
                        password: 'fifa123!'
                    }
                ).expect(401)
        });
    })


    describe("with no password",()=>{
        it('bad request', () => {
            return request(app)
                .post("/login")
                .send(
                    {
                        username: 'fifaRep',
                        password: 'a'
                    }
                ).expect(401)
        });
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

