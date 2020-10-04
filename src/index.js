import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Square extends React.Component {
  renderValue() {
    switch(this.props.value) {
      case 'X':
        return (
          <div className="space">
            <div style={{
              position: 'absolute',
              width: '175px',
              height: '15px',
              top: '50%',
              left: '50%',
              transformOrigin: 'top left',
              transform: 'rotate(45deg) translate(-50%, -50%)',
              borderRadius: '5px',
              background: 'rgb(255, 250, 220)',}} />
            <div style={{
              position: 'absolute',
              width: '175px',
              height: '15px',
              top: '50%',
              left: '50%',
              transformOrigin: 'top left',
              transform: 'rotate(-45deg) translate(-50%, -50%)',
              borderRadius: '5px',
              background: 'rgb(255, 250, 220)',}} />
          </div>
        )
        break;
      case 'O':
        return (
          <div className="space">
            <div style={{
              position: 'absolute',
              width: '120px',
              height: '120px',
              border: '15px solid rgb(255, 250, 220)',
              borderRadius: '120px',
              top: '50%',
              left: '50%',
              transformOrigin: 'top left',
              transform: 'translate(-50%, -50%)',}} />
          </div>
        )
      //   break;
      // default:
      //   return (
      //     <div className="empty"></div>
      //   )
    }
  }

  render() {
    return (
      <div
      className={this.props.name}
      onClick={this.props.onClick}
      >
        {this.renderValue()}
      </div>
    );
  }
}

class Board extends React.Component {
  renderSquare(i) {
    let name = "square";
    switch(i%3) {
      case 0:
        name += " left";
        break;
      case 1:
        name += " middle";
        break;
      default:
        name += " right";
    }

    return (
      <Square
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
      name={name}
      />
    );
  }

  render() {
    return (
      <div className="board">
        <div className="board-row line">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row line">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext:true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? 'Go to move #' + move : 'Go to Game start';
      return (
        <li key = {move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    }
    else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

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
      return squares[a];
    }
  }
  return null;
}