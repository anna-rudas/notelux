import React, { useState, useContext } from "react";
import { className } from "../../helpers";
import * as style from "./EditNote.module.css";
import Form from "../Form";
import DeleteConfirmation from "../DeleteConfirmation";
import { AppContext } from "../../context";
import ShareNoteModal from "../ShareNoteModal";
import { FormikValues } from "formik";

function EditNote() {
  const {
    activeNote,
    resetDefault,
    updateNoteInDb,
    loadNotesFromDb,
    deleteNoteInDb,
    setIsLoading,
    getUserIdByEmail,
    setCollaborators,
    setActiveNote,
    setInfoMessage,
  } = useContext(AppContext);
  const [isDelConfOpen, setIsDelConfOpen] = useState(false);
  const [isShareNoteOpen, setIsShareNoteOpen] = useState(false);

  const handleSubmit = async () => {
    if (activeNote) {
      await updateNoteInDb({ ...activeNote, date: new Date() });
      await loadNotesFromDb();
      resetDefault();
    }
  };

  const handleDelete = async () => {
    if (activeNote) {
      await deleteNoteInDb(activeNote);
      await loadNotesFromDb();
      resetDefault();
      setIsDelConfOpen(false);
    }
  };

  const handleShareNote = async (values: FormikValues) => {
    setIsLoading(true);

    //get user id
    const newUserId = await getUserIdByEmail(values.newUserEmail);

    if (activeNote && newUserId && activeNote.coUsers.indexOf(newUserId) >= 0) {
      setInfoMessage({
        showMsg: true,
        isPersisting: false,
        isError: true,
        desc: "User already added",
      });
    } else {
      //set note
      if (activeNote && newUserId !== "") {
        const newCoUsers = [...activeNote.coUsers, newUserId];
        await updateNoteInDb({
          ...activeNote,
          coUsers: newCoUsers,
        });
        await setCollaborators(activeNote.userId, newCoUsers);
        setActiveNote({ ...activeNote, coUsers: newCoUsers });
        await loadNotesFromDb();
      }
    }

    setIsLoading(false);
  };

  return (
    <div {...className(style.editNoteCon)}>
      <Form
        handleSubmit={handleSubmit}
        handleCancel={resetDefault}
        setIsDelConfOpen={setIsDelConfOpen}
        setIsShareNoteOpen={setIsShareNoteOpen}
        noteFormStyle={style.editNoteForm}
        noteBodyStyle={style.editNoteBody}
      />
      {isDelConfOpen && (
        <DeleteConfirmation
          handleSubmit={handleDelete}
          setIsModalOpen={setIsDelConfOpen}
        />
      )}
      {isShareNoteOpen && (
        <ShareNoteModal
          handleSubmit={handleShareNote}
          setIsModalOpen={setIsShareNoteOpen}
        />
      )}
    </div>
  );
}

export default EditNote;
