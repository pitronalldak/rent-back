/**
 * Rest level class with methods for realty items.
 */
export default class RealtyApi {
    constructor (app, service) {
        this.app = app;
        this.service = service;
    }

    /**
     * Realty routes list
     */
    register = () => {
        this.app.get('/realty', (req, res) => this.service.getRealty(req, res));
    }
}
