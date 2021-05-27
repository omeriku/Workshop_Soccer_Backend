var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const players_utils = require("./utils/players_utils");

router.get("/partialDetails/:playerId",async (req,res,next) => {
    let playerInfo = [];
    try {
        const playerInfo = await players_utils.getOnePlayerInfo(req.params.playerId) 
        res.send(playerInfo);
    } catch (error) {
    next(error);
  }

})

router.get("/fullDetails/:playerId",async (req,res,next) => {
    let playerInfo = [];
    try {
        const playerInfo = await players_utils.getMoreDataOfPlayer(req.params.playerId)
        res.send(playerInfo);
    } catch (error) {
    next(error);
  }


})

module.exports = router;