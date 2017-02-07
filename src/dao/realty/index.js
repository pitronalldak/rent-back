/**
 * Module dependencies.
 */
import Dao from '../dao.js';

/**
 * Dao level class with methods for realty.
 */
export default class RealtyDao extends Dao {
    constructor(db) {
        super();
        this.db = db;
    }

    /**
     * Method for request new realty from DB.
     *
     * @param {Object} filter filter list for request.
     * @return {Promise} promise.
     */
    getRealty = (filter) => (
        this.db.manyOrNone(
            'SELECT * FROM advert ORDER BY created ASC LIMIT 10'
        )
    );

    /**
     * Method for request photos list by advert identifier.
     *
     * @param {Object} advertIdList filter list for request.
     * @return {Promise} promise.
     */
    getPhotos = (advertIdList) => (
        this.db.task(t => {
            const queries = [];
            for (let advertId of advertIdList) {
                queries.push(this.db.manyOrNone('SELECT * FROM photo WHERE advertId=$1', [advertId]));
            }
            return t.batch(queries);
        })
    );

};