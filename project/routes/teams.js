var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const players_utils = require("./utils/players_utils");
const team_utils = require("./utils/team_utils");

router.get("/detailsById/:teamId", async (req, res, next) => {  
  let team_details = [];
  try {
    // Get Data of the players
    team_details = await players_utils.getPlayersByTeam(
      req.params.teamId
    );
    //we should keep implementing team page.....
    
    // Get the games data
    let games = await DButils.execQuery(
      `SELECT dbo.games.game_id, home_team_id, away_team_id, date_time, home_goals, away_goals, winner_team_id, stadium,  referee_id 
    FROM dbo.games WHERE home_team_id = '${req.params.teamId}' OR away_team_id = '${req.params.teamId}'`
    )
    
    // Arrange the data
    let finalToSend = {}
    finalToSend["id"] = req.params.teamId
    finalToSend["players"] = team_details
    finalToSend["games"] = games   
    // finalToSend.push(team_details)
    // finalToSend.push(games)   

    res.send(finalToSend);
  } catch (error) {
    res.status(404).send("No such team id")
    // next(error);
  }
});

router.get("/detailsByName/:teamName", async(req,res,next)=> {
  let team_details = []
  try {
    // Get the team id from name
    const team_id = await team_utils.getTeamIdFromName(req.params.teamName);

    // Get Data of the players
    team_details = await players_utils.getPlayersByTeam(team_id)
   
    // Get the games data
    let games = await DButils.execQuery(
      `SELECT dbo.games.game_id, home_team_id, away_team_id, date_time, home_goals, away_goals, winner_team_id, stadium,  referee_id 
      FROM dbo.games WHERE home_team_id = '${team_id}' OR away_team_id = '${team_id}'`
    )
        
    // Arrange the data
    let finalToSend = {}
    finalToSend["id"] = team_id
    finalToSend["players"] = team_details
    finalToSend["games"] = games
    
    // finalToSend.push(team_details)
    // finalToSend.push(games)   

    res.send(finalToSend);


  res.send(team_id)
  } catch (error) {
    res.status(404).send("No such team id")
    // next(error)
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
