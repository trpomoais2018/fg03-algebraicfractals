function drawFractal(context, size, screen, fractal) {
    context.clearRect(0, 0, size.width, size.height);
    let imageData = context.createImageData(size.width, size.height);
    for (let i = 0; i < size.height; i++) {
        for (let j = 0; j < size.width; j++) {
            let point = fromScreenToDecarde(screen, j, i, size);
            imageData = putColor(imageData, i, j, size.width, fractal.getColor(point));
        }
    }
    context.putImageData(imageData, 0, 0);
}

function putColor(imageData, y, x, height, color) {
    imageData.data[4 * (x + height * y) + 0] = color[0];
    imageData.data[4 * (x + height * y) + 1] = color[1];
    imageData.data[4 * (x + height * y) + 2] = color[2];
    imageData.data[4 * (x + height * y) + 3] = color[3];
    return imageData;
}

function fromScreenToDecarde(screen, x, y, size) {
    return {
        x: x * (screen.right - screen.left) / (size.width - 1) + screen.left,
        y: y * (screen.bottom - screen.top) / (size.height - 1) + screen.top
    };
}

