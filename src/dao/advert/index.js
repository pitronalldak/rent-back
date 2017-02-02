/**
 * Module dependencies.
 */
import Dao from '../dao.js';

/**
 * Dao level class with methods for advertisement.
 */
export default class AdvertDao extends Dao {
    constructor(db) {
        super();
        this.db = db;
    }

    /**
     * Method for creating new advertisement in DB.
     *
     * @param {String} advert advertisement data.
     * @param {String} userId user identifier.
     * @return {Promise} promise.
     */
    createAdvert = (advert, userId) => (
        this.db.tx((t) =>
                t.one("INSERT INTO advert (dealType, realtyType, objectType, periodType, description, userId)" +
                    " VALUES($1, $2, $3, $4, $5, $6) " +
                    "RETURNING id",
                    [advert.dealType, advert.realtyType, advert.objectType, advert.periodType, advert.description, userId],
                    u => u.id)
                .then((advertId) => {
                    const queries = [];
                    const address = advert.address;
                    queries.push(t.one("INSERT INTO location (placeId, name, lat, lng, advertId)" +
                        " VALUES($1, $2, $3, $4, $5)" +
                        "RETURNING id",
                        [address.placeId, address.name, address.lat, address.lng, advertId],
                        u => u.id));
                    if (advert.dealType === 'rent') {
                        queries.push(t.none("INSERT INTO rentPrice (advertId, price, utilityPayments, prepayment, " +
                            "depositOwner, commission, currency)" +
                            " VALUES($1, $2, $3, $4, $5, $6, $7)",
                            [advertId, advert.price, advert.utilityPayments, advert.prepayment, advert.depositOwner, advert.commission, advert.currency]));
                    }
                    if (advert.dealType === 'sale'){
                        queries.push(t.none("INSERT INTO rentPrice (advertId, price, currency)" +
                            " VALUES($1, $2, $3)",
                            [advertId, advert.price, advert.currency],));
                    }
                    if (advert.objectType === 'land') {
                        queries.push(t.none("INSERT INTO residentialLand (advertId, area, areaMeasure, townShip, " +
                            "electricity, sewerage, waterSupply)" +
                            " VALUES($1, $2, $3, $4, $5, $6, $7)",
                            [advertId, advert.area, advert.areaMeasure, advert.townShip, advert.electricity, advert.sewerage, advert.waterSupply]));
                    } else {
                        const houseOptions = {};
                        for (let option of advert.houseOptions) {
                            houseOptions[option.key] = option.value;
                        }
                        queries.push(t.none("INSERT INTO residentialBuilding (advertId, year, houseType, area, " +
                            "floors, bedrooms, repair, gardenArea, gardenAreaMeasure," +
                            "washer, wc, fridge, childrenAllowed, animalsAllowed, dishwasher, furnitureRooms, furnitureKitchen," +
                            "conditioning, tv, internet, phone, bath, shower, garage, swimmingPool)" +
                            " VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19," +
                            "$20, $21, $22, $23, $24, $25)",
                            [advertId, advert.year, advert.houseType, advert.area, advert.floors, advert.bedrooms, advert.repair,
                                advert.gardenArea, advert.gardenAreaMeasure, houseOptions.washer, houseOptions.wc,
                                houseOptions.fridge, houseOptions.childrenAllowed, houseOptions.animalsAllowed, houseOptions.dishwasher,
                                houseOptions.furnitureRooms, houseOptions.furnitureKitchen, houseOptions.conditioning, houseOptions.tv,
                                houseOptions.internet, houseOptions.phone, houseOptions.bath, houseOptions.shower, houseOptions.garage,
                                houseOptions.swimmingPool]));
                    }
                    for (const photo of advert.uploadedImgList) {
                        queries.push(t.none('INSERT INTO photo (format, url, height, width, bytes, advertId)' +
                            ' VALUES($1, $2, $3, $4, $5, $6)',
                            [photo.format, photo.url, photo.height, photo.width, photo.bytes, advertId]
                        ));
                    }
                    return t.batch(queries)

                })
    ))
};