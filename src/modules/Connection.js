const { default: makeWASocket, makeInMemoryStore, useMultiFileAuthState, jidDecode, getDevice, generateProfilePicture } = require('@whiskeysockets/baileys');
const pino = require('pino');
const { Message, Calling, MsgDelete, UpdateStatus } = require('../parsing');
const Connect = require('../utils/Connect');
const { parseMention } = require('../utils/Function');
const ShowLogs = require('../utils/ShowLogs');

module.exports = class Connection {
    constructor({ config }) {
        this.config = config;
        this.client = {};
        this.server = {};
        this.msg = {}
        this.obj = {}
        this.store = {}
    }

    initial = async (server) => {
        const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) });
        store.readFromFile(this.config.dir.store);
        setInterval(() => store.writeToFile(this.config.dir.store), 10000);

        const { state, saveCreds } = await useMultiFileAuthState(this.config.dir.auth);

        const sock = makeWASocket({
            ...this.config,
            auth: state,
            getMessage: async (key) => (store ? (await store.loadMessage(key.remoteJid, key.id)).message || undefined : { conversation: 'ZWA' }),
            patchMessageBeforeSending: (message) => {
                const requiresPatch = !!(message.buttonsMessage || message.templateMessage || message.listMessage);
                if (requiresPatch) {
                    message = { viewOnceMessage: { message: { messageContextInfo: { deviceListMetadataVersion: 2, deviceListMetadata: {} }, ...message } } };
                }
                return message;
            }
        });

        store.bind(sock.ev);
        sock.ev.on('creds.update', saveCreds);

        sock.ev.on("contacts.update", async (msg) => {
            for (let cntc of msg) {
                let jid = await this.decodeJid(cntc.id);
                if (store && store.contacts)
                    store.contacts[jid] = { jid, name: cntc.notify };
            }
        });

        sock.ev.on('zwa.show-logs', (x) => ShowLogs(x, this.config, this));
        sock.ev.on('zwa.restart', () => server());

        this.store = store;
        this.client = sock;
        this.server = server;
    }

    on = (event, module) => {
        switch (event) {
            case 'connection':
                Connect(this.client, module)
                break;
            case 'messages':
                this.client.ev.on('messages.upsert', async (msg) => {
                    const ctx = msg.messages[0];
                    const type = ctx.message ? Object.keys(ctx.message)[0] : "";
                    if (ctx && type == "protocolMessage") this.client.ev.emit("message.delete", ctx.message.protocolMessage.key);

                    const chat = await Message(this.client, msg, this.config, event);
                    this.msg = msg.messages[0];
                    this.obj = chat;
                    (module)(chat);
                });
                break;
            case 'messages.delete':
                this.client.ev.on('messages.upsert', async (msg) => {
                    const del = MsgDelete(this.client, msg, event);
                    (module)(del);
                });
                break;
            case 'call':
                this.client.ws.on('CB:call', async (msg) => {
                    const call = Calling(this.client, msg, event);
                    (module)(call);
                });
                break;
            case 'update.status':
                this.client.ev.on('messages.upsert', async (msg) => {
                    const status = UpdateStatus(this.client, msg, event);
                    (module)(status);
                });
                break;
        }
    }

    decodeJid = async (jid) => {
        if (/:\d+@/gi.test(jid)) {
            const decode = jidDecode(jid) || {};
            return ((decode.user && decode.server && decode.user + "@" + decode.server) || jid).trim();
        } else return jid.trim();
    };

    getName = async (jid, withoutContact = false) => {
        let v, id = await this.decodeJid(jid);
        withoutContact = this.client.withoutContact || withoutContact;
        if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
            v = this.store.contacts[id] || {};
            if (!(v.name || v.subject)) v = this.client.groupMetadata(id) || {};
            resolve(v.name || v.subject || require("awesome-phonenumber")("+" + id.replace("@s.whatsapp.net", "")).getNumber("international"));
        });
        else v = id === "0@s.whatsapp.net" ? { id, name: "WhatsApp" } : id === this.decodeJid(this.client.user.id) ? this.client.user : this.store.contacts[id] || {};
        return ((withoutContact ? "" : v.name) || v.subject || v.verifiedName || require("awesome-phonenumber")("+" + jid.replace("@s.whatsapp.net", "")).getNumber("international"));
    };

    sendText = (text, from = this.obj.chats.from, options) => this.client.sendMessage(from, { text: text, mentions: parseMention(text), ...options });
    sendReply = (text, from = this.obj.chats.from, options) => this.client.sendMessage(from, { text: text, mentions: parseMention(text), ...options }, { quoted: this.msg });
    sendReaction = (emoticon, from = this.obj.chats.from, key = this.msg.key) => this.client.sendMessage(from, { react: { text: emoticon, key } });
};
