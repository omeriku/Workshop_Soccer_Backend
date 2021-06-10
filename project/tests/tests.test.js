const DButils = require('../routes/utils/DButils')
const auth_utils = require('../routes/utils/auth_utils')
const request = require('supertest');
const app = require('../main')
const sql = require('mssql')
var user = request.agent(app)
require("dotenv").config();
const { response } = require('express');
const manage_utils = require('../routes/utils/manage_utils')
jest.setTimeout(100000);
var test_session = null;


//////////////////Login///////////////////////////

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
                        password: ''
                    }
                ).expect(401)
        });
    })  
    
})

//////////////////Matches//////////////////////////

////////////////// UNIT TESTING //////////////////////
describe('test createGame func', ()=>{
    
  it('create games works correctly', async()=>{
    //let numOfGamesBefore = DButils.execQuery(`SELECT COUNT(*) FROM dbo.test_games`)
    await manage_utils.createGame(300,301,"2021-05-15 20:30:00","Camp Nou",2)   
  })
})


////////////////// Integration & Acceptance Testing //////////////////

describe(' test post create game request',()=>{

  it('Game Created After Login',async ()=>{
    const req = request(app).post("/login").send(
      {
        "username": "fifaRep",
        "password": "fifa123!"
      })
    
    var cookie = (await req).header["set-cookie"][0];

    return request(app)
    .post("/manage/createGame")
    .send(        
        {
          "home_team_id": 200,
          "away_team_id": 201,
          "date_time": "2021-05-15 20:30:00",
          "stadium": "Camp Nou",
          "referee_id": 2
        }        
    ).set('Cookie', cookie).expect(201)
  })



  it('Try to create game with user loggin in with no permissions',async ()=>{
    const req = request(app).post("/login").send(
      {
        "username": "omer123",
        "password": "gal@123"
      })
    
    var cookie = (await req).header["set-cookie"][0];

    return request(app)
    .post("/manage/createGame")
    .send(        
        {
          "home_team_id": 200,
          "away_team_id": 201,
          "date_time": "2021-05-15 20:30:00",
          "stadium": "Camp Nou",
          "referee_id": 2
        }        
    ).set('Cookie', cookie).expect(403)
  })


  it('create game without login', async ()=>{    
    return request(app)
          .post("/manage/createGame")
          .send(        
              {
                "home_team_id": 200,
                "away_team_id": 201,
                "date_time": "2021-05-15 20:30:00",
                "stadium": "Camp Nou",
                "referee_id": 2
              }        
          ).expect(401)
      })

})
