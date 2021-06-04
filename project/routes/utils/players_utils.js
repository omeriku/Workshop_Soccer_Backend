const axios = require("axios");
const { stat } = require("fs");
const { nextTick } = require("process");
// const { get } = require("../teams");
const { getAllTeams } = require("./team_utils");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const LEAGUE_ID = 271;
// const TEAM_ID = "85";
// const SEASON_ID = await axios.get(`${api_domain}/leagues/${LEAGUE_ID}`,
// {
//   params: {
//     include: "season",
//     api_token: process.env.api_token,
//   },
// }
// );

async function getPlayerIdsByTeam(team_id) {
  let player_ids_list = [];
  const team = await axios.get(`${api_domain}/teams/${team_id}`, {
    params: {
      include: "squad",
      api_token: process.env.api_token,
    },
  });


  // Check if in the current season
  const league = await axios.get(
    `${api_domain}/leagues/${LEAGUE_ID}`,
    {
        params: {
        api_token: process.env.api_token,
        },
    }
    );
  let seasonID = league.data.data.current_season_id

  if( team.data.data.current_season_id !== seasonID){
    throw { status: 404, message: "There is no such team in the league" };
  }



  team.data.data.squad.data.map((player) =>
    player_ids_list.push(player.player_id)
  );
  return player_ids_list;
}


async function getOnePlayerInfo(player_id){
  // name, position, teamName, image
  let playerDet = [];
  
    let detailsOfPlayer = await axios.get(`${api_domain}/players/${player_id}`,{
    params: {
      include: "team",
      api_token: process.env.api_token
    },    
  })   
  // console.log(detailsOfPlayer.data.data)
  playerName = detailsOfPlayer.data.data.fullname;
  playerPos = detailsOfPlayer.data.data.position_id;
  playerPic = detailsOfPlayer.data.data.image_path;  

  // const teamId = detailsOfPlayer.data.data.team_id;
  const posId = detailsOfPlayer.data.data.position_id;

  // Get the team name
  // const detTeamName = await axios.get(`${api_domain}/teams/${teamId}`,{
  //   params: {
  //     api_token: process.env.api_token
  //   },
  // })
  // playerTeamName = detTeamName.data.data.name;
  const playerTeamName = detailsOfPlayer.data.data.team.data.name
  // console.log(playerTeamName)
  return {
    id: player_id,
    name: playerName,
    imageUrl: playerPic,  
    position_id: posId,
    team: playerTeamName,
    
  };
}

async function getPlayersInfo(players_ids_list) {
  let promises = [];
  players_ids_list.map((id) =>
    promises.push(
      axios.get(`${api_domain}/players/${id}`, {
        params: {
          api_token: process.env.api_token,
          include: "team",
        },
      })
    )
  );
  let players_info = await Promise.all(promises);
  return extractRelevantPlayerData(players_info);
}

function extractRelevantPlayerData(players_info) {
  return players_info.map((player_info) => {
    const { player_id ,fullname, image_path, position_id } = player_info.data.data;
    const { name } = player_info.data.data.team.data;
    return {
      id: player_id,
      name: fullname,
      imageUrl: image_path,
      position: position_id,
      team: name,
    };
  });
}

async function getPlayersByTeam(team_id) {
  let player_ids_list = await getPlayerIdsByTeam(team_id);
  let players_info = await getPlayersInfo(player_ids_list);
  return players_info;
}


// Get Full data of player
async function getMoreDataOfPlayer(player_id) {
      
  const detailsOfPlayer = await axios.get(`${api_domain}/players/${player_id}`,{
    params: {
      api_token: process.env.api_token,
      include: "team",
    },
  }) 
    
  teamId = detailsOfPlayer.data.data.team_id;
  playerName = detailsOfPlayer.data.data.fullname;
  playerPos = detailsOfPlayer.data.data.position_id;
  playerPic = detailsOfPlayer.data.data.image_path;  
  commonName = detailsOfPlayer.data.data.common_name;
  nationality = detailsOfPlayer.data.data.nationality;
  birthdate = detailsOfPlayer.data.data.birthdate;
  birthcountry = detailsOfPlayer.data.birthcountry;
  height = detailsOfPlayer.data.data.height;
  weight = detailsOfPlayer.data.data.weight;

  // Get the team name
  // const detTeamName = await axios.get(`${api_domain}/teams/${teamId}`,{
  //   params: {
  //     api_token: process.env.api_token
  //   },
  // })
  // playerTeamName = detTeamName.data.data.name;
  playerTeamName = detailsOfPlayer.data.data.team.data.name
  return {
    id: player_id,
    name: playerName,
    team: playerTeamName,
    imageUrl: playerPic,
    position: playerPos,
    common_name: commonName,
    nationality: nationality,
    birthdate: birthdate,
    birthcountry: birthcountry,
    height: height,
    weight: weight
  };

}

// Get names of players 
async function getDataByName(player_name){
  
  let teams = await getAllTeams();
  let teamsIds = teams.map((team) => team.id)
  let teamDic = {}
  teams.map((team) =>{teamDic[team.id] = team.name})
  // let teamsIds = Object.keys(teamDic)
  let playersToReturn = []  
  const playersWithTheNameList = await axios.get(`${api_domain}/players/search/${player_name}`,{
    params: {
      api_token: process.env.api_token
    }  
  })
 // Check inside teams
  playersWithTheNameList.data.data.map((player) => {
    
    if (teamsIds.includes(player.team_id)) {

      playersToReturn.push({        
        id: player.player_id,
        name: player.display_name,
        imageUrl: player.image_path,
        position: player.position_id,
        team_name: teamDic[player.team_id]
      })
    }

  })
  return playersToReturn;

}

async function getAllPlayers(){
  const league = await axios.get(
    `${api_domain}/leagues/${LEAGUE_ID}`,
    {
        params: {
        api_token: process.env.api_token,
        },
    }
    );
let seasonID = league.data.data.current_season_id
  const teams = await axios.get(`https://soccer.sportmonks.com/api/v2.0/teams/season/${seasonID}`,{
       params: {
       //   include: squad.player,    
         api_token: process.env.api_token,
         include: "squad.player",
       },
    });     
  let allPlayers = []
  teams.data.data.map( (team)=>{
      // console.log("heloo");
      const teamName = team.name;
      const teamId = team.id
      let one_team = (team.squad.data.map( (one_player)=>{
      allPlayers.push( {
          id: one_player.player.data.player_id, 
          name: one_player.player.data.fullname,
          team_name: teamName,
          team_id: teamId,
          imageUrl: one_player.player.data.image_path,
          position_id: one_player.player.data.position_id,
          common_name: one_player.player.data.common_name,
          nationality: one_player.player.data.nationality,
          birthdate: one_player.player.data.birthdate,
          birthcountry: one_player.player.data.birthcountry,
          height: one_player.player.data.height,
          weight: one_player.player.data.weight
        })
      }))
    });
    return allPlayers
}

exports.getAllPlayers = getAllPlayers
exports.getPlayersByTeam = getPlayersByTeam;
exports.getPlayersInfo = getPlayersInfo;
exports.getOnePlayerInfo = getOnePlayerInfo;
exports.getMoreDataOfPlayer = getMoreDataOfPlayer;
exports.getDataByName = getDataByName;