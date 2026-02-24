import type { ContainerProps } from "@mui/material";
import { Container } from "@mui/material";
import { styled } from "@mui/material/styles";

const MainContentContainer = styled(Container)(({ theme }) => ({
  backgroundColor: theme.palette.brand.surfaceBackground,
  borderRadius: "12px",
  overflow: "auto",
  // Fix border radius when scrollbar appears
  "&::-webkit-scrollbar": {
    width: "12px",
  },
  "&::-webkit-scrollbar-track": {
    background: "transparent",
    borderRadius: "0 12px 12px 0",
    margin: "8px 0", // Add margin to create space at top and bottom
  },
  "&::-webkit-scrollbar-thumb": {
    background: theme.palette.grey[600],
    borderRadius: "6px",
    border: "2px solid transparent",
    backgroundClip: "content-box",
    "&:hover": {
      background: theme.palette.grey[700],
      backgroundClip: "content-box",
    },
  },
  "&::-webkit-scrollbar-corner": {
    background: "transparent",
  },
})) as typeof Container;

interface MainContentContainerWithPropsProps extends ContainerProps {
  /** Whether a filter component is present above this container */
  hasFilter?: boolean;
  /** Height of the filter component in pixels (default: 80px) */
  filterHeight?: number;
  /** Height of the navbar/topbar in pixels (default: 64px) */
  navbarHeight?: number;
}

/**
 * MainContentContainer with dynamic height calculation
 *
 * This component calculates its height based on the viewport height minus
 * the navbar height and optionally minus the filter height if a filter is present.
 *
 * @param hasFilter - Set to true if there's a filter component above this container
 * @param filterHeight - Height of the filter component in pixels (default: 80px)
 * @param navbarHeight - Height of the navbar in pixels (default: 64px)
 * @param props - All other ContainerProps are passed through
 */
const MainContentContainerWithProps = ({
  hasFilter = false,
  filterHeight = 65,
  navbarHeight = 81,
  ...props
}: MainContentContainerWithPropsProps) => {
  const availableHeight = `calc(100vh - ${navbarHeight}px${
    hasFilter ? ` - ${filterHeight}px` : ""
  })`;

  return (
    <MainContentContainer
      disableGutters
      maxWidth={false}
      sx={{
        display: "flex",
        flexDirection: "column",
        height: availableHeight,
        overflow: "auto",
        // Additional styling to ensure border radius is preserved
        "& > *": {
          borderRadius: "inherit",
        },
        ...(props.sx || {}),
      }}
      {...props}
    />
  );
};

export default MainContentContainerWithProps;
