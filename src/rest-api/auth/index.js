/**
 * Rest level class with methods for authorization.
 */
export default class AuthApi {
    constructor (app, service) {
        this.app = app;
        this.service = service;
    }

    /**
     * Authorization routes list
     */
    register = () => {
        this.app.post('/auth/sign-up', (req, res) => this.service.createUser(req, res));
        this.app.post('/auth/login', (req, res) => this.service.login(req, res));
        this.app.get('/auth/logout', (req, res) => this.service.logout(req, res));
        this.app.get('/auth/user', (req, res) => this.service.getUser(req, res));
    }
}
