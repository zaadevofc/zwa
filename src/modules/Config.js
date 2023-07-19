const pino = require('pino');

module.exports = ({ dir = 'session', browser = ['ZWA MD', 'Desktop', '3.0.0'], authors = [], banned = [], showLogs = true, prefix = false }) => {
    const parseDir = {
        store: dir + '/store.json',
        auth: dir + '/auth',
    }

    return {
        browser,
        authors,
        banned,
        prefix,
        showLogs,
        dir: parseDir,
        printQRInTerminal: false,
        logger: pino({ level: 'silent' }),
    }
}