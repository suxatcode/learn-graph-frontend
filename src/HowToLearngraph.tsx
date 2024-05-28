//TODO: Translation
import { ReactNode } from "react";
import { Box, Container, Typography, useTheme } from "@mui/material";
import Image from "mui-image";
import { NavigationWithContent } from "./Navigation";
import { Add, Edit } from "@mui/icons-material";

const HowToImage = (props: { src: string; alt: string }) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
      <Image src={props.src} alt={props.alt} fit="contain" width="50%" />
    </Box>
  );
};
const HowToTypography = (props: { children: ReactNode }) => {
  return <Typography sx={{ maxWidth: "100ch" }}>{props.children}</Typography>;
};
const HowToTopic = (props: { children: ReactNode }) => {
  const theme = useTheme();
  return (
    <Typography
      sx={{
        paddingBottom: theme.spacing(2),
        paddingTop: theme.spacing(2),
      }}
      variant="h2"
    >
      {props.children}
    </Typography>
  );
};

export const HowToLearngraph = () => {
  const theme = useTheme();

  return (
    <>
      <NavigationWithContent
        withSideNavigation={true}
        content={
          <Box
            sx={{
              width: "100%",
              backgroundColor: theme.palette.background.default,
              color: theme.palette.text.primary,
            }}
          >
            <Container
              sx={{
                padding: theme.spacing(4),
              }}
              component="main"
            >
              <Typography sx={{ paddingBottom: theme.spacing(4) }} variant="h1">
                How to use the learngraph {/*TODO(skep): lg-logo*/}
              </Typography>
              <HowToTypography>
                The learngraph is a map of learning dependencies. In this image
                you can see that in order to understand multiplication you need
                to learn about addition.
              </HowToTypography>
              <HowToImage
                src="HowTo-link.png"
                alt="Two blobs one labeled Multiplication the other labeled Addition are visible. An arrow pointing towards Addition connects those two."
              />
              <HowToTypography>
                There is no way around learning addition first so the connection
                between them is strong. The Arrow always points you towards the
                things you have to learn to understand a given topic. Clicking
                on a topic reveals learning resources and infos about the most
                important learning dependencies.
              </HowToTypography>

              <HowToTopic>Interact with the learngraph</HowToTopic>
              <HowToTypography>
                <ul>
                  <li>
                    Click the <Edit fontSize="small" /> icon to switch between
                    Edit and view-only mode
                  </li>
                  <li>Search for subjects using the search bar</li>
                  <li>
                    Click on any topic (in edit mode) to reveal learning
                    resources
                  </li>
                </ul>
                The <Edit fontSize="small" /> icon lets you switch between edit
                and read-only mode. Move the subject toward its prerequisite
                knowledge to create a new link. Alternatively use the
                <Add fontSize="small" /> icon &gt; "New dependency" dialogue
                Select an existing link to vote on the strength of the
                connection. To add a new Topic use the <Add fontSize="small" />{" "}
                icon &gt; "New subject" dialogue.
              </HowToTypography>

              <HowToTopic> Translations </HowToTopic>
              <HowToImage src="HowTo-translation-de-en.png" alt="" />
              <HowToTypography>
                You may find some subjects in a different language than your
                selected one. They are marked by the corresponding country flag.
                You can translate subjects to your selected language by editing
                the subject and removing the flag icon. To insert a translation
                in a different language than your currently selected on, first
                change your language settings and then proceed with the
                translation.
              </HowToTypography>
              <HowToTopic>The Merge Zoom</HowToTopic>
              <HowToImage src="HowTo-Toolbar.png" alt="" />
              <HowToTypography>
                Some topics are more connected than other ones. Those might be
                more important than other things to learn about. The zoom slider
                on the right hand side groups areas of knowledge under the
                banner of the topic that is required the most ie. has the
                highest amount of arrows pointing toward it.
              </HowToTypography>
            </Container>
          </Box>
        }
      />
    </>
  );
};
