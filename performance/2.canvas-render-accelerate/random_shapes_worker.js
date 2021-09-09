// 创建正多边形，返回顶点
function regularShape(x, y, r, edges = 3) {
    const points = [];
    const delta = 2 * Math.PI / edges;
    for(let i = 0; i < edges; i++) {
        const theta = i * delta;
        points.push([x + r * Math.sin(theta), y + r * Math.cos(theta)]);
    }
    return points;
}

// 根据顶点绘制图形
function drawShape(context, points) {
    context.fillStyle = 'red';
    context.strokeStyle = 'black';
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(...points[0]);
    // 这里通过遍历顶点，执行绘图指令，绘制出来的图形，所以对于边很多（比如100边形），可能执行比较慢
    for(let i = 1; i < points.length; i++) {
        context.lineTo(...points[i]);
    }
    context.closePath();
    context.stroke();
    context.fill();
}

// 多边形类型，包括正三角形、正四边形、正五边形、正六边形和正100边形
const shapeTypes = [3, 4, 5, 6, -1];
const TAU = 2 * Math.PI;


// 创建缓存函数()
function createCache(){
    const ret = [];
    for(let i = 0; i < shapeTypes.length; i++) {
        // 创建离屏canvas缓存图形
        const cacheCanvas = new OffscreenCanvas(20, 20);
        // 将图像绘制到离屏canvas图像上
        const type = shapeTypes[i];
        const context = cacheCanvas.getContext('2d'); 
        context.fillStyle = 'red'; 
        context.strokeStyle = 'black';
        if(type > 0){
            // 画正多边形
            const points = regularShape(10, 10, 10, type);
            drawShape(context, points);
        }else{
            // 画圆 
            context.beginPath(); 
            context.arc(10, 10, 10, 0, TAU); 
            context.stroke(); 
            context.fill();
        }
        ret.push(cacheCanvas);
    }
    // 将离屏Canvas数组（缓存对象）返回
    return ret;
}

const shapes = createCache();
const COUNT = 1000;

function draw(ctx, shapes) {
    const canvas = ctx.canvas;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let i = 0; i < COUNT; i++) {
        const shape = shapes[Math.floor(Math.random() * shapeTypes.length)];
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        ctx.drawImage(shape, x, y);
    }
    requestAnimationFrame(draw.bind(null, ctx, shapes));
}

self.addEventListener("message",(evt)=>{
    const { type, canvas } = evt.data;
    if(type === 'init'){
        if(canvas){
            const ctx = canvas.getContext("2d");
            const shapes = createCache();
            draw(ctx, shapes);
        }
    }
})