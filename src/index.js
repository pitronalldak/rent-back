/**
 * Module dependencies.
 */
import http from 'http';
import express from 'express';
import cors from 'cors';
import expressValidator from 'express-validator';
import session from 'express-session';
let redisStore = require('connect-redis')(session);

import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import config from './config.json';
import {db} from './db.js';
import redisClient from './redis';

import AuthApi from './rest-api/auth';
import AuthService from './services/auth';
import AuthDao from './dao/auth';

import AdvertApi from './rest-api/advert';
import AdvertService from './services/advert';
import AdvertDao from './dao/advert';

import RealtyApi from './rest-api/realty';
import RealtyService from './services/realty';
import RealtyDao from './dao/realty';

let app = express();
app.server = http.createServer(app);

/**
 *  3rd party middleware.
 */
// app.use(cookieParser());

app.use(session({
    secret: 'keyboard cat',
    store: new redisStore({client: redisClient}),
    saveUninitialized: false,
    resave: false,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 60
    }
}));

app.use(cors({
    origin: ['http://localhost:3000', 'https://rent-front.herokuapp.com'],
    credentials: true
}));

app.use(bodyParser.json({
	limit : config.bodyLimit
}));


app.all('*', function (req, res, next) {
    next(); // pass control to the next handler
});


app.use(expressValidator({
    errorFormatter: (param, msg, value) => {
        const namespace = param.split('.');
        const root    = namespace.shift();
        let formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg   : msg,
            value : value
        };
    }
}));

new AuthApi(app, new AuthService(new AuthDao(db))).register();
new AdvertApi(app, new AdvertService(new AdvertDao(db))).register();
new RealtyApi(app, new RealtyService(new RealtyDao(db))).register();

app.server.listen(process.env.PORT || config.port);

console.log(`Started on port ${app.server.address().port}`);


export default app;
