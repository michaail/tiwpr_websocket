
var tiles = 0;

exports.generateBoard = function (columns, rows) { // generates board array and shuffles it
  const board = []
  tiles = columns * rows;
  const sources = getTilesSources().map((item) => {
    return [item, item];
  }).reduce((a, b) => {
    return a.concat(b);
  });

  shuffleTiles(sources);

  for (let x = 0; x < columns; x++) {
    board.push([]);
    for (let y = 0; y < rows; y++) {
      board[x].push(sources.pop());
    }
  }

  console.log(board);
  return board;
}

function getTilesSources () { // gets file numbers 
  let sources = [];
  while (sources.length < tiles / 2) {
    var randomNumber = Math.floor(Math.random()*100);
    if (sources.indexOf(randomNumber) > -1) continue;
    sources.push(randomNumber);
  }
  return sources;
}

function shuffleTiles (tiles) { // shuffles tiles
  for (let i= tiles.length - 1; i > 0; i--) {
    const swap = Math.floor(Math.random()*i);
    const tmp = tiles[i];
    tiles[i] = tiles[swap];
    tiles[swap] = tmp;
  }
}
