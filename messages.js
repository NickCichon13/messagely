const { router } = require("../app");
const Message = require("../models/messgaes");

/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/
router.get("/:id", async (req, res, next) => {
    try{
        const results = await Message.get();

        res.json(results.rows[0]);

    } catch(error){

        return next(error);
    }
})

/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/

router.post("/create", async (req, res, next) => {
    try{
        const results = await Message.create();

        res.json(results.rows[0]);

    } catch(error){
        return next(error);
    }
})


/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/
router.post("/:id/read", async (req, res, next) => {
    try{
        const results = await Message.markRead();

        res.json(results.rows[0]);
        
    } catch(error){
        return next(error);
    }
})
