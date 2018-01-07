function UIsymbolButtonClick(ActionToBeTaken) {
    if (!ActionToBeTaken) return;

    if (ActionToBeTaken === "load") UIloadItem();
}


function UIloadItem() {
    SymbolID = new URL(window.location.href).searchParams.get("id");


    var img = new Image();
    img.src = './symbols/' + SymbolID + '.png';
    img.onload = function () {
        context.drawImage(img, 0, 0);
    }


    document.getElementById("PinListing").innerHTML = "";


    var lines = document.getElementById('TextPinListing').innerHTML.split('\n');
    for (var i = 0; i < lines.length; i++) {
        if (lines[i] != "") UIaddItemToSelect("PinListing", lines[i]);
    }
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


    alert(mousePos.x + " " + mousePos.y);


    renderLayout();
}, false);


