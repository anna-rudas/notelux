import React, { useContext } from "react";
import AddNote from "../components/AddNote";
import EditNote from "../components/EditNote";
import Notes from "../components/Notes";
import { AppContext } from "../context";
import PageWrapper from "../components/PageWrapper";
import InformationMessage from "../components/InformationMessage";

function Dashboard() {
  const { isEditing, infoMessage } = useContext(AppContext);

  return (
    <PageWrapper isAuthStlye={true}>
      <>
        <AddNote />
        <Notes />
        {isEditing && <EditNote />}
        {infoMessage.showMsg && (
          <InformationMessage
            description={infoMessage.desc}
            isError={infoMessage.isError}
          />
        )}
      </>
    </PageWrapper>
  );
}

export default Dashboard;
