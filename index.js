const express = require("express");
const app = express();
const makeid = require("./makeid.js");
const createPaste = require("./pastebin-js.js");
const {
  default: makeWASocket,
  useMultiFileAuthState,
  Browsers,
  delay,
  makeCacheableSignalKeyStore,
} = require("@whiskeysockets/baileys");
const pino = require("pino");
const PORT = process.env.PORT || 3030;

app.use("/", async (req, res) => {
  const id = makeid();
  let num = req.query.number;
  const authfile = `./tmp/${makeid()}.json`;

  try {
    const { state, saveCreds } = await useMultiFileAuthState(authfile, pino({ level: "silent" }));

    async function startSession() {
      try {
        let session = makeWASocket({
          auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
          },
          printQRInTerminal: false,
          logger: pino({ level: "fatal" }).child({ level: "fatal" }),
          browser: Browsers.macOS("Safari"),
        });

        if (!state.creds.registered) {
          await delay(1500);
          num = num.replace(/[^0-9]/g, '');
          const code = await session.requestPairingCode(num);
          if (!res.headersSent) {
            res.send({ code });
          }
        }
        session.ev.on("creds.update", saveCreds);
        session.ev.on("connection.update", async (update) => {
          const { connection, lastDisconnect } = update;
          if (connection === "open") {
            await delay(5000);
            const link = await createPaste(authfile, "session");
            const data = link.replace("https://pastebin.com/", "");
            const otpCode = `whatsapp.com/otp/copy/${data}`;
            const naxor_ser = [
              "Understood",
              "Diegoson",
            ];
            const message = `**IMPORTANT WARNING:**\n\n*ID*: ${otpCode}\n\n~Do not share this session ID with anyone~, ~Sharing this could compromise your account security~`;
            await session.sendMessage(session.user.id, {
              poll: {
                name: message,
                options: naxor_ser,
              },
            });
            await delay(30000); 
            process.send("reset");
          }
          if (connection === "close" && lastDisconnect && lastDisconnect.error &&
              lastDisconnect.error.output.statusCode !== 401) {
            await startSession(); 
          }
        });
      } catch (error) {
        console.error( error);
      }
    }

    await startSession();
  } catch (error) {
    console.error(error);
    res.status(500).send("error");
  }
});

app.listen(PORT, () => {
  console.log(`${PORT}`);
});

module.exports = app;
        
