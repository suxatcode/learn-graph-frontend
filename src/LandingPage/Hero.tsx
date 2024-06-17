import { alpha, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { Link } from "react-router-dom";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Trans, useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  TranslatedText,
  TranslatedTextStandalone,
} from "@src/shared/TranslatedText";

export default function Hero() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();

  // TODO: mock, delete me
  function delayedSuccess(): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("success");
      }, 2000);
    });
  }

  const headerText = (
    <Typography
      component="h1"
      variant="h1"
      sx={{
        display: "flex",
        flexDirection: { xs: "column" },
        alignSelf: "center",
        textAlign: "center",
        color:
          theme.palette.mode === "light"
            ? theme.palette.text.primary
            : theme.palette.text.primary,
        "& strong": {
          color:
            theme.palette.mode === "light" ? "primary.main" : "primary.dark",
        },
      }}
    >
      <Trans i18nKey="landing.header" />
    </Typography>
  );

  return (
    <Box
      id="hero"
      sx={(theme) => ({
        width: "100%",
        backgroundImage:
          theme.palette.mode === "light"
            ? `linear-gradient(180deg, ${theme.palette.primary.light}, ${theme.palette.background.default})`
            : `linear-gradient(${theme.palette.primary.dark}, ${theme.palette.background.default})`,
        backgroundSize: "100% 20%",
        backgroundRepeat: "no-repeat",
        color: theme.palette.text.secondary,
      })}
    >
      <TranslatedTextStandalone
        onSubmit={delayedSuccess}
        text={{
          translations: [{ language: "en", content: "im an eng text" }],
        }}
      />
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: { xs: 14, sm: 20 },
          pb: { xs: 8, sm: 12 },
          gap: 2,
        }}
      >
        <Stack spacing={2} useFlexGap sx={{ width: { xs: "100%", sm: "70%" } }}>
          <Typography
            component="h1"
            variant="h1"
            sx={{
              display: "flex",
              flexDirection: { xs: "column" },
              alignSelf: "center",
              textAlign: "center",
              color:
                theme.palette.mode === "light"
                  ? theme.palette.text.primary
                  : theme.palette.text.primary,
            }}
          >
            {headerText}
          </Typography>
          <Typography
            variant="body1"
            textAlign="center"
            color="text.secondary"
            sx={{
              whiteSpace: "pre-line",
              color:
                theme.palette.mode === "light"
                  ? "text.secondary"
                  : "text.secondary",
            }}
          >
            {t("landing.intro")}
          </Typography>
        </Stack>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Link to="/graph">
            <Box
              id="image"
              sx={{
                mt: { xs: 8, sm: 10 },
                alignSelf: "center",
                height: { xs: 200, sm: 700 },
                width: "100%",
                backgroundImage:
                  theme.palette.mode === "light"
                    ? 'url("/screenshot_learngraph.png")'
                    : 'url("/screenshot_learngraph.png")',
                backgroundSize: "cover",
                borderRadius: "10px",
                outline: "1px solid",
                outlineColor:
                  theme.palette.mode === "light"
                    ? alpha("#BFCCD9", 0.5)
                    : alpha("#9CCCFC", 0.1),
                boxShadow:
                  theme.palette.mode === "light"
                    ? `0 0 12px 8px ${alpha("#9CCCFC", 0.2)}`
                    : `0 0 24px 12px ${alpha("#033363", 0.2)}`,
              }}
            />
          </Link>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignSelf="center"
            spacing={1}
            useFlexGap
            alignItems={"center"}
            sx={{
              width: { xs: "100%", sm: "auto" },
            }}
          >
            <Typography variant="body1">
              {t("landing.hintClickImage")}
            </Typography>
            <Button
              onClick={() => navigate("/graph")}
              variant="contained"
              color="primary"
            >
              {t("landing.buttonGoToGraph")}
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
