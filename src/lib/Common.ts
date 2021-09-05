// --- Common
Object.defineProperty(Phaser.Structs.List.prototype, 'current', {
    get() {
        return this.getAt(this.position);
    }
});

export {}
declare global {
    function resolvePropertyInPath(path: string, obj: any): any;
    function setPropertyInPath(path: string, obj: any, value: any): void;
}

const _global = (window /* browser */ || global /* node */) as any;
_global.resolvePropertyInPath = function(path: string, obj: any): any {
    return path.split('.').reduce(function(prev, curr) {
        return prev ? prev[curr] : null
    }, obj || self)
}

_global.setPropertyInPath = function(path: string, obj: any, value: any): void {
    var schema = obj;
    var pList = path.split('.');
    var len = pList.length;
    for(var i = 0; i < len-1; i++) {
        var elem = pList[i];
        if( !schema[elem] ) schema[elem] = {}
        schema = schema[elem];
    }

    schema[pList[len-1]] = value;
}