const { contextBridge, ipcRenderer } = require("electron");

// The renderer talks to BibleQL directly over fetch; this bridge exists for the
// v2 backend work (bookmarks, reading plans) and for platform hints.
contextBridge.exposeInMainWorld("desktop", {
  platform: process.platform,
  version: process.versions.electron
});
