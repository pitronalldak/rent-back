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
                    const advertIdList = adverts.map(a => adverts.id);
                    this.dao.getPhotos(advertIdList)
                        .then((photoList) => {
                            for (const index in adverts) {
                                adverts[index].photos = photoList[index];
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