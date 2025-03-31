import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import {GlobalWS} from "./lib/websocket.js";
import {redisConnect} from "./lib/redis.js";
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(async () => {

    const server = createServer((req, res) => {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
    });


    const port =  process.env.SERVER_PORT;
    server.listen(port, () => {
        console.log(`> Ready on http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`);
    });

    redisConnect();
    const wsServer = new GlobalWS();
    console.log('wsserver ', wsServer.getInstance())

});





