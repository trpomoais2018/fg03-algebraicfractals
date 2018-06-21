let canvas = document.getElementById("canvas");
let context = canvas.getContext('2d');
let image = context.createImageData(canvas.width, canvas.height);
let N, complexNumber,previousType;
let scaleFactor = {left: -2, top: -2, right: 2, bottom: 2, scale: 2};

let colors = {
    red: 0,
    green: 0,
    blue: 0,
    opacity: 255,
    st: function (i, j) {
        image.data[4 * (i + canvas.width * j) + 0] = this.red;
        image.data[4 * (i + canvas.width * j) + 1] = this.green;
        image.data[4 * (i + canvas.width * j) + 2] = this.blue;
        image.data[4 * (i + canvas.width * j) + 3] = this.opacity;
    },
    classical: function (atractor, i, j) {
        let color = atractor == 0 ? 0 : 255;
        this.red = this.green = this.blue = color;
        this.st(i, j);
    },
    levels: function (atractor, i, j) {
        let brightness = N > 1 ? 255 * Math.log(1 + atractor) / Math.log(N) : 0;
        this.red = this.green = this.blue = brightness;
        this.st(i, j);
    },
    zebra: function (atractor, i, j) {
        let color = atractor % 2 == 0 ? 0 : 255;
        this.red = this.green = this.blue = color;
        this.st(i, j);
    },
    classicalNewton: function (atractor, i, j) {
        this.red = this.green = this.blue = 0;
        if (atractor == 1) this.red = 255;
        if (atractor == 2) this.green = 255;
        if (atractor == 3) this.blue = 255;
        this.st(i, j);
    },
    hybridNewton: function (atractor, k, i, j) {
        this.red = this.green = this.blue = 0;
        if (atractor == 1) this.red = N > 1 ? 255 * k / (N - 1) : 255;
        if (atractor == 2) this.green = N > 1 ? 255 * k / (N - 1) : 255;
        if (atractor == 3) this.blue = N > 1 ? 255 * k / (N - 1) : 255;
        this.st(i, j);
    }
}

let fractalTypes = {
    cos: Math.cos(Math.PI / 3),
    sin: Math.sin(Math.PI / 3),
    epsilon: 0.0001,

    Mandelbrot: function (c) {
        let x = 0;
        let y = 0;
        let newX = 0;
        let newY = 0;
        for (let i = 0; i < N; i++) {
            newX = x * x - y * y + c.Re;
            newY = 2 * x * y + c.Im;
            if (newX * newX + newY * newY > 4)
                return i;
            x = newX;
            y = newY;
        }
        return 0;
    },
    Newton: function (complex) {
        return this.NewtonR(complex, 0, N);
    },
    NewtonR: function (c, iter, n) {
        if (n == 0) return {atractor: 0, iterNumber: iter};
        if (Math.abs(c.Re - 1) <= this.epsilon && c.Im <= this.epsilon) return {atractor: 1, iterNumber: iter};
        if (Math.abs(c.Re + this.cos) <= this.epsilon && Math.abs(c.Im - this.sin) <= this.epsilon) return {
            atractor: 2,
            iterNumber: iter
        };
        if (Math.abs(c.Re + this.cos) <= this.epsilon && Math.abs(c.Im + this.sin) <= this.epsilon) return {
            atractor: 3,
            iterNumber: iter
        };

        let a = c.Re * c.Re;
        let b = c.Im * c.Im;
        let nX = 2 * c.Re / 3 + (a - b) / (3 * Math.pow((a + b), 2));
        let nY = 2 * c.Im * (1 - c.Re / Math.pow((a + b), 2)) / 3;
        return this.NewtonR({Re: nX, Im: nY}, iter + 1, n - 1);
    },
    Julian: function (c) {
        let x = c.Re;
        let y = c.Im;
        let newX = 0;
        let newY = 0;
        for (let i = 0; i < N; i++) {
            if (x * x + y * y > 4)
                return i;
            newX = x * x - y * y + complexNumber.Re;
            newY = 2 * x * y + complexNumber.Im;
            x = newX;
            y = newY;
        }
        return 0;
    }
}

function creatFractal(type, color) {
    let atractor, atr;
    for (let x = 0; x < canvas.width; ++x) {
        for (let y = 0; y < canvas.height; ++y) {
            let point = getComplexPoint(x, y);
            switch (type) {
                case "N":
                    let a = fractalTypes.Newton(point);
                    atractor = a.iterNumber;
                    atr = a.atractor;
                    break;
                case "M":
                    atractor = fractalTypes.Mandelbrot(point);
                    break;
                case "J":
                    atractor = fractalTypes.Julian(point);
                    break;
            }
            switch (color) {
                case "CN":
                    colors.classicalNewton(atr, x, y);
                    break;
                case "C":
                    colors.classical(atractor, x, y);
                    break;
                case "L":
                    colors.levels(atractor, x, y);
                    break;
                case "Z":
                    colors.zebra(atractor, x, y);
                    break;
                case "HN":
                    colors.hybridNewton(atr, atractor, x, y);
                    break;
            }
        }
    }
    context.putImageData(image, 0, 0);
}

function getComplexPoint(x, y) {
    return {
        Re: (x * (scaleFactor.right - scaleFactor.left) / (canvas.width - 1)) + scaleFactor.left,
        Im: (y * (scaleFactor.bottom - scaleFactor.top) / (canvas.height - 1)) + scaleFactor.top
    }
}

function run() {
    complexNumber = {
        Re: parseFloat(document.getElementById("Re").value),
        Im: parseFloat(document.getElementById("Im").value)
    };
    N = parseInt(document.getElementById("N").value);
    creatFractal(Form.type.options[Form.type.selectedIndex].value, Form.color.options[Form.color.selectedIndex].value);
}

function configure() {
    let CN = document.getElementById("CN");
    let C = document.getElementById("C");
    let H = document.getElementById("HN");
    let R = document.getElementById("Re");
    let I = document.getElementById("Im");
    let type = Form.type.options[Form.type.selectedIndex].value;
    if (type.localeCompare(previousType) != 0) {
        switch (type) {
            case "N" :
                if (Form.color.value === "C")
                    Form.color.value = "CN";
                R.disabled = true;
                I.disabled = true;
                C.disabled = true;
                CN.disabled = false;
                H.disabled = false;
                break;
            case "M":
                if (Form.color.value === "CN" || Form.color.value === "HN")
                    Form.color.value = "C";
                R.disabled = true;
                I.disabled = true;
                C.disabled = false;
                CN.disabled = true;
                H.disabled = true;
                break;
            case "J":
                if (Form.color.value === "CN" || Form.color.value === "HN")
                    Form.color.value = "C";
                R.disabled = false;
                I.disabled = false;
                C.disabled = false;
                CN.disabled = true;
                H.disabled = true;
                break;
        }
        restoreScale();
        previousType = type;
    }
    run();
}

function getMousePos(canvas, evt) {
    let rect = canvas.getBoundingClientRect();
    let mouseCoords = {x: evt.clientX - rect.left, y: evt.clientY - rect.top};
    let x = mouseCoords.x * (scaleFactor.right - scaleFactor.left) / (canvas.width - 1) + scaleFactor.left;
    let y = mouseCoords.y * (scaleFactor.bottom - scaleFactor.top) / (canvas.height - 1) + scaleFactor.top;
    return {x: x, y: y};
}

function restoreScale() {
    scaleFactor = {left: -2, top: -2, right: 2, bottom: 2, scale: 2};
    run();
}

canvas.addEventListener("mousedown", function (evt) {
    let mousePos = getMousePos(canvas, evt);
    if (evt.button === 0) scaleFactor.scale /= 1.5;
    if (evt.button === 2) scaleFactor.scale *= 1.5;
    scaleFactor.left = mousePos.x - scaleFactor.scale;
    scaleFactor.top = mousePos.y - scaleFactor.scale;
    scaleFactor.right = mousePos.x + scaleFactor.scale;
    scaleFactor.bottom = mousePos.y + scaleFactor.scale;
    run();
})

addEventListener("change", configure);
addEventListener("load", configure);