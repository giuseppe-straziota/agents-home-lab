
// redisClient.js
import {createClient} from 'redis';
import {GlobalWS} from "../lib/websocket.js";

let redisClient;
let subscribeClient;
let publishClient;
console.log('Is redis client already connected', redisClient !== undefined);
if (!redisClient) {
    redisClient =  createClient();
    publishClient = redisClient.duplicate();
    subscribeClient = redisClient.duplicate();
    redisClient.on('error', (err) => console.error('Redis Client Error', err));
    redisClient.connect()
        .then(()=>{
            console.log('connected to redis client ...')
        })
        .catch((err) => console.error('Error connection  Redis client:', err));

    subscribeClient.on('error', (err) => console.error('Redis subscribeClient Error:', err));
    subscribeClient.connect()
        .then(()=>{
            console.log('connected to redis subscribeClient...')
        })
        .catch((err) =>
        console.error('Error connection subscribeClient Redis:', err)
    );

    publishClient.on('error', (err) => console.error('Redis publishClient Client Error:', err));
    publishClient.connect()
        .then(()=>{
            console.log('connected to redis publishClient...')
        })
        .catch((err) =>
        console.error('Error connection publishClient Redis:', err)
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

    redisClient.set('redis_conn_timestamp', Date.now().toString()).then(() => {
        console.log('Redis Client Connected');
    });

    subscribeClient.subscribe('info', (message) => {
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
