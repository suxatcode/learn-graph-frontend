import { useState } from "react";
import { LanguageSelect } from "@src/GraphManager/LanguageSelect";
import { useUserDataContext } from "@src/Context/UserDataContext";
import { languageDict } from "./languageDict";
import { Text } from "@src/GraphManager/RPCHooks/types";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { Formik, FormikValues } from "formik";
import { useTranslation } from "react-i18next";
import { Check, Clear } from "@mui/icons-material";

const CONFIGS = {
  TIMEOUT_SUCCESS: 2000,
  TIMEOUT_ERROR: 5000,
};

type submitState = "none" | "awaiting" | "error" | "success";
interface TranslatedTextInput {
  onChange: (newValue: string) => void;
  inputText: Text;
  displayValue: string;
  onSubmit?: () => void; // if used as standalone, not within a form
  onReset: () => void;
  submitState?: submitState;
  isEnabled?: boolean;
  selectedLanguage: string;
  onLanguageSelect: (arg0: string) => void;
}

interface StandaloneInput {
  text: Text;
  onSubmit: (newValue: string) => Promise<"success">;
}

interface FormikInput {
  formik: ReturnType<typeof Formik<T>>;
  fieldName: keyof T;
}

const getTranslation = (text: Text, language: string): string => {
  return (
    text.translations.find(
      ({ language: itemLanguage }) => language === itemLanguage,
    )?.content ?? ""
  );
};

export const TranslatedTextStandalone = ({
  onSubmit,
  text,
}: StandaloneInput) => {
  const { language: UILanguage } = useUserDataContext();

  const initialText = getTranslation(text, UILanguage);

  const [selectedLanguage, setSelectedLanguage] = useState(UILanguage);
  const [displayedText, setDisplayedText] = useState(initialText);

  const [submissionState, setSubmissionState] = useState<submitState>("none");

  const handleLanguageChange = (languageString: string) => {
    setSelectedLanguage(languageString);
    setDisplayedText(getTranslation(text, languageString));
  };

  const handleReset = () => {
    const currentLanguageDefaultText = getTranslation(text, selectedLanguage);
    console.log("resetting ", initialText, currentLanguageDefaultText);

    setDisplayedText(currentLanguageDefaultText);
  };

  const handleSubmit = () => {
    setSubmissionState("awaiting");
    onSubmit(displayedText)
      .then(() => {
        setSubmissionState("success");
        setTimeout(() => {
          setSubmissionState("none");
        }, CONFIGS.TIMEOUT_SUCCESS);
      })
      .catch(() => {
        setSubmissionState("error");
        setTimeout(() => {
          setSubmissionState("none");
        }, CONFIGS.TIMEOUT_ERROR);
      });
  };

  return (
    <TranslatedText
      inputText={text}
      displayValue={displayedText}
      onChange={setDisplayedText}
      selectedLanguage={selectedLanguage}
      onLanguageSelect={handleLanguageChange}
      onSubmit={handleSubmit}
      submitState={submissionState}
      onReset={handleReset}
    />
  );
};

// const TranslatedTextFormik = ({ formik, fieldName, }: FormikInput) => {
//   const { language: UILanguage } = useUserDataContext();

//   const [selectedLanguage, setSelectedLanguage] = useState(UILanguage);

//   const fieldValue = formik.values[fieldName]
//   const displayValue = fieldValue.translations.find(({language}) => language === UILanguage)?.content ?? ''

//   return (
//     <TranslatedText
//     displayValue={displayValue}
//     inputText={fieldValue}
//     selectedLanguage={selectedLanguage}
//     setSelectedLanguage={setSelectedLanguage}

//     />
//   )
// }

export const TranslatedText = ({
  inputText,
  displayValue,
  onChange,
  onSubmit,
  submitState,
  isEnabled,
  onReset,
  selectedLanguage,
  onLanguageSelect,
}: TranslatedTextInput) => {
  let originalText = "";

  const { t } = useTranslation();

  const languageTextMap = new Map();
  inputText.translations.forEach(({ language, content }) => {
    languageTextMap.set(language, content);
    if (language === selectedLanguage) {
      originalText = content;
    }
  });

  const placeholderText =
    originalText || `🇺🇸 ${getTranslation(inputText, "en")}`;

  const hasInputChanged = displayValue !== originalText;

  const handleLanguageChange = (languageString: string) => {
    if (hasInputChanged) {
      // prompt confirm to drop changes, only then change
    }
    onLanguageSelect(languageString);
  };

  const isStandalone = Boolean(onSubmit);

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    onChange(event.target.value);

  return (
    <>
      <LanguageSelect
        buttonText={languageDict[selectedLanguage].displayIcon}
        buttonProps={{ variant: "outlined" }}
        selectedLanguage={selectedLanguage}
        onLanguageSelect={handleLanguageChange}
        languageTextMap={languageTextMap}
      />
      <TextField
        fullWidth
        value={displayValue}
        onChange={handleTextChange}
        placeholder={placeholderText}
        {...(isStandalone && {
          InputProps: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  sx={{ m: 0.1 }}
                  aria-label={t("submit")}
                  onClick={onSubmit}
                  edge="end"
                  disabled={!hasInputChanged}
                >
                  <Check />
                  {/* TODO: implement submission states */}
                </IconButton>
                <IconButton
                  sx={{ m: 0.1 }}
                  aria-label={t("reset")}
                  onClick={onReset}
                  edge="end"
                  disabled={!hasInputChanged}
                >
                  <Clear />
                </IconButton>
              </InputAdornment>
            ),
          },
        })}
      />
    </>
  );
};
