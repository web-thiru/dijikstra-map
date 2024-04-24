export default class Queue {
    constructor() {
        this.items = []
    }
    print(){
        console.log(this.items);
    }
    isEmpty(){
        return this.items.length===0;
    }
    add(node) {
        const obj = {
            name: node.name,
            distance: node.distance
        }
        this.items.push(obj)
    }
    poll() {
        const item = this.items[0];
        var dummy = []
        for(let i=1;i<this.items.length;i++){
            dummy.push(this.items[i])
        }
        this.items = dummy;
        return item;
    }
    peek() {
        return this.items[this.frontIndex]
    }
    get printQueue() {
        return this.items;
    }
}