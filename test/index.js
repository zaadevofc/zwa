const { Connection, Config, useWatchFile } = require('../src')

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

    require('./handlers')(ZWA)

    // ZWA.on('messages.delete', async (msg) => {
    //     /* .... */
    // })

    // ZWA.on('call', async (msg) => {
    //     /* .... */
    // })

    // ZWA.on('update.status', async (msg) => {
    //     /* .... */
    // })

}

connect()