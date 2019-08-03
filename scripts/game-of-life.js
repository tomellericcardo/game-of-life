// Some rules for the game
const gameRules = {
    default: {
        name: 'Default rules',
        survive: [2, 3],
        born: [3]
    },
    highLife: {
        name: 'High life',
        survive: [2, 3],
        born: [3, 6]
    },
    coral: {
        name: 'Coral',
        survive: [4, 5, 6, 7, 8],
        born: [3]
    }
};


// Game class
class Game {

    constructor(
        rules,
        rows,
        columns,
        probability,
        drawer,
        interval
    ) {
        this.board = new Board(rules, rows, columns, probability);
        this.drawer = drawer;
        this.drawer.drawBoard(this.board);
        this.interval = interval;
        this.running = false;
    }

    toggleCell(row, column) {
        this.board.toggleCell(row, column);
        this.drawer.drawBoard(this.board);
    }

    sleep() {
        const interval = this.interval;
        return new Promise(function(resolve) {
            setTimeout(resolve, interval)
        });
    }

    async start() {
        this.running = true;
        while (this.running) {
            this.board.nextGeneration();
            this.drawer.drawBoard(this.board);
            await this.sleep();
        }
    }

    stop() {
        this.running = false;
    }

}


// Board class
class Board {

    constructor(rules, rows, columns, probability) {
        this.rules = rules;
        this.rows = rows;
        this.columns = columns;
        this.generation = 0;
        this.population = 0;
        this.generateMatrix(probability);
    }

    generateMatrix(probability) {
        this.matrix = [];
        for (let row = 0; row < this.rows; row++) {
            var array = [];
            for (let column = 0; column < this.columns; column++) {
                let alive = false;
                if (Math.random() < probability) {
                    alive = true;
                    this.population++;
                }
                array.push(new Cell(alive));
            }
            this.matrix.push(array);
        }
    }

    toggleCell(row, column) {
        let cell = this.matrix[row][column];
        this.matrix[row][column] = new Cell(!cell.alive);
    }

    getCell(row, column) {
        return this.matrix[row][column];
    }

    nextGeneration() {
        this.generation++;
        this.population = 0;
        var future = [];
        for (let row = 0; row < this.rows; row++) {
            var array = [];
            for (let column = 0; column < this.columns; column++) {
                let cell = this.matrix[row][column];
                let futureCell = this.cellTransition(cell, row, column);
                array.push(futureCell);
            }
            future.push(array);
        }
        this.matrix = future;
    }

    cellTransition(cell, row, column) {
        var futureCell = new Cell(false);
        let neighbours = this.aliveNeighbours(cell, row, column);
        if (cell.alive && this.rules.survive.includes(neighbours)) {
            futureCell = new Cell(true, cell.age + 1);
            this.population++;
        } else if (this.rules.born.includes(neighbours)) {
            futureCell = new Cell(true);
            this.population++;
        }
        return futureCell;
    }

    aliveNeighbours(cell, cellRow, cellColumn) {
        var count = 0;
        for (let row = cellRow - 1; row <= cellRow + 1; row++) {
            for (let column = cellColumn - 1; column <= cellColumn + 1; column++) {
                if (row >= 0 && row < this.rows && column >= 0 && column < this.columns) {
                    let currentCell = this.matrix[row][column];
                    count += currentCell.alive ? 1 : 0;
                }
            }
        }
        count -= cell.alive ? 1 : 0;
        return count;
    }

}


// Cell class
class Cell {

    constructor(alive, age = 0) {
        this.alive = alive;
        this.age = age;
    }

}
