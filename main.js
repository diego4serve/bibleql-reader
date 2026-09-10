const { app, BrowserWindow, nativeTheme } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1040,
    minHeight: 620,
    titleBarStyle: process.platform === "darwin" ? "hiddenInset" : "hidden",
    titleBarOverlay: process.platform === "darwin" ? false : { color: "#eae9e9", symbolColor: "#201f1d", height: 46 },
    backgroundColor: nativeTheme.shouldUseDarkColors ? "#171615" : "#f3f2f2",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.js")
    }
  });

  win.loadFile(path.join(__dirname, "index.html"));
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
