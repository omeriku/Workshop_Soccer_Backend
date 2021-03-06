var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const favorites_utils = require("./utils/favorites_utils");


router.use(async function (req, res, next) {
  if (req.session && req.session.user_id) {
    DButils.execQuery("SELECT user_id FROM users")
      .then((users) => {
        if (users.find((x) => x.user_id === req.session.user_id)) {
          req.user_id = req.session.user_id;
          next();
        }
      })
      .catch((err) => next(err));
  } else {
    res.sendStatus(401);
  }
});


router.post("/addGame", async (req, res, next) => {
  try {
    const currentGames = await DButils.execQuery(
      `SELECT * FROM dbo.favorites WHERE user_id = '${req.session.user_id}'`
    );

    if (currentGames.find((x) => x.game_id === req.body.id))
      throw { status: 409, message: "Game Already Added" };



    await DButils.execQuery(
      `INSERT INTO dbo.favorites VALUES ('${req.session.user_id}', '${req.body.id}')`
    );
    res.status(201).send("Game added Successfully");
  } catch (error) {
    next(error);
  }
});

router.get("/getGames", async (req, res, next) => {
  try {
    const games_details = await favorites_utils.getAllGamesforUser(req);
    res.send(games_details);
  } catch (error) {
    next(error);
  }
});

router.post("/delGame", async (req, res, next) => {
  try {
    const currentGames = await DButils.execQuery(
      `SELECT * FROM dbo.favorites WHERE user_id = '${req.session.user_id}'`
    );

    if ( !(currentGames.find((x) => x.game_id === req.body.id)) )
      throw { status: 409, message: "Game Not Exist" };



    await DButils.execQuery(
      `DELETE FROM dbo.favorites WHERE user_id = '${req.session.user_id}' AND game_id = '${req.body.id}'`
    );
    res.status(201).send("Game Deleted Successfully");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
