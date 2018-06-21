import {draw as drawNewton} from './newton';
import {draw as drawMandelbrot} from './mandelbrot';
import {draw as drawJulia} from './julia';


const drawFractal = (maxIterations, fractalTabId, coloringCode, juliaC) => {
    if(fractalTabId === "newtonTab")
        drawNewton(maxIterations, coloringCode);
    else if (fractalTabId === "mandelbrotTab")
        drawMandelbrot(maxIterations, coloringCode);
    else if (fractalTabId === "juliaTab")
        drawJulia(maxIterations, coloringCode, juliaC);
};


export default drawFractal;