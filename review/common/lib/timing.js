export class Timing{
    // 动画周期，与动画的执行周期次数
    constructor(during, iterations){
        this.startTime = Date.now();
        this.during = during;
        this.iterations = iterations;
    }
    // 执行的时间
    get time(){
        return Date.now() - this.startTime;
    }
    // 进度
    get p(){
        let progress = Math.min(this.time / this.during, this.iterations);
        return this.isFinished ? 1 : progress % 1;
    }
    // 判断是否完成
    get isFinished(){
        return this.time / this.during >= this.iterations;
    }
}