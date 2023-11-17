const { getValue, checkKey } = require("../utils/Function")

module.exports = async (client, chats, event) => {
    let obj = {}
    let msg = chats.messages[0]

    if (!checkKey('protocolMessage', msg) || checkKey('ephemeralExpiration', msg)) return {}
    
    obj.chats = {
        id: msg.key.id,
        sender: msg.key.fromMe ? (client.user.id.split(':')[0] + '@s.whatsapp.net' || client.user.id) : (msg.key.participant || msg.key.remoteJid),
        from: msg.key.remoteJid,
        pushName: msg.pushName,
        fromMe: msg.key.fromMe,
        times: msg.messageTimestamp
    }

    obj.isGroup = msg.key.remoteJid.endsWith('@g.us')
    var groupData = obj.isGroup ? await client.groupMetadata(obj.chats.from) : null

    obj.delete = {
        id: getValue('protocolMessage', msg)[0].key?.id || msg.key.id,
        from: getValue('protocolMessage', msg)[0].key?.remoteJid || msg.key.remoteJid,
        fromMe: getValue('protocolMessage', msg)[0].key?.fromMe || msg.key.fromMe,
        type: getValue('protocolMessage', msg)[0].type,
    }
    
    client.ev.emit('zwa.show-logs', { event, ...obj, ...groupData })

    return { ...obj }
}