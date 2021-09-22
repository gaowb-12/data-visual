// 构造向量
export class Vector extends Array{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
    get length(){
        return Math.hypot(this.x, this.y);
    }
    dir(){
        return Math.atan2(this.y, this.x);
    }
    // 倍数延长坐标向量
    scale(a) {
        this.x *= a;
        this.y *= a;
        this[0] = this.x;
        this[1] = this.y;
        return this;
    }
    normalize(){
        return this.scale(1 / this.length);
    }
    dot(){

    }
    cross(){

    }
    copy(){

    }
    rotate(radius){
        
    }
}