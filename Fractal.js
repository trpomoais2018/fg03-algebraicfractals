let Scale = 0;
let Field = {
    left: 0,
    top: 0,
    right: 0,
    bottom: 0
};

function mousePress() {
    canvas.addEventListener("mousedown",
        function (e) {
            reScale(canvas, e);
        },
        false);
}

function reScale(canvas, e) {
    let mouseCoords = canvas.relMouseCoords(e);
    let x = mouseCoords.x * (Field.right - Field.left) / (canvas.width - 1) + Field.left;
    let y = mouseCoords.y * (Field.bottom - Field.top) / (canvas.height - 1) + Field.top;
    if (e.button === 0) {
        Scale /= 1.5;
    }
    if (e.button === 2) {
        Scale *= 1.5;
    }
    run(x, y);
}

function resetScale() {
    Scale = 2;
}

function run(centerX, centerY) {
    let fractalType = Choose.ChooseFractal.options[Choose.ChooseFractal.selectedIndex].value;
    let colorType = Choose.ChooseColor.options[Choose.ChooseColor.selectedIndex].value;
    Field.left = centerX - Scale;
    Field.top = centerY - Scale;
    Field.right = centerX + Scale;
    Field.bottom = centerY + Scale;
    let n = parseInt(document.getElementById('n').value);
    draw(n, fractalType, colorType);
}

function draw(n, fractalType, colorType) {
    let canvas = document.getElementById("canvas");
    let context = canvas.getContext('2d');
    let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    let width = canvas.width;
    let height = canvas.height;
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            let i = x * (Field.right - Field.left) / (width - 1) + Field.left;
            let j = y * (Field.bottom - Field.top) / (height - 1) + Field.top;
            let pointData = choseFractal(i, j, n, fractalType);
            let color = choseColor(pointData, n, fractalType, colorType);
            putColor(x, y, color, width, imageData);
        }
    }
    context.putImageData(imageData, 0, 0);
}

function choseFractal(x, y, n, fractalType) {
    switch (fractalType) {
        case 'newtonPool':
            return getNewtonAttractor(x, y, n, 0);
        case 'mandelbrotSet':
            return getMandelbrotAttractor(x, y, n);
        case 'juliaSet':
            let re = parseFloat(document.getElementById('re').value);
            let im = parseFloat(document.getElementById('im').value);
            return getJuliaAttractor(x, y, re, im, n);
    }
}

function getNewtonAttractor(x, y, n, itter) {
    let cos = Math.cos(Math.PI / 3);
    let sin = Math.sin(Math.PI / 3);

    if (n === 0)
        return {
            attr: 0,
            i: itter
        };
    if (isCloseToAttr(x, y, 1, 0))
        return {
            attr: 1,
            i: itter
        };
    if (isCloseToAttr(x, y, -cos, sin))
        return {
            attr: 2,
            i: itter
        };
    if (isCloseToAttr(x, y, -cos, -sin))
        return {
            attr: 3,
            i: itter
        };
    let x2 = x * x;
    let y2 = y * y;
    let x1 = 2 / 3 * x + (x2 - y2) / (3 * (x2 + y2) * (x2 + y2));
    let y1 = 2 / 3 * y * (1 - x / ((x2 + y2) * (x2 + y2)));
    return getNewtonAttractor(x1, y1, n - 1, itter + 1);
}

function isCloseToAttr(x1, y1, x2, y2) {
    return Math.abs(x2 - x1) <= 0.0001 && Math.abs(y2 - y1) <= 0.0001;
}

function getMandelbrotAttractor(x, y, n) {
    let x0 = 0;
    let y0 = 0;
    let x1 = 0;
    let y1 = 0;
    let k = 0;
    while (k < n) {
        x1 = x0 * x0 - y0 * y0 + x;
        y1 = 2 * x0 * y0 + y;
        if (x1 * x1 + y1 * y1 > 4)
            return {
                i: k
            };
        x0 = x1;
        y0 = y1;
        k++;
    }
    return {
        i: 0
    };
}

function getJuliaAttractor(x, y, re, im, n) {
    let x0 = x;
    let y0 = y;
    let x1 = 0;
    let y1 = 0;
    let k = 0;
    while (k < n) {
        if (x0 * x0 + y0 * y0 > 4)
            return {
                i: k
            };
        x1 = x0 * x0 - y0 * y0 + re;
        y1 = 2 * x0 * y0 + im;
        x0 = x1;
        y0 = y1;
        k++;
    }
    return {
        i: 0
    };
}

function choseColor(pointData, n, fractalType, colorType) {
    switch (colorType) {
        case 'classicPaint':
            return paintClassic(pointData, fractalType);
        case 'levelPaint':
            return paintLevels(n, pointData.i);
        case 'zebraPaint':
            return paintZebra(pointData.i);
        case 'newtonHybridPaint':
            return paintNewtonHybrid(pointData.attr, pointData.i, n)
    }
}

function paintClassic(point, fractalType) {
    if (fractalType === "newtonPool") {
        switch (point.attr) {
            case 0:
                return [0, 0, 0, 0];
            case 1:
                return [255, 0, 0, 255];
            case 2:
                return [0, 255, 0, 255];
            case 3:
                return [0, 0, 255, 255];
        }
    } else return point.i === 0 ? [0, 0, 0, 255] : [255, 255, 255, 255];
}

function paintLevels(n, itter) {
    let brightness = n > 1 ? 255 * itter * 4 / (n - 1) : 255;
    return [brightness, brightness, brightness, 255];
}

function paintZebra(itter) {
    let color;
    itter % 2 === 0 ? color = [0, 0, 0, 255] : color = [255, 255, 255, 255];
    return color;
}

function paintNewtonHybrid(attr, k, n) {
    let point = [0, 0, 0, 255];
    if (attr == 1) point[0] = n > 1 ? 255 * k / (n - 1) : 255;
    if (attr == 2) point[1] = n > 1 ? 255 * k / (n - 1) : 255;
    if (attr == 3) point[2] = n > 1 ? 255 * k / (n - 1) : 255;
    return point;
}

function putColor(x, y, color, width, imageData) {
    let index = (x + y * width) * 4;
    imageData.data[index + 0] = color[0];
    imageData.data[index + 1] = color[1];
    imageData.data[index + 2] = color[2];
    imageData.data[index + 3] = color[3];
}