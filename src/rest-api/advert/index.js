/**
 * Rest level class with methods for advertisement.
 */
export default class AdvertApi {
    constructor (app, service) {
        this.app = app;
        this.service = service;
    }

    /**
     * Advertisement routes list
     */
    register = () => {
        this.app.post('/advert/create', (req, res) => this.service.createAdvert(req, res));

    }
}
