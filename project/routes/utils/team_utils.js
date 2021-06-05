const axios = require("axios");
// const { getPlayersByTeam } = require("./players_utils");
const players_utils = require("./players_utils");
const DButils = require("./DButils");
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

  const allGames = await DButils.execQuery(
    `SELECT * FROM dbo.games`
  )

  all_team.data.data.map( (my_team) => {
    
    let gamesOfTeam = []
    allGames.map((game)=> 
    {if (game.home_team_id === my_team.id || game.away_team_id === my_team.id)
       {gamesOfTeam.push(game)}})

    team_ids_list.push( {
      id: my_team.id,
      name: my_team.name, 
      games: gamesOfTeam  
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
      if(seasonID === team.current_season_id){
        return new Promise((resolve,reject) => {
          resolve(createTeamTemplete(team))
        })
      }
    })
  

  let toReturn = await Promise.all(dataToReturn)
  return toReturn

}



async function createTeamTemplete(team){

  let gamesOfTeam = await DButils.execQuery(
      `SELECT dbo.games.game_id, home_team_id, away_team_id, date_time, home_goals, away_goals, winner_team_id, stadium,  referee_id 
      FROM dbo.games WHERE home_team_id = '${team.id}' OR away_team_id = '${team.id}'`
    )
  
  
  //console.log(team)
  
  let teamPlayers = []

  team.squad.data.map((playerMinData) => {
      teamPlayers.push(
        {
          player_id: playerMinData.player_id,
          name: playerMinData.player.data.fullname,
          team_name: team.name,
          team_id: team.id,
          imageUrl: playerMinData.player.data.image_path,
          position_id: playerMinData.player.data.position_id,
          common_name: playerMinData.player.data.common_name,
          nationality: playerMinData.player.data.nationality,
          birthdate: playerMinData.player.data.birthdate,
          birthcountry: playerMinData.player.data.birthcountry,
          height: playerMinData.player.data.height,
          weight: playerMinData.player.data.weight

        }
      )
      // console.log(playerMinData.player.data)
  })
  return {
    id: team.id,
    name: team.name,    
    players: teamPlayers,
    games: gamesOfTeam    
  }

}

async function getTeamByID(team_id){

  const team = await axios.get(
    `${api_domain}/teams/${team_id}`,
    {
        params: {
        api_token: process.env.api_token,
        include: "squad.player"
        },
    }
    );
  //return teams.data.data
  const league = await axios.get(
    `${api_domain}/leagues/${LEAGUE_ID}`,
    {
        params: {
        api_token: process.env.api_token,
        },
    }
    );
    const seasonID = league.data.data.current_season_id
     
    if (team.data.data.current_season_id != seasonID){
      throw { status: 404, message: { message: "There is no such Team in the League" }};
    }

    const games = await DButils.execQuery(
      `SELECT dbo.games.game_id, home_team_id, away_team_id, date_time, home_goals, away_goals, winner_team_id, stadium,  referee_id 
    FROM dbo.games WHERE home_team_id = '${team_id}' OR away_team_id = '${team_id}'`
    )

    let allPlayers = []

    team.data.data.squad.data.map((playerMinData) => {
      allPlayers.push(
        {
          player_id: playerMinData.player_id,
          name: playerMinData.player.data.fullname,
          team_name: team.data.data.name,
          team_id: team.data.data.id,
          imageUrl: playerMinData.player.data.image_path,
          position_id: playerMinData.player.data.position_id,
          common_name: playerMinData.player.data.common_name,
          nationality: playerMinData.player.data.nationality,
          birthdate: playerMinData.player.data.birthdate,
          birthcountry: playerMinData.player.data.birthcountry,
          height: playerMinData.player.data.height,
          weight: playerMinData.player.data.weight

        }
      )
    })
    return {
      id:  team.data.data.id,
      name: team.data.data.name,
      players: allPlayers,
      games: games
    }

}


exports.getDataOfTeams = getDataOfTeams;
exports.getAllTeams = getAllTeams;
exports.getTeamIdFromName = getTeamIdFromName
exports.getTeamByID = getTeamByID