import React, { useContext, useEffect } from "react";
import * as style from "./MoreNoteOptions.module.css";
import * as shared from "../../../assets/styles/shared.module.css";
import * as textStyles from "../../../assets/styles/text-styles.module.css";
import { className } from "../../../utilities/helpers";
import { AppContext } from "../../../context/AppContext";
import TrashIcon from "../../../assets/icons/TrashIcon";
import ShareIcon from "../../../assets/icons/ShareIcon";
import { DashboardContext } from "../../../context/DashboardContext";
import FocusTrap from "focus-trap-react";

type MoreNoteOptionsProps = {
  backgroundColor: string;
  optionsContainerStyle: string;
};

function MoreNoteOptions({
  backgroundColor,
  optionsContainerStyle,
}: MoreNoteOptionsProps) {
  const { isLoading, user, anonymousUserId } = useContext(AppContext);

  const {
    moreNoteOptionsRef,
    isMoreNoteOptionsOpen,
    moreNoteOptionsButtonRef,
    setIsMoreNoteOptionsOpen,
    setIsDeleteNoteModalOpen,
    setIsShareNoteModalOpen,
    setIsCreateAccountModalOpen,
  } = useContext(DashboardContext);

  const handleClickOutside = (event: MouseEvent) => {
    if (moreNoteOptionsRef && moreNoteOptionsButtonRef) {
      if (
        moreNoteOptionsRef.current &&
        moreNoteOptionsButtonRef.current &&
        !moreNoteOptionsRef.current.contains(event.target as Node) &&
        !moreNoteOptionsButtonRef.current.contains(event.target as Node)
      ) {
        setIsMoreNoteOptionsOpen(false);
      }
    }
  };

  useEffect(() => {
    if (isMoreNoteOptionsOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isMoreNoteOptionsOpen]);

  const handleClickShareNoteButton = () => {
    if (anonymousUserId) {
      setIsCreateAccountModalOpen(true);
    } else {
      setIsShareNoteModalOpen(true);
    }
  };

  return (
    <FocusTrap
      focusTrapOptions={{
        allowOutsideClick: true,
        onDeactivate: () => {
          setIsMoreNoteOptionsOpen(false);
        },
      }}
    >
      <div
        style={user?.theme === "light" ? { backgroundColor } : {}}
        ref={moreNoteOptionsRef}
        {...className(
          style.moreOptionsCon,
          shared.shadow,
          optionsContainerStyle
        )}
      >
        <button
          disabled={isLoading}
          {...className(style.moreOptionsItem)}
          onClick={handleClickShareNoteButton}
          type="button"
        >
          <ShareIcon {...className(style.shareIcon)} />
          <span {...className(textStyles.normalText)}>Share</span>
        </button>
        <button
          disabled={isLoading}
          {...className(style.moreOptionsItem)}
          onClick={() => setIsDeleteNoteModalOpen(true)}
          type="button"
        >
          <TrashIcon {...className(style.trashIcon)} />
          <span {...className(textStyles.normalText)}>Delete</span>
        </button>
      </div>
    </FocusTrap>
  );
}

export default MoreNoteOptions;
