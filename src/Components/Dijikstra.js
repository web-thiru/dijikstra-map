import PriorityQueue from "./PriorityQueue";

import React from 'react'

function Dijikstra() {
    let pq = new PriorityQueue();
    pq.add({
        name: "chengalpet",
        distance: 63
    })
    pq.add({
        name: "kanchipuram",
        distance: 76
    })
    pq.add({
        name: "vellore",
        distance: 116
    })
    console.log(pq.poll());
    return (
        <div>Dijikstra</div>
    )
}
