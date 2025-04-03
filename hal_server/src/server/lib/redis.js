
// redisClient.js
import {createClient} from 'redis';
import {GlobalWS} from "../lib/websocket.js";

let redisClient;
let pubSubClient;
console.log('redisClient yet connected', redisClient !== undefined);
if (!redisClient) {
    redisClient =  createClient();
    redisClient.on('error', (err) => console.error('Redis Client Error', err));
    redisClient.connect()
        .then(c=>{
            console.log('connected to redis ...')
        })
        .catch((err) => console.error('Errore connessione Redis:', err));

    pubSubClient = redisClient.duplicate();
    pubSubClient.on('error', (err) => console.error('Redis Pub/Sub Client Error:', err));
    pubSubClient.connect()
        .then(c=>{
            console.log('connected to redis pubSubClient...')
        })
        .catch((err) =>
        console.error('Errore connessione Pub/Sub Redis:', err)
    );

}

export function redisConnect() {

    const ws = new GlobalWS().getInstance();

    if (!redisClient.isOpen) {
        redisClient
            .connect().then(c => {
            console.log('connected to redis client...')
        });
    }

    redisClient.set('test2', Date.now().toString()).then((data) => {
        console.log('Redis Client Connected');
        //const value = redisClient.get('test');
        //console.log('value',value)
        //clientRedis.disconnect();
    });

    pubSubClient.subscribe('info', (message) => {
        console.log('lib redis info', message);
        ws.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({info:message}));
            }
        });
    })
}

export default {redisClient, pubSubClient };
