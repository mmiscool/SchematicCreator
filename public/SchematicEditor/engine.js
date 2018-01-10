var MaxSymbols = 50;
var MaxLayout = 100;
var MaxConnections = 100;
var CurrentToolStatus = "symbolPic";

var UIselectedSymbolID;

var SchematicID = new URL(window.location.href).searchParams.get("id");


function Point() {
    this.x = 0;
    this.y = 0;
    this.collor = "red";
    this.name = "";
    this.check = false;

    this.SetPoint = function (MyPointX, MyPointY) {
        this.x = MyPointX;
        this.y = MyPointY;
    }
}

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
        this.pin1 = "";
        this.id2 = 0;
        this.pin2 = "";
        this.jogged = "";
        this.jogPosition = 0;
        return "deleted";
    };

    this.remove = function () {
        //deletes the item and rerenders
        this.delete();
        renderLayout();
    };


    this.DrawMe = function (collor) {
        if (this.id2 === 0) return;
        console.log(this.pin1);
        bla = Layout[this.id1].GivePointForPinID(this.pin1);
        console.log(Layout[this.id1].GivePointForPinID(this.pin1), Layout[this.id2].GivePointForPinID(this.pin2));

        if (Layout[this.id1].GivePointForPinID(this.pin1) === undefined || Layout[this.id2].GivePointForPinID(this.pin2) === undefined) return;

        if (collor != undefined) {
            UIdrawLine(Layout[this.id1].GivePointForPinID(this.pin1), Layout[this.id2].GivePointForPinID(this.pin2), collor)
        }
        else {
            UIdrawLine(Layout[this.id1].GivePointForPinID(this.pin1), Layout[this.id2].GivePointForPinID(this.pin2))
        }


        return "Drew the line";
    };

    this.Select = function () {
        renderLayout();
        this.DrawMe("red");
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
        this.SchematicX = Number(document.getElementById("SchematicX").value);
        this.SchematicY = Number(document.getElementById("SchematicY").value);
        this.SchematicRotation = Number(document.getElementById("SchematicRotation").value);
    };

    this.RenderLayoutItem = function () {
        if (this.SymbolID <= 0) return;
        var img = new Image();
        img.src = './symbols/' + this.SymbolID + '-Symbol.png';
        drawRotatedImage(img, this.SchematicX, this.SchematicY, this.SchematicRotation);
    };


    this.RenderLayoutPoints = function (checkIfPointClickedHack) {


        if (this.SymbolID <= 0) return;
        UIeditMode = "Symbol";
        resolution = 20;

        pins = this.PinsListObject();


        for (var i = 0; i < pins.length; i++) {
            if (checkIfPointClickedHack != undefined) {
                //console.log("my point" , checkIfPointClickedHack);
                myTempppOint = this.SchematicSymbolPoint(pins[i]);

                console.log(checkIfPointClickedHack, myTempppOint)


                if (
                    Number(checkIfPointClickedHack.x) <= myTempppOint.x + resolution && Number(checkIfPointClickedHack.x) >= myTempppOint.x - resolution &&
                    Number(checkIfPointClickedHack.y) <= myTempppOint.y + resolution && Number(checkIfPointClickedHack.y) >= myTempppOint.y - resolution
                ) {

                    console.log(this.SchematicSymbolPoint(pins[i].name));
                    return this.SchematicSymbolPoint(pins[i].name);
                }

            }
            UIdrawPin(this.SchematicSymbolPoint(pins[i]));
        }
    };


    this.DetectPointClick = function (clickx, clicky) {


    };


    this.GivePointForPinID = function (pinID) {
        pins = this.PinsListObject();


        for (var i = 0; i < pins.length; i++) {
            if (pins[i].name === pinID) return this.SchematicSymbolPoint(pins[i]);
        }
    };

    this.SchematicSymbolPoint = function (mypoint) {

        if (Number(this.SchematicRotation) === 0) {
            mypoint.x = mypoint.x - (Symbols[this.SymbolID].width / 2);
            mypoint.y = mypoint.y - (Symbols[this.SymbolID].height / 2);
        }


        if (Number(this.SchematicRotation) === 180) {
            mypoint.x = (Symbols[this.SymbolID].width / 2) - mypoint.x;
            mypoint.y = (Symbols[this.SymbolID].height / 2) - mypoint.y;
        }


        if (Number(this.SchematicRotation) === 90) {
            mypoint.x = mypoint.x - (Symbols[this.SymbolID].width / 2);
            mypoint.y = (Symbols[this.SymbolID].height / 2) - mypoint.y;
            [mypoint.x, mypoint.y] = [mypoint.y, mypoint.x];

        }

        if (Number(this.SchematicRotation) === 270) {
            mypoint.y = mypoint.y - (Symbols[this.SymbolID].height / 2);
            mypoint.x = (Symbols[this.SymbolID].width / 2) - mypoint.x;
            [mypoint.x, mypoint.y] = [mypoint.y, mypoint.x];

        }

        mypoint.x += this.SchematicX;
        mypoint.y += this.SchematicY;

        return mypoint;

    };


    this.PinsListObject = function () {

        pins = Symbols[this.SymbolID].Points.split('\n');
        var ListOfPoints = [];

        for (i = 0; i < pins.length; i++) {
            var bla = new Point();
            bla.name = pins[i].split('|')[0];
            if (UIeditMode === "Symbol") {
                bla.x = pins[i].split('|')[1];
                bla.y = pins[i].split('|')[2];
                ListOfPoints.push(bla);

            }

            if (UIeditMode === "Pads") {
                bla.x = pins[i].split('|')[3];
                bla.y = pins[i].split('|')[4];
                ListOfPoints.push(bla);
            }
        }

        return ListOfPoints;
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
        Connections[x].extend(BrowserStorage("Schematic", x, "Connection"));
    }

    for (x = 1; x <= MaxLayout; x++) {
        Layout[x] = new CircuitLayout();
        Layout[x].extend(BrowserStorage("Schematic", x, "Layout"));
    }
}


function UIsaveStoredLayout() {

    for (x = 1; x <= MaxConnections; x++) {
        BrowserStorageStore("Schematic", x, "Connection", JSON.stringify(Connections[x]));
    }

    for (x = 1; x <= MaxLayout; x++) {
        BrowserStorageStore("Schematic", x, "Layout", JSON.stringify(Layout[x]));
    }
}


UIloadStoredLayout();


function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');
canvas.addEventListener('contextmenu', function (e) {
    if (e.button === 2) {
        e.preventDefault();
        return false;
    }
}, false);
canvas.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);


canvas.addEventListener('mouseup', function (evt) {
    var mousePos = getMousePos(canvas, evt);

    console.log(CheckLayoutSymbolPinClick(mousePos.x, mousePos.y));
    console.log(CheckLayoutSymbolClick(mousePos.x, mousePos.y));

    if (evt.button === 2 && UIselectedSymbolID) CurrentToolStatus = "moveSymbol";

    if (CurrentToolStatus === "symbolPic") {
        UIselectedSymbolID = CheckLayoutSymbolClick(mousePos.x, mousePos.y);
        UIshowSymbolLayoutInfo(UIselectedSymbolID);
        //CheckLayoutSymbolClick(mousePos.x, mousePos.y);
    }


    if (CurrentToolStatus === "moveSymbol") {
        UIselectedSymbolID = document.getElementById("LayoutID").value;
        Layout[UIselectedSymbolID].moveSymbol(mousePos.x, mousePos.y);
        UIshowSymbolLayoutInfo(UIselectedSymbolID);
        CurrentToolStatus = "symbolPic";
    }


    if (CurrentToolStatus === "addSymbol") {
        UIselectedSymbolID = "";

        for (x = 1; x <= MaxLayout; x++) {
            console.log(x + " " + Layout[x].SymbolID);
            if (Layout[x].SymbolID === 0) {

                UIselectedSymbolID = x;
                Layout[x].SymbolID = UIsymbolToAdd;

                Layout[UIselectedSymbolID].moveSymbol(mousePos.x, mousePos.y);
                UIshowSymbolLayoutInfo(UIselectedSymbolID);
                CurrentToolStatus = "symbolPic";

                break;
            }

        }


        UIshowSymbolLayoutInfo(UIselectedSymbolID);
        CurrentToolStatus = "symbolPic";
    }


    if (CurrentToolStatus === "addConnection") {
        if (Connections[UIselectedConnectionID].id1 === 0) {
            bla = CheckLayoutSymbolPinClick(mousePos.x, mousePos.y);
            if (bla) {
                Connections[UIselectedConnectionID].id1 = bla.id;
                Connections[UIselectedConnectionID].pin1 = bla.pin;
                renderLayout();
                return
            }

        } else if (Connections[UIselectedConnectionID].id2 === 0) {

            bla = CheckLayoutSymbolPinClick(mousePos.x, mousePos.y);
            if (bla) {
                Connections[UIselectedConnectionID].id2 = bla.id;
                Connections[UIselectedConnectionID].pin2 = bla.pin;
                renderLayout();
            }
        }

        if (Connections[UIselectedConnectionID].id1 && Connections[UIselectedConnectionID].id2) {
            //alert("Connection Created");
            CurrentToolStatus = "symbolPic";
            renderLayout();
        }


    }


    renderLayout();
}, false);


function UIaddSymbolButtonClick() {
    if (UIsymbolToAdd != "") {
        CurrentToolStatus = "addSymbol";
    }
    else {
        alert("You must select a symbol");
    }
}


function UIaddConnectionButtonClick() {
    for (x = 1; x <= MaxConnections; x++) {
        if (Connections[x].id1 === 0) {
            CurrentToolStatus = "addConnection";
            UIselectedConnectionID = x;
            break;
        }
    }

}


function UIshowSymbolLayoutInfo() {


    if (UIselectedSymbolID) {
        document.getElementById("LayoutID").value = UIselectedSymbolID;
        Layout[UIselectedSymbolID].UIshowProperties();
    }
    else {
        document.getElementById("LayoutID").value = UIselectedSymbolID;
        document.getElementById("SymbolID").value = 0;
        document.getElementById("SchematicX").value = 0;
        document.getElementById("SchematicY").value = 0;
        document.getElementById("SchematicRotation").value = 0;
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
        if (Layout[UIselectedSymbolID].SchematicRotation === -90) Layout[UIselectedSymbolID].SchematicRotation = 270;
        renderLayout();
        UIshowSymbolLayoutInfo();
    }

    if (ActionToBeTaken == "rotate right") {
        Layout[UIselectedSymbolID].SchematicRotation += 90;
        if (Layout[UIselectedSymbolID].SchematicRotation === 360) Layout[UIselectedSymbolID].SchematicRotation = 0;
        renderLayout();
        UIshowSymbolLayoutInfo();
    }
}


function CheckLayoutSymbolClick(x, y) {

    for (i = 1; i <= MaxLayout; i++) {
        if (Layout[i].DetectIfSymbolUnderXY(x, y)) {
            return i;
        }
    }
    return 0;
}

function CheckLayoutSymbolPinClick(x, y) {

    CheckLayoutSymbolPinClickMyPoint = new Point();
    CheckLayoutSymbolPinClickMyPoint.x = x;
    CheckLayoutSymbolPinClickMyPoint.y = y;
    CheckLayoutSymbolPinClickMyPoint.check = true;

    myReturn = new Object();


    for (x = 1; x <= MaxLayout; x++) {
        myReturn.pin = Layout[x].RenderLayoutPoints(CheckLayoutSymbolPinClickMyPoint);
        if (myReturn.pin) {
            myReturn.id = x;
            return myReturn;
        }
    }
    return false;
}


function UIdrawPin(point) {
    if (!point.x) ;
    context.beginPath();
    context.arc(point.x, point.y, 20, 0, 2 * Math.PI, false);
    context.fillStyle = point.collor;
    context.fill();
    context.closePath();
}

function UIdrawLine(point1, point2, collor) {

    context.lineWidth = 10;
    context.beginPath();
    if (collor != undefined) {
        context.strokeStyle = '#ff0000';
    } else {
        context.strokeStyle = "black";
    }
    context.moveTo(Number(point1.x), Number(point1.y));
    context.lineTo(Number(point2.x), Number(point2.y));
    context.stroke();
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
        Layout[x].RenderLayoutItem();
        Layout[x].RenderLayoutPoints();

    }

    for (x = 1; x <= MaxConnections; x++) {
        //console.log(Connections[x]);
        Connections[x].DrawMe();
    }
    UIdisplayConnectionTable();
    //renderLayoutItemPoints(UIselectedSymbolID);
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
    document.getElementById('SymbolPreviewImage').src = "./Symbols/" + UIsymbolToAdd + '-Symbol.png';
}

function UIaddItemToSelect(id, optionToAdd, value) {
    var option = document.createElement("option");
    if (optionToAdd === "") return;
    option.text = optionToAdd;
    option.value = value
    document.getElementById(id).add(option);
}

function UIexportImage() {

    if (canvas && context) {
        var img = canvas.toDataURL("image/png;base64;");
        //img = img.replace("image/png","image/octet-stream"); // force download, user would have to give the file name.
        // you can also use anchor tag with download attribute to force download the canvas with file name.
        window.open(img, "", "width=700,height=700");
    }
    else {
        alert("Can not export");
    }

}

function UIdisplayConnectionTable() {

    var table = document.getElementById("ConnectionTable");
    table.innerHTML = "";
    var row = table.insertRow(-1);
    row.insertCell(0).innerHTML = "Actions";
    row.insertCell(1).innerHTML = "id1";
    row.insertCell(2).innerHTML = "pin1";
    row.insertCell(3).innerHTML = "id2";
    row.insertCell(4).innerHTML = "pin2";
    row.insertCell(5).innerHTML = "Jogged";
    row.insertCell(6).innerHTML = "jogPosition";


    for (x = 1; x <= MaxConnections; x++) {

        if (Connections[x].id2) {

            var row = table.insertRow(-1);

            var bla = document.createElement("div");

            var button = document.createElement("button");
            button.innerHTML = "-";
            button.id = x;
            button.setAttribute("onClick", "Connections[" + x + "].remove();");
            bla.appendChild(button)

            var button = document.createElement("button");
            button.innerHTML = "Select";
            button.id = x;
            button.setAttribute("onClick", "Connections[" + x + "].Select();");
            bla.appendChild(button);
            row.insertCell(0).appendChild(bla);


            row.insertCell(1).innerHTML = Connections[x].id1;
            row.insertCell(2).innerHTML = Connections[x].pin1;
            row.insertCell(3).innerHTML = Connections[x].id2;
            row.insertCell(4).innerHTML = Connections[x].pin2;
            row.insertCell(5).innerHTML = Connections[x].jogged;
            row.insertCell(6).innerHTML = Connections[x].jogPosition;
        }

    }


}