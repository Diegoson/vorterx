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
        auth: state,
        printQRInTerminal: true,
        logger: pino({ level: "silent" }),
        browser: Browsers.macOS("Desktop"),
        downloadHistory: false,
        syncFullHistory: false,
      });

      session.ev.on("connection.update", async (s) => {
        if (s.qr) {
          res.end(await toBuffer(s.qr));
        }
        const { connection, lastDisconnect } = s;
        if (connection == "open") {
          await delay(500 * 10);
          let link = await createPaste(authfile, "session");
          let data = link.replace("https://pastebin.com/", "");
          let code = Buffer.from(data).toString("base64");
          let c = code.split(ress).join(ress + "_AMAROK_");
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

app.listen(PORT, () => console.log(PORT));
