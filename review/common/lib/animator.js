import { Timing } from "./timing.js"

export class Animator{
    constructor({during, iterations = 1.0,easing}){
        this.timing = {during, iterations,easing};
    }
    animate(target,update){
        const timing = new Timing(this.timing);
        return new Promise((resolve)=>{
            function next(){
                if(update({target,timing}) !== false && !timing.isFinished)
                    requestAnimationFrame(next);
                else resolve(timing)
            }
            next();
        });
    }
}