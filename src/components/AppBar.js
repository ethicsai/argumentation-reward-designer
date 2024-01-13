import React from "react";
import { styled } from "@mui/material/styles";
import {
  IconButton, Toolbar, Tooltip, Typography
} from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import GitHubIcon from '@mui/icons-material/GitHub';
import HelpIcon from '@mui/icons-material/Help';


const AppBar = styled(MuiAppBar)(
  ({ theme}) => ({
  zIndex: theme.zIndex.drawer + 1,
}));


export default function CustomizedAppBar() {

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography
          variant="h6"
          noWrap
          component="h1"
        >
          Argumentation Reward Designer
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Box>
          <Tooltip title="Open project on GitHub">
            <IconButton
              size="large"
              aria-label="open project github"
              color="inherit"
              href="https://github.com/ethicsai/argumentation-reward-designer/"
            >
              <GitHubIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );

};
