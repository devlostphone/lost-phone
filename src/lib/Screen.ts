let w: number = window.innerWidth;
let h: number = window.innerHeight;
let pxr: number = window.devicePixelRatio;

export const width: number = w * pxr;
export const height: number = h * pxr;
export const dpr: number = pxr;
