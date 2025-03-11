import { useEffect, useRef, useState } from "react";
import { Catalogue, Cell, Header, Menu } from "./components";
import { CellContext } from "./components/CellContext.js";
import {
  addOrganismToGrid,
  previewOrganism,
  unpreviewOrganism,
} from "./assets/organisms.js";
import "./App.css";

function App() {
  const [cellArray, setCellArray] = useState([]);
  const [organism, setOrganism] = useState(null);
  const [size, setSize] = useState(50);
  const [loop, setLoop] = useState(false);
  const [catalogueOpen, setCatalogueOpen] = useState(false);
  const [previewGrid, setPreviewGrid] = useState(null);
  const [generation, setGeneration] = useState(0);
  const [tempSize, setTempSize] = useState(0);

  const gridRef = useRef(null);
  const dropdownRef = useRef(null);

  const initCellArray = (size) => {
    //init 2D array
    const x = Array(size).fill(0);
    const y = Array(size).fill(x);

    setCellArray(y);
  };

  //from google gemini b/c the
  //a function this trivial aint
  //worth the keystrokes
  const areArraysEqual = (arr1, arr2) => {
    // Check if the arrays have the same number of rows
    if (arr1.length !== arr2.length) {
      return false;
    }

    // Iterate over the rows
    for (let i = 0; i < arr1.length; i++) {
      // Check if the rows have the same number of columns
      if (arr1[i].length !== arr2[i].length) {
        return false;
      }

      // Iterate over the columns
      for (let j = 0; j < arr1[i].length; j++) {
        // Check if the elements are equal
        if (arr1[i][j] !== arr2[i][j]) {
          return false;
        }
      }
    }

    // If all elements are equal, return true
    return true;
  };

  const getTotalNeighbors = (x, y) => {
    //offsets from top left
    const xOffset = [-1, 0, 1, -1, 0, 1, -1, 0, 1];
    const yOffset = [1, 1, 1, 0, 0, 0, -1, -1, -1];
    let sum = 0;

    for (let index = 0; index < 9; index++) {
      const xCurr = x + xOffset[index];
      const yCurr = y + yOffset[index];

      const oobCheck =
        xCurr < 0 || xCurr > size - 1 || yCurr < 0 || yCurr > size - 1;
      const originCell = xOffset[index] == 0 && yOffset[index] == 0;

      //skip cells oob
      if (oobCheck || originCell) {
        continue;
      }

      sum += cellArray[xCurr][yCurr] === 1 ? 1 : 0;
    }
    return sum;
  };

  const update = () => {
    const updatedArray = cellArray.map((x, xIndex) => {
      return x.map((y, yIndex) => {
        const currentCell = cellArray[xIndex][yIndex];
        const neighbors = getTotalNeighbors(xIndex, yIndex);

        const aliveToggle = neighbors == 2 || neighbors == 3;
        const deadToggle = neighbors == 3;

        //if the cell is alive
        if (currentCell) {
          return aliveToggle ? 1 : 0;
        } else {
          return deadToggle ? 1 : 0;
        }
      });
    });

    setCellArray((oldArray) => {
      //pause game if no updates are necessary
      const gridNotChanging = areArraysEqual(oldArray, updatedArray);
      if (gridNotChanging) {
        alert("bitch full of still-life");
        setLoop(false);
        return updatedArray;
      } else {
        setGeneration((prev) => prev + 1);
        return updatedArray;
      }
    });
  };

  useEffect(() => {
    initCellArray(size);
  }, [size]);

  useEffect(() => {
    setPreviewGrid(JSON.parse(JSON.stringify(cellArray)));
  }, [catalogueOpen]);
  //setTimeout works for now but theres no way of telling (for
  // an amateur like me) how poorly it might scale
  useEffect(() => {
    let gameLoop;
    if (loop) {
      gameLoop = setTimeout(() => {
        update();
      }, 50);
    } else {
      clearInterval(gameLoop);
    }
  }, [loop, cellArray]);

  useEffect(() => {
    if (dropdownRef.current) {
      dropdownRef.current.style.transform = catalogueOpen
        ? "rotate(90deg)"
        : "";
    }
  }, [catalogueOpen]);

  const breakpoints = [];

  const cellSize = 16;

  const gridStyle = {
    gridTemplateColumns: `repeat(${size}, ${cellSize}px)`,
    gridTemplateRows: `repeat(${size}, ${cellSize}px)`,
  };

  const gridContextValues = {
    cellArray: cellArray,
    setCellArray: setCellArray,
    previewGrid: previewGrid,
    setPreviewGrid: setPreviewGrid,
    organism: organism,
    setOrganism: setOrganism,
    catalogueOpen: catalogueOpen,
    setCatalogueOpen: setCatalogueOpen,
  };

  const catalogueContextValues = {};

  //render the preview array when trying to place
  //an organism
  const gridToRender = catalogueOpen ? previewGrid : cellArray;

  const addingOrganism = catalogueOpen && organism;
  const aliveColor = addingOrganism ? "blue" : "white";

  const handleCellToggle = (x, y) => {
    setCellArray((oldArray) => {
      const newArray = oldArray.map((row, index) => {
        return index === x ? [...row] : row;
      });

      //invert the state
      newArray[x][y] = oldArray[x][y] ? 0 : 1;

      return newArray;
    });
  };

  const handleCellEnter = (e, xIndex, yIndex) => {
    if (addingOrganism) {
      previewOrganism(xIndex, yIndex, organism, setPreviewGrid, cellArray);
      e.target.style.backgroundColor = "red";
    }
  };

  const handleCellLeave = (e, xIndex, yIndex) => {
    if (addingOrganism) {
      unpreviewOrganism(xIndex, yIndex, organism, setPreviewGrid, cellArray);
      e.target.style.backgroundColor = gridToRender?.[xIndex]?.[yIndex]
        ? "white"
        : "#777";
    }
  };

  const handleCellClick = (e, xIndex, yIndex) => {
    //if you're selecting an organism, add it if its in a valid spot
    if (addingOrganism) {
      addOrganismToGrid(xIndex, yIndex, organism, cellArray, setCellArray);

      setOrganism(null);
      setCatalogueOpen(false);
    } else {
      handleCellToggle(xIndex, yIndex);
    }
  };

  const handleClear = () => {
    setLoop(false);
    setGeneration((prev) => 0);

    //just generate a new
    //blank cell array
    initCellArray(size);
  };

  const handleSizeDown = () => {
    setSize((prev) => prev - 1);
  };

  const handleSizeUp = () => {
    setSize((prev) => prev + 1);
  };

  const handleSizeInputChange = (e) => {
    const num_exp = new RegExp("^$|[\\b\\d]+");
    const valid_size = num_exp.test(e.target.value);
    console.log(valid_size);

    if (valid_size) {
      setTempSize(Number.parseInt(e.target.value));
      console.log(tempSize);
    } else {
      alert("enter in a number bro");
    }
  };

  const handleSizeInputSubmit = (e) => {
    e.preventDefault();
    console.log(e.target.value);

    console.log(tempSize);

    setSize(tempSize);
    console.log(size);
  };

  const handleCatalogueClick = (e) => {
    setLoop(false);
    setCatalogueOpen((prev) => !prev);
    //in order to change the chevron, gotta use an effect
    //because state updates are asynch
  };

  return (
    <div className="container">
      <Header />
      <CellContext.Provider value={gridContextValues}>
        <div
          /*this only works when we change the width in css.
        need to find a way to change it when ADDING an element to the
        dom. */
          className={`grid-wrapper ${
            catalogueOpen ? "grid-wrapper-expand" : ""
          }`}
        >
          <Menu>
            <button className="step" onClick={update}>
              <i className="fa-solid fa-chevron-right"></i>
            </button>
            <button className="clear" onClick={handleClear}>
              <i className="fa-solid fa-close"></i>
            </button>
            <button
              className="start"
              onClick={() => {
                setLoop(!loop);
              }}
            >
              {loop ? (
                <i className="fa-solid fa-pause"></i>
              ) : (
                <i className="fa-solid fa-play"></i>
              )}
            </button>
            <div className="speed-controls">
              <button className="size-down" onClick={handleSizeDown}>
                <i className="fa-solid fa-chevron-left"></i>
              </button>
              <form className="speed-input" onSubmit={handleSizeInputSubmit}>
                <input
                  type="text"
                  className="speed-input"
                  placeholder={size}
                  value={tempSize || ""}
                  onChange={handleSizeInputChange}
                ></input>
              </form>

              <button className="size-up" onClick={handleSizeUp}>
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
            <h4 className="generation-info">generation: {generation}</h4>
          </Menu>
          <div className="grid-container" style={gridStyle} ref={gridRef}>
            {gridToRender.map((x, xIndex) => {
              return gridToRender[xIndex].map((y, yIndex) => {
                const style = {
                  backgroundColor: gridToRender?.[xIndex]?.[yIndex]
                    ? aliveColor
                    : "#777",
                };

                return (
                  <div
                    className="cell"
                    onMouseEnter={(e) => handleCellEnter(e, xIndex, yIndex)}
                    onMouseLeave={(e) => handleCellLeave(e, xIndex, yIndex)}
                    onClick={(e) => handleCellClick(e, xIndex, yIndex)}
                    style={style}
                  ></div>
                );
              });
            })}
          </div>
          <Menu>
            <button className="catalogue-button" onClick={handleCatalogueClick}>
              <i
                className={
                  catalogueOpen
                    ? "fa-solid fa-chevron-right"
                    : "fa-solid fa-grip"
                }
                ref={dropdownRef}
              ></i>
              <span>catalogue</span>
            </button>
            {catalogueOpen && <Catalogue />}
          </Menu>
        </div>
      </CellContext.Provider>
    </div>
  );
}

export default App;
