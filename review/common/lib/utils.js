// 加载图片的函数
export async function loadImg(src){
    const img = new Image();
    img.crossOrigin = "anonymous";
    return new Promise((resolve)=>{
        img.onload = function(){
            resolve(img);
        }
        img.src = src;
    });
}

// 获取图片的剪裁区数据
const imageDataContext = new WeakMap();
export function getImageData(img, rect = [0, 0, img.width, img.height]){
    let context;
    if(imageDataContext.has(img)) context = imageDataContext.get(img);
    else{
        const canvas = new OffscreenCanvas(img.width, img.height);
        context = canvas.getContext("2d");
        context.drawImage(img, 0, 0);
        imageDataContext.set(img, context);
    }
    return context.getImageData(...rect);
}

// 处理图片像素
export function traverse(imageData, pass){
    const { width, height, data } = imageData;
    
    for (let i = 0; i < data.length; i += 4) {
        const [r, g, b, a] = pass({
            r: data[i] / 255,
            g: data[i + 1] / 255,
            b: data[i + 2] / 255,
            a: data[i + 3] / 255,
            index: i,
            x: (i/ 4 % width) / width,
            y: Math.floor(i/ 4 / width) / height,
        });
        data.set([r, g, b, a].map(v => Math.round(v * 255)), i);
    }
    return imageData;
}

// 灰度化矩阵（0<p<1，p=1 完全灰度化）
export function grayMatrix(p){
    const r = 0.2126 * p;
    const g = 0.7152 * p
    const b = 0.0722 * p;

    return [
        r + 1 - p, g, b, 0,0,
        r, g + 1 - p, b, 0,0,
        r, g, b + 1 - p, 0,0,
        0, 0, 0, 1,0,
    ]
}
// 改变某个通道的颜色
export function channel(r = 1, g = 1, b = 1){
    return [
        r, 0, 0, 0,0,
        0, g, 0, 0,0,
        0, 0, b, 0,0,
        0, 0, 0, 1,0,
    ]
}

/**
 * 生成高斯模糊矩阵
 * @param {number} radius 模糊半径
 * */ 
export function gaussianMatrix(radius, sigma = radius / 3){
    const a = 1 / (Math.sqrt(2 * Math.PI) * sigma);
    const b = -1 / 2 * sigma ** 2;
    let matrix = [], sum = 0;

    // 根据像素点的模糊半径计算模糊矩阵
    for (let i = -radius; i <= radius; i++) {
        let g = a * Math.exp(b * i ** 2);
        matrix.push(g);
        sum += g;
    }
    matrix = matrix.map(item=> item / sum);
    return { matrix, sum };
}

/**
 * 高斯模糊应用，对x、y两个方向分别应用高斯模糊
 * @param {imageData} imageData 图片剪裁区数据
 * @param {number} radius 高斯模糊半径
 * */ 
 export function gaussianBlur(imageData, radius){
    const { width, height, data } = imageData;
    const { matrix, sum } = gaussianMatrix(radius);
    
    // x方向
    for (let x = 0; x < height; x++) {
        for (let y = 0; y < width; y++) {
            let r = 0, g = 0, b = 0;
            // 当前坐标点在data数组中的位置
            let k = (x * width + y) * 4;
            // 分配权重
            for (let i = -radius; i <= radius; i++) {
                const o = y + i;
                if(o > 0 && o < width){
                    const gm = matrix[radius + i]; // 取权重的值
                    const j = (width * x + o) * 4;
                    r += gm * data[j];
                    g += gm * data[j + 1];
                    b += gm * data[j + 2];
                }
            }
            data[k] = r / sum;
            data[k + 1] = g / sum;
            data[k + 2] = b / sum;
        }
    }
    // y方向
    for (let y = 0; y < width; y++) {
        for (let x = 0; x < height; x++) {
            let r = 0, g = 0, b = 0;
            // 当前坐标点在data数组中的位置
            let k = (x * width + y) * 4;
            // 分配权重
            for (let i = -radius; i <= radius; i++) {
                const o = x + i;
                if(o > 0 && o < height){
                    const gm = matrix[radius + i]; // 取权重的值
                    const j = (o * width + y) * 4;
                    r += gm * data[j];
                    g += gm * data[j + 1];
                    b += gm * data[j + 2];
                }
            }
            data[k] = r / sum;
            data[k + 1] = g / sum;
            data[k + 2] = b / sum;
        }
    }
 }