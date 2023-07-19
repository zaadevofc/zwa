
# ZWA MD - WhatsApp NodeJS

Simple package to make Whatsapp bot Light and Fast! This is a replacement for the removed [@adiwajshing/baileys](https://github.com/adiwajshing/baileys) library. and now this package uses the library from [@whiskeysockets/baileys](https://github.com/WhiskeySockets/Baileys) then I make it easier and I break it down so that everyone can easily make WhatsApp Bot.


## Installation

Install `zwa` in your project :

```bash
  npm install zwa
```
```bash
  yarn add zwa
```
    
## Running Tests

To run tests, run the following command :

```bash
  git clone https://github.com/zaadevofc/zwa
  cd zwa
  npm install
  npm run test
```


## Usage

initial configuration that needs to be considered when running it.
```javascript
const { Connection, Config } = require('zwa')

const config = Config({
    /*  */
})

// must async function ...
const connect = async () => {
    const ZWA = new Connection({ config })
    await ZWA.initial(connect) // fill with function name
}

connect()

```
## Configuration

```javascript
{
    showLogs: true, // show a logs of some actions
    dir: 'session', // folder path of your session
    prefix: '/', // set prefix for use command object
    authors: [/* 628... */], // set authors
    banned: [/* 628... */], // set banned
    browser: ['ZWA MD', 'Safari', '3.0.0'] // set browser to show in your connection
}
```

## Event Listener

```javascript
ZWA.on('connection', ({ status }) => {
    // this event for actived and running the bot
    // don't delete this event
    // status "connecting" || "open" || "close"
})

ZWA.on('messages', (msg) => {
    /* .... */
})

ZWA.on('messages.delete', (msg) => {
    /* .... */
})

ZWA.on('call', (msg) => {
    /* .... */
})

ZWA.on('update.status', (msg) => {
    /* .... */
})
```


## Demo

![Demo](https://github.com/zaadevofc/zaadevofc/blob/5bdca1bb6eb7873b37f8485cd53447d7fc696714/doc-zwa.gif?raw=true)


## Feedback

If you have any feedback, please reach out to us at zaadevofc@gmail.com


## License

Copyright (c) 2022 Dominik Wilkowski.
Licensed under the [GNU GPL-3.0-or-later](https://github.com/zaadevofc/zwa/blob/main/LICENSE).

