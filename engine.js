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





