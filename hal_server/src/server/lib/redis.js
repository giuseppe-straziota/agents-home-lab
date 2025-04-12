
// redisClient.js
import {createClient} from 'redis';
import {GlobalWS} from "../lib/websocket.js";

let redisClient;
let subscribeClient;
let publishClient;
console.log('redisClient yet connected', redisClient !== undefined);
if (!redisClient) {
    redisClient =  createClient();
    publishClient = redisClient.duplicate();
    subscribeClient = redisClient.duplicate();
    redisClient.on('error', (err) => console.error('Redis Client Error', err));
    redisClient.connect()
        .then(c=>{
            console.log('connected to redis ...')
        })
        .catch((err) => console.error('Errore connessione Redis:', err));

    subscribeClient.on('error', (err) => console.error('Redis Pub/Sub Client Error:', err));
    subscribeClient.connect()
        .then(c=>{
            console.log('connected to redis pubSubClient...')
        })
        .catch((err) =>
        console.error('Errore connessione Pub/Sub Redis:', err)
    );

    publishClient.on('error', (err) => console.error('Redis publishClient Client Error:', err));
    publishClient.connect()
        .then(c=>{
            console.log('connected to redis publishClient...')
        })
        .catch((err) =>
        console.error('Errore connessione publishClient Redis:', err)
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

    redisClient.set('redis_conn_timestamp', Date.now().toString()).then((data) => {
        console.log('Redis Client Connected');
    });

    subscribeClient.subscribe('info', (message) => {
        console.log('lib redis info', message);
        ws.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                    channel: "info",
                    payload: JSON.parse(message),
                }));
            }
        });
    })

    subscribeClient.subscribe('processing', (message) => {
        console.log('lib redis processing', message);
        ws.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                    channel: "processing",
                    payload:  message,
                }));
            }
        });
    })
}

export default {redisClient, publishClient};
