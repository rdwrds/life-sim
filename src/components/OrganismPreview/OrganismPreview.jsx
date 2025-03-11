import { useState } from "react";
import organisms, { decode } from "../../assets/organisms";

const OrganismPreview = ({ org }) => {
  const [organism, setOrg] = useState(
    decode(org.organism, { x: org.x, y: org.y })
  );

  const gridStyle = {
    gridTemplateColumns: `repeat(${org.x}, ${12}px)`,
    gridTemplateRows: `repeat(${org.y}, ${12}px)`,
  };

  return (
    <div className="grid-container" style={gridStyle}>
      {organism.map((x, xIndex) => {
        return organism[xIndex].map((y, yIndex) => {
          const style = {
            backgroundColor: organism[xIndex][yIndex] ? "white" : "#777",
          };

          return <div className="cell" style={style}></div>;
        });
      })}
    </div>
  );
};
export default OrganismPreview;
