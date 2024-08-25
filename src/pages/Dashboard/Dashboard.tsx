import React, { useContext } from "react";
import AddNote from "../../components/features/AddNote";
import EditNoteModal from "../../components/modals/EditNoteModal";
import Notes from "../../components/features/Notes";
import PageWrapper from "../../components/templates/PageWrapper";
import { DashboardContext } from "../../context/DashboardContext";

function Dashboard() {
  const { isEditing } = useContext(DashboardContext);

  return (
    <PageWrapper>
      <>
        <AddNote />
        <Notes />
        {isEditing && <EditNoteModal />}
      </>
    </PageWrapper>
  );
}

export default Dashboard;
