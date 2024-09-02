import React, { useContext } from "react";
import ModalContainer from "../../templates/ModalContainer";
import { DashboardContext } from "../../../context/DashboardContext";
import { useNavigate } from "react-router-dom";

function CreateAccountModal() {
  const { setIsCreateAccountModalOpen } = useContext(DashboardContext);
  const navigate = useNavigate();

  const handleCreateAccountModalSubmit = () => {
    navigate("/create-account");
  };

  return (
    <ModalContainer
      title="Create your account"
      subtitle="You are an anonymous user. You cannot access account settings or certain functions such as note sharing, without creating a permanent account."
      handleSubmit={handleCreateAccountModalSubmit}
      handleCancel={() => setIsCreateAccountModalOpen(false)}
      primaryButtonText="Create account"
    />
  );
}

export default CreateAccountModal;
