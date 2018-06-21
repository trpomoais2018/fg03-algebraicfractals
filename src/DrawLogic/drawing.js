import {draw as drawNewton} from './newton';
import {draw as drawMandelbrot} from './mandelbrot';



const drawFractal = (maxIterations, fractalTabId, coloringCode) => {
    if(fractalTabId === "newtonTab")
        drawNewton(maxIterations, coloringCode);
    else if (fractalTabId === "mandelbrotTab")
        drawMandelbrot(maxIterations, coloringCode);
};


export default drawFractal;