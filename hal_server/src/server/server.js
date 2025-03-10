import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { createClient } from 'redis';
import {initWebSocket, setWSServer} from "./websocket.js";
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
    // Creiamo un server HTTP
    const server = createServer((req, res) => {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
    });


    const port =  process.env.SERVER_PORT;
    server.listen(port, () => {
        console.log(`> Pronto su http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`);
    });

    setWSServer(initWebSocket())

    redisConnect();


});


export function redisConnect(){
    const clientRedis = createClient({url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`});

    clientRedis
        .on('error', err => console.log('Redis Client Error', err))
        .connect();

    clientRedis.set('test','2222').then((data)=>{
        console.log('Redis Client Connected', data);
        const value = clientRedis.get('test');
        console.log('value',value)
        //clientRedis.disconnect();
    });
}
