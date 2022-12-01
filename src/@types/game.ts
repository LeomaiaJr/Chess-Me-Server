import { Move, PieceSymbol, Square } from 'chess.js';

export type Piece = 'pawn' | 'rook' | 'bishop' | 'knight' | 'queen' | 'king';
export type Color = 'b' | 'w';

export interface PieceData {
  square: Square;
  piece: Piece;
  color: Color;
  id: string;
  type?: PieceSymbol;
}

export interface Auth {
  leosSecret?: string;
}

export interface Movement extends Auth {
  move: Move;
  playerName: string;
}

export interface GameData {
  chessFen: string;
  squares: (PieceData | null)[][];
  deadPieces: PieceData[];

  lastMove?: {
    playerName: string;
    date: string;
  };
  score: {
    white: number;
    black: number;
  };
  playersConnected: number;
}

export const PIECES_ALIAS: {
  [key: string]: Piece;
} = {
  p: 'pawn',
  r: 'rook',
  b: 'bishop',
  n: 'knight',
  q: 'queen',
  k: 'king',
};

export const SQUARE_TO_VECTOR_DATA = {
  a: 0,
  b: 1,
  c: 2,
  d: 3,
  e: 4,
  f: 5,
  g: 6,
  h: 7,
  '1': 7,
  '2': 6,
  '3': 5,
  '4': 4,
  '5': 3,
  '6': 2,
  '7': 1,
  '8': 0,
} as const;
