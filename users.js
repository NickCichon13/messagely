const { router } = require("../app");
const User = require("../models/user");
const {ensureLoggedIn, ensureCorrectUser} = require("../middleware/auth");

const router = new Router();


/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/
router.get("/", ensureLoggedIn, async (req, res, next) =>{
    try{
        const results = await User.all();

        return res.json(results.rows[0]);

    } catch(error){

        return next(error);
    }
});

/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/

router.get("/:username",ensureCorrectUser, async (req, res, next) =>{ 
    try{
        const results = await User.get(req.params.username);

        res.json(results.rows[0]);

    }catch(error){

        return next(error);
    }
});

/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
router.get("/:username/to", ensureCorrectUser, async (req, res, next) => {
    try{
        const results = await User.messagesTo(req.params.username);

        res.json(results.rows[0]);

    } catch(error){

        return next(error);

    }
});

/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/

router.get("/:username/from", ensureCorrectUser, async (req, res, next) => {
    try{
        const results = await User.messagesFrom(req.params.username);

        res.json(results.rows[0]);

    } catch(error){

        return next(error);
    }
});