import React, { useState, useContext, useEffect } from "react";
import GeneralInput from "../GeneralInput";
import ModalContainer from "../ModalContainer";
import { shareNoteSchema } from "../../utilities/validationSchemas";
import { FormikValues } from "formik";
import AddUserIcon from "../../assets/icons/AddUserIcon";
import UserIcon from "../../assets/icons/UserIcon";
import * as style from "./ShareNoteModal.module.css";
import { className } from "../../utilities/helpers";
import { AppContext } from "../../context/AppContext";
import { DashboardContext } from "../../context/DashboardContext";

type EmailChangeConfirmationProps = {
  handleSubmit: (v: FormikValues) => void;
  setIsModalOpen: (value: boolean) => void;
};

function ShareNoteModal({
  handleSubmit,
  setIsModalOpen,
}: EmailChangeConfirmationProps) {
  const { getUserEmailById } = useContext(AppContext);
  const [activeNoteCollaborators, setActiveNoteCollaborators] = useState<
    string[] | null
  >(null);
  const { activeNote } = useContext(DashboardContext);

  useEffect(() => {
    if (activeNote) {
      setNoteCollaborators(activeNote.userId, activeNote.coUsers);
    }
  }, []);

  const setNoteCollaborators = async (
    ownerId: string,
    coUserIds: string[]
  ): Promise<void> => {
    const noteOwnerEmail = await getUserEmailById(ownerId);
    const noteCollaborators = await Promise.all(
      coUserIds.map(async (currentUserId) => {
        const temp = await getUserEmailById(currentUserId);
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
  };

  return (
    <ModalContainer
      title="Add a collaborator to this note"
      handleSubmit={handleSubmit}
      setIsModalOpen={setIsModalOpen}
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
