const axios = require("axios");
const DButils = require("./DButils");

async function getAllGamesforUser(req) {

  const userFavoritesGames = await DButils.execQuery(
    `SELECT dbo.games.game_id, home_team_id, away_team_id, date_time, stadium 
    FROM dbo.games INNER JOIN dbo.favorites
    ON dbo.games.game_id = dbo.favorites.game_id
    WHERE  dbo.favorites.user_id = '${req.session.user_id}'
    AND GETDATE() < dbo.games.date_time `
  );
  
  return userFavoritesGames
}

exports.getAllGamesforUser = getAllGamesforUser;