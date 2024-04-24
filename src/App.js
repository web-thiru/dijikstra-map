import React, { useState } from 'react';
import PriorityQueue from './Components/PriorityQueue';
import { Graph } from './Components/Graph';
import { data } from './Data';
import Map from './Assets/map.png';
import './App.css';
import Queue from './Components/Queue';

function App() {
  const districts = Object.keys(data);

  const list = []
  const [totalDistance, setTotalDistance] = useState(0);
  const [allNodes, setAllNodes] = useState([{ fromDataObj: {}, toDataObj: {} }])
  const [fromData, setFromData] = useState('');
  const [toData, setToData] = useState('');

  const handleSubmit = () => {
    const size = districts.length;
    var dist = [];
    dist[fromData] = 0;

    for (let a = 0; a < size; a++) {
      if (districts[a] !== fromData) {
        dist[districts[a]] = Number.MAX_VALUE;
      }

    }
    let pq = new PriorityQueue();
    pq.add({ name: fromData, distance: 0 });
    while (pq.isEmpty() === false) {
      let current = pq.poll();
      let name = current.name;
      let distance = current.distance
      if (distance > dist[name]) {
        continue;
      }
      for (let neighbor of Graph[name]) {

        if (dist[name] + neighbor.distance < dist[neighbor.name]) {
          dist[neighbor.name] = dist[name] + neighbor.distance;
          pq.add({ name: neighbor.name, distance: dist[neighbor.name] });
        }
      }
    }
    setTotalDistance(dist[toData]);
    const setValue = new Set();
    let queue = new Queue();
    queue.add({ name: toData, distance: dist[toData] })
    while (!queue.isEmpty()) {
      let current = queue.poll();
      let name = current.name;
      for (let neighbor of Graph[name]) {
        if (dist[name] - neighbor.distance === dist[neighbor.name]) {
          setValue.add(name);
          setValue.add(neighbor.name);
          queue.add({ name: neighbor.name, distance: dist[neighbor.name] });

        }
      }
    }

    for (let i of setValue) {
      list.push(i)
    }

    var start = list[0];
    var dup_dummy = []
    for (let j = 1; j < list.length; j++) {
      var end = list[j];
      var startObj = null;
      var endObj = null;
      for (let i in data) {
        if (i === start) {
          startObj = data[i];
        }
        if (i === end) {
          endObj = data[i];
        }
      }
      dup_dummy.push({ fromDataObj: startObj, toDataObj: endObj })
      start = end;
    }
    setAllNodes(dup_dummy);
  }


  //coords
  /* const [coords, setCoords] = useState({ x: null, y: null });
  const handleClick = (event) => {
    const { offsetX, offsetY } = event.nativeEvent;
    setCoords({ x: offsetX, y: offsetY });
  } */

  return (
    <div className="App">
      <h1>Shortest Route - Dijikstra </h1>
      <div>
        <label for="from">From:</label>
        <select value={fromData} name="from" id="from" onChange={(event) => setFromData(event.target.value)}>
          <option value='select'>select</option>
          {

            districts.map((district, index) => (
              <option value={district}>{district}</option>
            ))
          }
        </select>
      </div>
      <div>
        <label for="to">To:</label>
        <select value={toData} name="to" id="to" onChange={(event) => setToData(event.target.value)}>
          <option value='select'>select</option>
          {
            districts.map((district, index) => (
              <option value={district}>{district}</option>
            ))
          }
        </select>
      </div>
      <button onClick={handleSubmit}>Search</button><br />

      <div className='container' style={{ position: 'relative', display: 'inline-block' }}>
        <img src={Map} alt='map' className='image' useMap="#map" />
        {

          allNodes.map((dat) => {
            return (
              <svg class="my-svg" style={{ position: 'absolute', top: 0, left: 0 }}>
                <line
                  x1={dat.fromDataObj.x}
                  y1={dat.fromDataObj.y}
                  x2={dat.toDataObj.x}
                  y2={dat.toDataObj.y}
                  style={{ stroke: 'red', strokeWidth: 2 }}
                />
                <circle cx={dat.fromDataObj.x} cy={dat.fromDataObj.y} r="5" style={{ stroke: 'red', strokeWidth: 3 }} />
                <circle cx={dat.toDataObj.x} cy={dat.toDataObj.y} r="5" style={{ stroke: 'red', strokeWidth: 3 }} />
              </svg>
            )
          })
        }
        {/*  <map id="planetmap" name="map">

        </map>
        {coords.x !== null && coords.y !== null && (
          <p>Clicked at X: {coords.x}, Y: {coords.y}</p>
        )} */}
      </div>
      <p>Total Distance : {totalDistance}km</p>
    </div>
  );
}

export default App;
