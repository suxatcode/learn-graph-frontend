// TODO(skep): translate this file!
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Toolbar,
  AppBar,
  Drawer,
  useTheme,
  SxProps,
  Theme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import Button from "@mui/material/Button";
import { ReactNode, forwardRef, useState } from "react";
import LocaleManager from "./GraphManager/Header/LocaleManager";
import LoginManager from "./GraphManager/Header/LoginManager";
import { SearchBarProps, SearchField } from "./GraphManager/Header/Search";

const BarItems = styled("div")(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
}));

const LEARNGRAPH_HEADER_TEXT = "Learn Graph";

const LearngraphLOGO = (props: any) => {
  return (
    <Typography
      variant="h6"
      noWrap
      component="div"
      sx={{ ...props.sx }}
      {...props}
    >
      {LEARNGRAPH_HEADER_TEXT}
    </Typography>
  );
};

interface ListItemConfig {
  sectionID: string;
  buttonText: string;
}

const DisplayOnlyOnSmallScreen = forwardRef<
  HTMLDivElement,
  { children: ReactNode }
>(({ children }, ref) => {
  return (
    <Box
      ref={ref}
      sx={{
        flexShrink: 0,
        display: { xs: "block", sm: "none" },
      }}
    >
      {children}
    </Box>
  );
});

const DisplayOnlyOnLargeScreen = ({
  children,
  sx,
}: {
  children: ReactNode;
  sx?: SxProps<Theme>;
}) => {
  return (
    <Box
      sx={{
        flexShrink: 0,
        display: { xs: "none", sm: "block" },
        height: "100vh",
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

// Note: content must be used when withSideNavigation is true, if
// withSideNavigation is false, then other components can just be created after
// this one, i.e.
// ```js
// <NavigationWithContent withSideNavigation={true} content={<Other />} />
// // or
// <>
//  <NavigationWithContent />
//  <Other />
// </>
// ```
interface NavigationWithContentConfig {
  content?: ReactNode;
  alwaysDisplayNavDrawer?: boolean;
  withSideNavigation?: boolean;
  search?: SearchBarProps;
}

export const NavigationWithContent = (props: NavigationWithContentConfig) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const menuPalette = theme.palette.info;
  const scrollToSectionID = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else {
      console.log(`no element '${sectionId}' found`);
    }
  };
  const goToAboutSection = (sectionId: string) => {
    setIsDrawerOpen(false);
    navigate(`/about#${sectionId}`);
    scrollToSectionID(sectionId);
  };
  const ListItemSectionLink = (conf: ListItemConfig) => {
    return (
      <ListItemButton
        component={Link}
        to={`/about#${conf.sectionID}`}
        sx={{ paddingLeft: 2 }}
        onClick={() => goToAboutSection(conf.sectionID)}
      >
        <ListItemText primary={`${conf.buttonText}`} />
      </ListItemButton>
    );
  };
  const ListItemSubSectionLink = (conf: ListItemConfig) => {
    return (
      <ListItemButton
        sx={{
          fontSize: "smaller",
          borderLeft: `1px solid ${menuPalette.contrastText}`,
        }}
      >
        <ListItemSectionLink {...conf} />
      </ListItemButton>
    );
  };
  const ListItemGlobalLink = (conf: {
    globalPath: string;
    buttonText: string;
  }) => {
    return (
      <ListItemButton
        component={Link}
        to={`/${conf.globalPath}`}
        sx={{ paddingLeft: 2 }}
      >
        <ListItemText primary={`${conf.buttonText}`} />
      </ListItemButton>
    );
  };
  const menuColors = {
    background: menuPalette.main,
    color: menuPalette.contrastText,
  };
  const navigationList = (
    <List>
      <ListItemGlobalLink globalPath="" buttonText={LEARNGRAPH_HEADER_TEXT} />
      <Divider sx={{ margin: "20px 0" }} />
      <ListItemSectionLink sectionID={"about"} buttonText={"About"} />
      <List sx={{ paddingLeft: 2 }}>
        <ListItemSubSectionLink
          sectionID={"gettinginvolved"}
          buttonText={"Getting Involved!"}
        />
      </List>
      <Divider sx={{ margin: "20px 0" }} />
      <DisplayOnlyOnSmallScreen>
        <Typography variant="overline">Settings</Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: 1,
            gap: 1,
          }}
        >
          <ListItemButton component={LocaleManager} />
          <ListItemButton component={LoginManager} />{" "}
          {/* FIXME(skep): alignment only works for LocaleManager, but not for LoginManager ¯\_(ツ)_/¯ */}
        </Box>
      </DisplayOnlyOnSmallScreen>
    </List>
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const buttonAndNavDrawer = (
    <>
      <Button
        sx={menuColors}
        variant="contained"
        startIcon={<MenuIcon />}
        onClick={() => setIsDrawerOpen(true)}
      />
      <Drawer
        anchor="left"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        {navigationList}
      </Drawer>
    </>
  );
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          {props.alwaysDisplayNavDrawer ? (
            buttonAndNavDrawer
          ) : (
            <DisplayOnlyOnSmallScreen>
              {" "}
              {buttonAndNavDrawer}{" "}
            </DisplayOnlyOnSmallScreen>
          )}
          <LearngraphLOGO
            onClick={() => navigate("/")}
            sx={{
              ":hover": {
                cursor: "pointer",
              },
            }}
          />
          {props.search ? (
            <BarItems sx={{ alignItems: "left" }}>
              <SearchField props={props.search!} />
            </BarItems>
          ) : null}
          <Box sx={{ flexGrow: 1 }} />{" "}
          {/* Note: This Box pushes other bar-items to the right */}
          <BarItems sx={{ alignItems: "right" }}>
            <DisplayOnlyOnLargeScreen sx={{ height: "auto" }}>
              <LocaleManager />
              <LoginManager />
            </DisplayOnlyOnLargeScreen>
          </BarItems>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: "flex" }}>
        {props.withSideNavigation ? (
          <DisplayOnlyOnLargeScreen
            sx={{
              ...menuColors,
              color: theme.palette.text.primary,
              backgroundColor:
                theme.palette.mode === "light"
                  ? theme.palette.primary.main
                  : theme.palette.grey[800],
            }}
          >
            {navigationList}
          </DisplayOnlyOnLargeScreen>
        ) : null}
        {props.content ?? null}
      </Box>
    </>
  );
};
