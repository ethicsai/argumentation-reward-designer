import './App.css';

import React from 'react';
import { ReactFlowProvider } from "reactflow";
import { SnackbarProvider } from "notistack";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import CustomizedAppBar from "./components/AppBar";
import CustomizedDrawer from "./components/Drawer";
import FlowPanel from "./components/FlowPanel";


function App() {

  const defaultTheme = createTheme({
    drawerWidth: 300,
  });

  return (
    <ThemeProvider theme={defaultTheme}>
      <ReactFlowProvider>
        <SnackbarProvider maxSnack={3}>
          <Box sx={{ display: 'flex', width: '100vw', height: '100vh' }}>
            <CssBaseline />
            <CustomizedAppBar position="absolute" />
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                // height: '100%',
                // overflow: 'auto',
              }}
            >
              <Toolbar />
              <FlowPanel />
            </Box>
            <CustomizedDrawer />
          </Box>
        </SnackbarProvider>
      </ReactFlowProvider>
    </ThemeProvider>
  );

}

export default App;
