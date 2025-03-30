import React, { useState, useContext, useEffect } from "react";
import GeneralInput from "../../inputs/GeneralInput";
import ModalContainer from "../../templates/ModalContainer";
import { shareNoteSchema } from "../../../utilities/validationSchemas";
import { FormikValues } from "formik";
import AddUserIcon from "../../../assets/icons/AddUserIcon";
import UserIcon from "../../../assets/icons/UserIcon";
import * as style from "./ShareNoteModal.module.css";
import { className } from "../../../utilities/helpers";
import { DashboardContext } from "../../../context/DashboardContext";
import { getUserEmailFromUserId } from "../../../services/userService";
import { AppContext } from "../../../context/AppContext";
import { getUserIdFromUserEmail } from "../../../services/userService";
import { updateNoteInDb } from "../../../services/noteService";

function ShareNoteModal() {
  const [activeNoteCollaborators, setActiveNoteCollaborators] = useState<
    string[] | null
  >(null);
  const { activeNote, setActiveNote, setIsShareNoteModalOpen } =
    useContext(DashboardContext);
  const { setIsLoading, setToastMessageContent } = useContext(AppContext);

  if (!activeNote) {
    return null;
  }

  useEffect(() => {
    setNoteCollaborators(activeNote.userId, activeNote.coUsers);
  }, [activeNote.coUsers]);

  const setNoteCollaborators = async (
    ownerId: string,
    coUserIds: string[]
  ): Promise<void> => {
    try {
      const noteOwnerEmail = await getUserEmailFromUserId(ownerId);
      const noteCollaborators = await Promise.all(
        coUserIds.map(async (currentUserId) => {
          return await getUserEmailFromUserId(currentUserId);
        })
      );

      const updatedNoteCollaborators = noteCollaborators.map((curr) => {
        if (curr === noteOwnerEmail) {
          return `${noteOwnerEmail} (owner)`;
        }
        return curr;
      });
      setActiveNoteCollaborators(updatedNoteCollaborators);
    } catch (error) {
      console.error("Error setting collaborators for note: ", error);
    }
  };

  const handleShareNoteSubmit = async (values: FormikValues) => {
    setIsLoading(true);

    try {
      //get user id
      const newUserId = await getUserIdFromUserEmail(values.newUserEmail);
      if (!newUserId) {
        setToastMessageContent({
          showMessage: true,
          actionButtonText: "",
          isPersisting: false,
          isError: true,
          description: "There is no user with this email address",
        });
      } else if (newUserId && activeNote.coUsers.indexOf(newUserId) >= 0) {
        setToastMessageContent({
          showMessage: true,
          actionButtonText: "",
          isPersisting: false,
          isError: true,
          description: "User already added",
        });
      } else if (newUserId !== "") {
        //set note
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
          setToastMessageContent({
            showMessage: true,
            actionButtonText: "",
            isPersisting: false,
            isError: false,
            description: "New user added",
          });
        } catch (error) {
          console.error("Failed to add collaborator: ", error);
          setToastMessageContent({
            actionButtonText: "",
            isPersisting: false,
            showMessage: true,
            isError: true,
            description: `Failed to add collaborator`,
          });
        }
      }
    } catch (error: unknown) {
      console.error("Failed to find user: ", error);
      setToastMessageContent({
        actionButtonText: "",
        isPersisting: false,
        showMessage: true,
        isError: true,
        description: "Failed to find user",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalContainer
      title="Add a collaborator to this note"
      handleSubmit={handleShareNoteSubmit}
      handleCancel={() => setIsShareNoteModalOpen(false)}
      primaryButtonText="Add user"
      initialFormValues={{ newUserEmail: "" }}
      validationSchema={shareNoteSchema}
    >
      <div {...className(style.collabCon)}>
        {activeNoteCollaborators?.map((currentUserEmail) => {
          if (currentUserEmail !== "") {
            return (
              <div key={currentUserEmail} {...className(style.collabItem)}>
                <div {...className(style.userIconCon)}>
                  <UserIcon {...className(style.userIcon)} />
                </div>
                <span>{currentUserEmail}</span>
              </div>
            );
          }
        })}
      </div>
      <div {...className(style.addUserCon)}>
        <AddUserIcon {...className(style.addUserIcon)} />
        <GeneralInput
          type="email"
          config={{ name: "newUserEmail" }}
          placeholder="Email address"
        />
      </div>
    </ModalContainer>
  );
}

export default ShareNoteModal;
