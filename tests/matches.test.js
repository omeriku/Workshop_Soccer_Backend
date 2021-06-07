//const manage = require("./manage.js");
//const axios = require("axios");
import request from 'supertest'
import manage from "../manage.js"

// jest.mock("axios");

describe("bla bla",()=>{
    test("test description", async()=>{
        const response = await request(manage).post("/createGame").send({
            "home_team_id": 85,
            "away_team_id": 2585,
            "date_time": "2021-05-15 20:30:00",
            "stadium": "Camp Nou",
            "referee_id": 2  
        })
        expect(response.statusCode).toBe(200)
    })
})



// it("returns the title of the first album", async () => {
//     axios.get.mockResolvedValue({
//       data: [
//         {
//           userId: 1,
//           id: 1,
//           title: "My First Album",
//         },
//         {
//           userId: 1,
//           id: 2,
//           title: "Album: The Sequel",
//         },
//       ],
//     });
  
//     const title = await getFirstAlbumTitle();
//     expect(title).toEqual("My First Album");
//   });
