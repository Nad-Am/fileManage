export default function (func,dalay = 1000) {
    let timer;
    return function (...args) {
        if(timer) clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this,args);
        }, dalay);
    }
}