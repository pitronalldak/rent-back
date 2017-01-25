/**
 * Module dependencies.
 */
import Dao from '../dao.js';

/**
 * Dao level class with methods for authorization.
 */
export default class AuthDao extends Dao {
    constructor(db) {
        super();
        this.db = db;
    }

    /**
     * Method for creating new user in DB.
     *
     * @param {String} data user registration data.
     * @return {Promise} promise.
     */
    createUser = (data) => (
        this.db.oneOrNone('SELECT * FROM userinfo WHERE email = $1', data.email)
            .then(result => {
                if (result) {
                    throw {error: `User with email: ${data.email} already exist`};
                } else {
                    return (
                        this.db.one(
                            "INSERT INTO userinfo(${this~}) VALUES(${email}, ${password}, ${userName}, ${phone}, ${salt}) RETURNING id",
                            data,
                            u => u
                        ))
                }
            })
    );

    /**
     * Method request from DB userInfo.
     *
     * @param {String} data user email.
     * @return {Promise} promise.
     */
    getUser = (data) => (
        this.db.oneOrNone('SELECT * FROM userinfo WHERE email = $1', data)
    )
}