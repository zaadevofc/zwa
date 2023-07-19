const { Connection, Config } = require('../src')

const config = Config({
    showLogs: true, // show a logs of some actions
    dir: 'session', // folder path of your session
    prefix: '/', // set prefix for use command object
    authors: [/* 628... */], // set authors
    banned: [/* 628... */], // set banned
    browser: ['ZWA MD', 'Safari', '3.0.0'] // set browser to show in your connection
})

const connect = async () => {
    const ZWA = new Connection({ config })
    await ZWA.initial(connect)

    ZWA.on('connection', ({ status }) => {
        // this event for actived and running the bot
        // don't delete this event

        // status "connecting" || "open" || "close"
        if (status == 'open') {
            // ....
        }
    })

    ZWA.on('messages', async (msg) => {
        const { message, command } = msg
        // you must set "prefix" in config to use "command"
        if (command == 'tes') return ZWA.sendText('Tester ...')
        if (message == 'Hallo') return ZWA.sendText('Hai!')
    })

    ZWA.on('messages.delete', async (msg) => {
        /* .... */
    })

    ZWA.on('call', async (msg) => {
        /* .... */
    })

    ZWA.on('update.status', async (msg) => {
        /* .... */
    })

}

connect()