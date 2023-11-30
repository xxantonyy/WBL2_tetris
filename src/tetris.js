import { 
   PLAYFIELD_COLUMNS,
   PLAYFIELD_ROWS,
   TETROMINOES,
   TETROMINO_NAMES,
   getRandomElement,
   rotateMatrix
} from "./utilites";

export class Tetris {
   constructor() {
      this.playfield;
      this.tetromino;
      history.isGameOver = false;
      this.init();
      this.score;
      this.global_score = localStorage.getItem('score') || 0;
   }
      // Инициализация
   init() {
      this.generatePlayfield();
      this.generateTetromino();
      this.score = 0;
   }

   generatePlayfield() {
      this.playfield = new Array(PLAYFIELD_ROWS).fill()
         .map(() => new Array(PLAYFIELD_COLUMNS).fill(0));

   }

   generateTetromino() {
      // Получаем случайный элемент фигурки
      const name = getRandomElement(TETROMINO_NAMES);
      const matrix = TETROMINOES[name];

      // Центруем положение первой фиггуры
      const column = PLAYFIELD_COLUMNS / 2 - Math.floor(matrix.length / 2);
      const row = -2;

      this.tetromino = {
         name,
         matrix,
         row,
         column
      }
   }

   mooveTetrominoDown() {
      this.tetromino.row += 1
      if (!this.isValid()) {
         this.tetromino.row -= 1;
         this.placeTetromino();
      }
   }
   mooveTetrominoLeft() {
      this.tetromino.column -= 1
      if (!this.isValid()) {
         this.tetromino.column += 1;
      }
   }
   mooveTetrominoRight() {
      this.tetromino.column += 1
      if (!this.isValid()) {
         this.tetromino.column -= 1;
      }
   }
   rotateTetromino () {
      const oldMatrix = this.tetromino.matrix;
      const rotateDMatrix = rotateMatrix(this.tetromino.matrix);
      this.tetromino.matrix = rotateDMatrix;
      if (!this.isValid()) {
         this.tetromino.matrix = oldMatrix;
      }
   }

   isValid() {
      const matrixSize = this.tetromino.matrix.length;
      for (let row = 0; row < matrixSize; row++) {
         for(let column = 0; column < matrixSize; column++) {
            if(!this.tetromino.matrix[row][column]) continue;
            if(this.isOutsideOfGameBoard(row,column)) return false;
            if(this.isCollides(row,column)) return false;
         }
      }
      return true;
   }

   isOutsideOfGameBoard(row, column) {
      return this.tetromino.column + column < 0 || this.tetromino.column + column >= PLAYFIELD_COLUMNS || this.tetromino.row + row >= this.playfield.length
   }

   isCollides(row, column) {
      return this.playfield[this.tetromino.row + row]?.[this.tetromino.column + column];
   }

   placeTetromino() {
      const matrixSize = this.tetromino.matrix.length;
      for (let row = 0; row < matrixSize; row++) {
         for(let column = 0; column < matrixSize; column++) {
            if(!this.tetromino.matrix[row][column]) continue;

            // Конец игры 
            if(this.isOutsideOfTopBoard(row)) {
               this.isGameOver = true;
               return;
            }
           
            this.playfield[this.tetromino.row + row][this.tetromino.column + column] = this.tetromino.name
         }
      }

      this.processFieldRows();
      this.generateTetromino();
      this.score += 100;
      console.log(this.score);
   }

   isOutsideOfTopBoard(row) {
      return this.tetromino.row + row < 0;
   }
   
   processFieldRows() {
      const fielldLines = this.findFilledRows();
      this.removeFilledRows(fielldLines);
   }
 
   findFilledRows() {
      const filledRows = [];
      for (let row = 0; row < PLAYFIELD_ROWS; row++) {
        if (this.playfield[row].every(cell => Boolean(cell))) {
            filledRows.push(row);
    
            this.score += 900;
            console.log(this.score);
        }
      }
      return filledRows;
   }

   removeFilledRows(filledRows) {
      filledRows.forEach((row) => {
         this.dropRowsAbove(row);
      })
   }

   dropRowsAbove(rowToDelete) {
      for (let row = rowToDelete; row > 0; row--) {
         this.playfield[row] = this.playfield[row-1];
      }
      this.playfield[0] = new Array(PLAYFIELD_COLUMNS).fill(0);
   }
};
