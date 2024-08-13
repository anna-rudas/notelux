import React, { useState, useContext } from "react";
import { className, evalErrorCode } from "../../utilities/helpers";
import * as style from "./EditNote.module.css";
import Form from "../Form";
import DeleteConfirmation from "../DeleteConfirmation";
import { AppContext } from "../../context/AppContext";
import ShareNoteModal from "../ShareNoteModal";
import { FormikValues } from "formik";
import { DashboardContext } from "../../context/DashboardContext";
import { updateNoteInDb, deleteNoteInDb } from "../../firestore/noteService";
import { getUserIdFromEmail } from "../../firestore/userService";
import { FirebaseError } from "firebase/app";

function EditNote() {
  const { setIsLoading, setInfoMessage } = useContext(AppContext);
  const { activeNote, setActiveNote, resetDefaultNoteState } =
    useContext(DashboardContext);
  const [isDelConfOpen, setIsDelConfOpen] = useState(false);
  const [isShareNoteOpen, setIsShareNoteOpen] = useState(false);

  const handleEditNoteSubmit = async () => {
    if (activeNote) {
      try {
        await updateNoteInDb({ ...activeNote, date: new Date().toISOString() });
        setInfoMessage({
          actionButtonText: "",
          isPersisting: false,
          showMsg: true,
          isError: false,
          desc: "Note updated successfully",
        });
        resetDefaultNoteState();
      } catch (error: unknown) {
        console.error("Failed to update note in database: ", error);
        if (error instanceof FirebaseError) {
          setInfoMessage({
            actionButtonText: "",
            isPersisting: false,
            showMsg: true,
            isError: true,
            desc: `Failed to update note: ${evalErrorCode(error.code)}`,
          });
        }
      }
    }
  };

  const handleDeleteNoteSubmit = async () => {
    if (activeNote) {
      try {
        await deleteNoteInDb(activeNote);
        setInfoMessage({
          actionButtonText: "",
          isPersisting: false,
          showMsg: true,
          isError: false,
          desc: "Note deleted successfully",
        });
        resetDefaultNoteState();
        setIsDelConfOpen(false);
      } catch (error: unknown) {
        console.error("Failed to delete note in database: ", error);
        if (error instanceof FirebaseError) {
          setInfoMessage({
            actionButtonText: "",
            isPersisting: false,
            showMsg: true,
            isError: true,
            desc: `Failed to delete note: ${evalErrorCode(error.code)}`,
          });
        }
      }
    }
  };

  const handleShareNoteSubmit = async (values: FormikValues) => {
    setIsLoading(true);

    try {
      //get user id
      const newUserId = await getUserIdFromEmail(values.newUserEmail);
      if (!newUserId) {
        setInfoMessage({
          showMsg: true,
          actionButtonText: "",
          isPersisting: false,
          isError: true,
          desc: "There is no user with this email address",
        });
      } else if (
        activeNote &&
        newUserId &&
        activeNote.coUsers.indexOf(newUserId) >= 0
      ) {
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
          try {
            await updateNoteInDb({
              ...activeNote,
              coUsers: newCoUsers,
              date: new Date().toISOString(),
            });
            setActiveNote({
              ...activeNote,
              coUsers: newCoUsers,
              date: new Date().toISOString(),
            });
            setInfoMessage({
              showMsg: true,
              actionButtonText: "",
              isPersisting: false,
              isError: false,
              desc: "New user added",
            });
          } catch (error: unknown) {
            console.error("Failed to add collaborator: ", error);
            if (error instanceof FirebaseError) {
              setInfoMessage({
                actionButtonText: "",
                isPersisting: false,
                showMsg: true,
                isError: true,
                desc: `Failed to add user: ${evalErrorCode(error.code)}`,
              });
            }
          }
        }
      }
    } catch (error: unknown) {
      console.error("Failed to find user: ", error);
      if (error instanceof FirebaseError) {
        setInfoMessage({
          actionButtonText: "",
          isPersisting: false,
          showMsg: true,
          isError: true,
          desc: "Failed to find user:",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div {...className(style.editNoteCon)}>
      <Form
        handleSubmit={handleEditNoteSubmit}
        handleCancel={resetDefaultNoteState}
        setIsDelConfOpen={setIsDelConfOpen}
        setIsShareNoteOpen={setIsShareNoteOpen}
        noteFormStyle={style.editNoteForm}
        noteBodyStyle={style.editNoteBody}
      />
      {isDelConfOpen && (
        <DeleteConfirmation
          handleSubmit={handleDeleteNoteSubmit}
          handleCancel={() => setIsDelConfOpen(false)}
        />
      )}
      {isShareNoteOpen && (
        <ShareNoteModal
          handleSubmit={handleShareNoteSubmit}
          handleCancel={() => setIsShareNoteOpen(false)}
        />
      )}
    </div>
  );
}

export default EditNote;
