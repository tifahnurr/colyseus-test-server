import { Server } from 'colyseus';
import { WebSocketTransport } from '@colyseus/ws-transport';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { monitor } from '@colyseus/monitor';

// Rooms
import BattleRoom from './src/rooms/BattleRoom';

const port =
  Number(process.env.PORT || 2567) + Number(process.env.NODE_APP_INSTANCE || 0);

const app = express();
app.use(cors());
app.use(express.json());

const server = createServer(app);

const gameServer = new Server({
  transport: new WebSocketTransport({
    server,
  }),
});

// register colyseus monitor
const monitorRouter = monitor({
  columns: [
    'roomId',
    'name',
    'clients',
    { metadata: 'ping' }, // display 'ping' from metadata
    'locked',
    'elapsedTime',
  ],
});
app.use('/colyseus', monitorRouter);

// test server
app.get('/ping', (_, res) => {
  res.status(200).send('pong');
});

// register game rooms
gameServer.define('battle_room', BattleRoom);

gameServer.listen(port).then(() => {
  console.log(`Running on COLYSEUS on port: ${port}`);
});
