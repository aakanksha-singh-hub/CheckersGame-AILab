
import { PieceType, Position } from './gameLogic';

export function moveInBoard(
  board: PieceType[][], 
  pos1: Position, 
  pos2: Position
): { newBoard: PieceType[][]; killed: boolean } {
  const newBoard = board.map(row => [...row]);
  const currentColor = newBoard[pos1[0]][pos1[1]];
  let killed = false;

  console.log(`Moving piece from [${pos1[0]}, ${pos1[1]}] to [${pos2[0]}, ${pos2[1]}]`);

  const swap = (from: Position, to: Position) => {
    // King promotion
    if ((to[0] === 0 && currentColor === 'W') || (to[0] === 7 && currentColor === 'W')) {
      newBoard[to[0]][to[1]] = 'Y'; // White becomes yellow king
    } else if ((to[0] === 0 && currentColor === 'B') || (to[0] === 7 && currentColor === 'B')) {
      newBoard[to[0]][to[1]] = 'P'; // Black becomes purple king
    } else {
      newBoard[to[0]][to[1]] = currentColor;
    }
    newBoard[from[0]][from[1]] = '';
  };

  const rowDiff = Math.abs(pos1[0] - pos2[0]);
  const colDiff = Math.abs(pos1[1] - pos2[1]);

  if (rowDiff === 1 && colDiff === 1) {
    // Regular move
    killed = false;
    swap(pos1, pos2);
    console.log('Regular move executed');
  } else if (rowDiff === 2 && colDiff === 2) {
    // Capture move
    killed = true;
    swap(pos1, pos2);
    const capturedRow = (pos1[0] + pos2[0]) / 2;
    const capturedCol = (pos1[1] + pos2[1]) / 2;
    console.log(`Capturing piece at [${capturedRow}, ${capturedCol}]`);
    newBoard[capturedRow][capturedCol] = '';
  }

  return { newBoard, killed };
}

export function isValidMove(
  board: PieceType[][], 
  pos1: Position, 
  pos2: Position, 
  canGotoList: Position[][][]
): boolean {
  if (!pos1 || !canGotoList[pos1[0]] || !canGotoList[pos1[0]][pos1[1]]) {
    console.log('Invalid move: no valid moves for piece');
    return false;
  }
  
  const isValid = canGotoList[pos1[0]][pos1[1]].some(
    ([row, col]) => row === pos2[0] && col === pos2[1]
  );
  
  console.log(`Move validation: ${isValid ? 'valid' : 'invalid'}`);
  return isValid;
}

export function checkGameEnd(board: PieceType[][]): { gameOver: boolean; winner: PieceType | null } {
  const whiteCount = board.flat().filter(p => p === 'W' || p === 'Y').length;
  const blackCount = board.flat().filter(p => p === 'B' || p === 'P').length;

  console.log(`Piece count - White: ${whiteCount}, Black: ${blackCount}`);

  if (whiteCount === 0) {
    return { gameOver: true, winner: 'B' };
  } else if (blackCount === 0) {
    return { gameOver: true, winner: 'W' };
  }

  return { gameOver: false, winner: null };
}
