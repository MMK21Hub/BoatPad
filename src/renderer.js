const {
    Menu,
    MenuItem,
    BrowserWindow,
    systemPreferences,
} = require("electron").remote
const remote = require("electron").remote

bp.window.currentWindow = remote.getCurrentWindow()

bp.window.createMiniWindow = () => {
    const miniWindow = new BrowserWindow({
        width: 250,
        height: 250,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
        },
        alwaysOnTop: true,
    })
    miniWindow.loadFile("mini.html")
}
bp.view.zen ||= false

/*const contextMenu = new Menu()
contextMenu.append(
    new MenuItem({
        label: "Test",
        click() {
        },
    }),
)
contextMenu.append(new MenuItem({ type: "separator" }))
contextMenu.append(
    new MenuItem({ label: "MenuItem2", type: "checkbox", checked: true }),
)

window.addEventListener(
    "contextmenu",
    (ctx) => {
        ctx.preventDefault()
        contextMenu.popup({ window: remote.getCurrentWindow() })
    },
    false,
)*/

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
        bp.commands.list = {
            "window.close": {
                name: "Window: Close",
                type: "handled",
                handler: () => {
                    window.close()
                },
                args: null,
            },
        }
        bp.commands.reservedNamespaces = [
            "window",
            "file",
            "debug",
            "editor",
            "config",
            "edit",
            "view",
        ]
        bp.commands.register = (id, name, type, handler, args) => {
            if (!id) {
                throw "Error: The id parameter is required."
            } else if (type && (type != "simple" || type != "handled")) {
                throw "Error: Invalid command type."
            } else if (id.split(".").length === 1) {
                throw "Error: Command ids must be namespaced."
            } else if (bp.commands.list.hasOwnProperty(id)) {
                throw "Error: That command has already been registered!"
            } else if (!handler) {
                throw "Error: The handler parameter is required."
            } else if (type != "handled" && typeof handler != "function") {
                throw "Error: The handler parameter must be a javascript function."
            } else if (
                bp.commands.reservedNamespaces.includes(id.split(".")[0])
            ) {
                throw "Error: You cannot add a command to a reserved namespace."
            } else {
                type ||= "handled"
                args ||= null
                bp.commands.list[id] = {
                    name: name,
                    type: type,
                    handler: handler,
                    args: args,
                }
                return bp.commands.list[id]
            }
        }
        bp.commands.exec = (command, args) => {
            if (!command) {
                throw "Error: The command parameter is required."
            } else if (bp.commands.list.hasOwnProperty(command)) {
                return bp.commands.list[command].handler(args)
            } else {
                throw "Error: That command doesn't exist"
            }
        }
    } else {
        $("#main-textbox")
            .prop(
                "placeholder",
                `\
== BoatPad Immersive Window ==

Hit Ctrl+W to return to the main window.`,
            )
            .css("border-color", "#" + systemPreferences.getAccentColor())
            .css("border-width", "1px")
            .css("border-style", "solid")
        $("body").addClass("zen")
    }
})
