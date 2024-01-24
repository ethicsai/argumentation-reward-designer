import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import {
  Dialog, DialogContent, DialogContentText, DialogTitle,
  IconButton, Toolbar, Tooltip, Typography
} from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import GitHubIcon from '@mui/icons-material/GitHub';
import HelpIcon from '@mui/icons-material/Help';
import ArticleIcon from '@mui/icons-material/Article';


const AppBar = styled(MuiAppBar)(
  ({ theme}) => ({
  zIndex: theme.zIndex.drawer + 1,
}));


export default function CustomizedAppBar() {

  const [isDialogOpened, setDialogOpened] = useState(false);

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
          <Tooltip title="Show help">
            <IconButton
              size="large"
              aria-label="show help"
              color="inherit"
              onClick={() => setDialogOpened(true)}
            >
              <HelpIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Open documentation in new tab">
            <IconButton
              size="large"
              aria-label="open documentation"
              color="inherit"
              href="./docs/index.html"
              target="_blank"
            >
              <ArticleIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
      <Dialog
        scroll="paper"
        open={isDialogOpened} onClose={() => setDialogOpened(false)}
      >
        <DialogTitle>
          Help
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            This tool helps you create argumentation graphs that represent
            moral values. Argumentation graphs are used to judge the behaviour
            of learning agents, with respect to a specific moral value. Graphs
            contain a set of arguments, and a set of attacks between arguments.
            <br /><br />
            Arguments can be:
            <ul>
              <li>
                <i>pros</i>, meaning that they argue that the currently judged
                agent's behaviour promotes the specific moral value;
              </li>
              <li>
                <i>cons</i>, meaning that they argue that the currently judged
                agent's behaviour defeats the specific moral value;
              </li>
              <li>
                <i>neutral</i>, meaning that they do not argue the currently
                judged agent's behaviour either promotes or defeats the
                specific moral value. Such arguments can be useful to build
                complex attack relationships.
              </li>
            </ul>
            Arguments also contain an <i>activation function</i> that determines
            when the argument should be taken into account ("alive"), based
            on the current situation. For example, an argument can only be
            activated if the current judged agent is a School, or if the
            current judged agent has a comfort higher than the mean of other
            agents' comforts.
            <br /><br />
            To create arguments, use the "Node creation" panel on the right
            hand-side, by filling the different fields then clicking on
            "Add new node". The new node will appear near the center of the
            graph, and can be moved by grabbing it.
            <br /><br />
            To modify an argument, click on its representing node to select it,
            then use the "Update node" right hand-side panel to change any of
            its fields. The argument can be deleted by selecting it, then
            pressing "Delete" on your keyboard. Click anywhere else to unselect
            the argument.
            <br /><br />
            Attacks can be created by dragging the cursor from an argument's
            handle (one of the black dots on the edges of the node representing
            the argument) to another argument's handle. A directed arrow will
            appear, meaning that the first argument "attacks" the second one.
            <br /><br />
            When you are satisfied with your argumentation graph, you may
            use the "Import / export graph" panel on the right hand-side to
            export it to a format that you can share, such as an PNG image,
            or a format that can be embedded in your application, such as
            Python code.
            <br /><br />
            You may also save it in your browser memory, to be able to quickly
            get back to the same graph later, by using the "Save / load"
            panel.
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </AppBar>
  );

};
