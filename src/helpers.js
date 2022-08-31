export const className = (...classNames) => {
  return {
    className: classNames.filter(Boolean).join(" "),
  };
};

export const sortNotes = (notes, numberOfColumns) => {
  const columns = [];
  for (let i = 0; i < numberOfColumns; i++) {
    columns.push([]);
  }

  notes.sort(function (a, b) {
    return a.title.length - b.title.length;
  });

  for (let i = 0; i < notes.length; i = i + numberOfColumns) {
    for (let j = 0; j < numberOfColumns; j++) {
      if (notes[i + j]) {
        columns[j].push(notes[i + j]);
      }
    }
  }

  return columns;
};
