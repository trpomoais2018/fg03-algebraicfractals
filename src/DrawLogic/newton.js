import * as helpers from './helpers';

let complexBorders = {
    right: 3,
    left: -3,
    top: 2,
    bottom: -2,
};

let pointsData = [];
let attractors = [{x: 1, y: 0}, {x: -0.5, y: -0.86603}, {x: -0.5, y: 0.86603}];
let initialized = false;

let ctx;

let width;
let height;

let maxIterations;
let coloringCode;

const eps = 0.00001;

const init = () => {
    let canvas = document.getElementById('newton-canvas');
    ctx = canvas.getContext('2d');
    height = parseInt(canvas.getAttribute("height"));
    width = parseInt(canvas.getAttribute("width"));
    for (let i = 0; i < width; i++) {
        pointsData.push([]);
        for (let j = 0; j < height; j++) {
            pointsData[i].push({iterations: -1, attractor: -1})
        }
    }
    helpers.enableScaling(canvas, complexBorders, () => draw(maxIterations, coloringCode));
    initialized = true;
};


const drawFractal = (drawPixel) => {
    if (coloringCode === 0) drawClassic(drawPixel);
    if (coloringCode === 1) drawLevels(drawPixel);
    if (coloringCode === 2) drawZebra(drawPixel);
    if (coloringCode === 3) drawHybrid(drawPixel);
};

const drawClassic = (drawPixel) => {
    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            if (pointsData[i][j].iterations > 0 && pointsData[i][j].iterations <= maxIterations) {
                if (pointsData[i][j].attractor === 0)
                    drawPixel({r: 255, g: 0, b: 0}, i, j);
                if (pointsData[i][j].attractor === 1)
                    drawPixel({r: 0, g: 255, b: 0}, i, j);
                if (pointsData[i][j].attractor === 2)
                    drawPixel({r: 0, g: 0, b: 255}, i, j);
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
                let rgb = {r:0, g:0, b:0};
                if (n % 2 === 0) rgb = {r:255, g:255, b:255};
                drawPixel(rgb, i, j);
            }
        }
    }
};

const drawHybrid = (drawPixel) => {
    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            if (pointsData[i][j].iterations > 0 && pointsData[i][j].iterations <= maxIterations) {
                let brightness = getBrightness(i, j, maxIterations);
                if (pointsData[i][j].iterations > 0 && pointsData[i][j].iterations <= maxIterations) {
                    if (pointsData[i][j].attractor === 0)
                        drawPixel({r: brightness, g: 0, b: 0}, i, j);
                    if (pointsData[i][j].attractor === 1)
                        drawPixel({r: 0, g: brightness, b: 0}, i, j);
                    if (pointsData[i][j].attractor === 2)
                        drawPixel({r: 0, g: 0, b: brightness}, i, j);
                }
            }
        }
    }
};



const getBrightness = (i, j) => {
    let k = pointsData[i][j].iterations;
    return 255 * Math.log(1 + k) / Math.log(maxIterations);
};

export const draw = (maxIterationsAmount, coloringNumber) => {
    if (!initialized) init();
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
    let pointConverged = false;

    for (let k = 0; k < maxIterations; k++) {
        p = getNextPoint(p.x, p.y);
        for (let l = 0; l < attractors.length; l++) {
            if (helpers.getDistance(attractors[l], p) < eps) {
                pointConverged = true;
                pointsData[i][j].iterations = k;
                pointsData[i][j].attractor = l;
                break;
            }
        }
        if (pointConverged) break;
    }
    if (!pointConverged) {
        pointsData[i][j].iterations = -1;
        pointsData[i][j].attractor = -1;
    }
};

const getNextPoint = (x, y) => {
    let qx = x ** 2;
    let qy = y ** 2;
    return {
        x: 2 / 3 * x + (qx - qy) / (3 * (qx + qy) ** 2),
        y: 2 / 3 * y * (1 - x / ((qx + qy) ** 2))
    };
};

