import React, { useState, useContext } from "react";
import { className } from "../../utilities/helpers";
import * as style from "./EditNote.module.css";
import Form from "../Form";
import DeleteConfirmation from "../DeleteConfirmation";
import { AppContext } from "../../context/AppContext";
import ShareNoteModal from "../ShareNoteModal";
import { FormikValues } from "formik";
import { DashboardContext } from "../../context/DashboardContext";

function EditNote() {
  const {
    updateNoteInDb,
    deleteNoteInDb,
    setIsLoading,
    getUserIdByEmail,
    setInfoMessage,
  } = useContext(AppContext);
  const { activeNote, setActiveNote, resetDefault } =
    useContext(DashboardContext);
  const [isDelConfOpen, setIsDelConfOpen] = useState(false);
  const [isShareNoteOpen, setIsShareNoteOpen] = useState(false);

  const handleSubmit = async () => {
    if (activeNote) {
      await updateNoteInDb({ ...activeNote, date: new Date().toISOString() });
      resetDefault();
    }
  };

  const handleDelete = async () => {
    if (activeNote) {
      await deleteNoteInDb(activeNote);
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
        actionButtonText: "",
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
        setActiveNote({ ...activeNote, coUsers: newCoUsers });
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
