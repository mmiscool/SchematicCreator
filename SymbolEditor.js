var UIeditMode = "Symbol";
var UICurrentlySelectedPin = "";
var SymbolID = new URL(window.location.href).searchParams.get("id");

function UIsymbolButtonClick(ActionToBeTaken) {
    if (!ActionToBeTaken) return;

    if (ActionToBeTaken === "load") UIloadItem();
}


function UIloadItem() {

    document.getElementById("PinListing").innerHTML = "";
    context.clearRect(0, 0, canvas.width, canvas.height); //clear the canvas

    var lines = document.getElementById('TextPinListing').value.split('\n');
    for (var i = 0; i < lines.length; i++) {
        if (lines[i] != "") UIaddItemToSelect("PinListing", lines[i]);
    }

    var img = new Image();
    img.src = './symbols/' + SymbolID + "-" + UIeditMode + '.png';
    img.onload = function () {
        context.drawImage(img, 0, 0);
        UIDrawPins();
    }
    UIDrawPins();
}

function UIDrawPins() {

    var pins = document.getElementById("PinListing");

    var TotalPinListing = "";
    for (i = 0; i < pins.length; i++) {
        TotalPinListing += pins.options[i].text + '\n'

        if (UIeditMode == "Symbol") {
            PinX = pins.options[i].text.split('|')[1];
            PinY = pins.options[i].text.split('|')[2];
        }

        if (UIeditMode == "Pads") {
            PinX = pins.options[i].text.split('|')[3];
            PinY = pins.options[i].text.split('|')[4];
        }

        if (pins.options[i].text == UICurrentlySelectedPin) {
            PinCollor = "red"
        } else {
            PinCollor = "cyan";
        }

        UIdrawPin(PinX, PinY, PinCollor);


    }

    document.getElementById('TextPinListing').value = TotalPinListing;
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
