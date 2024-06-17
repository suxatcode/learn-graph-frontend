import { ListItemText, Menu, MenuItem } from "@mui/material";
import { languageDict } from "@src/shared/languageDict";

import Button, { ButtonProps } from "@mui/material/Button";
import { ReactNode, useState } from "react";

interface LanguageSelectProps {
  onLanguageSelect: (arg0: string) => void;
  selectedLanguage: string;
  buttonProps: ButtonProps;
  buttonText: ReactNode;
  languageTextMap?: Map<string, string>;
}

export const LanguageSelect = ({
  buttonProps,
  buttonText,
  selectedLanguage,
  onLanguageSelect,
  languageTextMap,
}: LanguageSelectProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isOpen = Boolean(anchorEl);
  const hasLanguageTextMap = Boolean(languageTextMap);

  const handleItemSelect = (languageString: string) => {
    setAnchorEl(null);
    if (!languageString) {
      return;
    }
    if (languageString !== selectedLanguage) {
      onLanguageSelect(languageString);
    }
  };

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <>
      <Button
        {...buttonProps}
        onClick={handleButtonClick}
        aria-label="switch language"
      >
        {buttonText}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={isOpen}
        onClose={() => setAnchorEl(null)}
        MenuListProps={{
          "aria-labelledby": "switch language",
        }}
      >
        {Object.entries(languageDict).map(
          ([languageString, languageProperties]) => {
            let displayItem = <></>;
            if (hasLanguageTextMap) {
              displayItem = (
                <ListItemText
                  title={languageProperties.displayText}
                >{`${languageProperties.displayIcon} ${languageTextMap?.get(languageString) ?? "-"}`}</ListItemText>
              );
            } else {
              displayItem = (
                <ListItemText>{`${languageProperties.displayIcon} ${languageProperties.displayText}`}</ListItemText>
              );
            }

            return (
              <MenuItem
                onClick={() => handleItemSelect(languageString)}
                key={languageString}
              >
                {displayItem}
              </MenuItem>
            );
          },
        )}
      </Menu>
    </>
  );
};
