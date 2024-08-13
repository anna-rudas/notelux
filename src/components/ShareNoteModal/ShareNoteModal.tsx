import React, { useState, useContext, useEffect } from "react";
import GeneralInput from "../GeneralInput";
import ModalContainer from "../ModalContainer";
import { shareNoteSchema } from "../../utilities/validationSchemas";
import { FormikValues } from "formik";
import AddUserIcon from "../../assets/icons/AddUserIcon";
import UserIcon from "../../assets/icons/UserIcon";
import * as style from "./ShareNoteModal.module.css";
import { className } from "../../utilities/helpers";
import { DashboardContext } from "../../context/DashboardContext";
import { getUserEmailFromId } from "../../firestore/userService";

type EmailChangeConfirmationProps = {
  handleSubmit: (v: FormikValues) => void;
  handleCancel: () => void;
};

function ShareNoteModal({
  handleSubmit,
  handleCancel,
}: EmailChangeConfirmationProps) {
  const [activeNoteCollaborators, setActiveNoteCollaborators] = useState<
    string[] | null
  >(null);
  const { activeNote } = useContext(DashboardContext);

  useEffect(() => {
    if (activeNote) {
      setNoteCollaborators(activeNote.userId, activeNote.coUsers);
    }
  }, [activeNote?.coUsers]);

  const setNoteCollaborators = async (
    ownerId: string,
    coUserIds: string[]
  ): Promise<void> => {
    try {
      const noteOwnerEmail = await getUserEmailFromId(ownerId);
      const noteCollaborators = await Promise.all(
        coUserIds.map(async (currentUserId) => {
          const temp = await getUserEmailFromId(currentUserId);
          return temp;
        })
      );

      const temp = noteCollaborators.map((curr) => {
        if (curr === noteOwnerEmail) {
          return `${noteOwnerEmail} (owner)`;
        }
        return curr;
      });
      setActiveNoteCollaborators(temp);
    } catch (error) {
      console.error("Error setting collaborators for note: ", error);
    }
  };

  return (
    <ModalContainer
      title="Add a collaborator to this note"
      handleSubmit={handleSubmit}
      handleCancel={handleCancel}
      primaryButtonText="Add user"
      initialFormValues={{ newUserEmail: "" }}
      validationSchema={shareNoteSchema}
    >
      <div {...className(style.collabCon)}>
        {activeNoteCollaborators?.map((currentUserEmail) => {
          return (
            <div key={currentUserEmail} {...className(style.collabItem)}>
              <div {...className(style.userIconCon)}>
                <UserIcon {...className(style.userIcon)} />
              </div>
              <span>{currentUserEmail}</span>
            </div>
          );
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
