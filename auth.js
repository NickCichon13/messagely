const { register } = require("module");
const { DB_URI } = require("../config");
const User = require("../models/user");

/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/
register.post("/login", async (req, res, next) => {
    try{
        const {username, password} = req.body;
        const results = await db.query(
        ` SELECT password 
          FROM users
          WHERE username = $1
        `[username]);

        return res.json(results.rows[0]);

         if (User) {
            if (await bcrypt.compare(password, User.password) === true) {
              let token = jwt.sign({ username }, SECRET_KEY);
              return res.json({ token });
            }
        }
        throw new ExpressError("Invalid user/password", 400);
    } catch(error){
        return next(error);
    }
});


/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */
router.post("/register", async (req, res, next ) => {
    try{
    let reg = await User.register();
    return res.json(reg.rows[0]);

    } catch(error){

        return next(error);
    }
})