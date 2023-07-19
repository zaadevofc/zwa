module.exports = (client, chats, config, event) => {
    if (!chats) return chats;

    let msg = chats.messages[0]
    let obj = {
        chats: {}
    }

    let sender = msg.key.fromMe ? client.user.id.split(':')[0] + '@s.whatsapp.net' || client.user.id : msg.key.participant || msg.key.remoteJid
    let message = msg.message[Object.keys(msg.message)[0]]

    obj.chats.id = msg.key.id
    obj.chats.sender = sender
    obj.chats.from = msg.key.remoteJid
    obj.chats.pushName = msg.pushName
    obj.chats.fromMe = msg.key.fromMe

    if (msg.message && msg.message.extendedTextMessage && msg.message.extendedTextMessage.text) {
        obj.chats.type = 'conversation'
    } else {
        obj.chats.type = Object.keys(msg.message)[0]
    }

    obj.chats.times = msg.messageTimestamp

    if (typeof message !== 'string') {
        if (msg.message['extendedTextMessage']) {
            obj.message = message.text || ""
        } else {
            obj.message = message.caption || ""
        }
    } else {
        obj.message = message || ""
    }

    if (msg.message['extendedTextMessage']) {
        if (message['contextInfo'] && message['contextInfo']['quotedMessage']) {
            let type = ''
            if (message?.contextInfo?.quotedMessage?.extendedTextMessage?.text) {
                type = 'conversation'
            } else {
                type = Object.keys(message.contextInfo.quotedMessage)[0]
            }

            if (message.contextInfo.hasOwnProperty('expiration')) {
                obj.quoted = {
                    id: message.contextInfo.stanzaId,
                    from: message.contextInfo.participant,
                    type: type,
                    message: message.contextInfo.quotedMessage[Object.keys(message.contextInfo.quotedMessage)[0]],
                }
            } else {
                obj.quoted = {
                    id: message.contextInfo.stanzaId,
                    from: message.contextInfo.participant,
                    type: type,
                    message: message.contextInfo.quotedMessage,
                }
            }
        }
    } else {
        obj.quoted = false
    }

    if (!message['text'] && typeof message !== 'string') {
        obj.media = message
    } else {
        obj.media = false
    }

    if (msg.message['extendedTextMessage']) {
        if (message['contextInfo']) {
            obj.isReplied = !!(message.contextInfo.hasOwnProperty('quotedMessage'))
            obj.isForward = !!(message.contextInfo.forwardingScore)
            obj.isForwardManyTimes = !!(message.contextInfo.forwardingScore > 1)
            obj.isEphemeral = !!(message.contextInfo.hasOwnProperty('expiration'))
        }
    } else {
        obj.isReplied = false
        obj.isForward = false
        obj.isForwardManyTimes = false
        obj.isEphemeral = false
    }

    if (msg.message[Object.keys(msg.message)[0]]) {
        if (message['contextInfo']) {
            obj.isReplied = !!(message.contextInfo.hasOwnProperty('quotedMessage'))
            obj.isForward = !!(message.contextInfo.forwardingScore)
            obj.isForwardManyTimes = !!(message.contextInfo.forwardingScore > 1)
            obj.isEphemeral = !!(message && message.contextInfo.hasOwnProperty('expiration'))
        }
    } else {
        obj.isReplied = false
        obj.isForward = false
        obj.isForwardManyTimes = false
        obj.isEphemeral = false
    }

    obj.isBroadcast = msg.broadcast
    obj.isGroup = msg.key.remoteJid.endsWith('@g.us')
    obj.isBot = (msg.key.id.startsWith('BAE5') && msg.key.id.length === 16) || (msg.key.id.startsWith('B24E') && msg.key.id.length === 20)
    obj.isAuthor = config.authors.some(x => Number(x) == Number(sender.split('@')[0]))

    obj.type = chats.type

    if (msg.message) {
        if (msg.message.viewOnceMessage) {
            msg.mtype = Object.keys(msg.message.viewOnceMessage.message)[0];
            msg.msg = msg.message.viewOnceMessage.message[msg.mtype];
        } else if (msg.message.viewOnceMessageV2) {
            msg.mtype = Object.keys(msg.message.viewOnceMessageV2.message)[0];
            msg.msg = msg.message.viewOnceMessageV2.message[msg.mtype];
        } else {
            msg.mtype = Object.keys(msg.message)[0] == 'senderKeyDistributionMessage' ? (Object.keys(msg.message)[2] == 'messageContextInfo' ? Object.keys(msg.message)[1] : Object.keys(msg.message)[2]) : Object.keys(msg.message)[0] != 'messageContextInfo' ? Object.keys(msg.message)[0] : Object.keys(msg.message)[1];
            msg.msg = msg.message[msg.mtype];
        }
        if (msg.mtype === 'ephemeralMessage' || msg.mtype === 'documentWithCaptionMessage') {
            msg.mtype = msg.msg.mtype;
            msg.msg = msg.msg.msg;
        }
        msg.mentionedJid = typeof msg.msg != 'undefined' ? (msg.msg.contextInfo ? msg.msg.contextInfo.mentionedJid : []) : [];
        if (msg.quoted) {
            let type = Object.keys(msg.quoted)[0];
            msg.quoted = msg.quoted[type];
            if (['productMessage'].includes(type)) {
                type = Object.keys(msg.quoted)[0];
                msg.quoted = msg.quoted[type];
            }
            if (['documentWithCaptionMessage'].includes(type)) {
                type = Object.keys(msg.quoted.message)[0];
                msg.quoted = msg.quoted.message[type];
            }
            if (typeof msg.quoted === 'string') msg.quoted = { text: msg.quoted };
            msg.quoted.id = msg.msg.contextInfo.stanzaId;
            msg.quoted.chat = msg.msg.contextInfo.remoteJid || msg.chat;
            msg.quoted.isBot = msg.quoted.id ? (msg.quoted.id.startsWith('BAE5') && msg.quoted.id.length === 16) || (msg.quoted.id.startsWith('3EB0') && msg.quoted.id.length === 12) || (msg.quoted.id.startsWith('3EB0') && msg.quoted.id.length === 20) || (msg.quoted.id.startsWith('B24E') && msg.quoted.id.length === 20) : false;
            msg.quoted.sender = msg.msg.contextInfo.participant.split(':')[0] || msg.msg.contextInfo.participant;
            msg.quoted.fromMe = msg.quoted.sender === (client.user && client.user.id);
            msg.quoted.mentionedJid = msg.msg.contextInfo ? msg.msg.contextInfo.mentionedJid : [];
            msg.quoted.mtype = msg.quoted != null ? Object.keys(msg.quoted.fakeObj.message)[0] : null;
            msg.quoted.text = msg.quoted.text || msg.quoted.caption || (msg.quoted.mtype == 'buttonsMessage' ? msg.quoted.contentText : '') || (msg.quoted.mtype == 'templateMessage' ? msg.quoted.hydratedFourRowTemplate.hydratedContentText : '') || '';
            msg.quoted.download = () => client.downloadMediaMessage(msg.quoted);
        }
    }
    msg.text =
        (msg.mtype == 'editedMessage' ? msg.msg.message.protocolMessage.editedMessage.conversation : '') ||
        (msg.mtype == 'listResponseMessage' ? msg.message.listResponseMessage.singleSelectReply.selectedRowId : '') ||
        (msg.mtype == 'buttonsResponseMessage' ? msg.message.buttonsResponseMessage.selectedButtonId : '') ||
        (msg.mtype == 'templateButtonReplyMessage' ? msg.message.templateButtonReplyMessage.selectedId : '') ||
        (typeof msg.msg != 'undefined' ? msg.msg.text : '') ||
        (typeof msg.msg != 'undefined' ? msg.msg.caption : '') ||
        msg.msg ||
        '';

    // console.log(m)

    // obj.msg = msg

    return { obj }

    // return {
    //     // message: (type === 'cAnversation' && msg.message.conversation) ? msg.message.conversation: (type === 'imageMessage') && msg.message.imageMessage.caption ? msg.message.imageMessage.caption: (type === 'videoMessage') && msg.message.videoMessage.caption ? msg.message.videoMessage.caption: (type === 'extendedTextMessage') && msg.message.extendedTextMessage.text ? msg.message.extendedTextMessage.text: (type === 'buttonsResponseMessage') && quotedMsg.fromMe && msg.message.buttonsResponseMessage.selectedButtonId ? msg.message.buttonsResponseMessage.selectedButtonId: (type === 'templateButtonReplyMessage') && quotedMsg.fromMe && msg.message.templateButtonReplyMessage.selectedId ? msg.message.templateButtonReplyMessage.selectedId: (type === 'messageContextInfo') ? (msg.message.buttonsResponseMessage?.selectedButtonId || msg.message.listResponseMessage?.singleSelectReply.selectedRowId): (type == 'listResponseMessage') && quotedMsg.fromMe && msg.message.listResponseMessage.singleSelectReply.selectedRowId ? msg.message.listResponseMessage.singleSelectReply.selectedRowId: "",
    //     from: ''
    // }
};