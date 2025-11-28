const { app, BrowserWindow } = require("electron");

app.whenReady().then(() => {
	const window = new BrowserWindow({
		titleBarStyle: "hidden"
	});
	window.setAlwaysOnTop(true);
	window.loadURL("https://google.com");
});
