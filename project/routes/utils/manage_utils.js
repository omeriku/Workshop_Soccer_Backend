const DButils = require('./DButils')

async function createGame(home_team_id,away_team_id,date_time,stadium,referee_id){

    await DButils.execQuery(
        `INSERT INTO dbo.test_games (home_team_id, away_team_id, date_time, stadium, referee_id) VALUES ('${home_team_id}', '${away_team_id}', '${date_time}', '${stadium}', '${referee_id}')`
    );
}

exports.createGame = createGame;