<<<<<<< HEAD
# pbwjs
Powerful Baileys Wrapper for interacting WhatsApp Web API.
=======
# Powerful Baileys Wrapper in JavaScript/TypeScript

pbwjs is a wrapper for [Baileys](https://github.com/WhiskeySockets/Baileys). It comes with powerful API method that can easily to interact with WhatsApp Web API.

The structure is simple, all functionalities (send message, misc, etc) similar to [open-wa](https://github.com/open-wa/wa-automate-nodejs) and [WWebJS](https://github.com/pedroslopez/whatsapp-web.js). If you familiar with all these, then you can easily master this library.
## Usage/Examples
The usage just like this if you familiar with [open-wa](https://github.com/open-wa/wa-automate-nodejs) and [WWebJS](https://github.com/pedroslopez/whatsapp-web.js):

```js
const { Client } = require("pbwjs");

const client = new Client();
client.on("message:received", (msg) => {
    client.sendText(msg.key.from, "Hello!");
});
```
More you can check [example.ts](https://github.com/filham/pbwjs/blob/master/example.ts)


## Installation

Install with your favorite package manager:

```bash
npm install pbwjs
```
    
## Contributing

Contributions are always welcome!

See `contributing.md` for ways to get started.

Please adhere to this project's `code of conduct`.

This project is on going and README.md will always keep update. For now, It just be like this.
>>>>>>> 41b6be0 (initial commit)
