// 构造向量
export class Vector2D extends Array{
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
    get length(){
        return Math.hypot(this.x, this.y);
    }
    dir(){
        return Math.atan2(this.y, this.x);
    }
    // 归一化
    normalize(){
        return this.scale(1 / this.length);
    }
    // 倍数延长坐标向量
    scale(a) {
        this.x *= a;
        this.y *= a;
        return this;
    }
    // 坐标向量相加
    add(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }
    // 点乘
    dot(v){
        // (x0,y0)·(x1,y1)
        return this.x * v.x + this.y * v.y;
    }
    // 叉乘
    cross(v){
        // z轴分量的值
        return this.x * v.y - this.y * v.x;
    }
    // 复制坐标向量
    copy() {
        return new Vector2D(this.x, this.y);
    }
    // 旋转向量
    rotate(radius){
        const c = Math.cos(radius);
        const s = Math.sin(radius);
        const [x,y] = this;
        
        this.x = x * c - y * s;
        this.y = x * s + y * c;
        return this
    }
}