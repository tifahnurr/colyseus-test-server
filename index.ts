/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
import { Server } from 'colyseus';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { monitor } from '@colyseus/monitor';

const port = Number(process.env.port) || 3000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

const gameServer = new Server({
  server: createServer(app),
});

// register colyseus monitor
const monitorRouter = monitor();
app.use('/colyseus', monitorRouter);

// test server
app.get('/ping', (_, res) => {
  res.send('pong');
});

gameServer.listen(port).then(() => {
  console.log(`Running on COLYSEUS on port: ${port}`);
});
