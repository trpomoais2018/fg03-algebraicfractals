class Mandelbrot {
    constructor(colorType, maxIterCount) {
        this.setColorType(colorType);
        this.maxIterCount = maxIterCount;
    }

    setColorType(colorType) {
        this.colorType = ((colorType % 3) + 3) % 3;
    }

    getColor(point) {
        if (this.distanceOf(point, {x: 0, y: 0}) > 2) return [0, 0, 0, 255];
        let k = 0;
        let currentPoint = point;
        for (; k < this.maxIterCount; k++) {
            let distance = this.distanceOf({x: 0, y: 0}, currentPoint);
            if (distance > 2) break;
            currentPoint = this.getNextPoint(currentPoint, point);
        }
        currentPoint.iterCount = k - 1;
        return this.selectColor(currentPoint);
    }

    selectColor(point) {
        switch (Number(this.colorType)) {
            case 0: return this.getClassicColor(point);
            case 1: return this.getLevelColor(point);
            case 2: return this.getZebraColor(point);
        }
    }

    getClassicColor(point) {
        let distance = this.distanceOf(point, {x: 0, y: 0});
        if (distance < 2) return [0, 0, 0, 255];
        return [255, 255, 255, 255];
    }

    getLevelColor(point) {
        let brightness = this.maxIterCount > 1 ? 255 * Math.log(1 + point.iterCount) / Math.log(this.maxIterCount) : 0;
        return [0, 0, 0, brightness];
    }

    getZebraColor(point) {
        if (point.iterCount % 2 != 0) return [0, 0, 0, 255];
        return [255, 255, 255, 255];
    }

    getNextPoint(currentPoint, point) {
        return {
            x: currentPoint.x ** 2 - currentPoint.y ** 2 + point.x,
            y: 2 * currentPoint.x * currentPoint.y + point.y
        };
    }

    distanceOf(firstPoint, secondPoint) {
        var delta = { x: firstPoint.x - secondPoint.x, y: firstPoint.y - secondPoint.y };
        return Math.sqrt(delta.x ** 2 + delta.y ** 2);
    }
}