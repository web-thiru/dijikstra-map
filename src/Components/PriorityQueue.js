export default class PriorityQueue {
    constructor() {
        this.heap = [];
    }
    print(){
        console.log(this.heap)
    }
    isEmpty() {
        return this.heap.length === 0;
    }
    add(node) {
        const obj = {
            name: node.name,
            distance: node.distance
        }
        this.heap.push(obj);
    }
    poll() {
        var dummy = []
        var minObj = null
        let min = Number.MAX_VALUE;
        for (var i of this.heap) {
            min = Math.min(min, i.distance);
        }
        for (var j of this.heap) {
            if (j.distance !== min) {
                dummy.push(j)
            }
            else{
                minObj = j;
            }
        }
        this.heap = dummy;
        return minObj;
    }

}