const axios = require("axios");
const { resolve } = require("path/posix");
const { getPlayersByTeam } = require("./players_utils");
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

async function getTeamIdFromName(team_name){
  let teams = await getAllTeams();
  let teamsIds = teams.map((team) => team.id)
  let teamDic = {}
  teams.map((team) =>{teamDic[team.name] = team.id})
  
  theTeamId = teamDic[team_name]
  
  return theTeamId
}

async function getDataOfTeams(seasonID, teams){
  
   let dataToReturn = teams.map((team) => {
      return new Promise((resolve,reject) => {
         resolve(createTeamTemplete(team))
      })
  })

  // let toReturn = await DataToReturn.Promise.all(dataToReturn)

}



async function createTeamTemplete(team){

  let gamesOfTeam = await DButils.execQuery(
      `SELECT dbo.games.game_id, home_team_id, away_team_id, date_time, home_goals, away_goals, winner_team_id, stadium,  referee_id 
      FROM dbo.games WHERE home_team_id = '${team.id}' OR away_team_id = '${team.id}'`
    )

  return {
    id: team.id,
    players: await getPlayersByTeam(team),
    games: gamesOfTeam
  }

}

exports.getAllTeams = getAllTeams;
exports.getTeamIdFromName = getTeamIdFromName