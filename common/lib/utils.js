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

// 异步加载图片
export function loadImage(src) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    return new Promise((resolve) => {
        img.onload = () => {
            resolve(img);
        };
        img.src = src;
    });
}
  
const imageDataContext = new WeakMap();
// 获得图片的 imageData 数据
export function getImageData(img, rect = [0, 0, img.width, img.height]) {
    let context;
    if(imageDataContext.has(img)) context = imageDataContext.get(img);
    else {
        const canvas = new OffscreenCanvas(img.width, img.height);
        context = canvas.getContext('2d');
        context.drawImage(img, 0, 0);
        imageDataContext.set(img, context);
    }
    return context.getImageData(...rect);
}

// 循环遍历 imageData 数据
export function traverse(imageData, pass) {
    const {width, height, data} = imageData;
    for(let i = 0; i < width * height * 4; i += 4) {
        const [r, g, b, a] = pass({
            r: data[i] / 255,//颜色归一化处理
            g: data[i + 1] / 255,
            b: data[i + 2] / 255,
            a: data[i + 3] / 255,
            index: i,
            width,
            height,
            x: ((i / 4) % width) / width,// 坐标点占x轴的比例（0-1）
            y: Math.floor(i / 4 / width) / height, // 坐标点占y轴的比例（0-1）
        });
        data.set([r, g, b, a].map(v => Math.round(v * 255)), i);
    }
    return imageData;
}

export function getPixel(imageData, index) {
    const {data} = imageData;
    const r = data[index] / 255,
        g = data[index + 1] / 255,
        b = data[index + 2] / 255,
        a = data[index + 3] / 255;
    return [r, g, b, a];
}


// 高斯权重矩阵（计算权重分布情况）
function gaussianMatrix(radius, sigma = radius / 3){
    // 高斯分布的一维公式
    const a = 1 / (Math.sqrt(2 * Math.PI) * sigma);
    const b = -1 / (2 * sigma ** 2);

    let sum = 0;
    const matrix = [];
    // 模糊半径内的所有像素点进行高斯分布权重计算
    for (let x = -radius; x <= radius; x++) {
        let g = a * Math.exp(b * x ** 2);
        matrix.push(g);
        sum += g;
    }
    // 所有像素点的权重之和为1
    for(let i = 0; i<matrix.length; i++){
        matrix[i] /= sum;
    }
    return { matrix, sum }
}

/**
  * 高斯模糊
  * @param  {Array} pixes  pix array
  * @param  {Number} width 图片的宽度
  * @param  {Number} height 图片的高度
  * @param  {Number} radius 取样区域半径, 正数, 可选, 默认为 3.0
  * @param  {Number} sigma 标准方差, 可选, 默认取值为 radius / 3
  * @return {Array}
  */
export function gaussianBlur(pixels, width, height, radius = 3, sigma = radius / 3){
    // 获取模糊半径范围内的高斯模糊权重矩阵
    const { matrix, sum } = gaussianMatrix(radius, sigma);

    // 1.对x方向做高斯模糊运算
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let r = 0, g = 0, b = 0;
            // 对高斯模糊半径范围内的x方向像素点进行计算
            for (let j = -radius; j <= radius; j++) {
                //像素点的范围
                const k = x + j;
                // 像素点的范围处于当前像素集合pixels范围内
                if(k > 0 && k < width){
                    // 当前要处理的第i个像素点
                    let i = (width * y + k) * 4;
                    // j + radius 是当前像素点的权重在权重矩阵中的位置
                    r += pixels[i] * matrix[j + radius];
                    g += pixels[i+1] * matrix[j + radius];
                    b += pixels[i+2] * matrix[j + radius];
                }
            }
            // 当前x方向的像素点在像素集合pixels中的位置
            const i = (width * y + x) * 4;
            // 除以 sum 是为了消除处于边缘的像素, 高斯运算不足的问题
            pixels[i] = r / sum;
            pixels[i+1] = g / sum;
            pixels[i+2] = b / sum;
            
        }
    }

    // 2.对y方向做高斯模糊运算
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            let r = 0, g = 0, b = 0;
            // 对高斯模糊半径范围内的x方向像素点进行计算
            for (let j = -radius; j <= radius; j++) {
                //像素点的范围
                const k = y + j;
                // 像素点的范围处于当前像素集合pixels范围内
                if(k > 0 && k < height){
                    // 当前要处理的第i个像素点
                    let i = (width * k + x) * 4;
                    // j + radius 是当前像素点的权重在权重矩阵中的位置
                    r += pixels[i] * matrix[j + radius];
                    g += pixels[i+1] * matrix[j + radius];
                    b += pixels[i+2] * matrix[j + radius];
                }
            }
            // 当前x方向的像素点在像素集合pixels中的位置
            const i = (width * y + x) * 4;
            // 除以 sum 是为了消除处于边缘的像素, 高斯运算不足的问题
            pixels[i] = r / sum;
            pixels[i+1] = g / sum;
            pixels[i+2] = b / sum;
        }
    }
    return pixels;
}

// 直角坐标影射为极坐标
export function toPolar(x, y) {
    const r = Math.hypot(x, y);
    const θ= Math.atan2(y, x);
    return [r, θ];
}

// 极坐标映射为直角坐标
export function fromPolar(r, θ) {
    const x = r * Math.cos(θ);
    const y = r * Math.sin(θ);
    return [x, y];
}
