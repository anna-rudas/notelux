import React, { useContext } from "react";
import AddNote from "../components/AddNote";
import EditNote from "../components/EditNote";
import Header from "../components/Header";
import Notes from "../components/Notes";
import { defaultTheme } from "../constants";
import { AppContext } from "../context";

function Dashboard() {
  const { isEditing, user } = useContext(AppContext);

  return (
    <div className="wrapper" data-theme={user?.theme ?? defaultTheme}>
      <Header loggedInStyle={true} />
      <AddNote />
      <Notes />
      {isEditing && <EditNote />}
    </div>
  );
}

export default Dashboard;
