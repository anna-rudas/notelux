export const className = (...classNames: any) => {
  return {
    className: classNames.filter(Boolean).join(" "),
  };
};

export const sortNotes: (
  notes: Array<Note>,
  numberOfColumns: number
) => Array<Array<Note>> = (notes, numberOfColumns) => {
  const columns = [];
  for (let i = 0; i < numberOfColumns; i++) {
    columns.push([]);
  }

  notes.sort((a, b) => a.title.length - b.title.length);

  for (let i = 0; i < notes.length; i = i + numberOfColumns) {
    for (let j = 0; j < numberOfColumns; j++) {
      if (notes[i + j]) {
        columns[j].push(notes[i + j]);
      }
    }
  }

  columns.forEach((current) => {
    current.sort(
      (a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf()
    );
  });

  return columns;
};
