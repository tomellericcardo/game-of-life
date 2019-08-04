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

// Initialize rules options
function initializeRules() {
    let rules = document.querySelector('#rules');
    rules.addEventListener('change', function() {
        game.setRules(gameRules[rules.value]);
    });
}

// Initialize action buttons
function initializeActions() {
    let playIcon = document.querySelector('#start-stop i');
    let stepButton = document.querySelector('#step');
    document.querySelector('#clear').addEventListener('click', function() {
        playIcon.innerHTML = 'play_arrow';
        stepButton.classList.remove('w3-disabled');
        restartGame(false);
    });
    document.querySelector('#random').addEventListener('click', function() {
        playIcon.innerHTML = 'play_arrow';
        stepButton.classList.remove('w3-disabled');
        restartGame(true);
    });
    document.querySelector('#start-stop').addEventListener('click', function() {
        if (game.running) {
            playIcon.innerHTML = 'play_arrow';
            stepButton.classList.remove('w3-disabled');
            game.stop();
        } else {
            playIcon.innerHTML = 'pause';
            stepButton.classList.add('w3-disabled');
            game.start();
        }
    });
    document.querySelector('#step').addEventListener('click', function() {
        if (!game.running) game.step();
    });
}

// Restart game
function restartGame(random) {
    if (game.running) game.stop();
    let canvas = document.querySelector('#canvas canvas');
    document.querySelector('#canvas').removeChild(canvas);
    let rules = document.querySelector('#rules').value;
    newGame(random, gameRules[rules]);
}


// Start a new game
function newGame(random, rules) {

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
    let statsHeight = document.querySelector('#actions').offsetHeight;

    // Game settings
    let rows = Math.round((pageHeight - statsHeight) / padding);
    let columns = Math.round(pageWidth / padding);
    let probability = random ? 0.1 : 0;
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
    initializeRules();
    initializeActions();

    // Automatic game
    newGame(true, gameRules.default);
    game.start();

});
