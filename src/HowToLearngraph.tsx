import { ReactNode, useLayoutEffect, useRef, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import Image from "mui-image";
import { NavigationWithContent } from "./Navigation";
import { Rectangle } from "./GraphManager/utils";

const HowToImage = (props: { availableSpace: Rectangle; src: string }) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Image
        src={props.src}
        fit="contain"
        width={props.availableSpace.width / 3}
        height={props.availableSpace.height / 3}
      />
    </Box>
  );
};
const HowToTypography = (props: { children: ReactNode }) => {
  return <Typography sx={{ maxWidth: "100ch" }}>{props.children}</Typography>;
};

export const HowToLearngraph = () => {
  const theme = useTheme();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const defaultSize = {
    height: 400,
    width: 600,
  };
  const [availableSpace, setAvailableSpace] = useState<Rectangle>(defaultSize);
  useLayoutEffect(() => {
    setAvailableSpace(
      wrapperRef.current?.getBoundingClientRect() ?? defaultSize,
    );
  }, []);
  return (
    <>
      <NavigationWithContent
        withSideNavigation={true}
        content={
          <Box sx={{ padding: theme.spacing(4) }} ref={wrapperRef}>
            <Typography sx={{ paddingBottom: theme.spacing(4) }} variant="h3">
              How to use the Learngraph {/*TODO(skep): lg-logo*/}
            </Typography>
            <HowToTypography>
              The Learngraph is a map of Learning dependencies. In this image
              you can see that in order to understand multiplication you need to
              learn about addition.
            </HowToTypography>
            <HowToImage src="HowTo-link.png" availableSpace={availableSpace} />
            <HowToTypography>
              There is no way around learning addition first so the connection
              between them is strong.
            </HowToTypography>
          </Box>
        }
      />
    </>
  );
};
