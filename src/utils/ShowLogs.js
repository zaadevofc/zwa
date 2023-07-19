const { getTime, color, checkKey } = require("./Function");

module.exports = async (msg, config, module) => {
    if (!config.showLogs) return;
    let log = console.log;

    let tpl = {
        group: {
            command: (prop, groupName) => color(
                ['[CMD - GROUP]', getTime(prop.chats.times * 1000), '>>', prop.chats.pushName, '>>', config.prefix + prop.command, '>>', groupName],
                ['yellow', 'white', 'magenta', 'yellow', 'magenta', 'cyan', 'magenta', 'white']
            ),
            banned: (prop, groupName) => color(
                ['[BANNED - GROUP]', getTime(prop.chats.times * 1000), '>>', prop.chats.pushName, '>>', config.prefix + prop.command, '>>', groupName],
                ['red', 'yellow', 'magenta', 'yellow', 'magenta', 'yellow', 'magenta', 'yellow']
            ),
            delete: (prop, groupName) => color(
                ['[DEL - GROUP]', getTime(prop.chats.times * 1000), '>>', prop.chats.pushName, '>>', prop.delete.id, '>>', groupName],
                ['red', 'white', 'magenta', 'yellow', 'magenta', 'cyan', 'magenta', 'white']
            ),
        },
        private: {
            command: (prop) => color(
                ['[CMD - PRIVATE]', getTime(prop.chats.times * 1000), '>>', prop.chats.pushName, '>>', config.prefix + prop.command],
                ['yellow', 'white', 'magenta', 'yellow', 'magenta', 'cyan']
            ),
            banned: (prop) => color(
                ['[BANNED - PRIVATE]', getTime(prop.chats.times * 1000), '>>', prop.chats.pushName, '>>', config.prefix + prop.command],
                ['red', 'yellow', 'magenta', 'yellow', 'magenta', 'yellow']
            ),
            delete: (prop) => color(
                [`[DEL - ${checkKey('status@broadcast', prop) ? 'STATUS' : 'PRIVATE'}]`, getTime(prop.chats.times * 1000), '>>', prop.chats.pushName, '>>', prop.delete.id],
                ['red', 'white', 'magenta', 'yellow', 'magenta', 'cyan']
            ),
        },
        call: async (prop) => color(
            ['[CALL]', getTime(prop.times * 1000), '>>', await module.getName(prop.from.split(':')[0] + '@s.whatsapp.net')],
            ['magenta', 'white', 'magenta', 'yellow']
        ),
        status: (prop) => color(
            ['[STATUS]', getTime(prop.chats.times * 1000), '>>', prop.chats.pushName, '>>', prop.status.type],
            ['yellow', 'white', 'magenta', 'yellow', 'magenta', 'cyan']
        ),
    }

    if (msg.event == 'messages') {
        if (msg.isGroup && msg.isCommand && !msg.isBanned) log(tpl.group.command(msg, msg.subject))
        if (msg.isGroup && msg.isCommand && msg.isBanned) log(tpl.group.banned(msg, msg.subject))

        if (!msg.isGroup && msg.isCommand && !msg.isBanned) log(tpl.private.command(msg))
        if (!msg.isGroup && msg.isCommand && msg.isBanned) log(tpl.private.banned(msg))

    } else if (msg.event == 'call') {
        log(await tpl.call(msg))

    } else if (msg.event == 'messages.delete') {
        if (!msg.isGroup) log(tpl.private.delete(msg))
        if (msg.isGroup) log(tpl.group.delete(msg, msg.subject))

    } else if (msg.event == 'update.status') {
        log(tpl.status(msg))

    }
}