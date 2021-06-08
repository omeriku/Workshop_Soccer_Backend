const DButils = require("./DButils");

async function registerUser(req){
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

    }
    catch (error) {
        next(error);
    }
}

async function loginUser(username, pass){
    try {
        const user = (
        await DButils.execQuery(
            `SELECT * FROM dbo.users WHERE username = '${username}'`
        )
        )[0];
        // check that username exists & the password is correct
        if (!user || !bcrypt.compareSync(pass, user.password)) {
            res.status(401).send("User not Found")
            // throw { status: 401, message: "Username or Password incorrect" };
        }  
        // Set cookie
        req.session.user_id = user.user_id;
    }
    catch(error){
        next(error);
    }

}

function logoutUser(req){
    req.session.reset();
}

exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.logoutUser = logoutUser;