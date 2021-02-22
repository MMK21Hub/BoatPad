const {
    Menu,
    MenuItem,
    BrowserWindow,
    systemPreferences,
} = require("electron").remote
const remote = require("electron").remote
const fs = require("fs")
//const fsp = fs.promises
const path = require("path")
const acorn = require("acorn")

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

function runHook(hook) {
    if (!hook) {
        throw "Error: The hook parameter is required."
    } else if (!bp.hooks.list[hook]) {
        throw "Error: That hook doesn't exist"
    }
    bp.hooks.list[hook].handlers.forEach((handler) => {
        handler()
    })
}

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

// Init the .boatpad dir
fs.mkdir("./.boatpad/", () => {})

// Scripts:
bp.scripts.list = []
bp.scripts.register = (path) => {
    if (!path) {
        throw "Error: The path parameter is required."
    } else {
        throw "Error: Tried to register script from unsafe source"
    }
}
// Register any new scripts:
if (fs.existsSync("./.boatpad/scripts/")) {
    fs.readdir("./.boatpad/scripts/", (err, files) => {
        files.forEach((file) => {
            if (path.extname(file) === ".js") {
                // We found a script!
                console.log("Registering " + file)
                validScript = true
                try {
                    acorn.parse(fs.readFileSync("./.boatpad/scripts/" + file), {
                        ecmaVersion: 2020,
                        sourceType: "module",
                    })
                } catch (error) {
                    console.error(
                        `Failed to parse script when registering (${file}). Scripts must be valid ES2020. \n${error.message}`,
                    )
                    validScript = false
                }
                if (validScript) {
                    bp.scripts.list.push({
                        name: file,
                        id: file.split(".")[0], // TODO: prevent duplicate IDs
                        path: "../.boatpad/scripts/" + file,
                        enabled: true,
                    })
                }
            } else if (path.extname(file) === ".ts") {
                console.warn(
                    "Skipping typescript file in scripts folder: " + file,
                )
            }
        })
        console.log("All scripts registered")

        // Load scripts:
        console.log(`Loading ${bp.scripts.list.length} script(s)`)
        for (let i in bp.scripts.list) {
            bp.scripts.list[i].content = require(bp.scripts.list[i].path)
            bp.scripts.list[i].content.script()
        }
    })
}

// Commands:
bp.commands.list = {
    "window.close": {
        name: "Window: Close",
        type: "handled",
        handler: () => {
            window.close()
        },
        args: null,
    },
    "debug.return": {
        name: "Debug: Return",
        type: "handled",
        handler: (args) => {
            console.log(args[0])
        },
        args: 1,
    },
    "debug.test": {
        name: "Debug: Test",
        type: "handled",
        handler: (args) => {
            console.log("Hello world!")
        },
        args: null,
    },
}
bp.commands.reservedNamespaces = [
    "window",
    "file",
    "debug",
    "config",
    "edit",
    "view",
    "app",
]
bp.commands.register = (id, name, type, handler, args) => {
    if (!id) {
        throw "Error: The id parameter is required."
    } else if (type && !(type == "simple" || type == "handled")) {
        throw "Error: Invalid command type."
    } else if (id.split(".").length === 1) {
        throw "Error: Command ids must be namespaced."
    } else if (bp.commands.list.hasOwnProperty(id)) {
        throw "Error: That command has already been registered!"
    } else if (!handler) {
        throw "Error: The handler parameter is required."
    } else if (type != "handled" && typeof handler != "function") {
        throw "Error: The handler parameter must be a javascript function."
    } else if (bp.commands.reservedNamespaces.includes(id.split(".")[0])) {
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
        runHook("commands.register.success")
        return bp.commands.list[id]
    }
}
bp.commands.exec = (command, args) => {
    if (!command) {
        throw "Error: The command parameter is required."
    } else if (!bp.commands.list.hasOwnProperty(command)) {
        throw "Error: That command doesn't exist"
    } else if (
        !(
            (bp.commands.list[command].args
                ? bp.commands.list[command].args
                : 0) === (args ? args.length : 0)
        )
    ) {
        throw `Error: That command requires ${
            bp.commands.list[command].args ? bp.commands.list[command].args : 0
        } arguments, but received ${args ? args.length : "none"}.`
    } else {
        return bp.commands.list[command].handler(args)
    }
}

// Hooks:
bp.hooks.list = {
    "commands.register.success": {},
    "window.domReady": {},
}
for (hook in bp.hooks.list) {
    bp.hooks.list[hook] = {
        handlers: [],
    }
}
bp.hooks.addToHook = (hook, handler) => {
    if (!hook) {
        throw "Error: The hook parameter is required."
    } else if (!handler) {
        throw "Error: The handler parameter is required."
    } else if (!bp.hooks.list[hook]) {
        throw "Error: That hook doesn't exist"
    }
    index = bp.hooks.list[hook].handlers.push(handler) - 1
    return index
}

$(runHook("window.domReady"))

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
