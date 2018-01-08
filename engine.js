var MaxSymbols = 5;
var MaxLayout = 50;
var MaxConnections = 50;
var CurrentToolStatus = "symbolPic";

var SchematicID = new URL(window.location.href).searchParams.get("id");

function CircuitSymbols() {
    this.delete = function () {
        this.Name = "";
        this.Points = "";
        this.width = 0;
        this.height = 0;
        return "deleted";
    };

    this.extend = function (jsonString) {

        try {
            var obj = JSON.parse(jsonString)
            for (var key in obj) {
                this[key] = obj[key]
            }
        } catch (e) {
        }
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

    this.DetectIfSymbolUnderXY = function (x, y) {
        if (this.SymbolID <= 0) return false;

        wid = Symbols[this.SymbolID].width;
        hei = Symbols[this.SymbolID].height;

        if (this.SchematicRotation == 90 || this.SchematicRotation == 90) [wid, hei] = [hei, wid];

        if (x > this.SchematicX - wid / 2 && x < this.SchematicX + wid / 2 && y > this.SchematicY - hei / 2 && y < this.SchematicY + hei / 2) {

            return 1;

        }
        return 0;
    };


    this.UIshowProperties = function () {

        document.getElementById("SymbolID").value = this.SymbolID;
        document.getElementById("SchematicX").value = this.SchematicX;
        document.getElementById("SchematicY").value = this.SchematicY;
        document.getElementById("SchematicRotation").value = this.SchematicRotation;

    };

    this.UIupdateFromProperties = function () {
        this.SymbolID = document.getElementById("SymbolID").value;
        this.SchematicX = document.getElementById("SchematicX").value;
        this.SchematicY = document.getElementById("SchematicY").value;
        this.SchematicRotation = document.getElementById("SchematicRotation").value;
    };


    this.extend = function (jsonString) {

        try {
            var obj = JSON.parse(jsonString)
            for (var key in obj) {
                this[key] = obj[key]
            }
        } catch (e) {
        }
    };

    this.delete();
}


// Create arraays to hold the objects for digram
var Connections = [];
var Symbols = [];
var Layout = [];


//Populate arraies with empty data
//or load data from localstorage
function UIloadStoredLayout() {

    for (x = 1; x <= MaxSymbols; x++) {
        Symbols[x] = new CircuitSymbols();
        Symbols[x].extend(BrowserStorage("Symbol", x, "Layout"));
        UIaddItemToSelect("SymbolListingForSelection", Symbols[x].Name, x);
    }

    for (x = 1; x <= MaxConnections; x++) {
        Connections[x] = new CircuitConnections();
    }

    for (x = 1; x <= MaxLayout; x++) {
        Layout[x] = new CircuitLayout();
        Layout[x].extend(BrowserStorage("Schematic", x, "Layout"));
    }
}


function UIsaveStoredLayout() {

    for (x = 1; x <= MaxConnections; x++) {
        Connections[x] = new CircuitConnections();
    }

    for (x = 1; x <= MaxLayout; x++) {
        BrowserStorageStore("Schematic", x, "Layout", JSON.stringify(Layout[x]));

    }
}


UIloadStoredLayout();

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

    if (CurrentToolStatus == "symbolPic") {
        UIselectedSymbolID = CheckLayoutSymbolClick(mousePos.x, mousePos.y);
        UIshowSymbolLayoutInfo(UIselectedSymbolID);
        //CheckLayoutSymbolClick(mousePos.x, mousePos.y);
    }


    if (CurrentToolStatus == "moveSymbol") {
        UIselectedSymbolID = document.getElementById("LayoutID").value;
        Layout[UIselectedSymbolID].moveSymbol(mousePos.x, mousePos.y);
        UIshowSymbolLayoutInfo(UIselectedSymbolID);
        CurrentToolStatus = "symbolPic";
    }


    if (CurrentToolStatus == "addSymbol") {
        UIselectedSymbolID = "";

        for (x = 1; x <= MaxLayout; x++) {
            console.log(x + " " + Layout[x].SymbolID);
            if (Layout[x].SymbolID === 0) {
                alert("Adding symbol");
                UIselectedSymbolID = x;
                Layout[x].SymbolID= UIsymbolToAdd;

                Layout[UIselectedSymbolID].moveSymbol(mousePos.x, mousePos.y);
                UIshowSymbolLayoutInfo(UIselectedSymbolID);
                CurrentToolStatus = "symbolPic";

                break;
            }

        }


        UIshowSymbolLayoutInfo(UIselectedSymbolID);
        CurrentToolStatus = "symbolPic";
    }

    renderLayout();
}, false);


function UIaddSymbolButtonClick() {
    if (UIsymbolToAdd != "") {
        CurrentToolStatus = "addSymbol";
    }
    else {
        Alert("You must select a symbol");
    }
}


function UIshowSymbolLayoutInfo() {


    if (UIselectedSymbolID) {
        document.getElementById("LayoutID").value = UIselectedSymbolID;
        Layout[UIselectedSymbolID].UIshowProperties();
    }
    else {
        document.getElementById("LayoutID").value = UIselectedSymbolID;
        document.getElementById("SymbolID").value = "";
        document.getElementById("SchematicX").value = "";
        document.getElementById("SchematicY").value = "";
        document.getElementById("SchematicRotation").value = "";
    }

}

function UIsymbolLayoutButtonClick(ActionToBeTaken) {
    UIselectedSymbolID = document.getElementById("LayoutID").value;
    if (UIselectedSymbolID === "undefined" || UIselectedSymbolID === "" || UIselectedSymbolID === null) return;


    if (ActionToBeTaken == "delete") {
        Layout[UIselectedSymbolID].delete()
        renderLayout();
        UIshowSymbolLayoutInfo(UIselectedSymbolID);
    }


    if (ActionToBeTaken == "move") {
        CurrentToolStatus = "moveSymbol";
    }

    if (ActionToBeTaken == "apply") {
        Layout[UIselectedSymbolID].UIupdateFromProperties();
        renderLayout();
    }


    if (ActionToBeTaken == "rotate left") {
        Layout[UIselectedSymbolID].SchematicRotation -= 90;
        if (Layout[UIselectedSymbolID].SchematicRotation === -90) Layout[UIselectedSymbolID].SchematicRotation = 270 ;
        renderLayout();
        UIshowSymbolLayoutInfo();
    }

    if (ActionToBeTaken == "rotate right") {
        Layout[UIselectedSymbolID].SchematicRotation += 90;
        if (Layout[UIselectedSymbolID].SchematicRotation === 360) Layout[UIselectedSymbolID].SchematicRotation = 0 ;
        renderLayout();
        UIshowSymbolLayoutInfo();
    }
}


function CheckLayoutSymbolClick(x, y) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (i = 1; i <= MaxLayout; i++) {
        if (Layout[i].DetectIfSymbolUnderXY(x, y)) {
            return i;
        }
    }
}


function RenderLayoutItem(id) {
    if (Layout[id].SymbolID <= 0) return;
    var img = new Image();
    img.src = './symbols/' + Layout[id].SymbolID + '-Symbol.png';
    drawRotatedImage(img, Layout[id].SchematicX, Layout[id].SchematicY, Layout[id].SchematicRotation);
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


function BrowserStorageStore(type, id, field, contents) {
    localStorage.setItem(type + "-" + id + "-" + field, contents);
}

function BrowserStorage(type, id, field) {
    if (localStorage.getItem(type + "-" + id + "-" + field)) {

        return localStorage.getItem(type + "-" + id + "-" + field);
    }
    return "";
}

var UIsymbolToAdd = "";

function UISymbolAdderSelectClick(thing) {
    UIsymbolToAdd = thing;
    document.getElementById('SymbolPreviewImage').src="./Symbols/" + UIsymbolToAdd + '-Symbol.png';
}

function UIaddItemToSelect(id, optionToAdd, value) {
    var option = document.createElement("option");
    if (optionToAdd === "") return;
    option.text = optionToAdd;
    option.value = value
    document.getElementById(id).add(option);
}