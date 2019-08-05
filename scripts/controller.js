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
    initializeRulesSelection();
    let modal = document.querySelector('#rules-modal');
    document.querySelector('#open-rules').addEventListener('click', function() {
        modal.style.display = 'block';
    });
    document.querySelector('#close-rules').addEventListener('click', function() {
        modal.style.display = 'none';
    });
    document.querySelectorAll('.w3-check').forEach(function(element) {
        element.addEventListener('change', function() {
            document.querySelector('#rules').value = 'custom';
        });
    });
    document.querySelector('#confirm-rules').addEventListener('click', function() {
        game.setRules(getRules());
        modal.style.display = 'none';
    });
}

// Initialize rules selection
function initializeRulesSelection() {
    let document.querySelector('#rules');
    rules.addEventListener('change', function() {
        if (rules.value != 'custom') {
            for (let i = 1; i <= 8; i++) {
                let survive = false;
                let born = false;
                if (gameRules[rules.value].survive.includes(i)) survive = true;
                if (gameRules[rules.value].born.includes(i)) born = true;
                document.querySelector('#survive-' + i).checked = survive;
                document.querySelector('#born-' + i).checked = born;
            }
        }
    });
}

// Get rules values
function getRules() {
    let rules = document.querySelector('#rules');
    if (rules.value == 'custom') {
        let values = {survive: [], born: []};
        for (let i = 1; i <= 8; i++) {
            if (document.querySelector('#survive-' + i).checked) values.survive.push(i);
            if (document.querySelector('#born-' + i).checked) values.born.push(i);
        }
        return values;
    }
    return gameRules[rules.value];
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
    newGame(random, getRules());
}


// Start a new game
function newGame(random, rules) {

    // Canvas creation
    let canvas = document.createElement('canvas');
    document.querySelector('#canvas').appendChild(canvas);

    // Drawer settings
    let padding = 5;
    let backgroundColor = getStyleValue('--primary-background');
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

    // Game settings
    let rows = Math.round(pageHeight / padding);
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
