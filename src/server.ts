import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import chessHandlers from './logic/chess';
import { preloadGameData } from './logic/preload';

let playersConnected = 0;

export const getPlayersConnected = () => playersConnected;

const port = process.env.PORT || 3800;
const app = express();

app.use(express.json());
app.use((_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

preloadGameData();

const { getGameData, handleMovement, resetChessGame } = chessHandlers;

app.get('/game-data', async (_, res) => {
  res.json(await getGameData());
});

app.post('/move', async (req, res) => {
  const { data, status } = await handleMovement(req.body, io);

  res.status(status).json(data);
});

app.post('/reset', async (req, res) => {
  const data = await resetChessGame(req.body?.leosSecret, io);

  if (data !== undefined) res.status(data.status).json(data.data);
  else res.json({ message: 'Game reseted' });
});

io.on('connection', (socket) => {
  playersConnected++;

  socket.on('disconnect', () => {
    playersConnected--;
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
