import React, { useContext } from "react";
import AddNote from "../../components/AddNote";
import EditNoteModal from "../../components/EditNoteModal";
import Notes from "../../components/Notes";
import PageWrapper from "../../components/PageWrapper";
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
