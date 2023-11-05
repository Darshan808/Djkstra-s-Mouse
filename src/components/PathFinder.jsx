import { useState } from "react";
import Node from "./node/Node";
import {
  getInitialGrid,
  getNewGridWithWallToggled,
} from "../algorithms/gridAlgo";
import Heading from "./heading/Heading";
import { details, getMazeWall_1 } from "../algorithms/gridAlgo";
import { dijkstra, getNodesInShortestPathOrder } from "../algorithms/dijkstra";

const PathFinder = () => {
  //States
  const [grid, setGrid] = useState(getInitialGrid);
  const [isMousePressed, setIsMousePressed] = useState(false);
  const [isScrClr, setIsScrClr] = useState(true);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [isMazeShown, setIsMazeShown] = useState(false);

  //Handling Mouse events

  function handleMouseDown(row, col) {
    console.log("{" + row + "," + col + "},");
    const newGrid = getNewGridWithWallToggled(grid, row, col);
    setGrid(newGrid);
    setIsMousePressed(true);
  }

  function handleMouseEnter(row, col) {
    if (!isMousePressed) return;
    const newGrid = getNewGridWithWallToggled(grid, row, col);
    setGrid(newGrid);
  }

  function handleMouseUp() {
    setIsMousePressed(false);
  }
  function animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    setIsScrClr(false);
    setIsVisualizing(true);
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document
          .getElementById(`node-${node.row}-${node.col}`)
          .classList.add("node-visited");
      }, 10 * i);
    }
  }

  function animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i <= nodesInShortestPathOrder.length; i++) {
      if (i === nodesInShortestPathOrder.length) {
        setTimeout(() => {
          animateMouse(nodesInShortestPathOrder);
          setIsVisualizing(false);
          setIsScrClr(false);
        }, 50 * i);
        return;
      }
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document
          .getElementById(`node-${node.row}-${node.col}`)
          .classList.add("node-shortest-path");
      }, 50 * i);
    }
  }
  function animateMouse(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length - 1; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        const prevNode = i > 0 ? nodesInShortestPathOrder[i - 1] : null;
        let newGrid = [...grid];
        newGrid[node.row][node.col] = {
          ...newGrid[node.row][node.col],
          isRat: true,
        };
        if (prevNode) {
          newGrid[prevNode.row][prevNode.col] = {
            ...newGrid[prevNode.row][prevNode.col],
            isRat: false,
          };
        }
        setGrid(newGrid);
      }, 65 * i);
    }
  }

  function visualizeDijkstra() {
    const startNode = grid[details.START_NODE_ROW][details.START_NODE_COL];
    const finishNode = grid[details.FINISH_NODE_ROW][details.FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  function reset() {
    // const emptyGrid = getInitialGrid();
    // setGrid(emptyGrid);
    // setIsScrClr(true);
    location.reload();
  }

  function handleClick() {
    if (isScrClr) visualizeDijkstra();
    else reset();
  }

  function getMaze() {
    setIsMazeShown(true);
    let newGrid = [...grid];
    newGrid[details.START_NODE_ROW][details.START_NODE_COL].isRat = false;
    newGrid[details.START_NODE_ROW][details.START_NODE_COL].isStart = false;
    newGrid[details.FINISH_NODE_ROW][details.FINISH_NODE_COL].isFinish = false;
    newGrid[19][0].isStart = true;
    newGrid[19][0].isRat = true;
    newGrid[0][49].isFinish = true;
    details.START_NODE_ROW = 19;
    details.START_NODE_COL = 0;
    details.FINISH_NODE_ROW = 0;
    details.FINISH_NODE_COL = 49;

    let walls = getMazeWall_1();
    for (let wall of walls) newGrid[wall.row][wall.column].isWall = true;
    setGrid(newGrid);
    return;
  }

  return (
    <>
      <Heading />
      <div className="button" onClick={handleClick}>
        {isScrClr ? "Find Path" : isVisualizing ? "Finding..." : "Reset"}
      </div>
      <div className="button getMazeBtn" onClick={getMaze}>
        {isMazeShown ? "Change Maze" : "Get Maze"}
      </div>
      <div
        className="grid"
        style={{ display: "flex", flexDirection: "column", flex: 1 }}
      >
        {grid.map((row, rowIdx) => {
          return (
            <div key={rowIdx} style={{ display: "flex", flex: 1 }}>
              {row.map((node, nodeIdx) => {
                const { row, col, isFinish, isStart, isWall, isRat } = node;
                return (
                  <Node
                    key={nodeIdx}
                    col={col}
                    isFinish={isFinish}
                    isStart={isStart}
                    isWall={isWall}
                    onMouseDown={(row, col) => handleMouseDown(row, col)}
                    onMouseEnter={(row, col) => handleMouseEnter(row, col)}
                    onMouseUp={handleMouseUp}
                    row={row}
                    isRat={isRat}
                  ></Node>
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default PathFinder;
