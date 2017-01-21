/**
 * Module dependencies.
 */
var pgp = require('pg-promise')({
    // Initialization Options
});

/**
 * Db config.
 */
let config = {
    host: 'ec2-54-247-120-169.eu-west-1.compute.amazonaws.com',
    port: 5432,
    database: 'd3tb1q5gs84aej',
    user: 'qvgrklqdeplvhf',
    password: '29325a63a6cb798639950d9f0dca21652fe844831d06b1d15f2fdd76df5b8288',
    ssl: true
};

/**
 * Db instance.
 */
export const db = pgp(config);
