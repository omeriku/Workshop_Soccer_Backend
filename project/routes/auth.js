var express = require("express");
var router = express.Router();
const DButils = require("../routes/utils/DButils");
const bcrypt = require("bcryptjs");
const auth_utils = require("../routes/utils/auth_utils")

router.post("/register", async (req, res, next) => {
  try {
    // parameters exists
    // valid parameters
    // username exists
    const users = await DButils.execQuery(
      "SELECT username FROM dbo.users"
    );

    if (users.find((x) => x.username === req.body.username))
      throw { status: 409, message: "Username taken" };
    if (users.find((x) => x.email === req.body.email))
      throw { status: 409, message: "email taken" };

    //hash the password
    let hash_password = bcrypt.hashSync(
      req.body.password,
      parseInt(process.env.bcrypt_saltRounds)
    );
    req.body.password = hash_password;

    // add the new username
    await DButils.execQuery(
      `INSERT INTO dbo.users (username, password, firstname, lastname, email, country, imageUrl) VALUES ('${req.body.username}', '${hash_password}', '${req.body.firstname}', '${req.body.lastname}', '${req.body.email}', '${req.body.country}', '${req.body.imageUrl}')`
    );
    res.status(201).send("user created");
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    //auth_utils.loginUser(req.body.username, req.body.password);
    const user = (
      await DButils.execQuery(
        `SELECT * FROM dbo.users WHERE username = '${req.body.username}'`
      )
    )[0];
    // user = user[0];
    console.log(user);

    // check that username exists & the password is correct
    if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
      res.status(401).send("User not Found")
      // throw { status: 401, message: "Username or Password incorrect" };
    }

    // Set cookie
    req.session.user_id = user.user_id;

    // return cookie
    res.status(200).send("login succeeded");
  } catch (error) {
    next(error);
  }
});

router.post("/logout", function (req, res) {
  auth_utils.logoutUser(req);
  // req.session.reset(); // reset the session info --> send cookie when  req.session == undefined!!
  res.send({ success: true, message: "logout succeeded" });
});

module.exports = router;
