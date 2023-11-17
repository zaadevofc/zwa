const { useWatchFile } = require("../src");

module.exports = (ZWA) => {
  useWatchFile(__filename);

  ZWA.on("messages", async (msg) => {
    const { message, command } = msg;
    // you must set "prefix" in config to use "command"
    if (command == "tes") return ZWA.sendText("Tester ...");
    if (message == "hallo") return ZWA.sendText("Hai!");
  });
};
