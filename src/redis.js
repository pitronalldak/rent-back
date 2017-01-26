/**
 * Redis instance.
 */
import redis from 'redis';

const redisClient = redis.createClient({
    host: 'ec2-54-243-141-208.compute-1.amazonaws.com',
    port: 25049,
    ttl :  260
}); // replace with your config

// const redisClient = redis.createClient(process.env.REDISCLOUD_URL, {no_ready_check: true});

redisClient.on('error', function(err) {
    console.log('Redis error: ' + err);
});

export default redisClient;