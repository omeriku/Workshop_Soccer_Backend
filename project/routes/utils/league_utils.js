const axios = require("axios");
const LEAGUE_ID = 271;
const DButils = require("./DButils");
const { getMoreDataOfPlayer } = require("./players_utils");

async function getLeagueDetails() {
  const league = await axios.get(
    `https://soccer.sportmonks.com/api/v2.0/leagues/${LEAGUE_ID}`,
    {
      params: {
        include: "season",
        api_token: process.env.api_token,
      },
    }
  );
  const stage = await axios.get(
    `https://soccer.sportmonks.com/api/v2.0/stages/${league.data.data.current_stage_id}`,
    {
      params: {
        api_token: process.env.api_token,
      },
    }
  );
  const next_game = await DButils.execQuery(
    "SELECT TOP (1) * FROM dbo.games WHERE GETDATE() < date_time ORDER BY date_time"
  );
  return {
    league_name: league.data.data.name,
    current_season_name: league.data.data.season.data.name,
    current_stage_name: stage.data.data.name,
    next_match_details: next_game[0]
    // next game details should come from DB
  };
}



async function getCurStage(){
  /**
 * The function returns all the games in the db in json
 * seperated to past and future
 */
  let stage = {}
  const futureGames = await DButils.execQuery(
    'SELECT game_id, date_time, home_team_id, away_team_id, stadium FROM dbo.games WHERE GETDATE() < date_time')
  
  stage["futureGames"] = futureGames

  let pastGames = await DButils.execQuery(
    'SELECT game_id, date_time, home_team_id, away_team_id, stadium, home_goals, away_goals, winner_team_id FROM dbo.games WHERE GETDATE() > date_time')

  let allGames = pastGames.map((game) => {
    return new Promise((resolve, reject) =>
  {
    resolve(createGameWithEvents(game))
  }
    )
  })

  let pastWithEvents = await Promise.all(allGames)

  stage.pastGames = pastWithEvents

  return stage;

}

 async function createGameWithEvents(game){
  
      let eventsOfGame =  await DButils.execQuery(`SELECT event_id, date_time, minute, description FROM dbo.events WHERE game_id = '${game.game_id}' `)
      game.events = eventsOfGame
      
      return game

}

exports.getLeagueDetails = getLeagueDetails;
exports.getCurStage = getCurStage
