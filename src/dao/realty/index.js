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
            'SELECT * FROM advert ORDER BY created ASC LIMIT 10 OFFSET 0'
        )
    );

    /**
     * Method for request photos list by advert identifier.
     *
     * @param {Object} adverts.
     * @return {Promise} promise.
     */
    getPhotos = (adverts) => {
        const queries = [];
        for (let advert of adverts) {
            queries.push(this.db.manyOrNone('SELECT * FROM photo WHERE advertId=$1', [advert.id]));
        }
        return this.db.task(t => t.batch(queries));
    };

    /**
     * Method for request address list by advert identifier.
     *
     * @param {Object} adverts.
     * @return {Promise} promise.
     */
    getAddresses = (adverts) => {
        const queries = [];
        for (let advert of adverts) {
            queries.push(this.db.oneOrNone('SELECT * FROM location WHERE advertId=$1', [advert.id]));
        }
        return this.db.task(t => t.batch(queries));
    };

    /**
     * Method for request terms list by advert identifier.
     *
     * @param {Object} adverts.
     * @return {Promise} promise.
     */
    getTerms = (adverts) => {
        const queries = [];
        for (let advert of adverts) {
            if (advert.dealtype === 'sale') {
                queries.push(this.db.oneOrNone('SELECT * FROM salePrice WHERE advertId=$1', [advert.id]));
            }
            if (advert.dealtype === 'rent') {
                for (let advert of adverts) {
                    queries.push(this.db.oneOrNone('SELECT * FROM rentPrice WHERE advertId=$1', [advert.id]));
                }
            }
        }
        return this.db.task(t => t.batch(queries));
    };

};