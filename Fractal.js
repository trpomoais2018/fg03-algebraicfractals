function setOfVariables() {
    this.left = -2;
    this.top = 2;
    this.right = 2;
    this.bottom = -2;
    this.width = 600;
    this.height = 600;
    this.n;
    this.color;
    this.method;
    this.a;
    this.b;
    this.getComplexCoordinats = function (x, y) {
        var i = x * (this.right - this.left) / (this.width - 1) + this.left;
        var j = y * (this.bottom - this.top) / (this.height - 1) + this.top;
        return { x: i, y: j };
    };
    this.read = function () {
        this.n = Number(document.getElementById("iter").value);
        this.color = Number(document.getElementById("color").value);
        this.method = Number(document.getElementById("method").value);
        this.a = Number(document.getElementById("x").value);
        this.b = Number(document.getElementById("y").value);
        return this;
    }
    this.whatMethod = function (x, y) {
        switch (this.method) {
            case 0: return getNewtonIteration(x, y, 0, this.n);
                break;
            case 1: return getMandelbrotIteration(x, y, this.n);
                break;
            case 2: return getJuliaIteration(x, y, this.a, this.b, this.n);
                break;
        }
    }
    this.whatColouring = function (at, ar) {
        switch (this.color) {
            case 0:
                if (this.method == 0)
                    return classical(at);
                else
                    return classic(ar);
                break;
            case 1: return level(ar);
                break;
            case 2: return zebra(ar);
                break;
            case 3: return gibrid(at, ar);
                break;
        }
    }
}
var param = new setOfVariables();

function draw() {
    param.read();
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext('2d');
    var imageData = context.createImageData(param.width, param.height);
    for (var i = 0; i < param.width; ++i)
        for (var j = 0; j < param.height; ++j) {
            var p = param.getComplexCoordinats(i, j);
            var attractor;
            var marker;

            attractor = param.whatMethod(p.x, p.y);
            if (param.method == 0) {
                var attract = attractor.at;
                var attractor = attractor.it;
            }

            marker = param.whatColouring(attract, attractor);

            imageData.data[4 * (i + canvas.width * j) + 0] = marker.r;
            imageData.data[4 * (i + canvas.width * j) + 1] = marker.g;
            imageData.data[4 * (i + canvas.width * j) + 2] = marker.b;
            imageData.data[4 * (i + canvas.width * j) + 3] = marker.op;
        }
    context.putImageData(imageData, 0, 0);
}

var cl = document.getElementById('canvas');
cl.addEventListener('click', getClickXY, false);

function getClickXY(event) {
    var clickX = (event.layerX == undefined ? event.offsetX : event.layerX) + 1;
    var clickY = (event.layerY == undefined ? event.offsetY : event.layerY) + 1;
    var ox, oy;
    var click = document.getElementById("zoom");
    if (click.value === "0") {
        ox = param.width / 4;
        oy = param.height / 4;
    }
    else if (click.value === "1") {
        ox = param.width * 2;
        oy = param.height * 2;
    }
    var left = clickX - ox;
    var top = clickY - oy;
    var right = clickX + ox;
    var bottom = clickY + oy;
    var point1 = param.getComplexCoordinats(left, top);
    var point2 = param.getComplexCoordinats(right, bottom);
    param.left = point1.x;
    param.top = point1.y;
    param.right = point2.x;
    param.bottom = point2.y;
    draw();
}
////////////////////////////////////////////////////
function zebra(n) {
    if (n % 2 == 0) { return { r: 0, g: 0, b: 0, op: 255 }; }
    else { return { r: 255, g: 255, b: 255, op: 255 }; }
}

function level(n) {
    var k = n;
    n = param.n;
    var brightness = 0;
    if (n > 1) { brightness = 255 * k / (n - 1); }
    else { brightness = 255; }

    return { r: 0, g: 0, b: 0, op: 255 - brightness};
}

function classic(d) {
    if (d == 0) { return { r: 0, g: 0, b: 0, op: 255 }; }
    else { return { r: 255, g: 255, b: 255, op: 255 }; }
}

function classical(attractor) {
    var opacity = 255;
    var red = 0;
    var green = 0;
    var blue = 0;

    switch (attractor) {
        case 1: red = 255;
            break;
        case 2: green = 255;
            break;
        case 3: blue = 255;
            break;
    }
    return { r: red, g: green, b: blue, op: opacity };
}

function gibrid(attractor, n) {
    var opacity = 255;
    var red = 0;
    var green = 0;
    var blue = 0;
    var k = n;
    n = param.n;
    var color = 255 * k / (n - 1);
    switch (attractor) {
        case 1:
            red = n != 0 ? color : 255;
            break;
        case 2:
            green = n != 0 ? color : 255;
            break;
        case 3:
            blue = n != 0 ? color : 255;
            break;
    }
    return { r: red, g: green, b: blue, op: opacity };
}
////////////////////////////////////////////////////////////////
function getJuliaIteration(x0, y0, a, b, n) {
    var x = x0;
    var y = y0;
    var newX = 0;
    var newY = 0;
    var count = 0;
    while (count < n) {
        if (x * x + y * y > 4)
            return count;
        newX = x * x - y * y + a;
        newY = 2 * x * y + b;
        x = newX;
        y = newY;
        count++;
    }
    return 0;
}
/////////////////////////////////////////////////////////////
function getMandelbrotIteration(a, b, n) {
    var x = 0;
    var y = 0;
    var newX = 0;
    var newY = 0;
    var count = 0;
    while (count < n) {
        newX = x * x - y * y + a;
        newY = 2 * x * y + b;
        if (newX * newX + newY * newY > 4)
            return count;
        x = newX;
        y = newY;
        count++;
    }
    return 0;
}
//////////////////////////////////////////////////////////
cos60 = Math.cos(Math.PI / 3);
sin60 = Math.sin(Math.PI / 3);

function getNewtonIteration(x, y, iter, n) {
    if (n == 0) return { at: 0, it: iter };
    if (neighboringPoint(x, y, 1, 0)) return { at: 1, it: iter };
    if (neighboringPoint(x, y, -cos60, sin60)) return { at: 2, it: iter };
    if (neighboringPoint(x, y, -cos60, -sin60)) return { at: 3, it: iter };
    var a = x * x;
    var b = y * y;
    var newX = 2 * x / 3 + (a - b) / (3 * Math.pow((a + b), 2));
    var newY = 2 * y * (1 - x / Math.pow((a + b), 2)) / 3;
    return getNewtonIteration(newX, newY, iter + 1, n - 1);
}

function neighboringPoint(x1, y1, x2, y2) {
    var epsilon = 0.0001;
    return Math.abs(x1 - x2) <= epsilon && Math.abs(y1 - y2) <= epsilon;
}