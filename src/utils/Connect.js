const { DisconnectReason } = require('@whiskeysockets/baileys');
const package = require('../../package.json');

const { Boom } = require("@hapi/boom");
const banner = require('cfonts')
const figlet = require("figlet");
const chalk = require('chalk')
const qrc = require('qrcode-terminal');
const Spinnies = require('spinnies')

const exit = process.exit;
const spin = new Spinnies({ succeedColor: 'green', failColor: 'red' });
const log = {
    err: (txt) => console.log(chalk.magenta('✖'), chalk.red(txt)),
    warn: (txt) => console.log(chalk.blue('!'), chalk.yellow(txt)),
    info: (txt) => console.log(chalk.yellow('#'), chalk.cyan(txt)),
    ok: (txt) => console.log(chalk.green('✓'), chalk.green(txt)),
}

const spinAdd = (name, text) => spin.add(name, { text })
const spinOk = (name, text) => spin.succeed(name, { text })
const spinErr = (name, text) => spin.fail(name, { text })
const spinDel = (name) => spin.remove(name)

const version = package.version.padEnd(10);
const author = package.author.padEnd(10);
const license = package.license.padEnd(10);

module.exports = (client, module) => {
    console.clear()
    console.log('\n')

    banner.say('ZWA MD', { font: 'block', align: 'center', colors: ['#e48c1b', '#b52b2b'] })
    banner.say(`simple package to make WhatsApp bot light and fast!|\nlibrary by @whiskeysockets/baileys|develop by @zaadevofc|\nThanks for use :D`, { font: 'console', align: 'center', colors: ['#e48c1b'] })

    banner.say(`https://npmjs.com/package/zwa|https://github.com/zaadevofc/zwa|\n- version  :   ${version}|- author   :   ${author}|- license  :   ${license}`, { font: 'console', align: 'center', colors: ['#fff'] });
    banner.say('_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _', { font: 'console', align: 'center', colors: ['#e48c1b'] })

    spinAdd('con-1', 'Wait is analyzing ...')

    let output = {}

    client.ev.on('connection.update', async (data) => {
        let initial = true
        const { connection, lastDisconnect, isNewLogin, qr } = data

        output.initial = initial
        output.status = connection

        if (initial && connection == 'connecting') spinAdd('con-2', 'Connecting with servers ...')
        if (initial && lastDisconnect === undefined && qr !== undefined) {
            spinAdd('create-qr', 'Creating Qr ...')
            qrc.generate(qr, { small: true }, (code) => console.log(`\n${code}\n`))
            spinDel('create-qr')
            spinAdd('con-3', 'Scan Qr with your WhatsApp ...')
        }

        if (initial && isNewLogin && qr == undefined) spinOk('con-3', 'Qr success scanned!')
        if (initial && connection === "open") {
            spinOk('con-1', 'Analyzing success!')
            spinOk('con-2', 'Connected to server!')

            log.info(`Login as ${client.user.name || client.user.verifiedName}`)
            console.log('\n')
        } 

        if (initial && connection === "close") {
            let reason = new Boom(lastDisconnect.error).output.statusCode;
            const conDel = () => {
                spinErr('con-1', 'Analyzing failed!')
                spinErr('con-2', 'Failed connecting with servers!')
            }

            switch (reason) {
                case DisconnectReason.badSession:
                    log.err('Bad session file, Please delete session and scan again!'); client.ev.emit('zwa.restart')
                    break;
                case DisconnectReason.connectionClosed:
                    log.warn('Connection closed, reconnecting ...'); client.ev.emit('zwa.restart')
                    break;
                case DisconnectReason.connectionLost:
                    log.warn('Connection lost from server, reconnecting ...'); client.ev.emit('zwa.restart')
                    break;
                case DisconnectReason.connectionReplaced:
                    log.err('Connection replaced, Another new session opened, Please close current session first!'); conDel(); client.logout();
                    break;
                case DisconnectReason.loggedOut:
                    log.err('Device logged out, Please delete session and scan again!'); conDel(); client.logout();
                    break;
                case DisconnectReason.restartRequired:
                    log.warn('Restart required, restarting ...'); client.ev.emit('zwa.restart')
                    break;
                case DisconnectReason.timedOut:
                    log.warn('Connection timed out, Reconnecting ...'); client.ev.emit('zwa.restart')
                    break;
                default:
                    log.warn(`Unknown Disconnect Reason: ${reason}|${lastDisconnect.error}`); client.ev.emit('zwa.restart')
                    break
            }
        }
        
        (module)(output)
    });
}