/**
 * Module dependencies.
 */
import Service from '../service';

/**
 * Service level class with methods for realty.
 */
export default class RealtyService extends Service {
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
    getRealty = (req, res) => {
        //TODO should add validation logic 
        // req.assert('email', 'required').notEmpty();
        // req.assert('email', 'valid email required').isEmail();
        // req.assert('password', 'required').notEmpty();
        // req.assert('password', '6 to 20 characters required').len(6, 20);
        // req.assert('userName', 'required').notEmpty();
        // req.assert('phone', 'required').notEmpty();
        // this.validation(req);
        return (
            this.dao.getRealty(req.body)
                .then((adverts) => {
                    const advertIdList = adverts.map(a => a.id);
                    Promise.all([this.dao.getPhotos(advertIdList), this.dao.getAddresses(advertIdList)])
                        .then((values) => {
                            for (const index in values[0]) {
                                adverts[index].photos = values[0][index];
                            }
                            for (const index in values[1]) {
                                adverts[index].address = values[1][index];
                            }
                            res.json(adverts);
                    })
                    .catch(error => {
                        res.status(400).json(error.message || error);
                    })
                })
                .catch(error => {
                    res.status(400).json(error.message || error);
                }))
    };
}