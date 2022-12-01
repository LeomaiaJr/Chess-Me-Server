import { Chess } from 'chess.js';
import 'dotenv/config';
import fse from 'fs-extra';
import { Server } from 'socket.io';
import { GameData, Movement } from '../@types/game';
import { SocketGameEvents } from '../@types/socket';
import { getPlayersConnected } from '../server';
import { preloadGameData } from './preload';
import { updateBoard } from './update-board';
import { movementSchema } from './validate';

const getError = (error: string, statusCode: number) => ({
  data: {
    error,
  },
  status: statusCode,
});

const getSuccess = (message: string) => ({
  data: {
    message,
  },
  status: 200,
});

const validateLeo = (leosSecret?: string) =>
  (leosSecret ?? '') === process.env.LEOS_SECRET;

const getGameData = async () => {
  const data = await fse.readJSON('./game-data.json');

  return data as GameData;
};

const handleMovement = async (payload: Movement, socket: Server) => {
  const isMovValid = await movementSchema.isValid(payload || {});

  if (!isMovValid) return getError('Invalid movement data', 400);

  const gameData = await getGameData();
  const chess = new Chess(gameData.chessFen);

  const turn = chess.turn();

  if (turn === 'w' && !validateLeo(payload.leosSecret))
    return getError('You are not Leo!', 403);

  const isValid = chess.move(payload.move) !== null;

  if (!isValid) return getError('Invalid movement', 400);

  const { squares, deadPieces } = updateBoard(payload.move, gameData);

  const newGameData = {
    ...gameData,
    squares,
    deadPieces,
    chessFen: chess.fen(),
    lastMove: {
      playerName: validateLeo(payload.leosSecret) ? 'Leo' : payload.playerName,
      date: new Date().toISOString(),
    },
    playersConnected: getPlayersConnected(),
  } as GameData;

  await fse.writeJSON('./game-data.json', newGameData);
  socket.emit(SocketGameEvents.GAME_DATA, newGameData);

  return getSuccess('Movement saved');
};

const resetChessGame = async (secret: string, socket: Server) => {
  if (!validateLeo(secret)) return getError('You are not Leo!', 403);

  const newGameData = await preloadGameData(true);

  socket.emit(SocketGameEvents.GAME_DATA, {
    ...newGameData,
    playersConnected: getPlayersConnected(),
    lastMove: {
      playerName: 'Leo',
      date: new Date().toISOString(),
    },
  } as GameData);
};

export default {
  getGameData,
  handleMovement,
  resetChessGame,
};
