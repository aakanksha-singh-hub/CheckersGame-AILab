
import { useState, useCallback } from 'react';
import { GameState, PieceType, Position, INITIAL_BOARD } from '@/utils/gameLogic';
import { updatePossibleMoves } from '@/utils/moveValidation';
import { moveInBoard, isValidMove, checkGameEnd } from '@/utils/gameActions';

export function useCheckersGame() {
  const [gameState, setGameState] = useState<GameState>({
    board: INITIAL_BOARD.map(row => [...row]),
    currentPlayer: [-1, -1],
    currentColor: 'W',
    killed: false,
    zigzag: false,
    gameOver: false,
    winner: null
  });

  const [selectedPiece, setSelectedPiece] = useState<Position | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<Position[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [currentTurn, setCurrentTurn] = useState<'white' | 'black'>('white');

  const updatePossibleMovesForPiece = useCallback((piece: Position | null) => {
    if (!piece || !gameStarted) {
      setPossibleMoves([]);
      return;
    }

    console.log(`Updating possible moves for piece at [${piece[0]}, ${piece[1]}]`);
    const { canGotoList } = updatePossibleMoves(gameState.board, gameState.killed, piece);
    const moves = canGotoList[piece[0]][piece[1]] || [];
    setPossibleMoves(moves);
    console.log('Available moves:', moves);
  }, [gameState.board, gameState.killed, gameStarted]);

  const makeMove = useCallback((from: Position, to: Position) => {
    console.log(`Attempting move from [${from[0]}, ${from[1]}] to [${to[0]}, ${to[1]}]`);
    
    const { canGotoList } = updatePossibleMoves(gameState.board, gameState.killed, from);

    if (!isValidMove(gameState.board, from, to, canGotoList)) {
      console.log('Invalid move attempted');
      return false;
    }

    const { newBoard, killed } = moveInBoard(gameState.board, from, to);
    const { gameOver, winner } = checkGameEnd(newBoard);

    // Add move to history
    const moveNotation = `${String.fromCharCode(65 + from[1])}${8 - from[0]} → ${String.fromCharCode(65 + to[1])}${8 - to[0]}`;
    setMoveHistory(prev => [...prev, moveNotation]);

    // Check for zigzag (multiple captures)
    const { zigzag } = updatePossibleMoves(newBoard, killed, to);

    setGameState(prev => ({
      ...prev,
      board: newBoard,
      currentPlayer: to,
      currentColor: newBoard[to[0]][to[1]],
      killed,
      zigzag,
      gameOver,
      winner
    }));

    // Switch turns only if no zigzag
    if (!zigzag) {
      setCurrentTurn(prev => prev === 'white' ? 'black' : 'white');
    }

    console.log(`Move successful. Killed: ${killed}, Zigzag: ${zigzag}, Game over: ${gameOver}`);
    return true;
  }, [gameState]);

  const handleSquareClick = useCallback((row: number, col: number) => {
    if (!gameStarted || gameState.gameOver) {
      console.log('Game not active');
      return;
    }

    const clickedPiece = gameState.board[row][col];
    console.log(`Square clicked: [${row}, ${col}], piece: ${clickedPiece}`);
    
    if (selectedPiece === null) {
      // Select a piece - check if it belongs to current player
      const isWhitePiece = clickedPiece === 'W' || clickedPiece === 'Y';
      const isBlackPiece = clickedPiece === 'B' || clickedPiece === 'P';
      
      if ((currentTurn === 'white' && isWhitePiece) || (currentTurn === 'black' && isBlackPiece)) {
        console.log(`Selecting piece for ${currentTurn} player`);
        setSelectedPiece([row, col]);
        updatePossibleMovesForPiece([row, col]);
      } else {
        console.log(`Cannot select piece - not ${currentTurn} player's turn`);
      }
    } else {
      // Try to move or select another piece
      const isOwnPiece = (currentTurn === 'white' && (clickedPiece === 'W' || clickedPiece === 'Y')) ||
                         (currentTurn === 'black' && (clickedPiece === 'B' || clickedPiece === 'P'));
      
      if (isOwnPiece) {
        // Select different piece
        console.log('Selecting different piece');
        setSelectedPiece([row, col]);
        updatePossibleMovesForPiece([row, col]);
      } else {
        // Try to move to clicked square
        const moveSuccessful = makeMove(selectedPiece, [row, col]);
        if (moveSuccessful) {
          // Only clear selection if not in zigzag mode
          if (!gameState.zigzag) {
            setSelectedPiece(null);
            setPossibleMoves([]);
          }
        }
      }
    }
  }, [gameStarted, gameState.gameOver, gameState.board, gameState.zigzag, selectedPiece, currentTurn, makeMove, updatePossibleMovesForPiece]);

  const startGame = useCallback(() => {
    console.log('Starting new game');
    setGameStarted(true);
    setMoveHistory([]);
    setCurrentTurn('white');
  }, []);

  const resetGame = useCallback(() => {
    console.log('Resetting game');
    setGameState({
      board: INITIAL_BOARD.map(row => [...row]),
      currentPlayer: [-1, -1],
      currentColor: 'W',
      killed: false,
      zigzag: false,
      gameOver: false,
      winner: null
    });
    setSelectedPiece(null);
    setPossibleMoves([]);
    setGameStarted(false);
    setMoveHistory([]);
    setCurrentTurn('white');
  }, []);

  return {
    gameState,
    selectedPiece,
    possibleMoves,
    gameStarted,
    moveHistory,
    currentTurn,
    handleSquareClick,
    startGame,
    resetGame
  };
}
