import React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import NodeSidePanel from "./NodeSidePanel";
import ImportExportPanel from "./ImportExportPanel";
import SaveLoadPanel from "./SaveLoadPanel";


const StyledDrawer = styled(MuiDrawer)(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      flexShrink: 0,
      width: theme.drawerWidth,
      boxSizing: 'border-box',
    },
  }),
);


export default function CustomizedDrawer() {

  return (
    <StyledDrawer
      variant="permanent"
      anchor="right"
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <NodeSidePanel />
        <ImportExportPanel />
        <SaveLoadPanel />
      </Box>
    </StyledDrawer>
  );

};
