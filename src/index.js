import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
      <button className={props.styleWin} onClick={props.onClick}>
        {props.value}
      </button>
    );
}

class Board extends React.Component {
  renderSquare(i, style) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        styleWin={style}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  createBoard() {
    const winner = this.props.winRow;
    const board = [];
    let index = 0;
    for ( let i = 0; i < 3; i++) {
      let row = [];
      for ( let i = 0; i < 3; i++) {
        if (winner !== null && winner.includes(index)) {
          row.push(this.renderSquare(index, "square winSquare"));
        } else {
          row.push(this.renderSquare(index, "square"));
        }
        index++;
      }
      board.push(<div key={i} className="board-row">{row}</div>);
    }
    return board;
  }

  render() {
    return (
      <div>
        {this.createBoard()}
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
         location: null,
      }],
      stepNumber: 0,
      xIsNext: true,
      descending: false,
     };
   }
  
  moveList(history) {
    let moves = history.map((step, move) => {
       const desc = move ? 
          'Go to move #' + move + ' location (' + (step.location%3) + ',' + ~~(step.location/3) + ')' :
          'Go to game start';
        
       let line;
       if (move === this.state.stepNumber) {
          line = ( <li key={move}>
             <button onClick={() => this.jumpTo(move)} style={{fontWeight: "bold"}}>{desc}</button>
           </li>)
       } else { 
           line = (<li key={move}>
             <button onClick={() => this.jumpTo(move)}>{desc}</button>
           </li>)
         }
        return line;
     });

    if(this.state.descending){
      moves = moves.reverse();
    }

    return moves;
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
        location: i,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
   }

   jumpTo(step){
     this.setState({
       stepNumber: step,
       xIsNext: (step % 2) === 0,
     });
   }
   
   handleSortClick() {
    this.setState(state => ({
      descending: !state.descending
    }));
   }

   render() {
     const history = this.state.history;
     const current = history[this.state.stepNumber];
     const winner = calculateWinner(current.squares);
     const draw = isDraw(current.squares); 
     const moves = this.moveList(history);
     let status;
     if (winner) {
       status = 'Winner: ' + current.squares[winner[0]];
     } else if (draw) {
        status = 'Game is a draw';
     } else {
       status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
     }
    
     let sort;
     if(this.state.descending){
      sort = 'Descending Order';
     } else {
      sort = 'Asending Order';
     }
     return (
      <div className="game">
        <div className="game-board">
          <Board 
             squares={current.squares}
             onClick={(i) => this.handleClick(i)}
             winRow={winner}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.handleSortClick()}>{sort}</button>
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
  for ( let i = 0; i < lines.length; i++) {
    const [a, b, c ] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return null;
}

function isDraw(squares) {
  if(squares.includes(null)) {
    return false;
  }

  return true;
}
