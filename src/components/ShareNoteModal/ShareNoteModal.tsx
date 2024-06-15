import React, { useContext } from "react";
import GeneralInput from "../GeneralInput";
import ModalContainer from "../ModalContainer";
import { shareNoteSchema } from "../../validationSchemas";
import { FormikValues } from "formik";
import AddUserIcon from "../../icons/AddUserIcon";
import UserIcon from "../../icons/UserIcon";
import * as style from "./ShareNoteModal.module.css";
import { className } from "../../helpers";
import { AppContext } from "../../context";

type EmailChangeConfirmationProps = {
  handleSubmit: (v: FormikValues) => void;
  setIsModalOpen: (value: boolean) => void;
};

function ShareNoteModal({
  handleSubmit,
  setIsModalOpen,
}: EmailChangeConfirmationProps) {
  const { activeNoteCollaborators } = useContext(AppContext);

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
