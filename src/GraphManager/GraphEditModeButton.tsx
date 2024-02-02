import * as React from "react";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Button from "@mui/material/Button";
import { Controller } from "./GraphEdit";
import { CircleContainer } from "./GraphEditCreateButton";
import { useUserDataContext } from "src/UserDataContext";

export const EditModeButton = ({ ctrl }: { ctrl: Controller }) => {
  const { userID } = useUserDataContext();
  const iconProp = { fontSize: 40 };
  const onClick = () => {
    if (!userID) {
      alert(`Please login.`); //TODO: translation
      return;
    }
    ctrl.mode.setIsEditMode(!ctrl.mode.isEditMode);
  };
  return (
    <Button id="basic-button" onClick={onClick}>
      <CircleContainer>
        {ctrl.mode.isEditMode ? (
          <EditIcon style={iconProp} />
        ) : (
          <VisibilityIcon style={iconProp} />
        )}
      </CircleContainer>
    </Button>
  );
};
