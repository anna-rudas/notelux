import React, { useContext } from "react";
import AddNote from "../components/AddNote";
import EditNote from "../components/EditNote";
import Notes from "../components/Notes";
import { AppContext } from "../context";
import PageWrapper from "../components/PageWrapper";

function Dashboard() {
  const { isEditing } = useContext(AppContext);

  return (
    <PageWrapper isAuthStyle={true}>
      <>
        <AddNote />
        <Notes />
        {isEditing && <EditNote />}
      </>
    </PageWrapper>
  );
}

export default Dashboard;
