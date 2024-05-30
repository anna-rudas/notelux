import React, { useContext } from "react";
import AddNote from "../components/AddNote";
import EditNote from "../components/EditNote";
import Header from "../components/Header";
import Notes from "../components/Notes";
import { defaultTheme } from "../constants";
import { AppContext } from "../context";
import AccountDropdown from "../components/AccountDropdown";

function Dashboard() {
  const { isEditing, user, isDropdownOpen } = useContext(AppContext);

  return (
    <div className="wrapper" data-theme={user?.theme ?? defaultTheme}>
      <Header loggedInStyle={true} />
      {isDropdownOpen && <AccountDropdown />}
      <AddNote />
      <Notes />
      {isEditing && <EditNote />}
    </div>
  );
}

export default Dashboard;
