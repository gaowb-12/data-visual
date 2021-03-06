import {Timing} from './timing.js';

export class Animator {
    constructor({duration, iterations, easing}){
        this.timing = {duration, iterations, easing}
    }
    updateTiming({duration, iterations, easing}){
        duration && (this.timing = {...this.timing, duration});
        iterations && (this.timing = {...this.timing, iterations});
        easing && (this.timing = {...this.timing, easing});
    }
    animate(target, update){
        let frameIndex = 0;
        const timing = new Timing(this.timing);

        return new Promise((resolve)=>{
            function next(){
                if(update({target, frameIndex, timing})!==false && !timing.isFinished){
                    requestAnimationFrame(next);
                }else{
                    resolve(timing);
                }
                frameIndex++;
            }
            next();
        })
    }
}