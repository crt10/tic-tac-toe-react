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
        break;
      default:
        return (
          <div className="empty"></div>
        )
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

class ModeToggle extends React.Component {
  render() {
    let img;
    let text;
    if (!this.props.mode) {
      img = "2p.png";
      text = "PvP"
    }
    else {
      img = "1p.png";
      text = "PvC"
    }

    return (
      <div className="mode" onClick={this.props.onClick}>
        <img src={img} alt="" width="50px" height="50px"></img>
        {text}
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
      mode: 0, //0 = PvP, 1 = PvC
    };
    this.playerX = 0;
    this.playerO = 0;
    this.playerDraw = 0;
  }

  move(i) {
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
    if (step === this.state.stepNumber) {
      return;
    }
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  toggleMode() {
    this.setState({mode: !this.state.mode});
  }

  componentDidUpdate() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    if (this.state.mode && this.state.xIsNext) {
      cpuMove(current.squares, this);
    }
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? 'Go to move #' + move : 'Go to Game start';
      return (
        <div key={move} className="move" onClick={() => this.jumpTo(move)}>{desc}</div>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
      if (winner === 'X') {
        this.playerX++;
      }
      else if (winner === 'O') {
        this.playerO++;
      }
    }
    else {
      if (this.state.stepNumber === 9) {
        this.playerDraw++;
        status = 'TIE';
      }
      else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }
    }

    return (
      <div className="game">
        <div className="game-score">
          <div className="player-x">{'X wins: ' + this.playerX}</div>
          <div className="player-draw">{'Draws: ' + this.playerDraw}</div>
          <div className="player-o">{'O wins: ' + this.playerO}</div>
        </div>
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.move(i)}
          />
        </div>
        <div className="game-info">
          <div className="status">{status}</div>
          <div className="move-list">{moves}</div>
        </div>
        <div className="game-mode">
          <ModeToggle
            mode={this.state.mode}
            onClick={() => this.toggleMode()}
          />
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

function cpuMove(squares, game) { //CPU = X
  let space = cpuPotentialWin(squares, 'X', 'O'); //play for CPU win
  if (space === -1) {
    space = cpuPotentialWin(squares, 'O', 'X'); //block player win
    if (space === -1) {
      let spaces = [0, 2, 6, 8];
      space = randomSpace(squares, spaces); //play random corner
      if (space === -1) {
        spaces = [1, 3, 4, 5, 7];
        space = randomSpace(squares, spaces); //play any random spot
      }
    }
  }
  game.move(space);
}

function cpuPotentialWin(squares, player, player2) {
  let lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    let occ = 0;
    let space = lines[i][0];

    for (let o = 0; o < lines[i].length; o++) {
      if (squares[lines[i][o]] === player) {
        occ++;
      }
      else if (squares[lines[i][o]] === player2) {
        occ = 0;
        break;
      }
      else {
        space = lines[i][o];
      }
    }

    if (occ === 2) {
      return space;
    }
  }
  return -1;
}

function randomSpace(squares, spaces) {
  spaces = spaces.filter(spaces => !squares[spaces]);
  if (spaces.length) {
    return spaces[Math.floor(Math.random()*spaces.length)];
  }
  else {
    return -1;
  }
}