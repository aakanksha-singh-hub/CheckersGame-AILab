
import { PieceType, Position, OPPONENTS } from './gameLogic';

export function canGoTo(board: PieceType[][], row: number, col: number): Position[] {
  const canGoto: Position[] = [];
  const pieceColor = board[row][col];
  
  console.log(`Checking moves for piece ${pieceColor} at [${row}, ${col}]`);

  // Regular pieces can't move backwards relative to their color
  if (pieceColor !== 'W' && pieceColor !== 'Y') {
    // Forward moves for black pieces (B, P)
    if (col < 7 && row < 7 && board[row + 1][col + 1] === '') {
      canGoto.push([row + 1, col + 1]);
    } else if (col < 6 && row < 6 && 
               OPPONENTS[pieceColor]?.includes(board[row + 1][col + 1]) && 
               board[row + 2][col + 2] === '') {
      canGoto.push([row + 2, col + 2]);
    }

    if (col > 0 && row < 7 && board[row + 1][col - 1] === '') {
      canGoto.push([row + 1, col - 1]);
    } else if (col > 1 && row < 6 && 
               OPPONENTS[pieceColor]?.includes(board[row + 1][col - 1]) && 
               board[row + 2][col - 2] === '') {
      canGoto.push([row + 2, col - 2]);
    }
  }

  if (pieceColor !== 'B' && pieceColor !== 'P') {
    // Backward moves for white pieces (W, Y) - they move "up" the board
    if (col < 7 && row > 0 && board[row - 1][col + 1] === '') {
      canGoto.push([row - 1, col + 1]);
    } else if (col < 6 && row > 1 && 
               OPPONENTS[pieceColor]?.includes(board[row - 1][col + 1]) && 
               board[row - 2][col + 2] === '') {
      canGoto.push([row - 2, col + 2]);
    }

    if (col > 0 && row > 0 && board[row - 1][col - 1] === '') {
      canGoto.push([row - 1, col - 1]);
    } else if (col > 1 && row > 1 && 
               OPPONENTS[pieceColor]?.includes(board[row - 1][col - 1]) && 
               board[row - 2][col - 2] === '') {
      canGoto.push([row - 2, col - 2]);
    }
  }

  console.log(`Valid moves for [${row}, ${col}]:`, canGoto);
  return canGoto;
}

export function updatePossibleMoves(
  board: PieceType[][], 
  killed: boolean, 
  currentPlayer: Position
): { canGotoList: Position[][][]; zigzag: boolean; killed: boolean; gameOver: boolean } {
  const canGotoList: Position[][][] = Array(8).fill(null).map(() => 
    Array(8).fill(null).map(() => [])
  );

  console.log(`Updating possible moves. Killed: ${killed}, Current player: [${currentPlayer[0]}, ${currentPlayer[1]}]`);

  let zigzag = false;
  let gameOver = false;
  
  // If we just made a capture, check if the same piece can capture again
  if (killed && currentPlayer[0] !== -1 && currentPlayer[1] !== -1) {
    const moves = canGoTo(board, currentPlayer[0], currentPlayer[1]);
    const captureMoves = moves.filter(move => 
      Math.abs(currentPlayer[0] - move[0]) === 2 && Math.abs(currentPlayer[1] - move[1]) === 2
    );
    
    if (captureMoves.length > 0) {
      zigzag = true;
      canGotoList[currentPlayer[0]][currentPlayer[1]] = captureMoves;
      console.log('Zigzag possible:', captureMoves);
    }
  }

  // If no zigzag, calculate all possible moves for the next player
  if (!zigzag) {
    const currentColor = killed && currentPlayer[0] !== -1 ? 
      board[currentPlayer[0]][currentPlayer[1]] : 'W'; // Default to white if no current player
    
    const nextColor = currentColor === 'W' || currentColor === 'Y' ? 'B' : 'W';
    
    console.log(`Calculating moves for ${nextColor} pieces`);
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if ((nextColor === 'W' && (piece === 'W' || piece === 'Y')) ||
            (nextColor === 'B' && (piece === 'B' || piece === 'P'))) {
          canGotoList[row][col] = canGoTo(board, row, col);
        }
      }
    }
  }

  // Check for game over conditions
  const hasValidMoves = canGotoList.some(row => row.some(moves => moves.length > 0));
  const whiteCount = board.flat().filter(p => p === 'W' || p === 'Y').length;
  const blackCount = board.flat().filter(p => p === 'B' || p === 'P').length;

  if (!hasValidMoves || whiteCount === 0 || blackCount === 0) {
    gameOver = true;
    console.log('Game over detected');
  }

  return { canGotoList, zigzag, killed: zigzag, gameOver };
}
