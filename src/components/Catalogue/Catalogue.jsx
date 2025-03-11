import "./Catalogue.css";
import organisms, { decode, previewOrganism } from "../../assets/organisms";
import { CellContext } from "../CellContext";
import { OrganismContext } from "../OrganismContext";
import { useContext, useState } from "react";
import OrganismPreview from "../OrganismPreview/OrganismPreview";

const Catalogue = () => {
  const { cellArray, previewGrid, setPreviewGrid, organism, setOrganism } =
    useContext(CellContext);
  const orgs = Object.entries(organisms);

  const checkFit = ({ x, y, organism }) => {
    const xBoard = cellArray[0].length;
    const yBoard = cellArray.length;

    //return if it fits within the bounds of the game
    return x <= xBoard && y <= yBoard;
  };

  return (
    <div className="catalogue">
      {orgs.map(([key, value]) => {
        const { x, y, organism } = value;
        const previewFits = x <= 5 && y <= 5;
        const previewToRender = previewFits ? (
          <OrganismPreview org={value} />
        ) : (
          key
        );
        return (
          <div
            className="organism"
            onClick={() => {
              //see if it fits
              const fits = checkFit(value);

              if (fits) {
                setOrganism(value);
              }
            }}
          >
            {previewToRender}
          </div>
        );
      })}
    </div>
  );
};
export default Catalogue;
