var MaxSymbols = 50;
var MaxLayout = 100;
var MaxConnections = 100;
var CurrentToolStatus = "symbolPic";

var UIselectedSymbolID;
var UIselectedConnectionID;
var UIscale = .5;

var UISelectedLinePoint;
var AplicationModeSetting = "Schematic";

resolution = 20;

Connections = [];
Symbols = [];
Layout = [];
NetList = [];


function UIsetAplicationModeSetting() {
    AplicationModeSetting = document.getElementById("AplicationModeSetting").value;

    if (AplicationModeSetting === "Schematic") {
        ScematicModeStyle = "";
    } else {
        ScematicModeStyle = "none";
    }

    if (AplicationModeSetting === "Board Layout") {
        BoardLayoutModeStyle = "";
    } else {
        BoardLayoutModeStyle = "none";
    }

    document.getElementsByName("Schematic").forEach(function (item) {
        item.style.display = ScematicModeStyle;
    });

    document.getElementsByName("Board Layout").forEach(function (item) {
        item.style.display = BoardLayoutModeStyle;
    });
    renderLayout();


}


function UIsetCurrentToolStatus(mystatus) {
    CurrentToolStatus = mystatus;
    document.getElementById("CurrentToolStatus").value = CurrentToolStatus;
}

UIsetCurrentToolStatus("");

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

function NetItem() {
    this.deviceID = 0;
    this.deviceRefDesignator = "";
    this.devicePinID = "";
}

function CircuitSymbols() {
    this.delete = function () {
        this.Name = "";
        this.ReferenceDesignator = " ";
        this.Points = "";
        this.width = 0;
        this.height = 0;
        this.img = new Image();
        this.padsImg = new Image();
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


function CircuitNets() {
    this.netID = undefined;
    this.netItems = [];

}

function CircuitConnections() {
    this.id1 = 0;
    this.pin1 = "";
    this.id2 = 0;
    this.pin2 = "";

    this.netID = undefined;
    this.linePoints = [];


    console.log(this.linePoints);


    this.delete = function () {
        this.id1 = 0;
        this.pin1 = "";
        this.id2 = 0;
        this.pin2 = "";
        this.linePoints = [];


        return "deleted";
    };

    this.netCheck = function (otherConnection) {

        if (this.id1 === otherConnection.id1 && this.pin1 === otherConnection.pin1) return true;
        if (this.id1 === otherConnection.id2 && this.pin1 === otherConnection.pin2) return true;


        if (this.id2 === otherConnection.id1 && this.pin2 === otherConnection.pin1) return true;
        if (this.id2 === otherConnection.id2 && this.pin2 === otherConnection.pin2) return true;

        return false;
    };

    this.connected = function () {
        if (this.id1 && this.id2) return true;
        return false;
    };


    this.remove = function () {
        //deletes the item and rerenders
        this.delete();
        renderLayout();
    };


    this.DrawMe = function (collor, mypoint) {
        if (collor === "undefined") collor = "black";
        if (this.id2 === 0) return false;

        bla = Layout[this.id1].GivePointForPinID(this.pin1);


        if (Layout[this.id1].GivePointForPinID(this.pin1) === undefined || Layout[this.id2].GivePointForPinID(this.pin2) === undefined) return;

        olditem = new Point();
        olditem = Layout[this.id1].GivePointForPinID(this.pin1);

        //draw all points of the line
        pointClicked = false;

        this.linePoints.forEach(function (item, index) {

            if (mypoint) {
                mypoint.check = true;
                if (DetectIfPointClicked(mypoint, item)) {
                    pointClicked = index;

                }
            }

            item.collor = "blue";
            UIdrawPin(item);
            UIdrawLine(olditem, item, collor);
            olditem = item;

        });
        console.log(collor);
        UIdrawLine(olditem, Layout[this.id2].GivePointForPinID(this.pin2), collor);
        return pointClicked;

    };


    this.Select = function (bla) {
        UIselectedConnectionID = bla;
        renderLayout();
        this.DrawMe("red");

    };

    this.AddLinePoin = function (mypoint) {
        this.linePoints.push(mypoint);
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
        this.ReferenceDesignator = 0;
        this.SchematicX = 0;
        this.SchematicY = 0;
        this.SchematicRotation = 0;
        this.PadX = 0;
        this.PadY = 0;
        this.PadRotation = 0;
        return "deleted";
    };

    this.remove = function () {
        //deletes the item and rerenders
        this.delete();
        renderLayout();
    };

    this.moveSymbol = function (x, y) {
        this.SchematicX = parseInt(x);
        this.SchematicY = parseInt(y);
    };

    this.moveSymbolRelative = function (x, y) {
        this.SchematicX += parseInt(x);
        this.SchematicY += parseInt(y);
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

    this.movePadsRelative = function (x, y) {
        this.PadX += parseInt(x);
        this.PadY += parseInt(y);
    };

    this.DetectIfPadsUnderXY = function (x, y) {
        if (this.SymbolID <= 0 || Symbols[this.SymbolID].Name === "JUNCTION") return 0;

        wid = Symbols[this.SymbolID].padsImg.width;
        hei = Symbols[this.SymbolID].padsImg.height;

        if (this.PadRotation == 90 || this.PadRotation == 90) [wid, hei] = [hei, wid];

        if (x > this.PadX - wid / 2 && x < this.PadX + wid / 2 && y > this.PadY - hei / 2 && y < this.PadY + hei / 2) {

            return 1;

        }
        return 0;
    };


    this.UIshowProperties = function () {

        document.getElementById("SymbolID").value = this.SymbolID;
        document.getElementById("ReferenceDesignator").value = this.ReferenceDesignator;
        document.getElementById("SchematicX").value = this.SchematicX;
        document.getElementById("SchematicY").value = this.SchematicY;
        document.getElementById("SchematicRotation").value = this.SchematicRotation;

    };

    this.UIupdateFromProperties = function () {
        this.SymbolID = document.getElementById("SymbolID").value;
        this.ReferenceDesignator = document.getElementById("ReferenceDesignator").value;
        this.SchematicX = Number(document.getElementById("SchematicX").value);
        this.SchematicY = Number(document.getElementById("SchematicY").value);
        this.SchematicRotation = Number(document.getElementById("SchematicRotation").value);
    };

    this.RenderLayoutItem = function (collor) {
        if (this.SymbolID <= 0) return;

        drawRotatedImage(Symbols[this.SymbolID].img, this.SchematicX, this.SchematicY, this.SchematicRotation, collor);
    };


    this.RenderBoardLayoutItem = function (collor) {
        if (this.SymbolID <= 0 || Symbols[this.SymbolID].Name === "JUNCTION") return;

        drawRotatedImage(Symbols[this.SymbolID].padsImg, this.PadX, this.PadY, this.PadRotation, collor);
    };

    this.RenderLayoutPoints = function (checkIfPointClickedHack) {


        if (this.SymbolID <= 0) return;
        UIeditMode = "Symbol";


        pins = this.PinsListObject();


        for (var i = 0; i < pins.length; i++) {
            if (checkIfPointClickedHack != undefined) {
                //console.log("my point" , checkIfPointClickedHack);
                myTempppOint = this.SchematicSymbolPoint(pins[i]);


                if (DetectIfPointClicked(checkIfPointClickedHack, myTempppOint)) {

                    console.log(this.SchematicSymbolPoint(pins[i].name));
                    return this.SchematicSymbolPoint(pins[i].name);
                }

            }
            UIdrawPin(this.SchematicSymbolPoint(pins[i]));
        }
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


//Populate arraies with empty data
//or load data from localstorage
function UIloadStoredLayout() {

    for (x = 1; x <= MaxSymbols; x++) {
        Symbols[x] = new CircuitSymbols();

        Symbols[x].extend(BrowserStorage("Symbol", x, "Layout"));
        if (Symbols[x].Name !== "") {
            UIaddItemToSelect("SymbolListingForSelection", Symbols[x].Name, x);
            Symbols[x].img.src = "../../../storage/symbols/" + x + '-Symbol.png';
            Symbols[x].padsImg.src = "../../../storage/symbols/" + x + '-Pads.png';
        }


    }

    for (x = 1; x <= MaxConnections; x++) {
        Connections[x] = new CircuitConnections();
        console.log(Connections[x].linePoints);

        Connections[x].extend(BrowserStorage("Schematic", x, "Connection"));
        blabla = new Point();

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


function DetectIfPointClicked(pontA, pointB) {
    if (
        Number(pontA.x) <= pointB.x + resolution && Number(pontA.x) >= pointB.x - resolution &&
        Number(pontA.y) <= pointB.y + resolution && Number(pontA.y) >= pointB.y - resolution

    ) {
        return true;
    }
    else {
        return false;
    }

}


function UIMouseWheelHandler(e) {
    context.setTransform(1, 0, 0, 1, 0, 0);
    // cross-browser wheel delta
    var e = window.event || e;
    var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

    UIscale += .1 * delta;
    if (UIscale < .1) UIscale = .1;
    if (UIscale > 1.5) UIscale = 1.5;
    context.scale(UIscale, UIscale);
    renderLayout();
    document.getElementById("zoom").value = UIscale;
    return false;
}


function UIupdateZoom() {
    context.setTransform(1, 0, 0, 1, 0, 0);
    UIscale = document.getElementById("zoom").value;
    context.scale(UIscale, UIscale);
    renderLayout();
}


function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: (evt.clientX - rect.left) / UIscale,
        y: (evt.clientY - rect.top) / UIscale
    };
}

var canvas = document.getElementById('myCanvas');


window.addEventListener("keydown", doKeyDown, true);

function doKeyDown(e) {
    if (AplicationModeSetting === "Board Layout") {
        UIboardLayoutEngineKeyboardPress(e.keyCode)
    }
    //alert( e.keyCode );
    //detect escape key
    if (AplicationModeSetting === "Schematic") {
        if (e.keyCode === 27) {
            UIsetCurrentToolStatus("");
            UIselectedSymbolID = undefined;
            UIselectedConnectionID = undefined;
        }
        //detect delete key
        if (e.keyCode === 46) {
            UIsetCurrentToolStatus("");
            if (Connections[UIselectedConnectionID].linePoints.length === 1) Connections[UIselectedConnectionID].delete();

            Connections[UIselectedConnectionID].linePoints.splice(UISelectedLinePoint, 1);

        }
        renderLayout();
    }


}

canvas.addEventListener('mousewheel', UIMouseWheelHandler);
var context = canvas.getContext('2d');
context.scale(UIscale, UIscale);
canvas.addEventListener('contextmenu', function (e) {
    if (e.button === 2) {
        e.preventDefault();
        return false;
    }
}, false);
canvas.addEventListener('selectstart', function (e) {
    e.preventDefault();
    return false;
}, false);

var detextifdrag = new Object();

canvas.addEventListener('mousedown', function (evt) {
    detextifdrag = getMousePos(canvas, evt);
});


document.onwheel = function () {
    return false;
};
var mousePos;
canvas.addEventListener('mouseup', function (evt) {
    //exit current command on right click
    if (evt.button === 2) UIsetCurrentToolStatus("");
    mousePos = getMousePos(canvas, evt);
    console.log(detextifdrag, mousePos);
    UIdragDetect = true;

    mouseClickMidpointOnDrag = new Point();

    if (AplicationModeSetting === "Board Layout") {

        //UIselectedSymbolID = CheckLayoutSymbolClick(mousePos.x, mousePos.y);
        UIselectedSymbolID = CheckLayoutSymbolClick(detextifdrag.x, detextifdrag.y);
        UIshowSymbolLayoutInfo(UIselectedSymbolID);

        if (detextifdrag.x != mousePos.x || detextifdrag.y != mousePos.y) {
            UIdragDetect = true;
            detextifdrag.x = mousePos.x - detextifdrag.x;
            detextifdrag.y = mousePos.y - detextifdrag.y;

            UIsetCurrentToolStatus("moveSymbol");
        }


        if (CurrentToolStatus === "moveSymbol") {
            //UIselectedSymbolID = document.getElementById("LayoutID").value;
            if (Layout[UIselectedSymbolID] !== undefined) {

                if (UIdragDetect === true) {
                    //put code here to move symbol relative to click position and not center point.
                    Layout[UIselectedSymbolID].movePadsRelative(detextifdrag.x, detextifdrag.y)
                }


                UIshowSymbolLayoutInfo(UIselectedSymbolID);
                UIsetCurrentToolStatus("symbolPic");
            }

        }
    }


    if (AplicationModeSetting === "Schematic") {
        if (evt.button === 2) UIsetCurrentToolStatus("");


        if (CurrentToolStatus === "AddLinePoint") {
            Connections[UIselectedConnectionID].AddLinePoin(mousePos)
            UIsetCurrentToolStatus("");
        }


        UIselectedSymbolID = CheckLayoutSymbolClick(mousePos.x, mousePos.y);
        UIselectedConnectionID = CheckConnectionPointClick(mousePos);

        UIshowSymbolLayoutInfo(UIselectedSymbolID);


        if (detextifdrag.x != mousePos.x || detextifdrag.y != mousePos.y) {
            UIdragDetect = true;

            mouseClickMidpointOnDrag.x = (detextifdrag.x + mousePos.x) / 2;
            mouseClickMidpointOnDrag.y = (detextifdrag.y + mousePos.y) / 2;
            console.log(mouseClickMidpointOnDrag);

            UIselectedConnectionID = CheckConnectionPointClick(detextifdrag);

            if (UIselectedConnectionID && UISelectedLinePoint !== false) {
                Connections[UIselectedConnectionID].linePoints[UISelectedLinePoint] = mousePos;

            }


            bla = CheckLayoutSymbolPinClick(detextifdrag);
            if (bla !== CheckLayoutSymbolPinClick(detextifdrag) && CheckLayoutSymbolPinClick(mousePos)) {
                UIaddConnectionButtonClick();
                Connections[UIselectedConnectionID].id1 = bla.id;
                Connections[UIselectedConnectionID].pin1 = bla.pin;
                CurrentToolStatus = "addConnection";


            }
            else {
                UIselectedSymbolID = CheckLayoutSymbolClick(detextifdrag.x, detextifdrag.y);
                UIsetCurrentToolStatus("moveSymbol");
                detextifdrag.x = mousePos.x - detextifdrag.x;
                detextifdrag.y = mousePos.y - detextifdrag.y;

            }


        }


        if (CurrentToolStatus === "moveSymbol") {
            //UIselectedSymbolID = document.getElementById("LayoutID").value;
            if (Layout[UIselectedSymbolID] !== undefined) {

                if (UIdragDetect === true) {
                    //put code here to move symbol relative to click position and not center point.
                    Layout[UIselectedSymbolID].moveSymbolRelative(detextifdrag.x, detextifdrag.y)
                }
                else {
                    Layout[UIselectedSymbolID].moveSymbol(mousePos.x, mousePos.y)
                }

                UIshowSymbolLayoutInfo(UIselectedSymbolID);
                UIsetCurrentToolStatus("symbolPic");
            }

        }


        if (CurrentToolStatus === "addSymbol") {
            UIselectedSymbolID = "";

            for (x = 1; x <= MaxLayout; x++) {

                if (Layout[x].SymbolID === 0) {

                    UIselectedSymbolID = x;
                    Layout[x].SymbolID = UIsymbolToAdd;
                    Layout[x].ReferenceDesignator = Symbols[UIsymbolToAdd].ReferenceDesignator + x;


                    Layout[UIselectedSymbolID].moveSymbol(mousePos.x, mousePos.y);
                    UIshowSymbolLayoutInfo(UIselectedSymbolID);
                    UIsetCurrentToolStatus("symbolPic");

                    break;
                }

            }


            UIshowSymbolLayoutInfo(UIselectedSymbolID);
            UIsetCurrentToolStatus("symbolPic");
        }


        if (CurrentToolStatus === "addConnection") {
            if (Connections[UIselectedConnectionID].id1 === 0) {
                bla = CheckLayoutSymbolPinClick(mousePos);
                if (bla) {
                    Connections[UIselectedConnectionID].id1 = bla.id;
                    Connections[UIselectedConnectionID].pin1 = bla.pin;
                    renderLayout();
                    return
                }

            } else if (Connections[UIselectedConnectionID].id2 === 0) {

                bla = CheckLayoutSymbolPinClick(mousePos);
                if (Connections[UIselectedConnectionID].id1 == bla.id && Connections[UIselectedConnectionID].pin1 == bla.pin) {
                    renderLayout();
                    return;
                }
                if (bla) {
                    Connections[UIselectedConnectionID].id2 = bla.id;
                    Connections[UIselectedConnectionID].pin2 = bla.pin;
                    Connections[UIselectedConnectionID].AddLinePoin(mouseClickMidpointOnDrag);
                    renderLayout();
                }
            }

            if (Connections[UIselectedConnectionID].id1 && Connections[UIselectedConnectionID].id2) {

                UIsetCurrentToolStatus("symbolPic");
                renderLayout();
            }


        }

    }
    renderLayout();

}, false);

var UIsymbolToAdd = "";

function UISymbolAdderSelectClick(thing) {
    UIsymbolToAdd = thing;
    document.getElementById('SymbolPreviewImage').src = "../../../storage/symbols/" + UIsymbolToAdd + '-Symbol.png';
    UIaddSymbolButtonClick();
}


function UIaddSymbolButtonClick() {
    if (UIsymbolToAdd != "") {
        UIsetCurrentToolStatus("addSymbol");
    }
    else {
        alert("You must select a symbol");
    }
}


function UIaddConnectionButtonClick() {
    for (x = 1; x <= MaxConnections; x++) {
        if (Connections[x].id1 === 0) {
            UIsetCurrentToolStatus("addConnection");
            UIselectedConnectionID = x;
            break;
        }
    }

}


function UIshowSymbolLayoutInfo() {


    if (UIselectedSymbolID) {
        document.getElementById("LayoutID").value = UIselectedSymbolID;
        Layout[UIselectedSymbolID].UIshowProperties();
        document.getElementById("PadsLayoutRotateButtons").style.display = "";
    }
    else {
        document.getElementById("LayoutID").value = UIselectedSymbolID;
        document.getElementById("SymbolID").value = 0;
        document.getElementById("ReferenceDesignator").value = 0;
        document.getElementById("SchematicX").value = 0;
        document.getElementById("SchematicY").value = 0;
        document.getElementById("SchematicRotation").value = 0;
        document.getElementById("PadsLayoutRotateButtons").style.display = "none";
    }
    renderLayout();

}

function UIsymbolLayoutButtonClick(ActionToBeTaken) {


    if (AplicationModeSetting === "Board Layout") {
        if (ActionToBeTaken === "rotate left") {
            Layout[UIselectedSymbolID].PadRotation -= 90;
            if (Layout[UIselectedSymbolID].PadRotation === -90) Layout[UIselectedSymbolID].PadRotation = 270;
            renderLayout();
            UIshowSymbolLayoutInfo();
        }

        if (ActionToBeTaken === "rotate right") {
            Layout[UIselectedSymbolID].PadRotation += 90;
            if (Layout[UIselectedSymbolID].PadRotation === 360) Layout[UIselectedSymbolID].PadRotation = 0;
            renderLayout();
            UIshowSymbolLayoutInfo();
        }
    }


    if (AplicationModeSetting === "Schematic") {
        UIselectedSymbolID = document.getElementById("LayoutID").value;
        if (UIselectedSymbolID === "undefined" || UIselectedSymbolID === "" || UIselectedSymbolID === null) return;


        if (ActionToBeTaken == "delete") {
            Layout[UIselectedSymbolID].delete()
            renderLayout();
            UIshowSymbolLayoutInfo(UIselectedSymbolID);
        }


        if (ActionToBeTaken == "move") {
            UIsetCurrentToolStatus("moveSymbol");
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


}


function CheckLayoutSymbolClick(x, y) {

    if (AplicationModeSetting === "Board Layout") {
        for (i = 1; i <= MaxLayout; i++) {
            if (Layout[i].DetectIfPadsUnderXY(x, y)) {
                return i;
            }
        }
        return 0;

    }


    if (AplicationModeSetting === "Schematic") {
        for (i = 1; i <= MaxLayout; i++) {
            if (Layout[i].DetectIfSymbolUnderXY(x, y)) {
                return i;
            }
        }
        return 0;
    }


}


function CheckLayoutSymbolPinClick(CheckLayoutSymbolPinClickMyPoint) {

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


function CheckConnectionPointClick(myMousePos) {

    returnvalue = undefined;
    for (x = 1; x <= MaxConnections; x++) {
        bla = Connections[x].DrawMe("black", myMousePos);
        if (bla !== false) {
            UISelectedLinePoint = bla;
            returnvalue = x;
            return returnvalue;
        }
    }
    return false;
}

function UIdrawPin(point) {
    if (!point.x) return;
    context.beginPath();
    context.arc(point.x, point.y, 20, 0, 2 * Math.PI, false);
    context.fillStyle = point.collor;
    context.fill();
    context.closePath();
}

function UIdrawLine(point1, point2, collor) {

    context.lineWidth = 10;
    context.beginPath();
    if (!collor) {
        context.strokeStyle = "black";
    } else {
        context.strokeStyle = collor;
    }
    context.moveTo(Number(point1.x), Number(point1.y));
    context.lineTo(Number(point2.x), Number(point2.y));
    context.stroke();
}


function drawRotatedImage(image, x, y, angle, collor) {
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
    context.strokeStyle = "black";
    context.drawImage(image, -(image.width / 2), -(image.height / 2));
    context.setLineDash([6]);
    context.lineWidth = 1;
    if (collor) context.strokeStyle = collor;
    context.strokeRect(-(image.width / 2), -(image.height / 2), image.width, image.height);

    // and restore the co-ords to how they were when we began
    context.restore();
}

function renderLayout() {
    context.clearRect(0, 0, canvas.width, canvas.height);


    if (AplicationModeSetting === "Board Layout") {

        for (x = 1; x <= MaxLayout; x++) {
            if (UIselectedSymbolID === x) {
                collor = "red";
            } else {
                collor = "black";
            }

            Layout[x].RenderBoardLayoutItem(collor);
            //Layout[x].RenderLayoutPoints();

        }
        UIdisplayDevicesTable();
    }


    if (AplicationModeSetting === "Schematic") {

        for (x = 1; x <= MaxLayout; x++) {
            if (UIselectedSymbolID === x) {
                collor = "red";
            } else {
                collor = "black";
            }
            Layout[x].RenderLayoutItem(collor);
            Layout[x].RenderLayoutPoints();

        }

        for (x = 1; x <= MaxConnections; x++) {


            if (x === UIselectedConnectionID) {

                Connections[x].DrawMe("red");

            }
            else {

                Connections[x].DrawMe("black");
            }
        }
        UIdisplayConnectionTable();
        UIdisplayDevicesTable();
        //renderLayoutItemPoints(UIselectedSymbolID);
    }


}

function renderBoardLayout() {



    //renderLayoutItemPoints(UIselectedSymbolID);
}


function BrowserStorageStore(type, id, field, contents) {
    localStorage.setItem(type + "-" + id + "-" + field, contents);
}

function BrowserStorage(type, id, field) {
    if (localStorage.getItem(type + "-" + id + "-" + field)) {

        return localStorage.getItem(type + "-" + id + "-" + field);
    }
    return "";
}


function UIaddItemToSelect(id, optionToAdd, value) {
    var option = document.createElement("option");
    if (optionToAdd === "") return;
    option.text = optionToAdd;
    option.value = value;
    option.style.backgroundImage = "../../../../../../storage/symbols/21-Symbol.png" >
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

function UIdisplayDevicesTable() {

    var table = document.getElementById("DevicesTable");

    table.innerHTML = "";
    var row = table.insertRow(-1);
    row.insertCell(0).innerHTML = "Actions";
    row.insertCell(1).innerHTML = "ID";
    row.insertCell(2).innerHTML = "Ref Designator";


    for (x = 1; x <= MaxLayout; x++) {

        if (Layout[x].SymbolID) {

            var row = table.insertRow(-1);

            var bla = document.createElement("div");


            if (AplicationModeSetting === "Board Layout") {

            }


            if (AplicationModeSetting === "Schematic") {
                var button = document.createElement("button");
                button.innerHTML = "-";
                button.id = x;
                button.setAttribute("onClick", "Layout[" + x + "].remove();");
                bla.appendChild(button);
            }


            var button = document.createElement("button");
            button.innerHTML = "Select";
            button.id = x;
            button.setAttribute("onClick", "UIselectedSymbolID =" + x + "; UIshowSymbolLayoutInfo(UIselectedSymbolID) ;");
            bla.appendChild(button);
            row.insertCell(0).appendChild(bla);


            row.insertCell(1).innerHTML = x;
            row.insertCell(2).innerHTML = Layout[x].ReferenceDesignator;
            if (UIselectedSymbolID === x) {
                row.style.backgroundColor = "red";
                row.scrollIntoView(false);

            }
        }

    }


}


function UIdisplayConnectionTable() {
    document.getElementById("addPoint").style.display = "none";


    var table = document.getElementById("ConnectionTable");
    table.innerHTML = "";
    var row = table.insertRow(-1);


    row.insertCell(0).innerHTML = "Actions";
    row.insertCell(1).innerHTML = "id1";
    row.insertCell(2).innerHTML = "pin1";
    row.insertCell(3).innerHTML = "id2";
    row.insertCell(4).innerHTML = "pin2";
    row.insertCell(5).innerHTML = "Net ID";

    for (x = 1; x <= MaxConnections; x++) {

        if (Connections[x].id2) {

            var row = table.insertRow(-1);

            var bla = document.createElement("div");


            if (AplicationModeSetting === "Board Layout") {

            }


            if (AplicationModeSetting === "Schematic") {
                var button = document.createElement("button");
                button.innerHTML = "-";
                button.id = x;
                button.setAttribute("onClick", "Connections[" + x + "].remove();");
                bla.appendChild(button);
            }


            var button = document.createElement("button");
            button.innerHTML = "Select";
            button.id = x;
            button.setAttribute("onClick", "Connections[" + x + "].Select(" + x + ");");
            bla.appendChild(button);
            row.insertCell(0).appendChild(bla);


            row.insertCell(1).innerHTML = Layout[Connections[x].id1].ReferenceDesignator;
            row.insertCell(2).innerHTML = Connections[x].pin1;
            row.insertCell(3).innerHTML = Layout[Connections[x].id2].ReferenceDesignator;
            row.insertCell(4).innerHTML = Connections[x].pin2;
            row.insertCell(5).innerHTML = Connections[x].netID;


            if (UIselectedConnectionID === x) {
                row.style.backgroundColor = "red";
                document.getElementById("addPoint").style.display = "";
                row.scrollIntoView(false);
            }
        }

    }


}


function UIdisplayNetListTable() {

    var table = document.getElementById("NetListTable");
    table.innerHTML = "";
    var row = table.insertRow(-1);


    row.insertCell(0).innerHTML = "Net ID";
    row.insertCell(1).innerHTML = "Devices / Pin";
    i = 0;

    NetList.forEach(function (item, index) {
        i++;
        var row = table.insertRow(-1);
        row.insertCell(0).innerHTML = item.netID;
        bla = "";


        if (item.netItems) {
            item.netItems.forEach(function (item) {
                bla += item.deviceRefDesignator + " / " + item.devicePinID + "<br>";
            });
        }


        row.insertCell(1).innerHTML = bla;

    });


}

function UIgenerateNetList() {
    for (x = 1; x <= MaxConnections; x++) {
        Connections[x].netID = undefined;
    }

    netIdsCounter = 0;
    for (i = 1; i <= MaxConnections; i++) {
        for (x = 1; x <= MaxConnections; x++) {
            for (y = 1; y <= MaxConnections; y++) {
                if (Connections[x].connected() && Connections[y].connected()) {
                    if (Connections[x].netCheck(Connections[y])) {
                        newNetID = 0;
                        newNetIDx = 0;
                        newNetIDy = 0;

                        if (Connections[x].netID > 0) newNetIDx = Connections[x].netID;
                        if (Connections[y].netID > 0) newNetIDy = Connections[y].netID;

                        newNetID = Math.min(newNetIDx, newNetIDy);

                        if (newNetID === 0) {
                            netIdsCounter = netIdsCounter + 1;
                            newNetID = netIdsCounter;

                        }

                        Connections[x].netID = newNetID;
                        Connections[y].netID = newNetID;

                    }
                }
            }

        }
    }


    for (x = 1; x <= MaxConnections; x++) {
        if (Connections[x].connected()) {
            netID = Connections[x].netID;

            if (!NetList[netID]) NetList[netID] = new CircuitNets();
            NetList[netID].netID = netID;


            bla = new NetItem();
            bla.deviceID = Connections[x].id1;
            bla.devicePinID = Connections[x].pin1;
            bla.deviceRefDesignator = Layout[Connections[x].id1].ReferenceDesignator;
            if (bla.devicePinID !== "JUNCTION") NetList[netID].netItems.push(bla);


            bla = new NetItem();
            bla.deviceID = Connections[x].id2;
            bla.devicePinID = Connections[x].pin2;
            bla.deviceRefDesignator = Layout[Connections[x].id2].ReferenceDesignator;
            ;
            if (bla.devicePinID !== "JUNCTION") NetList[netID].netItems.push(bla);
            //NetList[netID].netItems = removeDuplicates(NetList[netID].netItems);

            NetList[netID].netItems = Array.from(new Set(NetList[netID].netItems.map(JSON.stringify))).map(JSON.parse)

        }


    }

    UIdisplayConnectionTable();
    UIdisplayNetListTable();
    //console.log(NetList);
}


function removeDuplicates(arr) {
    let unique_array = []
    for (let i = 0; i < arr.length; i++) {
        if (unique_array.indexOf(arr[i]) == -1) {
            unique_array.push(arr[i])
        }
    }
    return unique_array
}

renderLayout();
UIsetAplicationModeSetting();
