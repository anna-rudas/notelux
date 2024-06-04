import React, { useState, useContext } from "react";
import { className } from "../../helpers";
import * as style from "./EditNote.module.css";
import Form from "../Form";
import DeleteConfirmation from "../DeleteConfirmation";
import { AppContext } from "../../context";

function EditNote() {
  const {
    activeNote,
    resetDefault,
    updateNoteInDb,
    loadNotesFromDb,
    deleteNoteInDb,
  } = useContext(AppContext);
  const [isDelConfOpen, setIsDelConfOpen] = useState(false);

  const handleSubmit = () => {
    if (activeNote) {
      updateNoteInDb({ ...activeNote, date: new Date() });
      loadNotesFromDb();
      resetDefault();
    }
  };

  const handleDelete = () => {
    if (activeNote) {
      deleteNoteInDb(activeNote);
      loadNotesFromDb();
      resetDefault();
      setIsDelConfOpen(false);
    }
  };

  return (
    <div {...className(style.editNoteCon)}>
      <Form
        handleSubmit={handleSubmit}
        handleCancel={resetDefault}
        setIsDelConfOpen={setIsDelConfOpen}
        noteFormStyle={style.editNoteForm}
        noteBodyStyle={style.editNoteBody}
      />
      {isDelConfOpen && (
        <DeleteConfirmation
          handleSubmit={handleDelete}
          setIsModalOpen={setIsDelConfOpen}
        />
      )}
    </div>
  );
}

export default EditNote;
