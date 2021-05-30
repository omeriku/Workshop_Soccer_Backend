const axios = require("axios");
const DButils = require("./DButils");

async function getAllGamesforUser(req) {

  const userFavoritesGames = await DButils.execQuery(
    `SELECT dbo.games.game_id, home_team_id, away_team_id, date_time, home_goals, away_goals, winner_team_id, stadium,  referee_id 
    FROM dbo.games INNER JOIN dbo.favorites
    ON dbo.games.game_id = dbo.favorites.game_id
    WHERE  dbo.favorites.user_id = '${req.session.user_id}' `
  );
  
  return userFavoritesGames
}

exports.getAllGamesforUser = getAllGamesforUser;