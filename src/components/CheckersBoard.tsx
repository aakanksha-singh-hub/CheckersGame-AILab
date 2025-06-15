
import { PieceType, Position } from '@/utils/gameLogic';

interface CheckersBoardProps {
  board: PieceType[][];
  onSquareClick: (row: number, col: number) => void;
  selectedPiece: Position | null;
  possibleMoves: Position[];
}

const CheckersBoard = ({ board, onSquareClick, selectedPiece, possibleMoves }: CheckersBoardProps) => {
  const isSelected = (row: number, col: number) => {
    return selectedPiece && selectedPiece[0] === row && selectedPiece[1] === col;
  };

  const isPossibleMove = (row: number, col: number) => {
    return possibleMoves.some(([r, c]) => r === row && c === col);
  };

  const getPieceColor = (piece: PieceType) => {
    switch (piece) {
      case 'W': return 'bg-white border-gray-300';
      case 'B': return 'bg-red-500 border-red-700';
      case 'Y': return 'bg-yellow-400 border-yellow-600';
      case 'P': return 'bg-purple-500 border-purple-700';
      default: return '';
    }
  };

  const isKing = (piece: PieceType) => piece === 'Y' || piece === 'P';

  return (
    <div className="grid grid-cols-8 gap-0 border-4 border-slate-800 rounded-lg overflow-hidden mx-auto">
      {board.map((row, rowIndex) =>
        row.map((piece, colIndex) => {
          const isBlackSquare = (rowIndex + colIndex) % 2 === 1;
          const selected = isSelected(rowIndex, colIndex);
          const possibleMove = isPossibleMove(rowIndex, colIndex);
          
          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`w-12 h-12 md:w-16 md:h-16 flex items-center justify-center cursor-pointer transition-all hover:brightness-110 relative ${
                isBlackSquare ? 'bg-amber-800' : 'bg-amber-100'
              } ${selected ? 'ring-4 ring-blue-400' : ''}`}
              onClick={() => onSquareClick(rowIndex, colIndex)}
            >
              {piece && (
                <div 
                  className={`w-8 h-8 md:w-12 md:h-12 rounded-full border-2 shadow-lg transition-transform hover:scale-110 flex items-center justify-center ${getPieceColor(piece)}`}
                >
                  {isKing(piece) && (
                    <div className="text-xs font-bold text-black">♔</div>
                  )}
                </div>
              )}
              {possibleMove && (
                <div className="absolute inset-0 bg-green-400 bg-opacity-50 rounded-full animate-pulse" />
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default CheckersBoard;
