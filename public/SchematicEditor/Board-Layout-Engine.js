var lineOffset = 4;
var anchrSize = 2;

var mousedown = false;
var clickedArea = {box: -1, pos: 'o'};
var x1 = -1;
var y1 = -1;
var x2 = -1;
var y2 = -1;

var boxes = [];
var tmpBox = null;

var UIboardLayoutEngineSelectedBox;

function UIboardLayoutEngineKeyboardPress(myKey) {
    if (myKey === 46) boxes.splice(UIboardLayoutEngineSelectedBox, 1);
    redraw();
}


document.getElementById("canvas2").onmousedown = function (e) {
    mousedown = true;
    clickedArea = findCurrentArea(e.offsetX, e.offsetY);
    x1 = e.offsetX;
    y1 = e.offsetY;
    x2 = e.offsetX;
    y2 = e.offsetY;
};
document.getElementById("canvas2").onmouseup = function (e) {
    if (clickedArea.box == -1 && tmpBox != null) {
        boxes.push(tmpBox);
    } else if (clickedArea.box != -1) {
        var selectedBox = boxes[clickedArea.box];
        if (selectedBox.x1 > selectedBox.x2) {
            var previousX1 = selectedBox.x1;
            selectedBox.x1 = selectedBox.x2;
            selectedBox.x2 = previousX1;
        }
        if (selectedBox.y1 > selectedBox.y2) {
            var previousY1 = selectedBox.y1;
            selectedBox.y1 = selectedBox.y2;
            selectedBox.y2 = previousY1;
        }
    }
    console.log(clickedArea.box);
    UIboardLayoutEngineSelectedBox = clickedArea.box;
    clickedArea = {box: -1, pos: 'o'};
    tmpBox = null;
    mousedown = false;
    console.log(boxes);
    redraw();

};
document.getElementById("canvas2").onmouseout = function (e) {
    if (clickedArea.box != -1) {
        var selectedBox = boxes[clickedArea.box];
        if (selectedBox.x1 > selectedBox.x2) {
            var previousX1 = selectedBox.x1;
            selectedBox.x1 = selectedBox.x2;
            selectedBox.x2 > previousX1;
        }
        if (selectedBox.y1 > selectedBox.y2) {
            var previousY1 = selectedBox.y1;
            selectedBox.y1 = selectedBox.y2;
            selectedBox.y2 > previousY1;
        }
    }
    mousedown = false;
    clickedArea = {box: -1, pos: 'o'};
    tmpBox = null;
};
document.getElementById("canvas2").onmousemove = function (e) {
    if (mousedown && clickedArea.box == -1) {
        x2 = e.offsetX;
        y2 = e.offsetY;
        redraw();
    } else if (mousedown && clickedArea.box != -1) {
        x2 = e.offsetX;
        y2 = e.offsetY;
        xOffset = x2 - x1;
        yOffset = y2 - y1;
        x1 = x2;
        y1 = y2;

        if (clickedArea.pos == 'i' ||
            clickedArea.pos == 'tl' ||
            clickedArea.pos == 'l' ||
            clickedArea.pos == 'bl') {
            boxes[clickedArea.box].x1 += xOffset;
        }
        if (clickedArea.pos == 'i' ||
            clickedArea.pos == 'tl' ||
            clickedArea.pos == 't' ||
            clickedArea.pos == 'tr') {
            boxes[clickedArea.box].y1 += yOffset;
        }
        if (clickedArea.pos == 'i' ||
            clickedArea.pos == 'tr' ||
            clickedArea.pos == 'r' ||
            clickedArea.pos == 'br') {
            boxes[clickedArea.box].x2 += xOffset;
        }
        if (clickedArea.pos == 'i' ||
            clickedArea.pos == 'bl' ||
            clickedArea.pos == 'b' ||
            clickedArea.pos == 'br') {
            boxes[clickedArea.box].y2 += yOffset;
        }
        redraw();
    }
}

function redraw() {
    // canvas.width = canvas.width;
    var context = document.getElementById("canvas2").getContext('2d');
    context.clearRect(0, 0, 8000, 8000);
    context.beginPath();
    for (var i = 0; i < boxes.length; i++) {
        if (UIboardLayoutEngineSelectedBox === i) {
            drawBoxOn(boxes[i], context, "red");
        } else {
            drawBoxOn(boxes[i], context);
        }

    }

    if (clickedArea.box == -1) {
        tmpBox = newBox(x1, y1, x2, y2);
        if (tmpBox != null) {
            drawBoxOn(tmpBox, context);
        }
    }
}

function findCurrentArea(x, y) {
    for (var i = 0; i < boxes.length; i++) {
        var box = boxes[i];
        xCenter = box.x1 + (box.x2 - box.x1) / 2;
        yCenter = box.y1 + (box.y2 - box.y1) / 2;
        if (box.x1 - lineOffset < x && x < box.x1 + lineOffset) {
            if (box.y1 - lineOffset < y && y < box.y1 + lineOffset) {
                return {box: i, pos: 'tl'};
            } else if (box.y2 - lineOffset < y && y < box.y2 + lineOffset) {
                return {box: i, pos: 'bl'};
            } else if (yCenter - lineOffset < y && y < yCenter + lineOffset) {
                return {box: i, pos: 'l'};
            }
        } else if (box.x2 - lineOffset < x && x < box.x2 + lineOffset) {
            if (box.y1 - lineOffset < y && y < box.y1 + lineOffset) {
                return {box: i, pos: 'tr'};
            } else if (box.y2 - lineOffset < y && y < box.y2 + lineOffset) {
                return {box: i, pos: 'br'};
            } else if (yCenter - lineOffset < y && y < yCenter + lineOffset) {
                return {box: i, pos: 'r'};
            }
        } else if (xCenter - lineOffset < x && x < xCenter + lineOffset) {
            if (box.y1 - lineOffset < y && y < box.y1 + lineOffset) {
                return {box: i, pos: 't'};
            } else if (box.y2 - lineOffset < y && y < box.y2 + lineOffset) {
                return {box: i, pos: 'b'};
            } else if (box.y1 - lineOffset < y && y < box.y2 + lineOffset) {
                return {box: i, pos: 'i'};
            }
        } else if (box.x1 - lineOffset < x && x < box.x2 + lineOffset) {
            if (box.y1 - lineOffset < y && y < box.y2 + lineOffset) {
                return {box: i, pos: 'i'};
            }
        }
    }
    return {box: -1, pos: 'o'};
}

function newBox(x1, y1, x2, y2) {
    boxX1 = x1 < x2 ? x1 : x2;
    boxY1 = y1 < y2 ? y1 : y2;
    boxX2 = x1 > x2 ? x1 : x2;
    boxY2 = y1 > y2 ? y1 : y2;
    if (boxX2 - boxX1 > lineOffset * 2 && boxY2 - boxY1 > lineOffset * 2) {
        return {
            x1: boxX1,
            y1: boxY1,
            x2: boxX2,
            y2: boxY2,
            lineWidth: 1,
            color: 'DeepSkyBlue'
        };
    } else {
        return null;
    }
}

function drawBoxOn(box, context, collor) {
    xCenter = box.x1 + (box.x2 - box.x1) / 2;
    yCenter = box.y1 + (box.y2 - box.y1) / 2;

    if (collor === undefined) {
        context.strokeStyle = box.color;
        context.fillStyle = box.color;
    }
    else {
        context.strokeStyle = collor;
        context.fillStyle = collor;
    }


    context.fillRect(box.x1, box.y1, (box.x2 - box.x1), (box.y2 - box.y1));
    context.lineWidth = box.lineWidth;
    context.stroke();

    context.fillRect(box.x1 - anchrSize, box.y1 - anchrSize, 2 * anchrSize, 2 * anchrSize);
    context.fillRect(box.x1 - anchrSize, yCenter - anchrSize, 2 * anchrSize, 2 * anchrSize);
    context.fillRect(box.x1 - anchrSize, box.y2 - anchrSize, 2 * anchrSize, 2 * anchrSize);
    context.fillRect(xCenter - anchrSize, box.y1 - anchrSize, 2 * anchrSize, 2 * anchrSize);
    context.fillRect(xCenter - anchrSize, yCenter - anchrSize, 2 * anchrSize, 2 * anchrSize);
    context.fillRect(xCenter - anchrSize, box.y2 - anchrSize, 2 * anchrSize, 2 * anchrSize);
    context.fillRect(box.x2 - anchrSize, box.y1 - anchrSize, 2 * anchrSize, 2 * anchrSize);
    context.fillRect(box.x2 - anchrSize, yCenter - anchrSize, 2 * anchrSize, 2 * anchrSize);
    context.fillRect(box.x2 - anchrSize, box.y2 - anchrSize, 2 * anchrSize, 2 * anchrSize);
}


function UIBoarLayoutEngineCheckOverlaps() {
    for (var i = 0; i < boxes.length; i++) {
        for (var j = 0; j < boxes.length; j++) {
            if(boxes[i] && boxes[j] && i !== j){
                console.log(boxes[i], boxes[j]);
                console.log(boxOverlap(boxes[i], boxes[j]));
            }

         }
    }
}


//detect if lines overlap
function overlap(a, b, x, y) {
    return Math.max(a, x) < Math.min(b, y);
}


//detect if boxes overlap
function boxOverlap(a, b) {
    return overlap(a.x1, a.x2, b.x1, b.x2) && overlap(a.y1, a.y2, b.y1, b.y2);
}