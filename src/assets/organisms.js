//an RLE decoder from https://github.com/timjacksonm/rle-decoder/blob/main/decode.js
//made by tim jackson
export const decode = (str, size) => {
  const rleString = str;
  const { x, y } = size;

  //on number repeat next letter number of times.
  //End by splitting on $ creating multiple lines
  let decoded = rleString
    .slice(0, -1)
    .replace(/(\d+)(\D)/g, function (match, num) {
      return match.split(num)[1].repeat(num);
    })
    .split("$");

  //replace letter 'o' with 1's & b with 0's ie - alive: 1 , dead: 0
  decoded = decoded.map((row) => row.replace(/o/g, 1));
  decoded = decoded.map((row) => row.replace(/b/g, 0));

  //for each row split into its own arrow containing single #'s
  decoded = decoded.map((row) => [...row.split("")]);

  //row length less than specifications add filler 0's
  decoded = decoded.map((row) => {
    if (row.length < x) {
      let filler = new Array(x - row.length).fill(0);
      let value = row.concat(filler);
      return value;
    } else {
      return row;
    }
  });

  //convert all string numbers to type of Number
  decoded = decoded.map((row) => row.map((string) => Number(string)));

  return decoded;
};

//TODO: make helper functions file
//NOTE: probably not necessary to pass all of these states
//just put all these two funcs in App.js and then put stuff in their
//respective components

//this function breaks when you cross over the edge of the gridd
export const previewOrganism = (
  xCell,
  yCell,
  { x, y, organism },
  setPreviewGrid,
  cellArray
) => {
  const orgArray = decode(organism, { x: x, y: y });

  setPreviewGrid((oldGrid) => {
    let newArray = JSON.parse(JSON.stringify(oldGrid));

    const xBounds = cellArray.length - orgArray.length;
    const yBounds = cellArray[0].length - orgArray[0].length;

    if (xCell <= xBounds && yCell <= yBounds) {
      orgArray.map((x, xIndex) => {
        orgArray[xIndex].map((y, yIndex) => {
          const xToSet = xCell + xIndex;
          const yToSet = yCell + yIndex;

          //this prints for each cell, so 3x3 = 9 times
          newArray[xToSet][yToSet] = orgArray[xIndex][yIndex];
        });
      });
    }

    return newArray;
  });
};

export const unpreviewOrganism = (
  xCell,
  yCell,
  { x, y, organism },
  setPreviewGrid,
  cellArray
) => {
  const orgArray = decode(organism, { x: x, y: y });

  setPreviewGrid((oldGrid) => {
    let newArray = JSON.parse(JSON.stringify(oldGrid));

    const xBounds = cellArray.length - orgArray.length;
    const yBounds = cellArray[0].length - orgArray[0].length;

    if (xCell <= xBounds && yCell <= yBounds) {
      orgArray.map((x, xIndex) => {
        orgArray[xIndex].map((y, yIndex) => {
          const xToSet = xCell + xIndex;
          const yToSet = yCell + yIndex;

          //this prints for each cell, so 3x3 = 9 times
          newArray[xToSet][yToSet] = cellArray[xIndex][yIndex];
        });
      });
    }

    return newArray;
  });
};

export const addOrganismToGrid = (
  xCell,
  yCell,
  { x, y, organism },
  cellArray,
  setCellArray
) => {
  const orgArray = decode(organism, { x: x, y: y });

  setCellArray((oldGrid) => {
    let newArray = JSON.parse(JSON.stringify(oldGrid));

    const xBounds = cellArray.length - orgArray.length;
    const yBounds = cellArray[0].length - orgArray[0].length;

    //hence some of the confusion
    console.log(`X: ${yCell}, Y: ${xCell}, `);
    console.log(yBounds);

    if (xCell <= xBounds && yCell <= yBounds) {
      orgArray.map((x, xIndex) => {
        orgArray[xIndex].map((y, yIndex) => {
          const xToSet = xCell + xIndex;
          const yToSet = yCell + yIndex;

          //this prints for each cell, so 3x3 = 9 times
          newArray[xToSet][yToSet] = orgArray[xIndex][yIndex];
        });
      });
    }

    return newArray;
  });
};

//any newlines will break the decode function and causes NaNs
// make sure template string start and end on the same line
const organisms = {
  r_pentomino: {
    x: 3,
    y: 3,
    organism: `b2o$2o$bo!`,
  },

  gosper_glider_gun: {
    x: 36,
    y: 9,
    organism: `24bo$22bobo$12b2o6b2o12b2o$11bo3bo4b2o12b2o$2o8bo5bo3b2o$2o8bo3bob2o4bobo$10bo5bo7bo$11bo3bo$12b2o!`,
  },

  simkin_glider_gun: {
    x: 33,
    y: 21,
    organism: `2o5b2o$2o5b2o2$4b2o$4b2o5$22b2ob2o$21bo5bo$21bo6bo2b2o$21b3o3bo3b2o$26bo4$20b2o$20bo$21b3o$23bo!`,
  },

  z_hexomino: {
    x: 3,
    y: 4,
    organism: `2ob$bob$bob$b2o!`,
  },

  f_heptomino: {
    x: 4,
    y: 4,
    organism: `2o$bo$bo$b3o!`,
  },

  loafer: {
    x: 9,
    y: 9,
    organism: `b2o2bob2o$o2bo2b2o$bobo$2bo$8bo$6b3o$5bo$6bo$7b2o!`,
  },

  weird_guy: {
    x: 6,
    y: 6,
    organism: `o3`,
  },

  bad_gpt: {
    x: 6,
    y: 6,
    organism: `b3o2b$obo2bo$2o3bo$o4bo$6b$b3o2b!`,
  },
};

export default organisms;
