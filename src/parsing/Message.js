const { checkKey, getValue, checkArrayInArray, getAllValuesByKey, removeKey, getMatchKeyByArray } = require("../utils/Function");
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

module.exports = async (client, chats, config, event) => {
    if (!chats) return {};

    let obj = {}
    const msg = chats.messages[0];

    if (msg.message) {
        if (!checkArrayInArray(MsgType, Object.keys(msg.message)) && !checkKey('status@broadcast', msg)) return {};
        let sender = msg.key.fromMe ? (client.user.id.split(':')[0] + '@s.whatsapp.net' || client.user.id) : (msg.key.participant || msg.key.remoteJid)

        obj = {
            chats: {
                id: msg.key.id,
                sender: sender,
                from: msg.key.remoteJid,
                pushName: msg.pushName,
                fromMe: msg.key.fromMe,
                type: ''
            },
            command: '',
            message: '',
            quoted: false,
            media: false,
            mentions: checkKey('quotedMessage', msg) ? [] : getValue('mentionedJid', msg)[0] || [],
            isCommand: false,
            isReplied: checkKey('quotedMessage', msg),
            isForward: checkKey('isForwarded', msg),
            isForwardManyTimes: getValue('forwardingScore', msg)[0] == 127,
            isEdited: checkKey('editedMessage', msg),
            isBroadcast: msg.broadcast,
            isGroup: msg.key.remoteJid.endsWith('@g.us'),
            isGroupAdmin: false,
            isGroupOwner: false,
            isBot: (msg.key.id.startsWith('BAE5') && msg.key.id.length === 16) || (msg.key.id.startsWith('B24E') && msg.key.id.length === 20),
            isAuthor: config.authors.some(x => Number(x) == Number(sender.split('@')[0])),
            isBanned: config.banned.some(x => Number(x) == Number(sender.split('@')[0])),
        };

        if (obj) {
            delete msg.message.messageContextInfo
            if (!checkKey('quotedMessage', msg)) {
                obj.chats.type = Object.keys(getValue('message', msg)[0])[0]

                if (obj.chats.type == 'ephemeralMessage') {
                    let ctx = getValue('ephemeralMessage', msg)[0]
                    obj.chats.type = Object.keys(getValue('message', ctx)[0])[0]
                } else {
                    obj.chats.type = obj.chats.type
                }
            } else {
                if (checkKey('ephemeralMessage', msg)) {
                    let ctx = getValue('message', getValue('ephemeralMessage', msg))[0]
                    obj.chats.type = Object.keys(ctx)[0]
                } else {
                    let ctx = getValue('message', msg)[0]
                    obj.chats.type = Object.keys(ctx)[0]
                }
            }
        }

        obj.chats.type = obj.chats.type == 'extendedTextMessage' ? 'conversation' : obj.chats.type
        obj.chats.type = obj.chats.type == 'documentWithCaptionMessage' ? 'documentMessage' : obj.chats.type
        obj.chats.type = obj.chats.type == 'viewOnceMessageV2' ? 'viewOnceMessage' : obj.chats.type
        obj.chats.type = obj.chats.type == 'senderKeyDistributionMessage' ? 'conversation' : obj.chats.type

        obj.isViewOnce = obj.chats.type == 'viewOnceMessage' || obj.chats.type == 'viewOnceMessageV2'
        obj.isReaction = obj.chats.type == 'reactionMessage'
        obj.isProduct = obj.chats.type == 'productMessage'
        obj.isPoll = obj.chats.type == 'pollCreationMessage'
        obj.isPollV3 = obj.chats.type == 'pollCreationMessageV3'
        obj.isAudio = obj.chats.type == 'audioMessage'
        obj.isVideo = obj.chats.type == 'videoMessage'
        obj.isImage = obj.chats.type == 'imageMessage'
        obj.isDocument = obj.chats.type == 'documentMessage'
        obj.isSticker = obj.chats.type == 'stickerMessage'
        obj.isLocation = obj.chats.type == 'locationMessage'
        obj.isContact = obj.chats.type == 'contactMessage'

        obj.chats.times = getValue('low', msg.messageTimestamp)[0] || msg.messageTimestamp;

        if (checkKey('quotedMessage', msg)) {
            obj.message = getValue('conversation', msg)[0] || getValue('text', msg)[0] || getValue('caption', msg)[0] || ''
        } else {
            obj.message = getValue('conversation', msg)[0] || getValue('text', msg)[0] || getValue('caption', msg)[0] || ''
        }

        if (obj.message && config.prefix) {
            obj.command = obj.message.startsWith(config.prefix) ? obj.message.split(' ')[0].slice(1) : ''
            obj.isCommand = !!(obj.command)
        }

        if (checkKey('quotedMessage', msg)) {
            let scope = getValue('contextInfo', msg)[0]

            obj.quoted = {
                id: getValue('stanzaId', scope)[0],
                from: getValue('participant', scope)[0],
                type: getMatchKeyByArray(scope, MsgType),
                mentions: getValue('mentionedJid', scope)[0],
                message: getValue('conversation', scope)[0] || getValue('text', scope)[0] || getValue('caption', scope)[0] || '',
                media: false,
            }

            obj.quoted.type = obj.quoted.type == 'extendedTextMessage' ? 'conversation' : obj.quoted.type
            obj.quoted.type = obj.quoted.type == 'documentWithCaptionMessage' ? 'documentMessage' : obj.quoted.type
            obj.quoted.type = obj.quoted.type == 'senderKeyDistributionMessage' ? 'conversation' : obj.quoted.type
            obj.quoted.type = obj.quoted.type == 'viewOnceMessageV2' ? 'imageMessage' : obj.quoted.type

            if (checkKey('ephemeralMessage', msg)) {
                let ctx = getValue('message', getValue('ephemeralMessage', getValue('quotedMessage', msg)))[0]
                obj.quoted.type = Object.keys(ctx)[0]
                obj.quoted.media = getValue(Object.keys(ctx)[0], ctx)[0]
            } else {
                obj.quoted.media = (checkKey('message', scope) ? getValue('message', scope)[0] : getValue('quotedMessage', scope)[0])[obj.quoted.type]
            }

            obj.quoted.media = typeof obj.quoted.media == 'string' ? false : obj.quoted.media
            obj.quoted.type = checkKey('viewOnceMessageV2', scope) ? 'viewOnceMessage' : obj.quoted.type

            obj.quoted.media = !obj.quoted.media ? false : { [obj.quoted.type]: obj.quoted.media }
            obj.quoted.media = checkKey('message', obj.quoted.media) ? getValue('message', obj.quoted.media)[0] : obj.quoted.media
        }

        if (['conversation', 'editedMessage', 'senderKeyDistributionMessage'].includes(obj.chats.type)) {
            obj.media = false
        } else {
            delete msg.message.messageContextInfo
            let scope = getAllValuesByKey(Object.keys(msg.message), msg)
            scope[0] = removeKey('contextInfo', scope[0])
            if (scope[0]['message']) {
                if (!checkKey('senderKeyDistributionMessage', scope[0]['message'])) {
                    delete scope[0].message[Object.keys(scope[0]['message'])[0]].contextInfo
                    obj.media = scope[0].message[Object.keys(scope[0]['message'])[0]]
                }
            } else {
                obj.media = scope[0]
            }
        }

        obj.media = !obj.media ? false : { [obj.chats.type]: obj.media }
        obj.media = checkKey('message', obj.media) ? getValue('message', obj.media)[0] : obj.media

        var groupData = obj.isGroup ? await client.groupMetadata(obj.chats.from) : null

        if (obj.isGroup) {
            const prp = groupData.participants.find(x => x.id == obj.chats.sender)

            obj.isGroupOwner = prp.admin == 'superadmin'
            obj.isGroupAdmin = obj.isGroupOwner ? true : prp.admin == 'admin'
        }

    }
    
    client.ev.emit('zwa.show-logs', { event, ...obj, ...groupData })

    return { ...obj };
};
