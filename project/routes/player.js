var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const players_utils = require("./utils/players_utils");

router.get("/partialDetails/:playerId",async (req,res,next) => {
    let playerInfo = [];
    try {
        playerInfo = await players_utils.getOnePlayerInfo(req.params.playerId) 
             
        res.send(playerInfo);
    } catch (error) {
    next(error);
  }
})

router.get("/fullDetails/:playerId",async (req,res,next) => {
    let playerInfo = [];
    try {
      playerInfo = await players_utils.getMoreDataOfPlayer(req.params.playerId)
     
      res.send(playerInfo);
    } catch (error) {
    next(error);
  }
  //172104
})

router.get("/partialDetailsByName/:playerName",async (req,res,next) => {
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
  } catch (error) {
  next(error);
}
})
 
module.exports = router;