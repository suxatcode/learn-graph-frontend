// TODO(skep): translate this file!
import {
  Box,
  Typography,
  Divider,
  Link as MuiLink,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { NavigationWithContent } from "./Navigation";

const TypographyMaxWidth = (props: any) => {
  return <Typography sx={{ maxWidth: "80ch", ...props.sx }} {...props} />;
};
const Href = (props: any) => {
  return <MuiLink {...props} target="_blank" rel="noopener noreferrer" />;
};

export const About = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  return (
    <NavigationWithContent
      withSideNavigation={true}
      content={
        <Box
          component="main"
          sx={{
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
            flexGrow: 1,
            padding: 3,
          }}
        >
          <TypographyMaxWidth variant="h4" gutterBottom id="about">
            {t("about.headline: About Us")}
          </TypographyMaxWidth>
          <TypographyMaxWidth paragraph>
            {t("about.mission-statement")}
          </TypographyMaxWidth>
          <TypographyMaxWidth paragraph>
            {t("about.what-is-learngraph")}
          </TypographyMaxWidth>

          <Divider sx={{ margin: "20px 0" }} />
          <TypographyMaxWidth variant="h5" gutterBottom id="gettinginvolved">
            {t("about.headline:getting-involved")}
          </TypographyMaxWidth>
          <TypographyMaxWidth paragraph>
            {t("about.Join our-followed-by-link") + " "}
            <Href href="https://discord.gg/DatEV4kNp6">Discord Server</Href>!
          </TypographyMaxWidth>
        </Box>
      }
    />
  );
};
