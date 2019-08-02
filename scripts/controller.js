
// Get style property by name
function getStyleValue(name) {
    let style = getComputedStyle(document.body);
    return style.getPropertyValue(name);
}


// Ready page
document.addEventListener('DOMContentLoaded', function() {

    // Drawer settings
    let canvas = document.querySelector('#canvas');
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
    let rules = gameRules.default;
    let rows = Math.round((pageHeight - statsHeight) / padding);
    let columns = Math.round(pageWidth / padding);
    let probability = 0.1;
    let interval = 50;

    // Game instantiation
    const game = new Game(
        rules,
        rows,
        columns,
        probability,
        drawer,
        interval
    );

    // Starting the game
    game.start();

});
