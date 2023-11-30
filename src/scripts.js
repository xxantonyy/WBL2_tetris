import "../styles/style.css"
import { Tetris } from "./tetris"
import { PLAYFIELD_COLUMNS, PLAYFIELD_ROWS, SAD, convertPositionToIndex, rotateMatrix } from "./utilites";

let requestId;
let timerID;
const tetris = new Tetris();
const cells = document.querySelectorAll('.grid>div');
const score = document.querySelector('.score');
const global_score = document.querySelector('.score2');


// setInterval(() => {
//    console.clear();
//    console.table(tetris.playfield);
// }, 500);

initKeyDown();
global_score.textContent = tetris.global_score;
moveDown();

function initKeyDown () {
   document.addEventListener('keydown', onKeyDown);
}

function onKeyDown (event) {
   switch (event.key) {
      case 'ArrowUp':
         rotate();
         break;
      case 'ArrowDown':
         moveDown()
         break;
         
      case 'ArrowLeft':
         moveLeft()
         break;
      case 'ArrowRight':
         moveRight()
         break;

      default:
         break;
   }
};

function moveDown () {
   tetris.mooveTetrominoDown();
   draw();
   // Функция остановки цикла отрисовки
   stopLoop();
   // Фцнкция начала цикла отрисовки
   startLoop();

   if(tetris.isGameOver) {
      localStorage.setItem('score',score.textContent);
      global_score.textContent = tetris.global_score;
      gameOver();
      score.textContent = 0;
   }
}
const moveLeft = () => {
   tetris.mooveTetrominoLeft();
   draw();
}
const moveRight = () => {
   tetris.mooveTetrominoRight();
   draw();
}

function rotate() {
   tetris.rotateTetromino();
   draw();
};

function draw() {
   cells.forEach(cell => cell.removeAttribute('class'))
   drawPlayfield();
   drawTetromino();
   score.textContent = tetris.score;
}


// requestAnimationFrame - чтобы браузер планировал перерисовку на следующем кадре!!!
function startLoop() {
   timerID = setTimeout(() => requestId = requestAnimationFrame(moveDown), 700);
} 

function stopLoop() {
   cancelAnimationFrame(requestId);
   clearTimeout(timerID);
}

function drawPlayfield() {
   for (let row = 0; row < PLAYFIELD_ROWS; row++) {
      for (let column = 0; column < PLAYFIELD_COLUMNS; column++) {
         if (!tetris.playfield[row][column]) continue;
         const name = tetris.playfield[row][column];
         const cellIndex = convertPositionToIndex(row,column);
         cells[cellIndex].classList.add(name);
      }
   }
}

function drawTetromino() {
   const name = tetris.tetromino.name;
   const tetrominoMatrixSize = tetris.tetromino.matrix.length;
   for (let row = 0; row < tetrominoMatrixSize; row++) {
      for (let column = 0; column < tetrominoMatrixSize; column++) {
         if (!tetris.tetromino.matrix[row][column]) continue;
         if (tetris.tetromino.row + row < 0) continue;
         const cellIndex = convertPositionToIndex(tetris.tetromino.row + row, tetris.tetromino.column + column);
         cells[cellIndex].classList.add(name);
      }
   }
}

function gameOver () {
   stopLoop();
   document.removeEventListener('keydown', onKeyDown);
   console.log('GameOver');
   gameOverAnimation();
}

function gameOverAnimation () {
   const filledCells = [...cells].filter(cell => cell.classList.length > 0);filledCells.forEach((cell,i) => {
      setTimeout(() => {cell.classList.add('hide')}, i * 10)
      setTimeout(() => {cell.removeAttribute('class')}, i * 10 + 500)
   })

   setTimeout(drawEnd, filledCells.length * 10 + 1000);
}

function drawEnd () {
   const topOffset = 5;
   for (let row = 0; row < SAD.length; row++) {
      for (let col = 0; col < SAD[0].length; col++) {
         if(!SAD[row][col]) continue;
         const cellIndex = convertPositionToIndex(topOffset + row, col);
         cells[cellIndex].classList.add('end')
      }
   }
}