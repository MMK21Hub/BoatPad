const { Menu, MenuItem } = require("electron").remote;

document.querySelector("textarea").placeholder = `Welcome to BoatPad!
BoatPad is an advanced™ text editor capable of using the full set of unicode characters limitlessly.

Features:
 - Simple, easy to understand UI
 - Fully customizable: just hit Ctrl+Shift+I
 - No bloat
 - Runs smoothly
 - Resize the window to whatever size you like
 - Automatic text wrapping
 - Familiar keyboard shortcuts
`;

window.bp = {};
bp.view = {
  native: true,
  zen: true,
};

const menu = new Menu();
menu.append(
  new MenuItem({
    label: "View",
    submenu: [
      {
        role: "Toggle zen mode",
        click: () => {
          console.log("Test");
        },
      },
    ],
  })
);
