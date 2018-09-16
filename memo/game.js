var canvas = document.querySelector('#memo-board');
var context = canvas.getContext('2d');
var sectionSize = 150;
var rows = 5;
var columns = 8;
var canvaHeight = rows * sectionSize;
var canvaWidth = columns * sectionSize;

var tiles = rows * columns;




function game(playerID) {
  canvas.width = canvaWidth;
  canvas.height = canvaHeight;  

  const ima = new Image();
  const sources = {
    zero: '../assets/animals_c/0.png',
    one:  '../assets/animals_c/1.png'
  };

  // loadImages(sources, (images) => {
  //   context.drawImage(images.zero, 0,0,150,150);
  //   context.drawImage(images.one, 150, 150, 150, 150);
  //   context.drawImage(images.zero, 0,150,150,150);
  //   context.drawImage(images.one, 150, 0, 150, 150);
  // });
  

  drawReverse(0);

  console.log('game');

  
  
    
}
game();

function pickImages(count) {

}

// when klicked on tile
function loadImages(sources, callback) {
  const images = {};
  let loadedImages = 0;
  let numImages = 0;

  for (const src in sources) {
    numImages++;
  }
  for (const src in sources) {
    images[src] = new Image();
    images[src].onload = () => {
      if (++loadedImages >= numImages) {
        callback(images);
      }
    };
    images[src].src = sources[src];
  }
}

function drawReverse(fileNo) {
  
  const source = {
    blank:  '../assets/blank/' + fileNo + '.png'
  };

  loadImages(source, (image) => {
    for (let x = 0; x < columns; x++) {
      for (let y = 0; y < rows; y++) {
        context.drawImage(image.blank, x * sectionSize, y * sectionSize, sectionSize, sectionSize);
      }
    }
  });
}


function generateBoard() {
  let i = 0;
  for (let x = 0; x < columns; x++) {
    for (let y = 0; y < rows; y++) {
      const image = new Image();
      image.onload = () => {
        context.drawImage(image, x* sectionSize, y*sectionSize, sectionSize, sectionSize);
      }
      let url = '../assets/' + i + '.png';
      i++;
      image.src = url;
    }
  }
}


/*
 *  CONTROLS
 */

function revertTile(mouse) 
{
  var xCordinate;
  var yCordinate;

  for (var x = 0; x < columns; x++) 
  {
    for (var y = 0; y < rows; y++) 
    {
      xCordinate = x * sectionSize;
      yCordinate = y * sectionSize;

      if (mouse.x >= xCordinate && mouse.x <= xCordinate + sectionSize &&
          mouse.y >= yCordinate && mouse.y <= yCordinate + sectionSize) 
      {
        console.log(`row: ${y}, column: ${x}`);
        //clearPlayingArea(xCordinate, yCordinate);

        
      }
    }
  }
}



 // gets coordinates of mouse click
function getCanvasMousePosition (event) 
{
  var rect = canvas.getBoundingClientRect();

  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  }
}

canvas.addEventListener('mouseup', function (event) {
  

  const canvasMousePosition = getCanvasMousePosition(event);
  // revert corresponding tile
  
  revertTile(canvasMousePosition);
  
});