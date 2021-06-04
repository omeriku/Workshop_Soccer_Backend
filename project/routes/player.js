var express = require("express");
var router = express.Router();
const axios = require("axios");
const DButils = require("./utils/DButils");
const players_utils = require("./utils/players_utils");
const team_utils = require("./utils/team_utils");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const LEAGUE_ID = 271;

router.get("/partialDetails/:playerId",async (req,res,next) => {
    let playerInfo = [];
    try {
        playerInfo = await players_utils.getOnePlayerInfo(req.params.playerId) 
             
        res.send(playerInfo);
    } catch (error) {
      res.status(404).send("No such player id")
    // next(error);  
    }      
})

router.get("/fullDetails/:playerId",async (req,res,next) => {
    let playerInfo = [];
    try {
      playerInfo = await players_utils.getMoreDataOfPlayer(req.params.playerId)
     
      res.send(playerInfo);
    } catch (error) {
      console.log(error)
      res.status(404).send("No such player id")
    // next(error);
  }
  //172104
})

router.get("/detailsByName/:playerName",async (req,res,next) => {
  let playersInfo = [];
  try {
      playersInfo = await players_utils.getDataByName(req.params.playerName)
      
      if(playersInfo.length === 0 ){
        throw { status: 404, message: "There is no such player" };
      }
      // if(playerInfo === []) {
      //   console.log("YESSSSSSSSSSSSSSS")
      //   // throw { status: 404, message: "There is no such player" };
      // }
      res.send(playersInfo);
  } catch (error){
  next(error);
}
})

router.get("/allPlayers",async (req,res,next) => {
  try {
      const allPlayers = await players_utils.getAllPlayers()
      res.status(200).send(allPlayers);
  } catch (error) {
    console.log(error)
    res.status(400).send("Something Went Wrong")
  // next(error);
}
})

 
module.exports = router;