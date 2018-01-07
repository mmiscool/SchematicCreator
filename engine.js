var MaxSymbols = 100;
var MaxLayout = 50;
var MaxConnections = 50;


function CircuitSymbols() {
    this.delete = function () {
        this.Name = "";
        this.symbolPoints = "";
        this.padPoints = "";
        return "deleted";
    };

    this.delete();
}

function CircuitConnections() {

    this.delete = function () {
        this.id1 = 0;
        this.id2 = 0;
        this.jogged = "";
        this.jogPosition = 0;
        return "deleted";
    };
    this.delete();
}


function CircuitLayout() {
    this.delete = function () {
        this.SymbolID = 0;
        this.SchematicX = 0;
        this.SchematicY = 0;
        this.SchematicRotation = 0;
        this.PadX = 0;
        this.PadY = 0;
        this.PadRotation = 0;
        return "deleted";
    };

    this.moveSymbol = function (x, y) {
        this.SchematicX = x;
        this.SchematicY = y;
    };
    this.delete();
}


// Create arraays to hold the objects for digram
var Connections = [];
var Symbols = [];
var Layout = [];


//Populate arraies with empty data
for (x = 1; x <= MaxConnections; x++) {
    Connections[x] = new CircuitConnections();
}

for (x = 1; x <= MaxSymbols; x++) {
    Symbols[x] = new CircuitSymbols();
}

for (x = 1; x <= MaxLayout; x++) {
    Layout[x] = new CircuitLayout();
}


function writeMessage(canvas, message) {
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, 200, 25);
    context.font = '18pt Calibri';
    context.fillStyle = 'black';
    context.fillText(message, 10, 25);
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');

canvas.addEventListener('click', function (evt) {
    var mousePos = getMousePos(canvas, evt);



    Layout[1].moveSymbol(mousePos.x, mousePos.y);


    renderLayout();

}, false);

Layout[1].SymbolID = 1;


Layout[5].SymbolID = 1;
Layout[5].SchematicX = 50;


function RenderLayoutItem(id) {
    if (Layout[id].SymbolID <= 0) return;
    var img = new Image();
    img.src = './symbols/' + Layout[id].SymbolID + '.png';
    drawRotatedImage(img, Layout[id].SchematicX, Layout[id].SchematicY, 90);
}


function drawRotatedImage(image, x, y, angle) {
    var TO_RADIANS = Math.PI / 180;
    // save the current co-ordinate system
    // before we screw with it
    context.save();

    // move to the middle of where we want to draw our image
    context.translate(x, y);

    // rotate around that point, converting our
    // angle from degrees to radians
    context.rotate(angle * TO_RADIANS);

    // draw it up and to the left by half the width
    // and height of the image
    context.drawImage(image, -(image.width / 2), -(image.height / 2));

    // and restore the co-ords to how they were when we began
    context.restore();
}

function renderLayout() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (x = 1; x <= MaxLayout; x++) {
        RenderLayoutItem(x);
    }
}

renderLayout();