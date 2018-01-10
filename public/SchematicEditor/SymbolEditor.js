var UIeditMode = "Symbol";
var UICurrentlySelectedPin = "";
var SymbolID = new URL(window.location.href).searchParams.get("id");


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

var SymbolObject = new CircuitSymbols();

SymbolObject.extend(BrowserStorage("Symbol", SymbolID, "Layout"));

document.getElementById("Name").value = SymbolObject.Name;

function UIsymbolButtonClick(ActionToBeTaken) {
    if (!ActionToBeTaken) return;

    if (ActionToBeTaken === "load") UIloadItem();

    if (ActionToBeTaken === "+") UInewPin();


    if (ActionToBeTaken === "-") UIremovePin();

    if (ActionToBeTaken === "rename") UIrenamePin();


}


function UIrenamePin() {
    OldPin = UICurrentlySelectedPin;
    OldPinID = UICurrentlySelectedPin.split('|')[0];

    NewPinID = prompt("Enter Pin ID", OldPinID);

    var x = document.getElementById("PinListing");
    x.remove(x.selectedIndex);
    UIDrawPins();
    UIloadItem();


    if (NewPinID != null) {
        UIaddItemToSelect("PinListing",
            NewPinID + "|"
            + OldPin.split('|')[1] + "|"
            + OldPin.split('|')[2] + "|"
            + OldPin.split('|')[3] + "|"
            + OldPin.split('|')[4] + "|")
    }
    UIDrawPins();


}


function UIremovePin() {
    var x = document.getElementById("PinListing");
    x.remove(x.selectedIndex);
    UIDrawPins();
    UIloadItem();

}

function UInewPin() {
    NewPinID = prompt("Enter Pin ID", "pin id");
    if (NewPinID != null) {
        UIaddItemToSelect("PinListing", NewPinID + "|50|50|50|50|");
    }
    UIDrawPins();

}


function UIloadItem() {

    document.getElementById("PinListing").innerHTML = "";
    context.clearRect(0, 0, canvas.width, canvas.height); //clear the canvas

    var lines = SymbolObject.Points.split('\n');
    for (var i = 0; i < lines.length; i++) {
        if (lines[i] != "") UIaddItemToSelect("PinListing", lines[i]);
    }

    var img = new Image();
    img.src = './symbols/' + SymbolID + "-" + UIeditMode + '.png';
    img.onload = function () {
        context.drawImage(img, 0, 0);
        UIDrawPins();

        SymbolObject.width = img.width;
        SymbolObject.height = img.height;

    }
    UIDrawPins();


}

function UIDrawPins() {

    var pins = document.getElementById("PinListing");

    var TotalPinListing = "";
    for (i = 0; i < pins.length; i++) {
        TotalPinListing += pins.options[i].text + '\n'

        if (UIeditMode === "Symbol") {
            PinX = pins.options[i].text.split('|')[1];
            PinY = pins.options[i].text.split('|')[2];
        }

        if (UIeditMode === "Pads") {
            PinX = pins.options[i].text.split('|')[3];
            PinY = pins.options[i].text.split('|')[4];
        }

        if (pins.options[i].text === UICurrentlySelectedPin) {
            PinCollor = "red"
        } else {
            PinCollor = "cyan";
        }

        UIdrawPin(PinX, PinY, PinCollor);


    }

    SymbolObject.Name = document.getElementById("Name").value;
    SymbolObject.Points = TotalPinListing;

    BrowserStorageStore("Symbol", SymbolID, "Layout", JSON.stringify(SymbolObject));

}

function UIdrawPin(PinX, PinY, Collor) {
    context.beginPath();
    context.arc(PinX, PinY, 3, 0, 2 * Math.PI, false);
    context.fillStyle = Collor;
    context.fill();
    context.closePath();
}


function UIsetEditMode(mode) {
    UIeditMode = mode;
    UIloadItem();
}


function UIpinSelectClick(selectedPin) {

    UICurrentlySelectedPin = selectedPin;
    UIDrawPins();
}


function UIaddItemToSelect(id, optionToAdd) {
    var option = document.createElement("option");
    option.text = optionToAdd;
    document.getElementById(id).add(option);
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

    var pins = document.getElementById("PinListing");
    for (i = 0; i < pins.length; i++) {


        if (pins.options[i].text == UICurrentlySelectedPin) {


            if (UIeditMode == "Symbol") {
                temp = pins.options[i].text;
                pins.options[i].text = temp.split('|')[0];
                pins.options[i].text += "|" + mousePos.x;
                pins.options[i].text += "|" + mousePos.y;
                pins.options[i].text += "|" + temp.split('|')[3];
                pins.options[i].text += "|" + temp.split('|')[4];

            }

            if (UIeditMode == "Pads") {
                temp = pins.options[i].text;
                pins.options[i].text = temp.split('|')[0];
                pins.options[i].text += "|" + temp.split('|')[1];
                pins.options[i].text += "|" + temp.split('|')[2];
                pins.options[i].text += "|" + mousePos.x;
                pins.options[i].text += "|" + mousePos.y;

            }
            UIDrawPins(); //need to save pins locations to textbox
            UIloadItem();
        }


    }


}, false);


UIloadItem();


function BrowserStorageStore(type, id, field, contents) {
    localStorage.setItem(type + "-" + id + "-" + field, contents);
}

function BrowserStorage(type, id, field) {
    if (localStorage.getItem(type + "-" + id + "-" + field)) {

        return localStorage.getItem(type + "-" + id + "-" + field);
    }
    return "";
}