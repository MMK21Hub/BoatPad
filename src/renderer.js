const { Menu, MenuItem, BrowserWindow } = require("electron").remote

bp.window.createMiniWindow = () => {
    const miniWindow = new BrowserWindow({
        width: 800,
        height: 600,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
        },
    })
    miniWindow.loadFile("mini.html")
}
bp.view.zen ||= false

$(() => {
    if (!bp.view.zen) {
        $("#main-textbox").prop(
            "placeholder",
            `\
Welcome to BoatPad!
BoatPad is an advanced™ text editor capable of using the full set of unicode characters limitlessly.

Features:
 - Simple, easy to understand UI
 - Fully customizable: just hit Ctrl+Shift+I
 - No bloat
 - Runs smoothly
 - Resize the window to whatever size you like
 - Automatic text wrapping
 - Familiar keyboard shortcuts
`,
        )
    } else {
        $("#main-textbox").prop(
            "placeholder",
            `\
== BoatPad Immersive Window ==

Hit Ctrl+W to return to the main window.`,
        )
    }
})
