
export type PieceType = 'W' | 'B' | 'Y' | 'P' | '';
export type Position = [number, number];
export type Move = [Position, Position];

export interface GameState {
  board: PieceType[][];
  currentPlayer: Position;
  currentColor: PieceType;
  killed: boolean;
  zigzag: boolean;
  gameOver: boolean;
  winner: PieceType | null;
}

export const INITIAL_BOARD: PieceType[][] = [
  ['B', '', 'B', '', 'B', '', 'B', ''],
  ['', 'B', '', 'B', '', 'B', '', 'B'],
  ['B', '', 'B', '', 'B', '', 'B', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', 'W', '', 'W', '', 'W', '', 'W'],
  ['W', '', 'W', '', 'W', '', 'W', ''],
  ['', 'W', '', 'W', '', 'W', '', 'W']
];

export const OPPONENTS: Record<PieceType, PieceType[]> = {
  'W': ['B', 'P'],
  'B': ['W', 'Y'],
  'Y': ['B', 'P'],
  'P': ['W', 'Y'],
  '': []
};

export const PIECE_COLORS: Record<PieceType, string> = {
  'W': "white",
  'B': "red",
  'Y': "yellow",
  'P': "purple",
  '': ""
};
