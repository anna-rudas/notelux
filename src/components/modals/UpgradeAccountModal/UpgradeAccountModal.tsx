import React, { useContext } from "react";
import ModalContainer from "../../templates/ModalContainer";
import { DashboardContext } from "../../../context/DashboardContext";
import { useNavigate } from "react-router-dom";

function UpgradeAccountModal() {
  const { setIsUpgradeAccountModalOpen } = useContext(DashboardContext);
  const navigate = useNavigate();

  const handleUpgradeAccountModalSubmit = () => {
    navigate("/upgrade-account");
  };

  return (
    <ModalContainer
      title="Upgrade your account"
      subtitle="You are an anonymous user. You cannot access account settings or certain functions such as note sharing, without upgrading to a permanent account."
      handleSubmit={handleUpgradeAccountModalSubmit}
      handleCancel={() => setIsUpgradeAccountModalOpen(false)}
      primaryButtonText="Upgrade account"
    />
  );
}

export default UpgradeAccountModal;
