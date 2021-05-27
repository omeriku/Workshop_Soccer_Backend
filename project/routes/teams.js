var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const players_utils = require("./utils/players_utils");
const team_utils = require("./utils/team_utils");

router.get("/detailsById/:teamId", async (req, res, next) => {
  let team_details = [];
  try {
    const team_details = await players_utils.getPlayersByTeam(
      req.params.teamId
    );
    //we should keep implementing team page.....
    res.send(team_details);
  } catch (error) {
    next(error);
  }
});

router.get("/detailsByName/:teamName", async(req,res,next)=> {
  let team_details = []
  try {
    const team_details = await players_utils.getPlayersByTeamName()

  res.send(team_details)
  } catch (error) {
    next(error)
  }

})

router.get("/allTeams", async (req, res, next) => {
  let team_details = [];
  try {
    const team_details = await team_utils.getAllTeams();
    //we should keep implementing team page.....
    res.send(team_details);
  } catch (error) {
    next(error);
  }
});



module.exports = router;
