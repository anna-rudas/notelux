import React, { useContext } from "react";
import AddNote from "../../components/AddNote";
import EditNote from "../../components/EditNote";
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
        {isEditing && <EditNote />}
      </>
    </PageWrapper>
  );
}

export default Dashboard;
