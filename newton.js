class Newton {
    constructor(colorType, maxIterCount, eps) {
        this.setColorType(colorType);
        this.maxIterCount = maxIterCount;
        this.eps = eps;
        this.atractors = [
            { x: -0.5, y: -0.86603 },
            { x: -0.5, y: 0.86603 },
            { x: 1, y: 0 }
        ];
    }

    setColorType(colorType) {
        this.colorType = ((colorType % 3) + 3) % 3;
    }

    getColor(point) {
        let k = 0;
        let currentPoint;
        for (; k < this.maxIterCount; k++) {
            currentPoint = this.getNextPoint(point);
            if (this.distanceOf(point, currentPoint) < this.eps) break;
            point = currentPoint;
        }
        point.iterCount = k;
        return this.selectColor(point);
    }

    getNextPoint(point) {
        let qx = point.x ** 2;
        let qy = point.y ** 2;
        return {
            x: 2 / 3 * point.x + (qx - qy) / (3 * (qx + qy) ** 2),
            y: 2 / 3 * point.y * (1 - point.x / (qx + qy) ** 2)
        };
    }

    selectColor(point) {
        switch (Number(this.colorType)) {
            case 0: return this.getClassicColor(point);
            case 1: return this.getLevelColor(point);
            case 2: return this.getZebraColor(point);
        }
    }

    getClassicColor(point) {
        let result = [0, 0, 0, 255];
        for (let i = 0; i < this.atractors.length; i++) {
            if (this.distanceOf(point, this.atractors[i]) < this.eps * 2) {
                result[i] = 255;
                return result;
            }
        }
        return [255, 255, 255, 255];
    }

    getLevelColor(point) {
        let brightness = this.maxIterCount > 1 ? 255 * Math.log(1 + point.iterCount) / Math.log(this.maxIterCount) : 0;
        return [0, 0, 0, 255 - brightness];
    }

    getZebraColor(point) {
        if (point.iterCount % 2 != 0) return [0, 0, 0, 255];
        return [255, 255, 255, 255];
    }

    distanceOf(firstPoint, secondPoint) {
        var delta = { x: firstPoint.x - secondPoint.x, y: firstPoint.y - secondPoint.y };
        return Math.sqrt(delta.x ** 2 + delta.y ** 2);
    }
}