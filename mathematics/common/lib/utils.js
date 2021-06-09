    /**
     * 2.设置向量
     * （1）设置x轴基向量(1,0)
     * （2）设置实际向量：
     *      a.设置x轴基向量一个旋转弧度r，这时基向量的坐标为（x*cosr-y*sinr,y*cosr+x*sinr）,动静坐标转换得到的公式
     *      b.将旋转后的向量，放大L倍，坐标为L（x*cosr-y*sinr,y*cosr+x*sinr）
     */
export class Vector2D extends Array {
    // 生成坐标向量
    constructor(x = 1, y = 0) {
        super(x, y);
    }
    set x(v) {
        this[0] = v;
    }
    set y(v) {
        this[1] = v;
    }
    get x() {
        return this[0];
    }
    get y() {
        return this[1];
    }
    get length() {
        // 计算向量的模
        return Math.hypot(this.x, this.y);
    }
    get dir() {
        // 计算向量的旋转的弧度
        return Math.atan2(this.y, this.x);
    }
    copy() {
        // 复制坐标向量
        return new Vector2D(this.x, this.y);
    }
    // 坐标向量相加
    add(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }
    // 坐标向量相减
    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }
    // 倍数延长坐标向量
    scale(a) {
        this.x *= a;
        this.y *= a;
        return this;
    }
    // 向量叉乘的模
    cross(v) {
        return this.x * v.y - v.x * this.y;
    }
    // 向量点乘的值
    dot(v) {
        return this.x * v.x + v.y * this.y;
    }
    // 向量归一化（向量除以向量的模）
    normalize() {
        return this.scale(1 / this.length);
    }
    // 向量旋转
    rotate(rad) {
        const c = Math.cos(rad),
        s = Math.sin(rad);
        const [x, y] = this;

        this.x = x * c + y * -s;
        this.y = x * s + y * c;

        return this;
    }
}

// 根据坐标点集合来绘制路径图形
export function draw(points, context, {
    strokeStyle = 'black',
    fillStyle = null,
    close = false,
} = {}) {
    context.strokeStyle = strokeStyle;
    context.beginPath();
    context.moveTo(...points[0]);
    for(let i = 1; i < points.length; i++) {
        context.lineTo(...points[i]);
    }
    if(close) context.closePath();
    if(fillStyle) {
        context.fillStyle = fillStyle;
        context.fill();
    }
    context.stroke();
}