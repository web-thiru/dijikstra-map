import React, { useState, useEffect, useRef } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import PriorityQueue from "./Components/PriorityQueue";
import { Graph } from "./Components/Graph";
import { data } from "./Data";
import Map from "./Assets/map.png";
import "./App.css";
import Queue from "./Components/Queue";

function App() {
  const districts = Object.keys(data);

  const list = [];
  const [totalDistance, setTotalDistance] = useState(0);
  const [allNodes, setAllNodes] = useState([
    { fromDataObj: {}, toDataObj: {} },
  ]);
  const [fromData, setFromData] = useState("");
  const [toData, setToData] = useState("");
  const [open, setOpen] = React.useState(false);

  function sleep(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  }
  async function handleOpen() {
    setOpen(true);
    await sleep(1500).then(() => setOpen(false));
    handleSubmit();
  }
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
      let distance = current.distance;
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
    queue.add({ name: toData, distance: dist[toData] });
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
      list.push(i);
    }

    var start = list[0];
    var dup_dummy = [];
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
      dup_dummy.push({ fromDataObj: startObj, toDataObj: endObj });
      start = end;
    }
    setAllNodes(dup_dummy);
  };

  //coords
  /* const [coords, setCoords] = useState({ x: null, y: null });
  const handleClick = (event) => {
    const { offsetX, offsetY } = event.nativeEvent;
    setCoords({ x: offsetX, y: offsetY });
  } */

  const imageRef = useRef(null);

  const image = imageRef.current;
  var originalWidth = 1;
  var originalHeight = 1;
  var currentWidth = 1;
  var currentHeight = 1;
  if (image) {
    originalWidth = image.naturalWidth;
    originalHeight = image.naturalHeight;
    currentWidth = image.clientWidth;
    currentHeight = image.clientHeight;
  }

  const [scalingFactorX, setScalingFactorX] = useState(
    currentWidth / originalWidth
  );
  const [scalingFactorY, setScalingFactorY] = useState(
    currentHeight / originalHeight
  );
  useEffect(() => {
    const updateCoords = () => {
      if (!image) return;
      console.log(image);

      const originalWidth = image.naturalWidth;
      const originalHeight = image.naturalHeight;
      const currentWidth = image.clientWidth;
      const currentHeight = image.clientHeight;

      if (currentWidth < 640) {
        setScalingFactorX(currentWidth / originalWidth);
        setScalingFactorY(currentHeight / originalHeight);
      }

      console.log(scalingFactorX, scalingFactorY);
    };
    updateCoords();
    window.addEventListener("resize", updateCoords);

    return () => window.removeEventListener("resize", updateCoords);
  });

  return (
    <div className="App">
      <h1>Shortest Route - Dijikstra </h1>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <FormControl style={{ width: "45%" }} sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-label">From</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={fromData}
            label="from"
            onChange={(event) => setFromData(event.target.value)}
          >
            {districts.map((district, index) => (
              <MenuItem value={district}>{district}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl style={{ width: "45%" }} sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-label">To</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={toData}
            label="to"
            onChange={(event) => setToData(event.target.value)}
          >
            {districts.map((district, index) => (
              <MenuItem value={district}>{district}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          style={
            fromData.length === 0 || toData.length === 0
              ? {
                  marginBottom: "10px",
                  backgroundColor: "#444544",
                  color: "white",
                }
              : {
                  marginBottom: "10px",
                  backgroundColor: "black",
                  color: "white",
                }
          }
          variant={
            fromData.length === 0 || toData.length === 0
              ? "disabled"
              : "contained"
          }
          onClick={() => handleOpen()}
        >
          {fromData.length === 0 || toData.length === 0
            ? "Select from and to"
            : "Search"}
        </Button>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>

      <div
        className="container"
        style={{
          width: "90%",
          maxWidth: "640px",
          position: "relative",
          display: "inline-block",
        }}
      >
        <img
          src={Map}
          ref={imageRef}
          style={{ width: "100%" }}
          alt="map"
          className="image"
          useMap="#map"
        />
        {allNodes.map((dat) => {
          return (
            <svg
              class="my-svg"
              style={{ position: "absolute", top: 0, left: 0 }}
            >
              <line
                x1={
                  scalingFactorX === 0
                    ? dat.fromDataObj.x
                    : dat.fromDataObj.x * scalingFactorX
                }
                y1={
                  scalingFactorY === 0
                    ? dat.fromDataObj.y
                    : dat.fromDataObj.y * scalingFactorY
                }
                x2={
                  scalingFactorX === 0
                    ? dat.toDataObj.x
                    : dat.toDataObj.x * scalingFactorX
                }
                y2={
                  scalingFactorY === 0
                    ? dat.toDataObj.y
                    : dat.toDataObj.y * scalingFactorY
                }
                style={{ stroke: "green", strokeWidth: 2 }}
              />
              {dat.fromDataObj.x > 0 &&
              dat.fromDataObj.y > 0 &&
              dat.toDataObj.x > 0 &&
              dat.toDataObj.y > 0 ? (
                <>
                  <circle
                    cx={
                      scalingFactorX === 0
                        ? dat.fromDataObj.x
                        : dat.fromDataObj.x * scalingFactorX
                    }
                    cy={
                      scalingFactorY === 0
                        ? dat.fromDataObj.y
                        : dat.fromDataObj.y * scalingFactorY
                    }
                    r="5"
                    style={{ stroke: "red", strokeWidth: 3 }}
                  />
                  <circle
                    cx={
                      scalingFactorX === 0
                        ? dat.toDataObj.x
                        : dat.toDataObj.x * scalingFactorX
                    }
                    cy={
                      scalingFactorY === 0
                        ? dat.toDataObj.y
                        : dat.toDataObj.y * scalingFactorY
                    }
                    r="5"
                    style={{ stroke: "red", strokeWidth: 3 }}
                  />
                </>
              ) : (
                <></>
              )}
            </svg>
          );
        })}
        {/*  <map id="planetmap" name="map">

        </map>
        {coords.x !== null && coords.y !== null && (
          <p>Clicked at X: {coords.x}, Y: {coords.y}</p>
        )} */}
      </div>
      {totalDistance > 0 ? <p>Total Distance : {totalDistance}km</p> : <></>}
    </div>
  );
}

export default App;
