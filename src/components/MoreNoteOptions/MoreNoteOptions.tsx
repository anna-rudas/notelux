import React, { useContext, useEffect } from "react";
import * as style from "./MoreNoteOptions.module.css";
import * as shared from "../shared.module.css";
import { className } from "../../helpers";
import { AppContext } from "../../context";
import TrashIcon from "../../icons/TrashIcon";
import ShareIcon from "../../icons/ShareIcon";

type MoreNoteOptionsProps = {
  backgroundColor: string;
  setIsDelConfOpen?: (value: boolean) => void;
  setIsShareNoteOpen?: (value: boolean) => void;
};

function MoreNoteOptions({
  backgroundColor,
  setIsDelConfOpen,
  setIsShareNoteOpen,
}: MoreNoteOptionsProps) {
  const {
    moreNoteOptionsRef,
    isMoreNoteOptionsOpen,
    moreNoteOptionsButtonRef,
    setIsMoreNoteOptionsOpen,
    isLoading,
    user,
  } = useContext(AppContext);

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

  return (
    <div
      style={
        user?.theme === "light" ? { backgroundColor: backgroundColor } : {}
      }
      ref={moreNoteOptionsRef}
      {...className(style.moreOptionsCon, shared.shadow)}
    >
      <button
        disabled={isLoading}
        {...className(
          style.moreOptionsItem,
          isLoading ? shared.btnDisabled : ""
        )}
        onClick={() => {
          if (setIsShareNoteOpen) {
            setIsShareNoteOpen(true);
          }
        }}
        type="button"
      >
        <ShareIcon {...className(style.shareIcon)} />
        <span {...className(shared.normalText)}>Share note</span>
      </button>
      <button
        disabled={isLoading}
        {...className(
          style.moreOptionsItem,
          isLoading ? shared.btnDisabled : ""
        )}
        onClick={() => {
          if (setIsDelConfOpen) {
            setIsDelConfOpen(true);
          }
        }}
        type="button"
      >
        <TrashIcon {...className(style.trashIcon)} />
        <span {...className(shared.normalText)}>Delete note</span>
      </button>
    </div>
  );
}

export default MoreNoteOptions;
