var MaxSymbols = 50;
var MaxLayout = 100;
var MaxConnections = 100;
var CurrentToolStatus = "symbolPic";

var UIselectedSymbolID;
var UIselectedConnectionID;
var UIscale = .5;

var UISelectedLinePoint;
var UISelectedBoardLayoutNet;
var UISelectedBoardLayoutLine;

var AplicationModeSetting = "Schematic";

var movePointsTogether = false;


resolution = 20;

Connections = [];
Symbols = [];
Layout = [];
NetList = [];
BoardLayoutLines = [];


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
}


function boardLayoutPointsManager() {
    this.BoardLayoutPoints = [];


    this.AssignPoint = function (inputPoint, inputPointName) {
        myTempPoint = new Point();

        myTempPoint.x = inputPoint.x;
        myTempPoint.y = inputPoint.y;

        myTempPoint.name = inputPointName;

        myTempPoint.collor = "yellow";
        this.BoardLayoutPoints.push(myTempPoint);


    };


    this.RenderThePoints = function () {
        this.BoardLayoutPoints.forEach(function (element) {
            if (UISelectedBoardLayoutNet === element.name) element.collor = "blue";
            UIdrawPoint(element);
        });

    };


    this.DeleteThePoints = function () {
        delete this.BoardLayoutPoints;
        this.BoardLayoutPoints = [];

    };


}


function Line() {
    this.point1 = new Point();
    this.point2 = new Point();
    this.netID = 0;
    this.LineWidth = 5;

    this.drawMe = function () {
        UIdrawPin(this.point1);
        UIdrawPin(this.point2);
        UIdrawLine(this.point1, this.point2, this.collor);

    };

    this.CheckIfClick = function (checkzPoint, NewPointLocationFromDrag) {
        if (DetectIfPointClicked(checkzPoint, this.point1)) {
            if (NewPointLocationFromDrag !== undefined) {
                this.point1.x = NewPointLocationFromDrag.x;
                this.point1.y = NewPointLocationFromDrag.y;
            }


            return 1;
        }
        if (DetectIfPointClicked(checkzPoint, this.point2)) {
            if (NewPointLocationFromDrag !== undefined) {
                this.point2.x = NewPointLocationFromDrag.x;
                this.point2.y = NewPointLocationFromDrag.y;
            }

            return 2;
        }


    };


    this.CheckIfClickJustPoint = function (checkzPoint) {
        if (DetectIfPointClicked(checkzPoint, this.point1)) return 1;
        if (DetectIfPointClicked(checkzPoint, this.point2)) return 2;


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

        //bla = Layout[this.id1].GivePointForPinID(this.pin1);


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

        wid = Symbols[this.SymbolID].img.width;
        hei = Symbols[this.SymbolID].img.height;

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

        pins = this.PinsListObject();


        for (var i = 0; i < pins.length; i++) {
            if (checkIfPointClickedHack != undefined) {
                //console.log("my point" , checkIfPointClickedHack);

                if (AplicationModeSetting === "Schematic") {
                    myTempppOint = this.SchematicSymbolPoint(pins[i]);
                }

                if (AplicationModeSetting === "Board Layout") {
                    myTempppOint = this.PadsSymbolPoint(pins[i]);
                }


                if (DetectIfPointClicked(checkIfPointClickedHack, myTempppOint)) {


                    if (AplicationModeSetting === "Schematic") {
                        return this.SchematicSymbolPoint(pins[i].name);
                    }

                    if (AplicationModeSetting === "Board Layout") {
                        return this.PadsSymbolPoint(pins[i].name);
                    }
                }

            }

            if (AplicationModeSetting === "Schematic") {
                UIdrawPin(this.SchematicSymbolPoint(pins[i]));
            }

            if (AplicationModeSetting === "Board Layout") {
                UIdrawPin(this.PadsSymbolPoint(pins[i]));
            }

        }
    };


    this.GivePointForPinID = function (pinID) {
        pins = this.PinsListObject();

        for (var i = 0; i < pins.length; i++) {
            if (pins[i].name === pinID) return this.SchematicSymbolPoint(pins[i]);
        }
    };

    this.SchematicSymbolPoint = function (mypoint) {

        if (AplicationModeSetting === "Board Layout") {
            return this.PadsSymbolPoint(mypoint);
        }


        if (Number(this.SchematicRotation) === 0) {
            mypoint.x = mypoint.x - (Symbols[this.SymbolID].img.width / 2);
            mypoint.y = mypoint.y - (Symbols[this.SymbolID].img.height / 2);
        }


        if (Number(this.SchematicRotation) === 180) {
            mypoint.x = (Symbols[this.SymbolID].img.width / 2) - mypoint.x;
            mypoint.y = (Symbols[this.SymbolID].img.height / 2) - mypoint.y;
        }


        if (Number(this.SchematicRotation) === 90) {
            mypoint.x = mypoint.x - (Symbols[this.SymbolID].img.width / 2);
            mypoint.y = (Symbols[this.SymbolID].img.height / 2) - mypoint.y;
            [mypoint.x, mypoint.y] = [mypoint.y, mypoint.x];

        }

        if (Number(this.SchematicRotation) === 270) {
            mypoint.y = mypoint.y - (Symbols[this.SymbolID].img.height / 2);
            mypoint.x = (Symbols[this.SymbolID].img.width / 2) - mypoint.x;
            [mypoint.x, mypoint.y] = [mypoint.y, mypoint.x];

        }

        mypoint.x += this.SchematicX;
        mypoint.y += this.SchematicY;

        return mypoint;

    };


    this.PadsSymbolPoint = function (mypoint) {

        if (Number(this.PadRotation) === 0) {
            mypoint.x = mypoint.x - (Symbols[this.SymbolID].padsImg.width / 2);
            mypoint.y = mypoint.y - (Symbols[this.SymbolID].padsImg.height / 2);
        }


        if (Number(this.PadRotation) === 180) {
            mypoint.x = (Symbols[this.SymbolID].padsImg.width / 2) - mypoint.x;
            mypoint.y = (Symbols[this.SymbolID].padsImg.height / 2) - mypoint.y;
        }


        if (Number(this.PadRotation) === 90) {
            mypoint.x = mypoint.x - (Symbols[this.SymbolID].padsImg.width / 2);
            mypoint.y = (Symbols[this.SymbolID].padsImg.height / 2) - mypoint.y;
            [mypoint.x, mypoint.y] = [mypoint.y, mypoint.x];

        }

        if (Number(this.PadRotation) === 270) {
            mypoint.y = mypoint.y - (Symbols[this.SymbolID].padsImg.height / 2);
            mypoint.x = (Symbols[this.SymbolID].padsImg.width / 2) - mypoint.x;
            [mypoint.x, mypoint.y] = [mypoint.y, mypoint.x];

        }

        mypoint.x += this.PadX;
        mypoint.y += this.PadY;

        return mypoint;

    };


    this.PinsListObject = function () {

        pins = Symbols[this.SymbolID].Points.split('\n');
        var ListOfPoints = [];

        for (i = 0; i < pins.length; i++) {
            var bla = new Point();
            pins[i] = pins[i] + "|";
            bla.name = pins[i].split('|')[0];
            if (bla.name != "" && bla.name != undefined) {
                if (AplicationModeSetting === "Schematic") {
                    bla.x = pins[i].split('|')[1];
                    bla.y = pins[i].split('|')[2];
                    ListOfPoints.push(bla);


                }

                if (AplicationModeSetting === "Board Layout") {
                    bla.x = Number(pins[i].split('|')[3]);
                    bla.y = Number(pins[i].split('|')[4]);
                    ListOfPoints.push(bla);

                }
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


        Connections[x].extend(BrowserStorage("Schematic", x, "Connection"));
        blabla = new Point();

    }

    for (x = 1; x <= MaxLayout; x++) {
        Layout[x] = new CircuitLayout();
        Layout[x].extend(BrowserStorage("Schematic", x, "Layout"));
    }
    if (BrowserStorage("Schematic", 1, "BoardLines") !== "") {

        tempBoardLayoutLines = JSON.parse(BrowserStorage("Schematic", 1, "BoardLines"));


        tempBoardLayoutLines.forEach(function (item, index) {
            myTempLine = new Line();
            myTempLine.point1.x = item.point1.x;
            myTempLine.point1.y = item.point1.y;
            myTempLine.point2.x = item.point2.x;
            myTempLine.point2.y = item.point2.y;


            BoardLayoutLines.push(myTempLine);
        });
    }

}


function UIsaveStoredLayout() {

    for (x = 1; x <= MaxConnections; x++) {
        BrowserStorageStore("Schematic", x, "Connection", JSON.stringify(Connections[x]));
    }

    for (x = 1; x <= MaxLayout; x++) {
        BrowserStorageStore("Schematic", x, "Layout", JSON.stringify(Layout[x]));
    }

    BrowserStorageStore("Schematic", 1, "BoardLines", JSON.stringify(BoardLayoutLines));


}


UIloadStoredLayout();


function DetectIfPointClicked(pontA, pointB, myresolution) {
    var myresolution = myresolution || resolution;

    if (
        Number(pontA.x) <= pointB.x + myresolution && Number(pontA.x) >= pointB.x - myresolution &&
        Number(pontA.y) <= pointB.y + myresolution && Number(pontA.y) >= pointB.y - myresolution

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
        if (UISelectedBoardLayoutLine !== undefined){
            BoardLayoutLines.splice(UISelectedBoardLayoutLine, 1);
            UISelectedBoardLayoutLine = undefined;

            renderLayout();
        }

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
    if (AplicationModeSetting === "Draw Rectangles") {
        UIBoardLayoutEngineMouseDown(evt);

    }

    detextifdrag = getMousePos(canvas, evt);
});


document.onwheel = function () {
    return false;
};
var mousePos;
canvas.addEventListener('mouseup', function (evt) {
    //exit current command on right click
    if (evt.button === 2) {
        UIsetCurrentToolStatus("");

        UIselectedSymbolID = undefined;
        UIselectedConnectionID = undefined;
        UISelectedLinePoint = undefined;
        UISelectedBoardLayoutNet = undefined;
        UISelectedBoardLayoutLine = undefined;
    }
    mousePos = getMousePos(canvas, evt);
    console.log(detextifdrag, mousePos);
    UIdragDetect = false;

    mouseClickMidpointOnDrag = new Point();

    if (AplicationModeSetting === "Board Layout") {


        //UIselectedSymbolID = CheckLayoutSymbolClick(mousePos.x, mousePos.y);
        UIselectedSymbolID = CheckLayoutSymbolClick(detextifdrag.x, detextifdrag.y);
        UIshowSymbolLayoutInfo(UIselectedSymbolID);


        BoardLayoutLines.forEach(function (item, index) {
            bla = item.CheckIfClickJustPoint(mousePos);

            if (bla > 0) {
                UIsetCurrentToolStatus("");
                UISelectedBoardLayoutLine = index;

                return false;
            }
            //if (bla) alert(index + "  "+bla);
        });


        if (detextifdrag.x != mousePos.x || detextifdrag.y != mousePos.y) {
            UIdragDetect = true;


            if (CurrentToolStatus === "Add Board Line") {
                bla = new Line();

                point1 = new Point();
                point2 = new Point();

                point1.x = detextifdrag.x;
                point1.y = detextifdrag.y;

                point2.x = mousePos.x;
                point2.y = mousePos.y;


                bla.point1 = point1;
                bla.point2 = point2;
                BoardLayoutLines.push(bla);
                console.log(bla);
            }
            else {
                UIsetCurrentToolStatus("moveSymbol");

                //detect if line point clicked and move it.

                if (movePointsTogether) {
                    BoardLayoutLines.forEach(function (item, index) {
                        bla = item.CheckIfClick(detextifdrag, mousePos);

                        if (bla > 0) {
                            UIsetCurrentToolStatus("");
                            UISelectedBoardLayoutLine = index;
                            return true;
                        }
                        //if (bla) alert(index + "  "+bla);
                    });
                }
                else {
                    BoardLayoutLines.some(function (item, index) {
                        bla = item.CheckIfClick(detextifdrag, mousePos);

                        if (bla > 0) {
                            UIsetCurrentToolStatus("");
                            UISelectedBoardLayoutLine = index;
                            return true;
                        }
                        //if (bla) alert(index + "  "+bla);
                    });
                }


            }




            detextifdrag.x = mousePos.x - detextifdrag.x;
            detextifdrag.y = mousePos.y - detextifdrag.y;

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
            Connections[UIselectedConnectionID].AddLinePoin(mousePos);
            UIsetCurrentToolStatus("");
        }


        UIselectedSymbolID = CheckLayoutSymbolClick(mousePos.x, mousePos.y);
        UIselectedConnectionID = CheckConnectionPointClick(mousePos);

        UIshowSymbolLayoutInfo(UIselectedSymbolID);

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


        if (detextifdrag.x != mousePos.x || detextifdrag.y != mousePos.y) {
            UIdragDetect = true;

            mouseClickMidpointOnDrag.x = (detextifdrag.x + mousePos.x) / 2;
            mouseClickMidpointOnDrag.y = (detextifdrag.y + mousePos.y) / 2;
            console.log(mouseClickMidpointOnDrag);

            UIselectedConnectionID = CheckConnectionPointClick(detextifdrag);

            if (UIselectedConnectionID && UISelectedLinePoint !== false) {
                Connections[UIselectedConnectionID].linePoints[UISelectedLinePoint] = mousePos;
                UIsetCurrentToolStatus("");
                renderLayout();
                return;
            }


            bla = CheckLayoutSymbolPinClick(detextifdrag);
            if (bla !== CheckLayoutSymbolPinClick(detextifdrag) && CheckLayoutSymbolPinClick(mousePos)) {
                UIaddConnectionButtonClick();
                Connections[UIselectedConnectionID].id1 = bla.id;
                Connections[UIselectedConnectionID].pin1 = bla.pin;
                UIsetCurrentToolStatus("addConnection");


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
            Layout[UIselectedSymbolID].delete();
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

    context.globalCompositeOperation = "destination-over";
    context.beginPath();
    context.arc(point.x, point.y, 20, 0, 2 * Math.PI, false);
    context.fillStyle = point.collor;
    context.fill();
    context.closePath();
    context.globalCompositeOperation = "source-over";

}

function UIdrawPoint(point) {
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
    //context.lineCap = "round";
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
    context.clearRect(0, 0, 5000, 5000);


    if (AplicationModeSetting === "Board Layout") {

        for (x = 1; x <= MaxLayout; x++) {
            if (UIselectedSymbolID === x) {
                collor = "red";
            } else {
                collor = "black";
            }

            if (Layout[x].SymbolID && Symbols[Layout[x].SymbolID].Name && Symbols[Layout[x].SymbolID].Name !== "JUNCTION") {
                Layout[x].RenderBoardLayoutItem(collor);
                Layout[x].RenderLayoutPoints();
            }


        }


        oldBoardLayoutLines = BoardLayoutLines;


        BoardLayoutLines.forEach(function (item, index) {
            if (item.netID === UISelectedBoardLayoutNet) {
                item.collor = "red"
            } else {
                item.collor = "black"
            }
            item.drawMe();
        });
        BoardLayoutLines = oldBoardLayoutLines;

        UIdisplayDevicesTable();
        UIgenerateNetList();
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

allMyBoardLayoutPoints = new boardLayoutPointsManager();


function UIdisplayNetListTable() {


    var table = document.getElementById("NetListTable");
    table.innerHTML = "";
    var row = table.insertRow(-1);

    row.insertCell(0).innerHTML = "Action";
    row.insertCell(1).innerHTML = "Net ID";
    row.insertCell(2).innerHTML = "Devices / Pin";
    i = 0;

    NetList.forEach(function (item, index) {
        i++;
        var row = table.insertRow(-1);

        var bla = document.createElement("div");
        var button = document.createElement("button");
        button.innerHTML = "Select";
        button.id = x;
        button.setAttribute("onClick", "UISelectedBoardLayoutNet =" + item.netID + ";renderLayout();");
        bla.appendChild(button);
        row.insertCell(0).appendChild(bla);


        row.insertCell(1).innerHTML = item.netID;
        bla = "";

        myCurrentNetId = item.netID;

        if (item.netItems) {
            item.netItems.forEach(function (item) {
                bla += item.deviceRefDesignator + " / " + item.devicePinID + "<br>";
                allMyBoardLayoutPoints.AssignPoint(Layout[item.deviceID].GivePointForPinID(item.devicePinID), myCurrentNetId);
            });
        }


        row.insertCell(2).innerHTML = bla;


        if (UISelectedBoardLayoutNet === item.netID) {
            row.style.backgroundColor = "red";
            document.getElementById("addPoint").style.display = "";
            row.scrollIntoView(false);
        }

    });

    console.log(allMyBoardLayoutPoints);
    allMyBoardLayoutPoints.RenderThePoints();

}


function UIgenerateNetList() {
    for (x = 1; x <= MaxConnections; x++) {
        Connections[x].netID = undefined;
    }
    NetList = [];
    //BoardLayoutLines = [];
    //allMyBoardLayoutPoints.length = 0;
    delete allMyBoardLayoutPoints;

    allMyBoardLayoutPoints = new boardLayoutPointsManager();


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


function UIBoardCheckLayout() {
    console.log(BoardLayoutLines);
    result = "success"

// clear the net ids from all the lines
    BoardLayoutLines.forEach(function (itemB, indexB) {
        itemB.netID = undefined;
    });


    allMyBoardLayoutPoints.BoardLayoutPoints.forEach(function (elementA, indexA) {
        BoardLayoutLines.forEach(function (itemB, indexB) {
            if (LineWithWidthIntersectionWithPadDetection(elementA, itemB)) {
                if (itemB.netID === 0 || itemB.netID === undefined) itemB.netID = elementA.name;
                if (itemB.netID !== elementA.name) {
                    alert("point connection" + itemB.netID + "!==" + elementA.name);
                    result = "failure";
                    return false;

                }
            }
        });
    });


    BoardLayoutLines.forEach(function (itemA, indexA) {


        BoardLayoutLines.forEach(function (itemB, indexB) {
            if (LineWithWidthIntersectionDetection(itemA, itemB)) {
                if (itemB.netID === 0 || itemB.netID === undefined) itemB.netID = itemA.netID;
                if (itemA.netID === 0 || itemA.netID === undefined) itemA.netID = itemB.netID;


                if (itemB.netID !== itemA.netID) {
                    alert("line connection" + itemB.netID + "!==" + itemA.netID);
                    result = "failure";
                    return false;

                }
            }
        });

    });


    alert(result);

}

function offsetLine(origLineFromCall, offset) {
    x1 = Number(origLineFromCall.point1.x);
    y1 = Number(origLineFromCall.point1.y);
    x2 = Number(origLineFromCall.point2.x);
    y2 = Number(origLineFromCall.point2.y);


    function sq(a) {
        return a * a;
    }

    length = Math.sqrt(sq(x2 - x1) + sq(y2 - y1));

    offX = -(y2 - y1) / length * offset;
    offY = (x2 - x1) / length * offset;

    x1 += offX;
    y1 += offY;
    x2 += offX;
    y2 += offY;


    myNewLine = new Line();
    myNewPoint1 = new Point();
    myNewPoint2 = new Point();

    myNewPoint1.x = Number(x1);
    myNewPoint1.y = Number(y1);
    myNewPoint2.x = Number(x2);
    myNewPoint2.y = Number(y2);


    myNewLine.point1 = myNewPoint1;

    myNewLine.point2 = myNewPoint2;


    console.log(myNewLine);
    return myNewLine;

}

function LineWithWidthIntersectionWithPadDetection(point1, line2) {

    PadSizeCheck = 20;


    lineA = [];
    lineA[1] = new Line();
    lineA[1].point1.x = point1.x + PadSizeCheck;
    lineA[1].point1.y = point1.y + PadSizeCheck;

    lineA[1].point2.x = point1.x - PadSizeCheck;
    lineA[1].point2.y = point1.y + PadSizeCheck;

    lineA[2] = new Line();

    lineA[2].point1.x = point1.x + PadSizeCheck;
    lineA[2].point1.y = point1.y - PadSizeCheck;

    lineA[2].point2.x = point1.x - PadSizeCheck;
    lineA[2].point2.y = point1.y - PadSizeCheck;


    lineA[3] = new Line();
    lineA[3].point1 = lineA[1].point1;
    lineA[3].point2 = lineA[2].point1;


    lineA[4] = new Line();
    lineA[4].point1 = lineA[1].point2;
    lineA[4].point2 = lineA[2].point2;


    lineB = [];
    lineB[1] = offsetLine(line2, line2.LineWidth * 2);
    lineB[2] = offsetLine(line2, -(line2.LineWidth * 2));

    lineB[3] = new Line();
    lineB[3].point1 = lineB[1].point1;
    lineB[3].point2 = lineB[2].point1;

    lineB[4] = new Line();
    lineB[4].point1 = lineB[1].point2;
    lineB[4].point2 = lineB[2].point2;


    //console.log(lineA, lineB)

    found = 0;

    lineA.forEach(function (elementA, indexA) {
        //console.log(elementA);
        if (found > 0) return;

        if (indexA > 0) {
            lineB.forEach(function (elementB, indexB) {
                //console.log(elementB);
                if (indexB > 0) {
                    UIdrawLine(elementA.point1, elementA.point2);
                    UIdrawLine(elementB.point1, elementB.point2);
                    console.log(elementA, elementB);
                    if (isIntersectingLines(elementA, elementB) == 1) {
                        found += 1;
                        return false
                    }
                    ;
                }

            });
        }

    });

    return found;
}


function LineWithWidthIntersectionDetection(line1, line2) {
    console.log(line1, line2);


    lineA = [];
    lineA[1] = offsetLine(line1, line1.LineWidth * 2);
    lineA[2] = offsetLine(line1, -(line1.LineWidth * 2));

    lineA[3] = new Line();
    lineA[3].point1 = lineA[1].point1;
    lineA[3].point2 = lineA[2].point1;

    lineA[4] = new Line();
    lineA[4].point1 = lineA[1].point2;
    lineA[4].point2 = lineA[2].point2;


    lineB = [];
    lineB[1] = offsetLine(line2, line2.LineWidth * 2);
    lineB[2] = offsetLine(line2, -(line2.LineWidth * 2));

    lineB[3] = new Line();
    lineB[3].point1 = lineB[1].point1;
    lineB[3].point2 = lineB[2].point1;

    lineB[4] = new Line();
    lineB[4].point1 = lineB[1].point2;
    lineB[4].point2 = lineB[2].point2;


    //console.log(lineA, lineB)

    found = 0;

    lineA.forEach(function (elementA, indexA) {
        //console.log(elementA);
        if (found > 0) return;

        if (indexA > 0) {
            lineB.forEach(function (elementB, indexB) {
                //console.log(elementB);
                if (indexB > 0) {
                    UIdrawLine(elementA.point1, elementA.point2);
                    UIdrawLine(elementB.point1, elementB.point2);
                    console.log(elementA, elementB);
                    if (isIntersectingLines(elementA, elementB) == 1) {
                        found += 1;
                        return false
                    }
                    ;
                }

            });
        }

    });

    return found;
}


function isIntersectingLines(myLine1, myLine2) {
    p0x = Number(myLine1.point1.x);
    p0y = Number(myLine1.point1.y);
    p1x = Number(myLine1.point2.x);
    p1y = Number(myLine1.point2.y);
    p2x = Number(myLine2.point1.x);
    p2y = Number(myLine2.point1.y);
    p3x = Number(myLine2.point2.x);
    p3y = Number(myLine2.point2.y);


    s1x = p1x - p0x;
    s1y = p1y - p0y;
    s2x = p3x - p2x;
    s2y = p3y - p2y;


    s = (-s1y * (p0x - p2x) + s1x * (p0y - p2y)) / (-s2x * s1y + s1x * s2y);
    t = (s2x * (p0y - p2y) - s2y * (p0x - p2x)) / (-s2x * s1y + s1x * s2y);

    if (s >= 0 && s <= 1 && t >= 0 && t <= 1) return 1;

    return 0; // No collision
}

setTimeout(renderLayout, 3000);
renderLayout();
UIsetAplicationModeSetting();




