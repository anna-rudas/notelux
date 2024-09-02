import React, { useContext } from "react";
import AddNote from "../../components/features/AddNote";
import EditNoteModal from "../../components/modals/EditNoteModal";
import Notes from "../../components/features/Notes";
import PageWrapper from "../../components/templates/PageWrapper";
import { DashboardContext } from "../../context/DashboardContext";
import { AppContext } from "../../context/AppContext";
import CreateAccountModal from "../../components/modals/CreateAccountModal";

function Dashboard() {
  const { isEditing, isCreateAccountModalOpen } = useContext(DashboardContext);
  const { termToSearch } = useContext(AppContext);

  return (
    <PageWrapper>
      <>
        {termToSearch == "" && <AddNote />}
        <Notes />
        {isEditing && <EditNoteModal />}
        {isCreateAccountModalOpen && <CreateAccountModal />}
      </>
    </PageWrapper>
  );
}

export default Dashboard;
