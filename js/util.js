
// TODO:
    // applyToCanvas: Block comments
    // calculateCanvasSize: Calculate canvas width

// Uses esprima to parse the given source code. Returns the result from esprima.
function parseSourceCode(sourceCode) {
    var esprimaOptions = { loc: true, comment: true, tokens: true };
    return esprima.parse(sourceCode, esprimaOptions);
}

// Returns the number of lines of the given source code
function getNumLines(sourceCode) {
    return sourceCode.split(String.fromCharCode(10)).length;  
}

// Returns a { width, height } object based on number of lines of code...
function calculateCanvasSize(numLines, lineHeight) {
  var canvasWidth = 1000;   // TODO: Actually calculate width
  var canvasHeight = (numLines * lineHeight) + 100;
  return { width: canvasWidth, height: canvasHeight };
}

// Applies the code image to the given canvas. 
// options = { lineHeight, characterWidth, commentColor, codeColor, reservedColor }
function applyToCanvas(canvas, sourceCode, options) {
    
    // Setup some drawing options...
    if (!options) { options = {}; }
    const LINE_HEIGHT = options.lineHeight || 10;               // 10px per line
    const CHARACTER_WIDTH = options.characterWidth || 10;       // 10px per character
    const COMMENT_COLOR = options.commentColor || "#00FF00";
    const CODE_COLOR = options.codeColor || "#000000";
    const RESERVED_COLOR = options.reservedColor || "#0000FF";
    
    // Parse the source code...
    var ast = parseSourceCode(sourceCode);
    var numLines = getNumLines(sourceCode);
    
    // Set canvas size...
    var ctx = canvas.getContext("2d");
    var canvasSize = calculateCanvasSize(numLines, LINE_HEIGHT);
    ctx.canvas.width = canvasSize.width;
    ctx.canvas.height = canvasSize.height;
    
    // Clear canvas...
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Loop through all comments and display them...
    ctx.fillStyle = COMMENT_COLOR;
    ast.comments.forEach(function(comment) {
      // TODO: Handle block comments
      if (comment.type == "Block") { return; }
      
      // Figure out dimensions and draw the line...
      if (comment.type == "Line") {
        x = comment.loc.start.column * CHARACTER_WIDTH;
        y = comment.loc.start.line * LINE_HEIGHT;
        w = (comment.loc.end.column - comment.loc.start.column) * CHARACTER_WIDTH;
        h = LINE_HEIGHT;
        ctx.fillRect(x, y, w, h);
      }
    });
    
    // Loop through all the tokens and display them...
    ast.tokens.forEach(function(token) {
      // TODO: Make this a function...
      x = token.loc.start.column * CHARACTER_WIDTH;
      y = token.loc.start.line * LINE_HEIGHT;
      w = (token.loc.end.column - token.loc.start.column) * CHARACTER_WIDTH;
      h = LINE_HEIGHT;
      
      // Figure out what color to use...
      var color = CODE_COLOR;
      if (token.type == "Keyword" || token.type == "Punctuator") { color = RESERVED_COLOR; }
      if (token.type == "Punctuator" && token.value == ".") { color = CODE_COLOR; }

      // Draw the token...
      ctx.fillStyle = color;      
      ctx.fillRect(x, y, w, h);
    }); 
}