/**
 * Module dependencies.
 */
import Service from '../service';

/**
 * Service level class with methods for authorization.
 */
export default class AdvertService extends Service {
    constructor(dao) {
        super();
        this.dao = dao;
    }

    /**
     * Method for creating new advertisement.
     *
     * @param {String} req request from client
     * @param {String} res response to client
     * @return {Promise} promise
     */
    createAdvert = (req, res) => {
        // req.assert('email', 'required').notEmpty();
        // req.assert('email', 'valid email required').isEmail();
        // req.assert('password', 'required').notEmpty();
        // req.assert('password', '6 to 20 characters required').len(6, 20);
        // req.assert('userName', 'required').notEmpty();
        // req.assert('phone', 'required').notEmpty();
        // this.validation(req);
        return (
            this.dao.createAdvert(req.body, 1)
                .then((data) => {
                    res.json({advertId: data[0]});
                })
                .catch(error => {
                    res.status(400).json(error.message || error);
                }))
    };
}