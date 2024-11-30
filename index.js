//
let express = require("express");
let app = express();
let { toBuffer } = require("qrcode");
let makeid = require("./makeid.js");
let createPaste = require("./pastebinHelper.js"); // Import the helper function
const {
  default: makeWASocket,
  useSingleFileAuthState,
  Browsers,
  delay,
} = require("@adiwajshing/baileys");

const pino = require("pino");
let PORT = process.env.PORT || 3030;

app.use("/", (req, res) => {
  const authfile = `./tmp/${makeid()}.json`;
  const { state } = useSingleFileAuthState(authfile, pino({ level: "silent" }));

  function Amarok() {
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
          
          // Use the helper function to create the Pastebin link
          let link = await createPaste(authfile, "Amarok-MD session");
          let data = link.replace("https://pastebin.com/", "");
          let code = Buffer.from(data).toString("base64");

          const templateMessage = {
            text: `\nᴅᴇᴀʀ ᴜsᴇʀ ᴛʜɪs ɪs ʏᴏᴜʀ sᴇssɪᴏɴ ɪᴅ
          
◕ ⚠️ *ᴘʟᴇᴀsᴇ ᴅᴏ ɴᴏᴛ sʜᴀʀᴇ ᴛʜɪs ᴄᴏᴅᴇ ᴡɪᴛʜ ᴀɴʏᴏɴᴇ ᴀs ɪᴛ ᴄᴏɴᴛᴀɪɴs ʀᴇǫᴜɪʀᴇᴅ ᴅᴀᴛᴀ ᴛᴏ ɢᴇᴛ ʏᴏᴜʀ ᴄᴏɴᴛᴀᴄᴛ ᴅᴇᴛᴀɪʟs ᴀɴᴅ ᴀᴄᴄᴇss ʏᴏᴜʀ ᴡʜᴀᴛsᴀᴘᴘ*`,
            footer: "sᴇssɪᴏɴ",
          };

          await session.sendMessage(session.user.id, templateMessage);

          await delay(3000 * 10);
          process.send("reset");
        }
        if (
          connection === "close" &&
          lastDisconnect &&
          lastDisconnect.error &&
          lastDisconnect.error.output.statusCode != 401
        ) {
          Amarok();
        }
      });
    } catch (err) {
      console.log(
        err + "Unknown Error Occured Please report to Owner and Stay tuned"
      );
    }
  }

  Amarok();
});

app.listen(PORT, () => console.log("App listened on port", PORT));
