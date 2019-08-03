// Game global variable
var game;


// Render rules options
function renderRules() {
    let select = document.querySelector('#rules');
    for (let rules in gameRules) {
        let option = document.createElement('option');
        option.value = rules;
        option.innerHTML = gameRules[rules].name;
        select.appendChild(option);
    }
}

// Detect options changes
function initializeOptions() {
    document.querySelectorAll('#configuration, #rules').forEach(function(element) {
        element.addEventListener('change', function() {
            game.stop();
            let canvas = document.querySelector('#canvas canvas');
            document.querySelector('#canvas').removeChild(canvas);
            document.querySelector('#start-stop i').innerHTML = 'play_arrow';
            let configuration = document.querySelector('#configuration').value;
            let rules = document.querySelector('#rules').value;
            newGame(configuration, gameRules[rules]);
        });
    });
}

// Initialize start button
function initializeGameStart() {
    document.querySelector('#start-stop').addEventListener('click', function() {
        let icon = document.querySelector('#start-stop i');
        if (game.running) {
            icon.innerHTML = 'play_arrow';
            game.stop();
        } else {
            icon.innerHTML = 'pause';
            game.start();
        }
    });
}


// Start a new game
function newGame(configuration, rules) {

    // Canvas creation
    let canvas = document.createElement('canvas');
    document.querySelector('#canvas').appendChild(canvas);

    // Drawer settings
    let padding = 5;
    let backgroundColor = getStyleValue('--background-color');
    let gridColor = getStyleValue('--grid-color');
    let cellColor = getStyleValue('--cell-color');
    let targetColor = getStyleValue('--target-color');
    let generationElement = document.querySelector('#generation');
    let populationElement = document.querySelector('#population');

    // Drawer instantiation
    const drawer = new Drawer(
        canvas,
        padding,
        backgroundColor,
        gridColor,
        cellColor,
        targetColor,
        generationElement,
        populationElement
    );

    // Page values
    let pageWidth = window.innerWidth;
    let pageHeight = window.innerHeight;
    let statsHeight = document.querySelector('#options').offsetHeight;

    // Game settings
    let rows = Math.round((pageHeight - statsHeight) / padding);
    let columns = Math.round(pageWidth / padding);
    let probability = configuration == 'random'? 0.1 : 0;
    let interval = 50;

    // Game instantiation
    game = new Game(
        rules,
        rows,
        columns,
        probability,
        drawer,
        interval
    );

    // Cell toggling
    initializeCanvas(canvas, padding);

}


// Get style property by name
function getStyleValue(name) {
    let style = getComputedStyle(document.body);
    return style.getPropertyValue(name);
}

// Cell toggling
function initializeCanvas(canvas, padding) {
    canvas.addEventListener('click', function(event) {
        let row = Math.floor(event.offsetY / padding);
        let column = Math.floor(event.offsetX / padding);
        game.toggleCell(row, column);
    });
}

// Ready page
document.addEventListener('DOMContentLoaded', function() {

    // Initialize options
    renderRules();
    initializeOptions();
    initializeGameStart();

    // Automatic game
    newGame('random', gameRules.default);
    game.start();

});
