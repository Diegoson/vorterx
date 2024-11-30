const express = require("express");
const app = express();
const { toBuffer } = require("qrcode");
const makeid = require("./makeid.js");
const createPaste = require("./pastebin-js.js");
const {
  default: makeWASocket,
  useMultiFileAuthState,
  Browsers,
  delay,
} = require("@whiskeysockets/baileys");
const pino = require("pino");
const PORT = process.env.PORT || 3030;
app.use("/", (req, res) => {
  const id = makeid();
  let num = req.query.number;
  const authfile = `./tmp/${makeid()}.json`;
  const { state, saveCreds } = useMultiFileAuthState(authfile, pino({ level: "silent" }));

  function oi() {
    try {
      let session = makeWASocket({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({level: "fatal"}).child({level: "fatal"})),
                },
                printQRInTerminal: false,
                logger: pino({level: "fatal"}).child({level: "fatal"}),
                browser: Browsers.macOS("Safari"),
             });

      if (!session.authState.creds.registered) {
                await delay(1500);
                num = num.replace(/[^0-9]/g, '');
                const code = await session.requestPairingCode(num);
                if (!res.headersSent) {
                    await res.send({ code });
                }
      }
      session.ev.on('creds.update', saveCreds);
      session.ev.on("connection.update", async (s) => {
        const { connection, lastDisconnect } = s;
        if (connection == "open") {
          await delay(500 * 10);
          let link = await createPaste(authfile, "session");
          let data = link.replace("https://pastebin.com/", "");
          let c = code.split(ress).join(ress + "naxor");
          await session.sendMessage(session.user.id, { url:`whatsapp.com/otp/copy/${c}`),    
          await delay(3000 * 10);
          process.send("reset");
        }
        if ( connection === "close" && lastDisconnect && lastDisconnect.error &&
             lastDisconnect.error.output.statusCode != 401
        ) {
          oi();
        }
      });
    } catch (err) {
      console.log(
        err + "3rror"
      );
    }}
 oi();
});

module.exports = router;
