const { getValue } = require("../utils/Function")

module.exports = (client, chats, event) => {
    let obj = {}

    obj.tag = chats.tag
    obj.id = chats.attrs.id
    obj.version = chats.attrs.version
    obj.platform = chats.attrs.platform
    obj.from = chats.attrs.from
    obj.times = chats.attrs.t
    obj.reason = getValue('reason', chats)[0]
    obj.content = getValue('content', chats)[0]

    client.ev.emit('zwa.show-logs', { event, ...obj })

    return { ...obj }
}