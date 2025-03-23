
// redisClient.js
import {createClient} from 'redis';

let redisClient;
console.log('redisClient yet connected', redisClient);
if (!redisClient) {
    redisClient =  createClient();

    redisClient.on('error', (err) => console.error('Redis Client Error', err));

    // Avvia la connessione
    redisClient.connect().catch((err) => console.error('Errore connessione Redis:', err));
}

export default redisClient;
