const axios = require("axios");
const LEAGUE_ID = 271;
const DButils = require("./DButils");

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
exports.getLeagueDetails = getLeagueDetails;
