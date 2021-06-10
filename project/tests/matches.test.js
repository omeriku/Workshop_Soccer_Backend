const DButils = require('../routes/utils/DButils')
const request = require('supertest');
const app = require('../main')
require("dotenv").config();
const { response } = require('express');
const manage_utils = require('../routes/utils/manage_utils')
jest.setTimeout(100000);
var test_session = null;

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


//     request(app)
//       .post("/login")
//       .send(
//           {
//               username: 'fifaRep',
//               password: 'fifa123!'
//           }
//       )

//     return request(app)
//       .post("/manage/createGame")
//       .send(        
//           {
//             "home_team_id": 200,
//             "away_team_id": 201,
//             "date_time": "2021-05-15 20:30:00",
//             "stadium": "Camp Nou",
//             "referee_id": 2
//           }        
//       ).expect(200)
//   })
// })

// describe('Sample Test', () => {
//   it('should test that true === true', () => {
//     expect(true).toBe(true)
//   })
// })
