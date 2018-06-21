import {draw as drawNewton} from './newton';



const drawFractal = (maxIterations, fractalTabId, coloringCode) => {

    if(fractalTabId === "newtonTab")
        drawNewton(maxIterations, coloringCode);
};


export default drawFractal;