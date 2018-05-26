let coords = { left : -2, right : 2, top : -2, bottom : 2 }
let centerCoords = { x : 0, y : 0 }
let scale = 2;

const EPSILON = 0.001;
const SIN60 = Math.sin(Math.PI / 3);
const COS60 = Math.cos(Math.PI / 3);

function start() {
  let inputParams = getUserInput();
  setCords(centerCoords.x - scale, centerCoords.x + scale, centerCoords.y - scale, centerCoords.y + scale);
  drawDractal(inputParams);
}

function drawDractal(inputParams) {
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext('2d');
  const height = parseInt(canvas.getAttribute("height"));
  const width = parseInt(canvas.getAttribute("width"));
  let image = context.createImageData(width, height);

  for (let i = 0; i < width; i++) {
    for(let j = 0; j < height; j++) {
      const point = convertToReadCoordinates(i, j, width, height);
      const attractor = getAttractorType(point, inputParams)
      const color = getColor(inputParams, attractor);
      fillColorToImage(image, color, i + width * j)
    }
  }
  context.putImageData(image, 0, 0);  
}

function fillColorToImage(image, color, shift) {
  image.data[4 * shift + 0] = color[0];
  image.data[4 * shift + 1] = color[1];
  image.data[4 * shift + 2] = color[2];
  image.data[4 * shift + 3] = color[3];
}

function getAttractorType(startPoint, inputParams) {
  switch(inputParams.fractal) {
    case 1:
      return getNewtoonAttractor(startPoint, inputParams.maxIter, 0);
    case 2:
      return getMandelbrotAttractor(startPoint, inputParams);
    case 3: 
      return getJuliaAttractor(startPoint, inputParams);
  }
}

function getColor(inputParams, attractor) {
  switch(inputParams.coloring) {
    case 1:
      return getClassicColor(inputParams, attractor);
    case 2:
      return getLevelColor(inputParams, attractor);
    case 3:
      return getZebraColor(inputParams, attractor);
    case 4:
      return getHybrydColor(inputParams, attractor);
  }
}

function getLevelColor(inputParams, attractor) {
  let color = 0;
  switch(inputParams.fractal) {
    case 1:
      color = inputParams.maxIter > 1 ? 255 * attractor.iterationAmount / (inputParams.maxIter - 1) : 0 
      return [color, color, color, 255];
    case 2:
      color = inputParams.maxIter > 1 ? 255 * attractor.iterationAmount / (inputParams.maxIter - 1) : 0 
      if (attractor.type === 1)
        color = 0;
      return [color, color, color, 255];
    case 3:
      color = inputParams.maxIter > 1 ? 255 * attractor.iterationAmount / (inputParams.maxIter - 1) : 0 
      return [color, color, color, 255];
  }
}

function getHybrydColor(inputParams, attractor) {
  const alpha = inputParams.maxIter > 1 ? 255 * attractor.iterationAmount / (inputParams.maxIter - 1) : 0;
  switch(attractor.type) {
    case 0:
      return [0, 0, 0, 255];
    case 1:
        return [255 + alpha, 0 + alpha, 0 + alpha, 255];
    case 2:
        return [0+ alpha, 255+ alpha, 0+ alpha, 255];
    case 3:
        return [0+ alpha, 0+ alpha, 255+ alpha, 255];
  }
}

function getZebraColor(inputParams, attractor) {
  let color = 0;
  switch (inputParams.fractal) {
    case 1:
      color = attractor.iterationAmount % 2 === 0 ? 255 : 0;
      return [color, color, color, 255]; 
    default:
      color = (attractor.type === 1 || attractor.iterationAmount % 2 === 0) ? 0 : 255;
      return [color, color, color, 255];
  }
}

function getClassicColor(inputParams, attractor) {
  if (inputParams.fractal === 1) {
    switch(attractor.type) {
      case 0:
        return [0, 0, 0, 0];
        break;
      case 1:
          return [255, 0, 0, 255];
          break;
      case 2:
          return [0, 255, 0, 255];
          break;
      case 3:
          return [0, 0, 255, 255];
          break;
    }
  } else { //if (inputParams.fractal === 2) 
      const color = attractor.type === 1 ? 0 : 255;
      return [color, color, color, 255];
  }
}

function getNewtoonAttractor(point, n, iterationAmount) {
  if (n === 0) 
    return { type : 0, iterationAmount : iterationAmount };
  else if (isConvergence(point.x, point.y, 1, 0)) 
    return { type : 1, iterationAmount : iterationAmount };
  else if (isConvergence(point.x, point.y, -COS60, SIN60))
    return { type : 2, iterationAmount : iterationAmount };
  else if (isConvergence(point.x, point.y, -COS60, -SIN60))
    return { type : 3, iterationAmount : iterationAmount };
  const x = point.x * point.x;
  const y = point.y * point.y;
  const nextX = 2 / 3 * point.x + (x - y) / (3 * (x + y) * (x + y));
  const nextY = 2 / 3 * point.y * (1 - point.x /((x + y) * (x + y)));
  const nextPoint = { x: nextX, y: nextY };
  return getNewtoonAttractor(nextPoint, n - 1, iterationAmount + 1); 
}

function getMandelbrotAttractor(startPoint, inputParams) {
  if (Math.sqrt(startPoint.x **2 + startPoint.y **2) > 2)
    return {type : 1, iterationAmount : 0};
  let point = {x : startPoint.x, y : startPoint.y}
  let x = 0;
  let y = 0;
  for(let i = 0; i < inputParams.maxIter; i++) {
    if (Math.sqrt(point.x **2 + point.y**2) > 2)
      return {type : 0, iterationAmount : i};
    x = point.x * point.x - point.y * point.y + startPoint.x;
    y = 2 * point.y * point.x + startPoint.y;
    point = {x : x, y : y};
  }
  return {type : 1, iterationAmount : inputParams.maxIter};
}

function getJuliaAttractor(startPoint, inputParams) {
  if (Math.sqrt(startPoint.x **2 + startPoint.y **2) > 2)
    return {type : 1, iterationAmount : 0};
  let point = {x : startPoint.x, y : startPoint.y}
  let x = 0;
  let y = 0;
  for(let i = 0; i < inputParams.maxIter; i++) {
    if (Math.sqrt(point.x **2 + point.y**2) > 2)
      return {type : 0, iterationAmount : i};
    x = point.x * point.x - point.y * point.y + inputParams.juliaConst.x;
    y = 2 * point.y * point.x + inputParams.juliaConst.y;
    point = {x : x, y : y};
  }
  return {type : 1, iterationAmount : inputParams.maxIter};
}


function convertToReadCoordinates(i, j, width, height) {
  const x = coords.left + i * (coords.right - coords.left) / (width - 1);
  const y = coords.top + j * (coords.bottom - coords.top) / (height - 1);
  return { x: x, y: y };
}

function setCords(left, right, top, bottom) {
  coords.left = left;
  coords.right = right;
  coords.top = top;
  coords.bottom = bottom;
}

function isConvergence(x1, y1, x2, y2) {
  const deltaX =Math.abs(x2 - x1);
  const deltaY =  Math.abs(y2 - y1);
  return  deltaX <= EPSILON && deltaY<= EPSILON;
}

function getUserInput() {
  const fractalType = parseInt(fractalsForm.fractal
                      .options[fractalsForm.fractal.selectedIndex].value);
  const coloringType = parseInt(fractalsForm.coloring
                      .options[fractalsForm.coloring.selectedIndex].value);
  const maxIter = parseInt(document.getElementById("maxIter").value);
  const juliaConst = { 
    x : parseFloat(document.getElementById("juliaX").value), 
    y : parseFloat(document.getElementById("juliaY").value) 
  };
  return { fractal : fractalType, coloring : coloringType, maxIter : maxIter, juliaConst : juliaConst };
}

function onMouseClick(canvas) {
 canvas.addEventListener("mousedown",
     function (e) {
        const mousePos = canvas.relMouseCoords(e);
        const i = mousePos.x * (coords.right - coords.left) / (canvas.width - 1) + coords.left;
        const j = mousePos.y * (coords.bottom - coords.top) / (canvas.height - 1) + coords.top;
        centerCoords.x = i;
        centerCoords.y = j;
        scale = e.button === 0 ? scale / 2 : scale * 2;
        start();
     },
     false);
     let slider = document.getElementById("maxIter");
     let output = document.getElementById("maxIterText");
     output.innerHTML = "N (max iter count) " + slider.value; 

     slider.oninput = function() {
        start();
        output.innerHTML = "N (max iter count) " + this.value;
     }
}