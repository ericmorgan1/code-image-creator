
// Load dependencies...
var fs = require("fs");
var page = require('webpage').create();
var system = require('system');
var args = system.args;
phantom.injectJs("./../js/util.js");

// Enable console logging...
page.onConsoleMessage = function(msg) { system.stderr.writeLine('console: ' + msg); };

// Returns a { width, height } object based on number of lines of code...
var calculateCanvasSize = function(numLines, LINE_HEIGHT) {
  var canvasWidth = 1000;   // TODO: Actually calculate width
  var canvasHeight = (numLines * LINE_HEIGHT) + 100;
  return { width: canvasWidth, height: canvasHeight };
}

// Process arguments...
if (args.length < 3) { console.log("Please supply arguments <inputFile> <outputFile>"); phantom.exit(); }
var inputFileName = args[1];
var outputFileName = args[2];

// ####################################################
// START OF SCRIPT
// ####################################################

// Get code and setup sizes...
var sourceCode = fs.read(inputFileName);
var numLines = getNumLines(sourceCode);
var canvasSize = calculateCanvasSize(numLines, 10);         // LINE_HEIGHT = 10
page.viewportSize = canvasSize;

// Open a page with a blank canvas...
page.open("canvas.html", function(status) {  
    page.evaluate(function(sourceCode) {        
        var canvas = document.getElementById("blankCanvas");
        applyToCanvas(canvas, sourceCode);       
    }, sourceCode);
  
    // Save image and exit...
    page.render(outputFileName);
    console.log("Completed.");
    phantom.exit();
});




