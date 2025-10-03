import { useState } from 'react';
import './App.css';

function Square({ value, onSquareClick, isWinning }) {
  const pieceClass = value ? `square-${value.toLowerCase()}` : '';
  const winningClass = isWinning ? 'square-winning' : '';

  return (
    <button
      type="button"
      className={`square ${pieceClass} ${winningClass}`.trim()}
      onClick={onSquareClick}
      aria-label={value ? `Casa ocupada por ${value}` : 'Casa vazia'}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, winningLine = [] }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  return (
    <div className="board-grid">
      {squares.map((square, index) => (
        <Square
          key={index}
          value={square}
          onSquareClick={() => handleClick(index)}
          isWinning={winningLine.includes(index)}
        />
      ))}
    </div>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const winnerInfo = calculateWinner(currentSquares);
  const winnerSymbol = winnerInfo?.player ?? null;
  const winningLine = winnerInfo?.line ?? [];
  const isDraw = !winnerSymbol && currentSquares.every(Boolean);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function resetGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  const moves = history.map((squares, move) => {
    const isCurrentMove = move === currentMove;
    let description;
    if (move > 0) {
      description = 'Voltar para a jogada #' + move;
    } else {
      description = 'Retornar ao início da trilha';
    }
    return (
      <li key={move}>
        <button
          type="button"
          className={`history-button${isCurrentMove ? ' history-button--active' : ''}`}
          onClick={() => jumpTo(move)}
        >
          {description}
        </button>
      </li>
    );
  });

  let status;
  if (winnerSymbol) {
    status = `Vitória da peça ${winnerSymbol}`;
  } else if (isDraw) {
    status = 'Empate sob as copas da floresta';
  } else {
    status = `Próximo explorador: ${xIsNext ? 'X' : 'O'}`;
  }

  return (
    <div className="game-forest">
      <div className="game-header">
        <h1>Trilha do Jogo da Velha</h1>
        <p>
          Acompanhe cada disputa entre os marcadores ancestrais enquanto a luz filtra
          pelas copas das árvores.
        </p>
      </div>

      <div className="game-layout">
        <section className="game-board-panel">
          <div
            className={`status-banner${
              winnerSymbol ? ' status-banner--victory' : isDraw ? ' status-banner--draw' : ''
            }`}
          >
            <span>{status}</span>
          </div>
          <Board
            xIsNext={xIsNext}
            squares={currentSquares}
            onPlay={handlePlay}
            winningLine={winningLine}
          />
          <button type="button" className="reset-button" onClick={resetGame}>
            Reiniciar trilha
          </button>
        </section>

        <aside className="history-panel">
          <h2>Passos pela mata</h2>
          <p className="history-hint">
            Reviva cada movimento registrado sob a copa das árvores ancestrais.
          </p>
          <ol className="history-list">{moves}</ol>
        </aside>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        player: squares[a],
        line: lines[i],
      };
    }
  }
  return null;
}