/**
 * Redis instance.
 */
import redis from 'redis';

const redisClient = redis.createClient(process.env.REDIS_URL); // replace with your config

// const redisClient = redis.createClient(process.env.REDISCLOUD_URL, {no_ready_check: true});

redisClient.on('error', function(err) {
    console.log('Redis error: ' + err);
});

export default redisClient;