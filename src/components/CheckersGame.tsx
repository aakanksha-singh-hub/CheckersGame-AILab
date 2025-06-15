import React, { useEffect, useRef, useState } from 'react';
import { Checkers } from '../lib/game/checkers';

interface CheckersGameProps {
    mode1: string;
    mode2: string;
    minimaxDepth: number;
    showVisualization: boolean;
}

// Move drawBoard outside the component to avoid recreation on every render
const drawBoard = (ctx: CanvasRenderingContext2D, boardToDraw: string[][], selectedPiece: [number, number] | null) => {
    console.log('Drawing board with:', JSON.parse(JSON.stringify(boardToDraw))); // Display full board content
    const SIZE = 800;
    const ROW = 8;
    const COL = 8;
    const SQUARE_SIZE = SIZE / ROW;
    const SPACE = 20;

    // Clear canvas before drawing
    ctx.clearRect(0, 0, SIZE, SIZE);

    // Draw board
    for (let row = 0; row < ROW; row++) {
        for (let col = 0; col < COL; col++) {
            if ((row + col) % 2 === 1) {
                ctx.fillStyle = 'white';
            } else {
                ctx.fillStyle = 'green';
            }
            ctx.fillRect(col * SQUARE_SIZE, row * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);

            const piece = boardToDraw[row][col]; // Use boardToDraw
            if (piece) {
                ctx.beginPath();
                ctx.arc(
                    col * SQUARE_SIZE + SQUARE_SIZE / 2,
                    row * SQUARE_SIZE + SQUARE_SIZE / 2,
                    SQUARE_SIZE / 2 - SPACE,
                    0,
                    2 * Math.PI
                );
                ctx.fillStyle = piece === 'W' || piece === 'Y' ? 'white' : 'red';
                ctx.fill();

                // Draw king crown if it's a king piece
                if (piece === 'Y' || piece === 'P') {
                    ctx.fillStyle = 'gold';
                    ctx.font = `bold ${SQUARE_SIZE / 3}px Arial`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('♛', col * SQUARE_SIZE + SQUARE_SIZE / 2, row * SQUARE_SIZE + SQUARE_SIZE / 2);
                }
            }

            // Highlight selected piece
            if (selectedPiece && selectedPiece[0] === row && selectedPiece[1] === col) {
                ctx.strokeStyle = 'blue';
                ctx.lineWidth = 3;
                ctx.strokeRect(col * SQUARE_SIZE, row * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
            }
        }
    }
};

export const CheckersGame: React.FC<CheckersGameProps> = ({ mode1, mode2, minimaxDepth, showVisualization }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [game, setGame] = useState<Checkers | null>(null);
    const [selectedPiece, setSelectedPiece] = useState<[number, number] | null>(null);
    const [boardState, setBoardState] = useState<string[][]>([]);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameOverMessage, setGameOverMessage] = useState<string | null>(null);
    const [showInstructions, setShowInstructions] = useState(true); // New state for instructions modal

    // Effect for game initialization (runs once, or when minimaxDepth/showVisualization changes)
    useEffect(() => {
        console.log('Initialization effect running...');
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                console.log('No canvas context available');
                return;
            }

            console.log('Creating new game...');
            const newGame = new Checkers(minimaxDepth, showVisualization);
            console.log('Game created, setting state...');
            
            // Set all states in sequence
            setGame(newGame);
            setGameStarted(true);
            const initialBoard = newGame.getBoard();
            setBoardState(initialBoard);
            
            console.log('Game initialization complete:', {
                game: !!newGame,
                gameStarted: true,
                boardState: initialBoard
            });
        }
    }, [minimaxDepth, showVisualization]);

    // Effect for drawing updates (runs when boardState or selectedPiece changes)
    useEffect(() => {
        if (canvasRef.current && game && boardState.length > 0) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            // Redraw whenever boardState or selectedPiece changes
            console.log('Drawing board with:', JSON.parse(JSON.stringify(boardState))); // Display full board content
            drawBoard(ctx, boardState, selectedPiece);
        }
    }, [boardState, selectedPiece, game]);

    // New effect for auto-play when both players are AI
    useEffect(() => {
        console.log('Auto-play effect running...', {
            game: !!game,
            gameStarted,
            mode1,
            mode2,
            currentColorFromGame: game?.getCurrentColor()
        });

        if (!game || !gameStarted || game.isGameOver()) {
            console.log('Game not ready for auto-play or game over.', { game: !!game, gameStarted, isGameOver: game?.isGameOver() });
            return;
        }

        console.log('Checking auto mode condition with:', { currentMode1: mode1, currentMode2: mode2 });
        const isAutoMode = (mode1 === 'minimax' || mode1 === 'rl') && 
                          (mode2 === 'minimax' || mode2 === 'rl');

        console.log('isAutoMode calculated as:', isAutoMode);

        if (isAutoMode) {
            console.log('Auto mode detected with correct strings:', { mode1, mode2 });
            console.log('Current game state:', {
                currentColor: game.getCurrentColor(),
                isGameOver: game.isGameOver(),
                board: game.getBoard()
            });

            const currentColor = game.getCurrentColor();
            const isWhiteTurn = currentColor === 'W' || currentColor === 'Y';
            
            // Determine which AI should play based on current turn
            const currentAIMode = isWhiteTurn ? mode1 : mode2;
            
            console.log('Current AI turn:', { currentAIMode, isWhiteTurn });
            
            const timeoutId = setTimeout(() => {
                console.log('Executing AI move for:', currentAIMode);
                try {
                    let moveMade = null;
                    if (currentAIMode === 'minimax') {
                        moveMade = game.minimaxPlay();
                        console.log('Minimax AI made move:', moveMade);
                    } else if (currentAIMode === 'rl') {
                        moveMade = game.rlPlay();
                        console.log('RL AI made move:', moveMade);
                    }
                    setBoardState([...game.getBoard()]); // Update board after AI move
                    console.log('Board state after AI move:', JSON.parse(JSON.stringify(game.getBoard()))); // Display full board content

                    if (game.isGameOver()) {
                        const winnerColor = (game.getCurrentColor() === 'W' || game.getCurrentColor() === 'Y') ? 'Red' : 'White';
                        const winningAlgorithm = (winnerColor === 'White' ? mode1 : mode2);
                        setGameOverMessage(`${winnerColor} wins! (${winningAlgorithm})`);
                        console.log(`Game Over! ${winnerColor} wins! (${winningAlgorithm})`);
                    }

                } catch (error) {
                    console.error('Error during AI move execution:', error);
                    // Optionally, stop auto-play or handle the error gracefully
                }
            }, 500);

            return () => clearTimeout(timeoutId);
        }
    }, [boardState, game, mode1, mode2, gameStarted]);

    const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
        console.log('Canvas clicked!'); // Debug log
        if (!game) {
            console.log('Game object not initialized.'); // Debug log
            return;
        }

        // Check if it's AI's turn - but only after the first move
        const currentColor = game.getCurrentColor();
        const isWhiteTurn = currentColor === 'W' || currentColor === 'Y';
        const isAIModeForCurrentPlayer = (isWhiteTurn && (mode1 === 'minimax' || mode1 === 'rl')) ||
                                       (!isWhiteTurn && (mode2 === 'minimax' || mode2 === 'rl'));

        // Only check for AI turn if we're not in the first move
        const isFirstMove = game.getBoard().every((row, r) => 
            row.every((cell, c) => {
                // Check if the piece is in its original position
                if (r < 3 && (cell === 'B' || cell === 'P')) return true; // Red pieces in top 3 rows
                if (r > 4 && (cell === 'W' || cell === 'Y')) return true; // White pieces in bottom 3 rows
                return cell === ''; // Empty cells in middle
            })
        );

        if (isAIModeForCurrentPlayer && !isFirstMove) {
            console.log("It's AI's turn, ignoring click");
            return;
        }

        // Ensure game.canGoto is updated for the current player before any click logic
        const [updatedCanGoto, updatedZigzag, updatedKilled] = game.updatePossibleMoves(game.getBoard(), game.getKilled(), game.getCurrentPlayer(), game.getCurrentColor());
        game.setCanGoto(updatedCanGoto);
        game.setZigzag(updatedZigzag);
        game.setKilled(updatedKilled);

        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const SQUARE_SIZE = 800 / 8;
        const row = Math.floor(y / SQUARE_SIZE);
        const col = Math.floor(x / SQUARE_SIZE);

        if (selectedPiece === null) {
            console.log('Selected piece: null, trying to select piece at', [row, col]); // Debug log
            const piece = game.getBoard()[row][col];
            const isWhiteTurn = game.getCurrentColor() === 'W' || game.getCurrentColor() === 'Y';
            const isBlackTurn = game.getCurrentColor() === 'B' || game.getCurrentColor() === 'P';

            // Allow selection only if it's the correct turn for the piece color
            if ( (isWhiteTurn && (piece === 'W' || piece === 'Y')) || (isBlackTurn && (piece === 'B' || piece === 'P')) ) {
                 // Check if there are mandatory captures
                 const possibleMovesForSelected = game.getCanGoto()[row][col];
                 const hasMandatoryCapture = possibleMovesForSelected.some((move: [number, number]) => Math.abs(row - move[0]) === 2);
                 
                 // Fix for Set comparison: convert array to string for Set.has()
                 const stringifiedMandatory = game.getMandatory().has(`${row},${col}`);
                 const allPiecesHaveMandatory = game.getCanGoto().some((r: any, rIdx: number) => r.some((c: any, cIdx: number) => game.getMandatory().has(`${rIdx},${cIdx}`) && c.some((move: [number, number]) => Math.abs(rIdx - move[0]) === 2)));

                 if (hasMandatoryCapture || !allPiecesHaveMandatory) {
                    setSelectedPiece([row, col]);
                 } else {
                    // If there are other mandatory captures for other pieces, this piece cannot be selected
                    console.log('Cannot select: Other mandatory captures exist.');
                 }
            } else {
                console.log("Not current player's piece or no piece at all.");
            }
        } else {
            console.log('Attempting move from', selectedPiece, 'to', [row, col]); // Debug log
            // Ensure the move is valid according to the game logic's canGoto
            const validMovesForSelected = game.getCanGoto()[selectedPiece[0]][selectedPiece[1]];
            console.log('Valid moves for selected piece from game.getCanGoto():', validMovesForSelected); // *** NEW DEBUG LOG ***
            const targetIsValid = validMovesForSelected.some((p: number[]) => p[0] === row && p[1] === col);

            if (targetIsValid) {
                const gameOver = game.move(selectedPiece, [row, col]);
                setBoardState([...game.getBoard()]); // Update state to trigger re-render AFTER human move
                console.log('Board state after human move:', JSON.parse(JSON.stringify(game.getBoard())));

                if (gameOver) {
                    console.log('Game Over!');
                    const winnerColor = (game.getCurrentColor() === 'W' || game.getCurrentColor() === 'Y') ? 'Red' : 'White';
                    const winningAlgorithm = (winnerColor === 'White' ? mode1 : mode2);
                    setGameOverMessage(`${winnerColor} wins! (${winningAlgorithm})`);
                    return;
                }

                // Determine if the next turn is an AI's turn
                const nextPlayerColor = game.getCurrentColor();
                const nextPlayerIsWhite = nextPlayerColor === 'W' || nextPlayerColor === 'Y';
                const isAIModeForNextPlayer = (nextPlayerIsWhite && (mode1 === 'minimax' || mode1 === 'rl')) ||
                                            (!nextPlayerIsWhite && (mode2 === 'minimax' || mode2 === 'rl'));

                // AI turn if game not over, not a zigzag move, and the next player is an AI
                if (!game.getZigzag() && isAIModeForNextPlayer) {
                    console.log('AI turn initiated...');
                    const currentAIMode = nextPlayerIsWhite ? mode1 : mode2;

                    // Small delay for AI move to make it observable
                    setTimeout(() => {
                        if (currentAIMode === 'minimax') {
                            game.minimaxPlay();
                        } else if (currentAIMode === 'rl') {
                            game.rlPlay();
                        }
                        setBoardState([...game.getBoard()]); // Update board after AI move
                        console.log('Board state after AI move (human vs AI):', JSON.parse(JSON.stringify(game.getBoard())));
                        if (game.isGameOver()) {
                            const winnerColor = (game.getCurrentColor() === 'W' || game.getCurrentColor() === 'Y') ? 'Red' : 'White';
                            const winningAlgorithm = (winnerColor === 'White' ? mode1 : mode2);
                            setGameOverMessage(`${winnerColor} wins! (${winningAlgorithm})`);
                        }
                    }, 500);
                }
            } else {
                console.log('Invalid move for selected piece.');
            }
            setSelectedPiece(null);
        }
    };

    return (
        <div style={{ position: 'relative', width: 800, height: 800 }}>
            <canvas
                ref={canvasRef}
                width={800}
                height={800}
                onClick={handleClick}
                style={{ border: '1px solid black' }}
            />
            {gameOverMessage && (
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        color: 'white',
                        padding: '20px',
                        borderRadius: '10px',
                        fontSize: '2em',
                        fontWeight: 'bold',
                        textAlign: 'center',
                    }}
                >
                    {gameOverMessage}
                </div>
            )}
            {showInstructions && (mode1 === 'minimax' || mode2 === 'minimax' || mode1 === 'rl' || mode2 === 'rl') && (
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        color: 'white',
                        padding: '30px',
                        borderRadius: '15px',
                        fontSize: '1.2em',
                        textAlign: 'center',
                        maxWidth: '600px',
                        zIndex: 1000,
                    }}
                >
                    <h2 style={{ marginBottom: '20px', color: '#ffd700' }}>Game Instructions</h2>
                    <div style={{ marginBottom: '20px', lineHeight: '1.6' }}>
                        <p>Welcome to Human vs AI Checkers!</p>
                        <p>The turn order is as follows:</p>
                        <ol style={{ textAlign: 'left', margin: '20px 0' }}>
                            <li>First turn: Human plays Red</li>
                            <li>Second turn: Human plays White</li>
                            <li>Third turn: AI Bot plays Red</li>
                            <li>Fourth turn: Human plays White</li>
                            <li>And so on...</li>
                        </ol>
                        <p>Click "OK" to start the game!</p>
                    </div>
                    <button
                        onClick={() => setShowInstructions(false)}
                        style={{
                            padding: '10px 30px',
                            fontSize: '1.2em',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s',
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#45a049'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}
                    >
                        OK
                    </button>
                </div>
            )}
        </div>
    );
}; 