const PastebinAPI = require("pastebin-js");
const pastebin = new PastebinAPI("h4cO2gJEMwmgmBoteYufW6_weLvBYCqT");
async function createPaste(filePath, title = "naxor")
  { try {
    const link = await pastebin.createPasteFromFile(filePath, title, null, 0, "N");
    return link;
  } catch (error) {
    console.error(error);
    throw new Error("err");
  }
}

module.exports = createPaste;
