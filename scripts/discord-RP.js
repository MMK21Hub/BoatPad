/* OFFICIAL BOATPAD SCRIPT */

// Dependencies:
const RPC = require("discord-rpc")

// Util functions:
function log(message, level = "info") {
    formattedMsg = "[" + "%c" + "Discord RP" + "%c" + "] " + message
    switch (level) {
        case "info":
            console.log(formattedMsg, "color:aqua", "color:inherit")
            break
        case "warn":
            console.warn(formattedMsg, "color:aqua", "color:inherit")
            break
        case "error":
            console.error(formattedMsg, "color:aqua", "color:inherit")
            break
    }
}

module.exports = {
    meta: {
        name: "Discord RP",
        desc: "Brings Discord Rich Presence integration to BoatPad",
        repo: "https://github.com/MMK21Hub/BoatPad",
        supportsBrowser: false,
    },
    main: () => {
        // The ID of the BoatPad application in Discord.
        // Managed by MMK21.
        const clientId = "813492106869735486"

        // Initialize the RPC client:
        const rpc = new RPC.Client({ transport: "ipc" })
        // Take a note of the current time:
        const startTimestamp = new Date()

        // Work out what status to show:
        if (bp.view.zen) {
            status = "In popout window"
        } else {
            status = "In main window"
        }

        async function setActivity() {
            rpc.setActivity({
                state: status,
                startTimestamp,
                instance: false,
            })
        }

        rpc.on("ready", () => {
            // Start by sending the activity to Discord:
            setActivity()
            // Update the activity every 15 secs:
            setInterval(() => {
                setActivity()
            }, 15000)
        })

        // Log in to Discord RPC:
        rpc.login({ clientId })
            .catch((msg) => {
                // TODO: Check internet connection
                // TODO: Check if Discord is running
                log(msg, "error")
            })
            .then(() => {
                log("Connected to Discord RPC!")
            })
    },
}
