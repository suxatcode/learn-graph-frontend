import { useUserDataContext } from "@src/Context/UserDataContext";
import { LanguageSelect } from "../LanguageSelect";
import { ButtonProps, useMediaQuery, useTheme } from "@mui/material";
import TranslateIcon from "@mui/icons-material/Translate";

import i18n from "@src/shared/i18n";

export default function LocaleManager() {
  const { language, setLanguage } = useUserDataContext();

  const theme = useTheme();

  const isSmallScreen: boolean = useMediaQuery(theme.breakpoints.down("sm"));

  const buttonText = isSmallScreen
    ? i18n.t("switch-language-button-short")
    : i18n.t("switch-language-button");

  const buttonProps: ButtonProps = {
    variant: "contained",
    startIcon: <TranslateIcon />,
    sx: {
      maxWidth: isSmallScreen ? "100%" : "auto", // Set maximum width for small screens
      whiteSpace: "normal", // Allow text to wrap
      textOverflow: "ellipsis", // Add ellipsis if text overflows
      overflow: "hidden", // Hide overflowed content
    },
  };

  return (
    <LanguageSelect
      buttonProps={buttonProps}
      buttonText={buttonText}
      selectedLanguage={language}
      onLanguageSelect={setLanguage}
    />
  );
}
