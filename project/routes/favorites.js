var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const favorites_utils = require("./utils/favorites_utils");

router.post("/game", async (req, res, next) => {
  try {
    await DButils.execQuery(
      `INSERT INTO dbo.favorites VALUES ('${req.session.user_id}', '${req.body.id}')`
    );
    res.status(201).send("Game added Successfully");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
