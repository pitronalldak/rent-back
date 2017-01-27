/**
 * Module dependencies.
 */
const crypto = require('crypto');
import getHash from './pass';
import Service from '../service';

/**
 * Service level class with methods for authorization.
 */
export default class AuthService extends Service {
    constructor(dao) {
        super();
        this.dao = dao;
    }

    /**
     * Method returning user info.
     *
     * @param {String} req request from client
     * @param {String} res response to client
     * @return {Promise} promise
     */
    getUser = (req, res) => {
        console.log(req.session);
        console.log(req.sessionID);
        if(req.session.userId) {
            // if email key is sent redirect.
            return res.json({user: req.session.key['user'], isLogin: true})
        } else {
            return res.json({isLogin: false})
        }
    };

    /**
     * Method for creating new user.
     *
     * @param {String} req request from client
     * @param {String} res response to client
     * @return {Promise} promise
     */
    createUser = (req, res) => {
        req.assert('email', 'required').notEmpty();
        req.assert('email', 'valid email required').isEmail();
        req.assert('password', 'required').notEmpty();
        req.assert('password', '6 to 20 characters required').len(6, 20);
        req.assert('userName', 'required').notEmpty();
        req.assert('phone', 'required').notEmpty();
        this.validation(req);

        //generate a salt for  and new password for db
        const salt = crypto.randomBytes(64).toString('base64');
        const password = getHash(req.body.password, salt);
        req.body.salt = salt;
        req.body.password = password;
        return (
            this.dao.createUser(req.body)
                .then(data => {
                    res.json(data);
                })
                .catch(error => {
                    res.status(400).json(error.message || error);
                }))
    };

    /**
     * Method for user login.
     *
     * @param {String} req request from client
     * @param {String} res response to client
     * @return {Promise} promise
     */
    login = (req, res) => {
        req.assert('password', 'required').notEmpty();
        req.assert('password', '6 to 20 characters required').len(6, 20);
        req.assert('email', 'valid email required').isEmail();
        req.assert('email', 'required').notEmpty();
        this.validation(req);


        return (
            this.dao.getUser(req.body.email)
                .then(user => {
                    if (!user) {
                        res.status(400).send(JSON.stringify('User not exist'));
                    } else {
                        const hash = getHash(req.body.password, user.salt);
                        if (hash == user.password) {
                            req.session.regenerate(() => {
                                delete user.password;
                                delete user.salt;
                                req.session.userId = user.id;
                                console.log(req.sessionID);
                                // res.cookie('cookieName', Math.random().toString(), { maxAge: 900000, httpOnly: true });
                                res.json(user);
                            });
                        } else {
                            res.status(400).json('Invalid password');
                        }
                    }
                })
                .catch(error => {
                    res.status(400).json(error.message || error);
                }))
    };
}