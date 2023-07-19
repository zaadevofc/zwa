const { getValue, checkKey, checkArrayInArray, getMatchKeyByArray } = require("../utils/Function")
const MsgType = [
    "conversation",
    "extendedTextMessage",
    'ephemeralMessage',
    "editedMessage",
    "audioMessage",
    "imageMessage",
    "videoMessage",
    "stickerMessage",
    "documentMessage",
    'documentWithCaptionMessage',
    "contactMessage",
    "locationMessage",
    "reactionMessage",
    "productMessage",
    'viewOnceMessage',
    'viewOnceMessageV2',
    "pollCreationMessage",
    "pollCreationMessageV3",
];

module.exports = async (client, chats, event) => {
    let obj = {}
    let msg = chats.messages[0]

    if (!checkKey('senderKeyDistributionMessage', msg) && !checkKey('status@broadcast', msg) || checkKey('protocolMessage', msg)) return {}

    obj.chats = {
        id: msg.key.id,
        sender: msg.key.fromMe ? (client.user.id.split(':')[0] + '@s.whatsapp.net' || client.user.id) : (msg.key.participant || msg.key.remoteJid),
        from: msg.key.remoteJid,
        pushName: msg.pushName,
        fromMe: msg.key.fromMe,
        times: msg.messageTimestamp
    }
    
    obj.status = {
        type: '',
        message: getValue('conversation', msg)[0] || getValue('text', msg)[0] || getValue('caption', msg)[0] || '',
        media: { ...getValue('message', msg)[0] } || false
    }

    obj.isAudio = obj.status.type == 'audioMessage'
    obj.isVideo = obj.status.type == 'videoMessage'
    obj.isImage = obj.status.type == 'imageMessage'

    obj.status.media = checkKey('extendedTextMessage', msg) ? false : obj.status.media
    obj.status.type = !obj.status.media ? 'conversation' : Object.keys(obj.status.media)[0]

    client.ev.emit('zwa.show-logs', { event, ...obj })

    return { ...obj }
}