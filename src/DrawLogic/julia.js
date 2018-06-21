import * as helpers from './helpers';

let complexBorders = {
    right: 3,
    left: -3,
    top: 2,
    bottom: -2,
};

let pointsData = [];
let initialized = false;

let ctx;

let width;
let height;

let juliaC;

let maxIterations;
let coloringCode;


const init = juliaConstant => {
    let canvas = document.getElementById('julia-canvas');
    juliaC = juliaConstant;
    ctx = canvas.getContext('2d');
    height = canvas.height;
    width = canvas.width;
    for (let i = 0; i < width; i++) {
        pointsData.push([]);
        for (let j = 0; j < height; j++) {
            pointsData[i].push({iterations: -1})
        }
    }
    helpers.enableScaling(canvas, complexBorders, () => draw(maxIterations, coloringCode, juliaC));
    initialized = true;
};


const drawFractal = (drawPixel) => {
    if (coloringCode === 0) drawClassic(drawPixel);
    if (coloringCode === 1) drawLevels(drawPixel);
    if (coloringCode === 2) drawZebra(drawPixel);
};

const drawClassic = (drawPixel) => {
    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            if (pointsData[i][j].iterations > 0 && pointsData[i][j].iterations <= maxIterations) {
                drawPixel({r: 0, g: 0, b: 0}, i, j);
            }
        }
    }
};

const drawLevels = (drawPixel) => {
    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            if (pointsData[i][j].iterations > 0 && pointsData[i][j].iterations <= maxIterations) {
                let brightness = getBrightness(i, j, maxIterations);
                drawPixel({r: brightness, g: brightness, b: brightness}, i, j);
            }
        }
    }
};

const drawZebra = (drawPixel) => {
    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            let n = pointsData[i][j].iterations;
            if (n > 0 && n <= maxIterations) {
                let rgb = {r: 0, g: 0, b: 0};
                if (n % 2 === 0) rgb = {r: 255, g: 255, b: 255};
                drawPixel(rgb, i, j);
            }
        }
    }
};


const getBrightness = (i, j) => {
    let k = pointsData[i][j].iterations;
    return 255 * Math.log(1 + k) / Math.log(maxIterations);
};

export const draw = (maxIterationsAmount, coloringNumber, juliaConstant) => {
    if (!initialized) init(juliaConstant);
    juliaC.real = juliaConstant.real;
    juliaC.imag = juliaConstant.imag;
    ctx.clearRect(0, 0, width, height);
    maxIterations = maxIterationsAmount;
    coloringCode = coloringNumber;

    let imageData = ctx.createImageData(width, height);
    let drawPixel = (rgb, i, j) => helpers.drawPixel(imageData, rgb, i, j, width);

    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            let p = helpers.getComplexPoint(i, j, complexBorders, width, height);
            expandPoint(maxIterations, p, i, j);
        }
    }
    drawFractal(drawPixel, maxIterations, coloringCode);
    ctx.putImageData(imageData, 0, 0);
};


const expandPoint = (maxIterations, p, i, j) => {
    let pointBailedOut = false;
    let prev = p;

    for (let k = 0; k < maxIterations; k++) {
        let next = getNextPoint(prev);
        if (Math.sqrt(next.x**2 + next.y**2) > 2){
            pointBailedOut = true;
            pointsData[i][j].iterations = k;
            break;
        }
        prev = next;
    }
    if (!pointBailedOut) {
        pointsData[i][j].iterations = -1;
    }
};

const getNextPoint = prev => {
    return {
        x: prev.x**2-prev.y**2 + juliaC.real,
        y: 2*prev.x*prev.y + juliaC.imag
    };
};

