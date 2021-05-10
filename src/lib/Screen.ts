// set game width and height by multiplying window width with devicePixelRatio

let w: number = window.innerWidth;
let h: number = window.innerHeight;
let pxr: number = window.devicePixelRatio;

console.log('w: ' + w + ' h: ' + h + ' pxr: ' + pxr);

export const width: number = w * pxr;
export const height: number = h * pxr;
export const dpr: number = pxr;
