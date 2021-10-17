import { Timing } from "./timing.js"

export class Animator{
    constructor({during, iterations = 1.0}){
        this.timing = new Timing(during, iterations);
    }
    animate(target,fun){

    }
}