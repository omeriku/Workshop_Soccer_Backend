const axios = require("axios");
// const { get } = require("../teams");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const LEAGUE_ID = 271;


async function getAllTeams() {
  const league = await axios.get(
        `${api_domain}/leagues/${LEAGUE_ID}`,
        {
            params: {
            api_token: process.env.api_token,
            },
        }
        );
  let seasonID = league.data.data.current_season_id
  let team_ids_list = [];

  const all_team = await axios.get(`${api_domain}/teams/season/${seasonID}`, {
    params: {
      api_token: process.env.api_token,
    },
  });
  all_team.data.data.map((my_team) => {
    team_ids_list.push( {
      id: my_team.id,
      name: my_team.name   
    });
  });
  let teams_info = await Promise.all(team_ids_list);

  return teams_info;
}



exports.getAllTeams = getAllTeams;
