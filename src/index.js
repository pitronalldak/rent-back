/**
 * Module dependencies.
 */
import http from 'http';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import expressValidator from 'express-validator';
import session from 'express-session';
import cookieParser from 'cookie-parser';

import config from './config.json';
import {db} from './db.js';

import AuthApi from './rest-api/auth';
import AuthService from './services/auth';
import AuthDao from './dao/auth';

let app = express();
app.server = http.createServer(app);

/**
 *  3rd party middleware.
 */
app.use(cors());

app.use(bodyParser.json({
	limit : config.bodyLimit
}));


app.use(cookieParser());


app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}))

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

app.server.listen(process.env.PORT || config.port);

console.log(`Started on port ${app.server.address().port}`);


export default app;
