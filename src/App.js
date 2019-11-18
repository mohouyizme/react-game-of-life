import React, { useState, useCallback, useRef } from 'react';
import produce from 'immer';
import uuid from 'uuid';

function App() {
  const [grid, setGrid] = useState(new Array(20).fill(new Array(20).fill(0)));

  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);

  const runSimulation = useCallback(() => {
    if (!runningRef.current) return;

    const operations = [
      [0, 1],
      [0, -1],
      [1, -1],
      [-1, 1],
      [1, 1],
      [-1, -1],
      [1, 0],
      [-1, 0]
    ];

    setGrid(grid => produce(grid, gridCopy => {
      for (let i = 0; i < 20; i += 1) {
        for (let j = 0; j < 20; j += 1) {
          let neighbors = 0;
          operations.forEach(([x, y]) => {
            const newI = i + x;
            const newJ = j + y;
            if (newI >= 0 && newI < 20 && newJ >= 0 && newJ < 20)
              neighbors += grid[newI][newJ]
          });
          if (neighbors < 2 || neighbors > 3)
            gridCopy[i][j] = 0;
          else if (grid[i][j] === 0 && neighbors === 3)
            gridCopy[i][j] = 1;
        }
      }
    }));
    setTimeout(runSimulation, 200);
  }, []);

  return (
    <>
    <button
      style={{ margin: '20px 0' }}
      onClick={() => {
        setRunning(!running);
        if (!running) {
          runningRef.current = true;
          runSimulation();
        } else runningRef.current = false;
     }}>{running ? 'Stop' : 'Start'}</button>
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(20, 20px)`,
      gridGap: '2px'
    }}>
      {grid.map((row, i) => row.map((col, j) =>
        <div
          key={uuid()}
          onClick={() => {
            setGrid(produce(grid, gridCopy => {
              gridCopy[i][j] = !gridCopy[i][j];
            }));
          }}
          style={{
            width: 20,
            height: 20,
            backgroundColor: col ? 'pink' : 'lightblue',
          }}
        ></div>
      ))}
    </div>
    </>
  );
}

export default App;
