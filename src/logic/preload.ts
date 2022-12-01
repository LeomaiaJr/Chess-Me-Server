import { Chess } from 'chess.js';
import fse from 'fs-extra';
import { GameData, PIECES_ALIAS } from '../@types/game';
import { getPlayersConnected } from '../server';

const getAppPiecesData = (): any[][] => {
  const rawBoard = [...new Chess().board()] as any[][];

  rawBoard.forEach((row, rowIndex) => {
    row.forEach((piece) => {
      if (piece) {
        const pieceIndex = row.indexOf(piece);
        const indexLabelID = `${rowIndex}${pieceIndex}`;

        row[pieceIndex] = {
          ...row[pieceIndex],
          piece: PIECES_ALIAS[piece.type],
          id: `${piece.type}_${piece.color}_${indexLabelID}`,
        };
      }
    });
  });

  return rawBoard;
};

const INITIAL_GAME_DATA = {
  chessFen: new Chess().fen(),
  squares: getAppPiecesData(),
  deadPieces: [],
  score: {
    black: 0,
    white: 0,
  },
  playersConnected: 0,
} as GameData;

export const preloadGameData = async (forcePreload = false) => {
  const fileExists = await fse.pathExists('./game-data.json');

  if (!fileExists || forcePreload)
    await fse.writeJSON('./game-data.json', {
      ...INITIAL_GAME_DATA,
      playerConnected: getPlayersConnected(),
    });

  if (forcePreload)
    return {
      ...INITIAL_GAME_DATA,
      playerConnected: getPlayersConnected(),
    };
};
