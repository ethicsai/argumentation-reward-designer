import * as React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';


export default function DropdownButton({
  /* The list of items to display in the menu.
     Each item must be either a string or an object `{ label, disabled, onClick }`. */
  menuItems,
  /* The callback when clicking on the "main" button.
     Signature: (event, currently selected index, currently selected item) */
  handleClick,
  /* The callback when clicking one of the items in the dropdown menu.
     By default, simply changes the selection.
     Signature: (event, selected index, selected item) */
  handleMenuItemClick = undefined,
  /* The (optional) item to display for the "main" button.
     By default, the currently selected menu item. */
  buttonTitle = undefined,
  /* The (optional) icon to display in front of the "main" button. */
  startIcon = undefined,
  /* The aria-label (for accessibility). */
  ariaLabel = undefined,
}) {

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  /* Set default handler when clicking on a menu item, if not defined.
     This handler simply changes the selectedIndex. */
  if (!handleMenuItemClick) {
    handleMenuItemClick = (event, index, item) => {
      setSelectedIndex(index);
      setOpen(false);
    };
  }

  /**
   * Opens and closes the dropdown menu. Callback for the 2nd button.
   */
  const handleToggle = () => {
    setOpen(!open);
  };

  /**
   * Closes the menu, e.g., when clicking anywhere else on the screen.
   */
  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  /* Helpers for handling object or string options. */
  const getOptionKey = (option) => {
    if (typeof option === 'object') {
      return option?.label ?? '';
    } else {
      return option;
    }
  }
  const getOptionDisabled = (option) => {
    if (typeof option === 'object') {
      return option?.disabled ?? false;
    } else {
      return false;
    }
  }


  return (
    <React.Fragment>
      <ButtonGroup variant="contained" ref={anchorRef} aria-label="split button">
        <Button startIcon={startIcon} onClick={(event) => handleClick(event, selectedIndex, menuItems[selectedIndex])}>
          {buttonTitle ?? menuItems[selectedIndex]}
        </Button>
        <Button
          size="small"
          aria-controls={open ? 'split-button-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-label={ariaLabel}
          aria-haspopup="menu"
          onClick={handleToggle}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper
        sx={{
          zIndex: 1,
        }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  {menuItems.map((option, index) => (
                    <MenuItem
                      key={getOptionKey(option)}
                      selected={index === selectedIndex}
                      disabled={getOptionDisabled(option)}
                      onClick={(event) => {
                        if (typeof option === 'object' && option?.onClick) {
                          option.onClick(event, index, menuItems[index])
                        } else {
                          handleMenuItemClick(event, index, menuItems[index])
                        }
                      }}
                    >
                      {getOptionKey(option)}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </React.Fragment>
  );
}
