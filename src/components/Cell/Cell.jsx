import { useContext } from "react";
import organisms, {
  addOrganismToGrid,
  previewOrganism,
  unpreviewOrganism,
} from "../../assets/organisms.js";
import { CellContext } from "../CellContext.js";

//TODO: continue refactoring into component
const Cell = ({ x, y }) => {
  const {
    cellArray,
    setCellArray,
    previewGrid,
    setPreviewGrid,
    organism,
    setOrganism,
    catalogueOpen,
  } = useContext(CellContext);

  const addingOrganism = catalogueOpen && organism;
  const aliveColor = addingOrganism ? "blue" : "white";
  const gridToRender = catalogueOpen ? previewGrid : cellArray;
  const style = {
    backgroundColor: gridToRender?.[x]?.[y] ? aliveColor : "#777",
  };

  const handleClick = (e, x, y) => {
    setCellArray((oldArray) => {
      const newArray = oldArray.map((row, index) => {
        return index === x ? [...row] : row;
      });

      //invert the state
      newArray[x][y] = oldArray[x][y] ? 0 : 1;

      return newArray;
    });
  };

  return (
    <div
      className="cell"
      onMouseEnter={(e) => {
        if (addingOrganism) {
          previewOrganism(x, y, organism, setPreviewGrid, cellArray);
          e.target.style.backgroundColor = "red";
        }
      }}
      onMouseLeave={(e) => {
        if (addingOrganism) {
          unpreviewOrganism(x, y, organism, setPreviewGrid, cellArray);
          e.target.style.backgroundColor = gridToRender?.[x]?.[y]
            ? "white"
            : "#777";
        }
      }}
      onClick={(e) => {
        //if you're selecting an organism, add it if its in a valid spot
        if (addingOrganism) {
          addOrganismToGrid(x, y, organism, cellArray, setCellArray);

          setOrganism(null);
          setCatalogueOpen(false);
          console.log("runnin this hoe");
        } else {
          handleClick(e, x, y);
        }
      }}
      style={style}
    ></div>
  );
};
export default Cell;
