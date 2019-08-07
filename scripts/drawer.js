class Drawer {

    constructor(
        canvas,
        padding,
        backgroundColor,
        gridColor,
        cellColor,
        targetColor,
        generationElement,
        populationElement
    ) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.padding = padding;
        this.backgroundColor = backgroundColor;
        this.gridColor = gridColor;
        this.cellColor = cellColor;
        this.targetColor = targetColor;
        this.generationElement = generationElement;
        this.populationElement = populationElement;
    }

    changePadding() {
        if (this.padding > 10) this.padding = 4;
        else this.padding += 2;
    }

    drawBoard(board) {
        this.clearCanvas(board);
        this.drawGrid(board);
        this.drawCells(board);
        this.printStats(board);
    }

    clearCanvas(board) {
        this.canvas.width = board.columns * this.padding;
        this.canvas.height = board.rows * this.padding;
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = this.backgroundColor;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawGrid(board) {
        for (let row = 0; row < board.rows; row++) {
            let y = row * this.padding;
            this.context.moveTo(0, y);
            this.context.lineTo(this.canvas.width, y);
        }
        for (let column = 0; column < board.columns; column++) {
            let x = column * this.padding;
            this.context.moveTo(x, 0);
            this.context.lineWidth = 0.1;
            this.context.lineTo(x, this.canvas.height);
        }
        this.context.strokeStyle = this.gridColor;
        this.context.stroke();
    }

    drawCells(board) {
        for (let row = 0; row < board.rows; row++) {
            for (let column = 0; column < board.columns; column++) {
                let cell = board.getCell(row, column);
                if (cell.alive) {
                    this.drawCell(row, column, cell);
                }
            }
        }
    }

    drawCell(row, column, cell) {
        this.context.beginPath();
        let x = column * this.padding;
        let y = row * this.padding;
        let p = this.padding;
        this.context.rect(x, y, p, p);
        this.context.fillStyle = this.pickColor(cell.age);
        this.context.fill();
        this.context.closePath();
    }

    pickColor(age) {
        let percentage = age <= 100 ? age : 100;
        let cellColor = this.colorValues(this.cellColor);
        let targetColor = this.colorValues(this.targetColor);
        var rgb = '#';
        for (let i = 0; i < 3; i++) {
            let value = (targetColor[i] - cellColor[i]) * (percentage / 100);
            value = (cellColor[i] + Math.round(value)).toString(16);
            if (value.length == 1) value = '0' + value;
            rgb += value;
        }
        return rgb;
    }

    colorValues(color) {
        var values = [];
        for (let i = 2; i < color.length; i += 2) {
            let value = color.substring(i, i + 2);
            value = parseInt(value, 16);
            values.push(value);
        }
        return values;
    }

    printStats(board) {
        this.generationElement.innerHTML = board.generation;
        this.populationElement.innerHTML = board.population;
    }

}
