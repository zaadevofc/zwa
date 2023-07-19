
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

