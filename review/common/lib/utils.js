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