/** User class for message.ly */

const { DB_URI } = require("../config");
const { db } = require("../db");
const ExpressError = require("../expressError");
const {BCRYPT_WORK_FACTOR} = require("../config");
const {bcrypt} = require("../config");

/** User of the site. */

class User {

    /** register new user -- returns
     *    {username, password, first_name, last_name, phone}
     */
  
    static async register({username, password, first_name, last_name, phone}) { 
    
        const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
        
        db.query(
        ` INSERT INTO users (username, password, first_name, last_name, phone)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING username, first_name, last_name, phone`
            [username, hashedPassword, first_name, last_name, phone]);

            return res.json(res.rows[0]);
        
    }
  
    /** Authenticate: is this username/password valid? Returns boolean. */
  
    static async authenticate(username, password) { 
       const results = await db.query(
        `SELECT password
         FROM users 
         WHERE username = $1
        `[username]);

        let user = results.rows[0];

        return user && await bcrypt.compare(password, user.password);
    }
    /** Update last_login_at for user */
  
    static async updateLoginTimestamp(username) { 
        const results = db.query(
        ` SELECT first_name, last_name, last_login_at
          FROM users
          RETURNING username, first_name, last_name
        `[username]);

        return res.json(results.rows[0]);

    }
  
    /** All: basic info on all users:
     * [{username, first_name, last_name, phone}, ...] */
  
    static async all() {
        const results = await db.query(
        `SELECT * FROM users
            RETURNING username, first_name, last_name, phone, last_login_at`);
        return res.json(results.rows[0])
     }
  
    /** Get: get user by username
     *
     * returns {username,
     *          first_name,
     *          last_name,
     *          phone,
     *          join_at,
     *          last_login_at } */
  
    static async get(username) { 
        const results = db.query(
        `SELECT 
            u.id, 
            u.to_username, 
            u.body, 
            u.sent_at, 
            u.read_at
        WHERE username = $1
        RETURNING username, first_name, last_name, phone
        `[username]);

        return res.json(results.rows[0]);
    }
  
    /** Return messages from this user.
     *
     * [{id, to_user, body, sent_at, read_at}]
     *
     * where to_user is
     *   {username, first_name, last_name, phone}
     */
  
    static async messagesFrom(username) {
        const results = db.query(
        `SELECT 
            u.from_username, 
            u.body, u.sent_at, 
            u.read_at
        WHERE username = $1
        RETURNING username, first_name, last_name, phone`
        [username]);

        return res.json(results.rows[0]);
        
     }
  
    /** Return messages to this user.
     *
     * [{id, from_user, body, sent_at, read_at}]
     *
     * where from_user is
     *   {username, first_name, last_name, phone}
     */
  
    static async messagesTo(username) {
        const results = await db.query(
        ` SELECT id, from_user, body, sent at, read_at 
          FROM messages
          WHERE username = $1
          RETURNING username, first_name, last_name, phone
        `[username]);

        return res.json(results.rows[0]);
     }
  }
  
  
  module.exports = User;