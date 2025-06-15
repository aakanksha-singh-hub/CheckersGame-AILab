import { Q_table } from './q_table';

const SIZE = 800;
const ROW = 8;
const COL = 8;
const SQUARE_SIZE = SIZE // ROW;
const SPACE = 20;
const DEPTH = 2;
const NEG_INF = -100000;
const POS_INF = 100000;

const black = ['B', '', 'B', '', 'B', '', 'B', '', 'B'];
const empty = ['', '', '', '', '', '', '', ''];
const white = ['', 'W', '', 'W', '', 'W', '', 'W', ''];
const opp = {'W': ['B', 'P'], 'B': ['W', 'Y'], 'Y': ['B', 'P'], 'P': ['W', 'Y']};
const color = {'W': "white", 'B': "red", 'Y': "yellow", 'P': "purple"};
const WHITE_STARTS = [[[],[],[],[],[],[],[],[]], [[],[],[],[],[],[],[],[]], [[], [], [], [], [], [], [], []], [[],[],[],[],[],[],[],[]], [[],[],[],[],[],[],[],[]], [[], [(4,0),(4,2)], [], [(4,2),(4,4)], [], [(4,4),(4,6)], [], [(4,6)]] , [[],[],[],[],[],[],[],[]], [[],[],[],[],[],[],[],[]]];

export class Checkers {
    private board: string[][];
    private currentPlayer: [number, number];
    private currentColor: string;
    private killed: boolean;
    private zigzag: boolean;
    private canGoto: any[][];
    private mandatory: Set<string>;
    private allMoves: [string, string][];
    private epsilon: number;
    private minimaxDepth: number;
    private showVisualization: boolean;

    constructor(minimaxDepth: number = DEPTH, showVisualization: boolean = false) {
        this.board = [
            ['B', '', 'B', '', 'B', '', 'B', ''],
            ['', 'B', '', 'B', '', 'B', '', 'B'],
            ['B', '', 'B', '', 'B', '', 'B', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', 'W', '', 'W', '', 'W', '', 'W'],
            ['W', '', 'W', '', 'W', '', 'W', ''],
            ['', 'W', '', 'W', '', 'W', '', 'W']
        ];
        this.currentPlayer = [-1, -1];
        this.currentColor = 'B';
        this.killed = false;
        this.zigzag = false;
        this.canGoto = [];
        this.mandatory = new Set<string>();
        this.allMoves = [];
        this.epsilon = 0;
        this.minimaxDepth = minimaxDepth;
        this.showVisualization = showVisualization;

        const [initialCanGoto, initialZigzag, initialKilled] = this.updatePossibleMoves(this.board, false, [-1, -1], 'B');
        this.canGoto = initialCanGoto;
        this.zigzag = initialZigzag;
        this.killed = initialKilled;
    }

    public getBoard(): string[][] {
        return JSON.parse(JSON.stringify(this.board));
    }

    public getCurrentPlayer(): [number, number] {
        return this.currentPlayer;
    }

    public getCurrentColor(): string {
        return this.currentColor;
    }

    public getKilled(): boolean {
        return this.killed;
    }

    public getZigzag(): boolean {
        return this.zigzag;
    }

    public getCanGoto(): any[][] {
        return this.canGoto;
    }

    public getMandatory(): Set<string> {
        return this.mandatory;
    }

    public setCanGoto(canGoto: any[][]): void {
        this.canGoto = canGoto;
    }

    public setZigzag(zigzag: boolean): void {
        this.zigzag = zigzag;
    }

    public setKilled(killed: boolean): void {
        this.killed = killed;
    }

    public isGameOver(): boolean {
        console.log('isGameOver called. Current board for calculation:', JSON.parse(JSON.stringify(this.board)));
        // Check if either player has no pieces left
        let whitePieces = 0;
        let blackPieces = 0;
        
        for (let r = 0; r < ROW; r++) {
            for (let c = 0; c < COL; c++) {
                const piece = this.board[r][c];
                if (piece === 'W' || piece === 'Y') whitePieces++;
                if (piece === 'B' || piece === 'P') blackPieces++;
            }
        }
        console.log('isGameOver calculated pieces:', { whitePieces, blackPieces });
        
        // Check if current player has no valid moves
        let hasValidMoves = false;
        for (let r = 0; r < ROW; r++) {
            for (let c = 0; c < COL; c++) {
                if (this.canGoto[r][c].length > 0) {
                    hasValidMoves = true;
                    break;
                }
            }
            if (hasValidMoves) break;
        }
        
        const gameOver = whitePieces === 0 || blackPieces === 0 || !hasValidMoves;
        console.log('Game state check:', {
            whitePieces,
            blackPieces,
            hasValidMoves,
            gameOver,
            currentColor: this.currentColor
        });
        
        return gameOver;
    }

    public move(pos1: [number, number], pos2: [number, number]): boolean {
        console.log('move called:', { pos1, pos2 });
        console.log('Board BEFORE move:', JSON.parse(JSON.stringify(this.board)));
        let gameOver: boolean = false;
        
        const isValidMove = this.canGoto[pos1[0]] && this.canGoto[pos1[0]][pos1[1]] && 
                            this.canGoto[pos1[0]][pos1[1]].some((p: [number, number]) => p[0] === pos2[0] && p[1] === pos2[1]);

        console.log('Is valid move?', isValidMove);

        if (pos1 && pos2 && isValidMove) {
            let newBoardAfterMove: string[][];
            [newBoardAfterMove, this.killed] = this.moveInBoard(this.board, pos1, pos2);
            this.board = newBoardAfterMove;

            this.currentPlayer = pos2;
            
            let newCanGoto: any[][], newZigzag: boolean, newKilled: boolean;
            console.log(`Calling updatePossibleMoves after current player's move. CurrentColor: ${this.currentColor}`);
            [newCanGoto, newZigzag, newKilled] = this.updatePossibleMoves(this.board, this.killed, this.currentPlayer, this.currentColor);
            this.canGoto = newCanGoto;
            this.zigzag = newZigzag;
            this.killed = newKilled;

            console.log('After move - zigzag:', this.zigzag, 'gameOver (pre-check):', gameOver, 'killed:', this.killed);
            
            if (!this.zigzag) {
                console.log('Turn switching to opponent...');
                this.currentColor = (this.currentColor === 'W' || this.currentColor === 'Y') ? 'B' : 'W';
                console.log('Current color after turn switch:', this.currentColor);
                this.currentPlayer = [-1, -1];
                let opponentCanGoto: any[][], opponentZigzag: boolean, opponentKilled: boolean;
                console.log(`Calling updatePossibleMoves for opponent. CurrentColor: ${this.currentColor}`);
                [opponentCanGoto, opponentZigzag, opponentKilled] = this.updatePossibleMoves(this.board, false, [-1, -1], this.currentColor);
                this.canGoto = opponentCanGoto;
                this.zigzag = opponentZigzag;
                this.killed = opponentKilled;

                gameOver = this.isGameOver();
                console.log('Game Over after opponent check?', gameOver);

            } else if (this.zigzag) {
                console.log('Continuing zigzag move...');
                let zigzagCanGoto: any[][], zigzagZigzag: boolean, zigzagKilled: boolean;
                console.log(`Calling updatePossibleMoves for zigzag. CurrentColor: ${this.currentColor}`);
                [zigzagCanGoto, zigzagZigzag, zigzagKilled] = this.updatePossibleMoves(this.board, this.killed, this.currentPlayer, this.currentColor);
                this.canGoto = zigzagCanGoto;
                this.zigzag = zigzagZigzag;
                this.killed = zigzagKilled;

                gameOver = this.isGameOver();
                console.log('Game Over after zigzag check?', gameOver);
            }
            
            if (gameOver) {
                console.log('Game Over detected!', this.currentColor === 'W' ? 'Black wins' : 'White wins');
                return true;
            }
        }
        console.log('Board AFTER move logic:', JSON.parse(JSON.stringify(this.board)));
        return gameOver;
    }

    private moveInBoard(board: string[][], pos1: [number, number], pos2: [number, number]): [string[][], boolean] {
        const pieceToMove = board[pos1[0]][pos1[1]];
        let killed = false;

        const newBoard = JSON.parse(JSON.stringify(board));

        const swap = (b: string[][], p1: [number, number], p2: [number, number]) => {
            if (p2[0] === 0 && (pieceToMove === 'B' || pieceToMove === 'P')) {
                b[p2[0]][p2[1]] = 'P';
            } else if (p2[0] === 7 && (pieceToMove === 'W' || pieceToMove === 'Y')) {
                b[p2[0]][p2[1]] = 'Y';
            } else {
                b[p2[0]][p2[1]] = pieceToMove;
            }
            b[p1[0]][p1[1]] = '';
        };

        if (Math.abs(pos1[0] - pos2[0]) === 1 && Math.abs(pos1[1] - pos2[1]) === 1) {
            killed = false;
            swap(newBoard, pos1, pos2);
        } else if (Math.abs(pos1[0] - pos2[0]) === 2 && Math.abs(pos1[1] - pos2[1]) === 2) {
            killed = true;
            swap(newBoard, pos1, pos2);
            newBoard[(pos1[0] + pos2[0]) / 2][(pos1[1] + pos2[1]) / 2] = '';
        }

        return [newBoard, killed];
    }

    public updatePossibleMoves(board: string[][], lastMoveKilled: boolean, lastMovedPiecePos: [number, number], playerColor: string): [any[][], boolean, boolean] {
        console.log(`[updatePossibleMoves] Called for playerColor: ${playerColor}`);
        let currentTurnColor = playerColor;

        const mandatoryCaptures = new Set<string>();
        const allPossibleMoves: any[][] = Array(ROW).fill(0).map(() => Array(COL).fill(0).map(() => []));

        const getPieceMoves = (r: number, c: number): [number, number][] => {
            console.log(`  [getPieceMoves] Checking moves for piece at [${r},${c}] (Color: ${board[r][c]}), currentTurnColor: ${currentTurnColor}`);
            const moves: [number, number][] = [];
            const pieceColor = board[r][c];

            const opponentColors = (pieceColor === 'W' || pieceColor === 'Y') ? ['B', 'P'] : ['W', 'Y'];

            const checkDirection = (dr: number, dc: number) => {
                const newR = r + dr;
                const newC = c + dc;
                console.log(`    [checkDirection] Checking direction dr=${dr}, dc=${dc} -> newR=${newR}, newC=${newC}, board[newR][newC]: ${newR >= 0 && newR < ROW && newC >= 0 && newC < COL ? board[newR][newC] : 'Out of bounds'}`);

                // Regular move
                if (newR >= 0 && newR < ROW && newC >= 0 && newC < COL && board[newR][newC] === '') {
                    moves.push([newR, newC]);
                }

                // Check for jumps over opponent pieces
                const jumpR = r + 2 * dr;
                const jumpC = c + 2 * dc;
                const jumpedPieceR = r + dr;
                const jumpedPieceC = c + dc;
                console.log(`    [checkDirection] Checking jump from [${r},${c}] to [${jumpR},${jumpC}], over [${jumpedPieceR},${jumpedPieceC}]`);

                if (jumpR >= 0 && jumpR < ROW && jumpC >= 0 && jumpC < COL &&
                   board[jumpR][jumpC] === '' &&
                   opponentColors.includes(board[jumpedPieceR][jumpedPieceC]))
                {
                    moves.push([jumpR, jumpC]);
                    mandatoryCaptures.add(`${r},${c}`);
                    console.log(`      [checkDirection] Mandatory capture found from [${r},${c}] to [${jumpR},${jumpC}]`);
                }
            };

            // Determine directions based on piece color and type
            if (pieceColor === 'B' || pieceColor === 'P') { // Black or Promoted Black
                checkDirection(1, 1);
                checkDirection(1, -1);
            }
            if (pieceColor === 'W' || pieceColor === 'Y') { // White or Promoted White
                checkDirection(-1, 1);
                checkDirection(-1, -1);
            }
            if (pieceColor === 'P' || pieceColor === 'Y') { // Promoted pieces can move both ways
                checkDirection(1, 1);
                checkDirection(1, -1);
                checkDirection(-1, 1);
                checkDirection(-1, -1);
            }

            console.log(`  [getPieceMoves] Final moves for [${r},${c}]:`, moves);
            return moves;
        };

        for (let r = 0; r < ROW; r++) {
            for (let c = 0; c < COL; c++) {
                const piece = board[r][c];
                const isCurrentPlayerPiece = 
                    (playerColor === 'W' && (piece === 'W' || piece === 'Y')) ||
                    (playerColor === 'B' && (piece === 'B' || piece === 'P'));

                if (piece !== '' && isCurrentPlayerPiece) {
                    const moves = getPieceMoves(r, c);
                    allPossibleMoves[r][c] = moves;
                }
            }
        }

        console.log(`[updatePossibleMoves] Mandatory Captures after initial scan:`, mandatoryCaptures);
        let zigzag = false;
        let currentKilledState = lastMoveKilled;

        if (mandatoryCaptures.size > 0) {
            currentKilledState = true;
            for (let r = 0; r < ROW; r++) {
                for (let c = 0; c < COL; c++) {
                    if (mandatoryCaptures.has(`${r},${c}`)) {
                        allPossibleMoves[r][c] = allPossibleMoves[r][c].filter((movePos: [number, number]) => {
                            return Math.abs(r - movePos[0]) === 2;
                        });
                    }
                }
            }
        } else {
            currentKilledState = false;
        }

        const whitePiecesExist = board.some(row => row.some(piece => piece === 'W' || piece === 'Y'));
        const blackPiecesExist = board.some(row => row.some(piece => piece === 'B' || piece === 'P'));

        const noMovesPossibleForCurrentPlayer = allPossibleMoves.every(row => row.every(col => col.length === 0));

        console.log(`[updatePossibleMoves] Final allPossibleMoves for playerColor ${playerColor}:`, allPossibleMoves);
        return [allPossibleMoves, zigzag, currentKilledState];
    }

    public evaluateBoard(board: string[][]): number {
        let score = 0;
        const changeInScore = {'W': -100, 'B': 100, 'Y': -200, 'P': 200, '': 0};
        
        for (let row = 0; row < ROW; row++) {
            for (let col = 0; col < COL; col++) {
                const piece = board[row][col];
                score += changeInScore[piece];
                if (row >= 2 && row <= 5 && col >= 2 && col <= 5) {
                    if (piece === 'W' || piece === 'Y') {
                        score -= 25;
                    } else if (piece === 'B' || piece === 'P') {
                        score += 25;
                    }
                }
            }
        }
        return score;
    }

    public minimax(board: string[][], killed: boolean, currentPlayer: [number, number], depth: number, maximizingPlayer: boolean): [number, [[number, number], [number, number]]] {
        console.log(`Minimax called: depth=${depth}, maximizingPlayer=${maximizingPlayer}, currentColor=${this.currentColor}`);

        // Determine the current color for this simulated board state
        const simulatedCurrentColor = maximizingPlayer ? 'W' : 'B';
        console.log(`  Simulated current color for updatePossibleMoves: ${simulatedCurrentColor}`);
        const [possibleMoves, _, newKilledStateForSim] = this.updatePossibleMoves(board, killed, currentPlayer, simulatedCurrentColor);
        console.log(`  Possible moves from updatePossibleMoves for simulated color ${simulatedCurrentColor}:`, possibleMoves);
        
        // Check for game over *within the simulation* using the board state and newly calculated moves
        const whitePiecesExistSim = board.some(row => row.some(piece => piece === 'W' || piece === 'Y'));
        const blackPiecesExistSim = board.some(row => row.some(piece => piece === 'B' || piece === 'P'));
        const noMovesPossibleSim = possibleMoves.every(row => row.every(col => col.length === 0));
        const gameOverSim = !whitePiecesExistSim || !blackPiecesExistSim || noMovesPossibleSim;

        if (depth === 0 || gameOverSim) {
            console.log(`  Minimax base case reached: depth=${depth}, gameOver=${gameOverSim}, score=${this.evaluateBoard(board)}`);
            return [this.evaluateBoard(board), [[-1,-1], [-1,-1]]];
        }

        let bestEval = maximizingPlayer ? NEG_INF : POS_INF;
        let bestMove: [[number, number], [number, number]] = [[-1, -1], [-1, -1]];

        let foundMovesInCurrentDepth = false; // Flag to check if any moves are found at this depth

        // Initialize bestMove with the first valid move if any exist
        for (let r = 0; r < ROW; r++) {
            for (let c = 0; c < COL; c++) {
                if (possibleMoves[r][c] && possibleMoves[r][c].length > 0) {
                    bestMove = [[r, c], possibleMoves[r][c][0]];
                    foundMovesInCurrentDepth = true; // Ensure this is set early
                    break; // Found first move, can exit inner loops
                }
            }
            if (foundMovesInCurrentDepth) break;
        }

        if (!foundMovesInCurrentDepth) {
            console.log(`  No moves found for current player at depth ${depth}. Returning board evaluation.`);
            return [this.evaluateBoard(board), [[-1,-1], [-1,-1]]];
        }

        console.log(`  Starting move evaluation loop. Initial bestMove:`, bestMove);

        for (let row = 0; row < ROW; row++) {
            for (let col = 0; col < COL; col++) {
                const movesForPiece = possibleMoves[row][col];
                if (movesForPiece && movesForPiece.length > 0) {
                    // foundMovesInCurrentDepth is already set above
                    console.log(`    Found ${movesForPiece.length} moves for piece at [${row},${col}]`);
                    const pos1: [number, number] = [row, col];
                    for (const pos2 of movesForPiece) {
                        console.log(`      Evaluating move from ${pos1} to ${pos2}`);
                        const tempBoard = JSON.parse(JSON.stringify(board));
                        const [newBoard, newKilled] = this.moveInBoard(tempBoard, pos1, pos2);
                        
                        // Pass the correct next player's color for the recursive call
                        const nextPlayerColor = maximizingPlayer ? 'B' : 'W';
                        console.log(`        Recursive call: nextPlayerColor=${nextPlayerColor}, !maximizingPlayer=${!maximizingPlayer}`);
                        const [evalu, _] = this.minimax(newBoard, newKilled, pos2, depth - 1, !maximizingPlayer);

                        if (maximizingPlayer) {
                            if (evalu > bestEval) {
                                bestEval = evalu;
                                bestMove = [pos1, pos2];
                                console.log(`          New best eval (MAX): ${bestEval} for move ${bestMove}`);
                            }
                        } else {
                            if (evalu < bestEval) {
                                bestEval = evalu;
                                bestMove = [pos1, pos2];
                                console.log(`          New best eval (MIN): ${bestEval} for move ${bestMove}`);
                            }
                        }
                    }
                }
            }
        }

        console.log(`Minimax final return at depth=${depth}: bestEval=${bestEval}, bestMove=${bestMove}`);
        return [bestEval, bestMove];
    }
    
    private boardToStr(state: string[][]): string {
        let str_state = '';
        for (let row = 0; row < ROW; row++) {
            for (let col = 0; col < COL; col++) {
                str_state += state[row][col] === '' ? ' ' : state[row][col];
            }
        }
        return str_state;
    }

    private evaluateReward(board: string[][], lastMovedPiecePos: [number, number], killed: boolean): number {
        let reward = 0;
        if (killed) reward += 1;
        return reward;
    }

    private validMoves(board: string[][], killed: boolean, currentPlayer: [number, number]): string[] {
        const moves: string[] = [];
        const [canGotoList, _, __] = this.updatePossibleMoves(board, killed, currentPlayer, this.currentColor);
        for (let row = 0; row < ROW; row++) {
            for (let col = 0; col < COL; col++) {
                if (canGotoList[row][col] && canGotoList[row][col].length > 0) {
                    for (const pos2 of canGotoList[row][col]) {
                        moves.push(`${row}${col}${pos2[0]}${pos2[1]}`);
                    }
                }
            }
        }
        return moves;
    }
    
    private chooseAction(state: string[][], killed: boolean, currentPlayer: [number, number]): string {
        const strState = this.boardToStr(state);
        const possibleMoves = this.validMoves(state, killed, currentPlayer); 

        if (possibleMoves.length === 0) {
            return '';
        }

        if (Math.random() < this.epsilon || !(strState in Q_table)) {
            return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        } else {
            let maxQ = -Infinity;
            let bestAction = '';
            const stateQ = Q_table[strState];
            
            const validQActions = possibleMoves.filter(move => move in stateQ);

            if (validQActions.length === 0) {
                return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
            }

            for (const move of validQActions) {
                if (stateQ[move] > maxQ) {
                    maxQ = stateQ[move];
                    bestAction = move;
                }
            }
            return bestAction;
        }
    }

    private learn(currentState: string[][], strCurrentState: string, action: string, reward: number, strNextState: string, killed: boolean, currentPlayer: [number, number]): void {
        if (!(strCurrentState in Q_table)) {
            Q_table[strCurrentState] = {};
        }
        
        for (const act of this.validMoves(currentState, killed, currentPlayer)) {
            if (!(act in Q_table[strCurrentState])) {
                Q_table[strCurrentState][act] = 0;
            }
        }

        let nextBestScore = 0;
        if (strNextState in Q_table) {
            const nextStateActions = Object.values(Q_table[strNextState]);
            if (nextStateActions.length > 0) {
                nextBestScore = Math.max(...nextStateActions);
            }
        }

        const currentQValue = Q_table[strCurrentState][action] || 0;
        Q_table[strCurrentState][action] += (learning_rate * (reward + discount_rate * nextBestScore - currentQValue));
    }

    public minimaxPlay(): void {
        console.log('minimaxPlay called. Current board:', this.board);
        console.log('Current color:', this.currentColor);
        if (this.isGameOver()) {
            console.log('Game is over, minimaxPlay will not proceed.');
            return;
        }

        // Ensure this.canGoto is updated for the current player's turn
        const [currentCanGoto, currentZigzag, currentKilled] = this.updatePossibleMoves(this.board, this.killed, this.currentPlayer, this.currentColor);
        this.canGoto = currentCanGoto;
        this.zigzag = currentZigzag;
        this.killed = currentKilled;

        let currentBoardForMinimax = this.board;
        let currentKilledForMinimax = this.killed;
        let currentPlayerForMinimax = this.currentPlayer;

        // Determine if Minimax is the maximizing player based on current color
        const isMinimaxMaximizing = (this.currentColor === 'W' || this.currentColor === 'Y');
        let [score, [pos1, pos2]] = this.minimax(currentBoardForMinimax, currentKilledForMinimax, currentPlayerForMinimax, this.minimaxDepth, isMinimaxMaximizing);
        
        console.log('Minimax selected move:', { from: pos1, to: pos2, score });
        
        // Validate the move before attempting to execute it
        if (pos1 && pos2 && pos1[0] !== -1 && pos2[0] !== -1) {
            const moveResult = this.move(pos1, pos2);
            console.log('Board after minimax move:', this.board);
            // Game over check will now be handled by the auto-play useEffect after boardState update
            if (moveResult) {
                console.log('Minimax move resulted in game over.');
                return;
            }
        } else {
            console.log('Minimax could not find a valid move. Forcing turn switch.');
            // Force a turn switch if no valid moves, to prevent stagnation
            this.currentColor = (this.currentColor === 'W' || this.currentColor === 'Y') ? 'B' : 'W';
            this.currentPlayer = [-1, -1];
            // Recalculate for opponent after forced switch
            this.updatePossibleMoves(this.board, false, [-1, -1], this.currentColor); 
            console.log('Turn forced switched after minimax.');
        }
    }

    public rlPlay(): void {
        console.log('rlPlay called. Current board:', this.board);
        console.log('Current color:', this.currentColor);
        if (this.isGameOver()) {
            console.log('Game is over, rlPlay will not proceed.');
            return;
        }

        // Ensure this.canGoto is updated for the current player's turn
        const [currentCanGoto, currentZigzag, currentKilled] = this.updatePossibleMoves(this.board, this.killed, this.currentPlayer, this.currentColor);
        this.canGoto = currentCanGoto;
        this.zigzag = currentZigzag;
        this.killed = currentKilled;

        console.log('Calling validMoves for RL player...');
        const currentValidMoves = this.validMoves(this.board, this.killed, this.currentPlayer);
        console.log('Valid moves for RL player:', currentValidMoves);

        if (currentValidMoves.length === 0) {
            console.log('No valid moves available for RL player. Forcing turn switch.');
            this.currentColor = (this.currentColor === 'W' || this.currentColor === 'Y') ? 'B' : 'W';
            this.currentPlayer = [-1, -1];
            this.updatePossibleMoves(this.board, false, [-1, -1], this.currentColor); 
            console.log('Turn forced switched after RL.');
            return;
        }
        console.log('Calling chooseAction for RL player...');
        const action = this.chooseAction(this.board, this.killed, this.currentPlayer);
        console.log('RL selected action:', action);
        
        if (action && action.length === 4) {
            const pos1: [number, number] = [parseInt(action[0]), parseInt(action[1])];
            const pos2: [number, number] = [parseInt(action[2]), parseInt(action[3])];
            // Validate the move before attempting to execute it
            if (pos1 && pos2 && pos1[0] !== -1 && pos2[0] !== -1) {
                const moveResult = this.move(pos1, pos2);
                console.log('Board after RL move:', this.board);
                console.log('Game Over after RL move? ', this.isGameOver());
                if (moveResult) {
                    console.log('RL move resulted in game over.');
                    return;
                }
            } else {
                console.log('RL chose an invalid action. Forcing turn switch.');
                this.currentColor = (this.currentColor === 'W' || this.currentColor === 'Y') ? 'B' : 'W';
                this.currentPlayer = [-1, -1];
                this.updatePossibleMoves(this.board, false, [-1, -1], this.currentColor); 
                console.log('Turn forced switched after RL.');
            }
        } else {
            console.log('RL did not choose any action. Forcing turn switch.');
            this.currentColor = (this.currentColor === 'W' || this.currentColor === 'Y') ? 'B' : 'W';
            this.currentPlayer = [-1, -1];
            this.updatePossibleMoves(this.board, false, [-1, -1], this.currentColor); 
            console.log('Turn forced switched after RL.');
        }
    }
} 