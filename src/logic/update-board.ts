import { Move } from 'chess.js';
import { GameData, PieceData, SQUARE_TO_VECTOR_DATA } from '../@types/game';

const chessPositionToBoardPosition = (position: string) => {
  const [x, y] = position.split('');

  return [(SQUARE_TO_VECTOR_DATA as any)[x], 8 - +y];
};

export const updateBoard = (move: Move, gameData: GameData): GameData => {
  const [fCol, fRow] = chessPositionToBoardPosition(move.from);
  const [tCol, tRow] = chessPositionToBoardPosition(move.to);

  const newGameData = { ...gameData };
  const prevGameData = { ...gameData };

  const squareData = newGameData.squares[fRow][fCol];

  if (move.captured !== undefined) {
    const capturedPiece = prevGameData.squares[tRow][tCol];
    prevGameData.squares[tRow][tCol] = null;

    newGameData.deadPieces.push(capturedPiece!);
  }

  prevGameData.squares[fRow][fCol] = null;
  newGameData.squares[tRow][tCol] = {
    ...squareData,
    square: move.to,
  } as PieceData;

  if (move.promotion !== undefined) {
    newGameData.squares[tRow][tCol] = {
      ...squareData,
      square: move.to,
      piece: 'queen',
      type: 'q',
    } as PieceData;
  }

  return newGameData;
};
