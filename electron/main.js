const path = require("path");
const { app, BrowserWindow } = require("electron");
const { spawn } = require("child_process");
const http = require("http");

// ── Config ─────────────────────────────────────────────────────────────────
const BACKEND_PORT = 8765;
const isDev = !app.isPackaged; // true when running via `npm run dev`

let backendProcess = null;
let mainWindow = null;

// ── Spawn the Django backend exe (production only) ──────────────────────────
function startBackend() {
  if (isDev) return; // In dev, backend is started manually

  const exePath = path.join(
    process.resourcesPath,
    "backend",
    "perfectfit-server.exe"
  );

  backendProcess = spawn(exePath, [], {
    detached: false,
    stdio: "ignore", // suppress console window
  });

  backendProcess.on("error", (err) => {
    console.error("[Electron] Backend failed to start:", err.message);
  });
}

// ── Poll health endpoint until backend is ready ─────────────────────────────
function waitForBackend(retries = 30) {
  return new Promise((resolve, reject) => {
    function attempt(remaining) {
      if (remaining <= 0) {
        reject(new Error("Backend did not start in time"));
        return;
      }
      const req = http.get(
        `http://127.0.0.1:${BACKEND_PORT}/api/health/`,
        (res) => {
          if (res.statusCode === 200) resolve();
          else setTimeout(() => attempt(remaining - 1), 500);
        }
      );
      req.on("error", () => setTimeout(() => attempt(remaining - 1), 500));
      req.end();
    }
    attempt(retries);
  });
}

// ── Create the browser window ───────────────────────────────────────────────
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 680,
    icon: path.join(__dirname, "assets", "icon.ico"),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.setMenuBarVisibility(false); // clean desktop-app look

  if (isDev) {
    // Dev: load Vite dev server
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools();
  } else {
    // Production: load compiled React build
    const indexPath = path.join(
      process.resourcesPath,
      "frontend",
      "index.html"
    );
    mainWindow.loadFile(indexPath);
  }
}

// ── App lifecycle ───────────────────────────────────────────────────────────
app.whenReady().then(async () => {
  startBackend();

  if (!isDev) {
    try {
      await waitForBackend();
    } catch (err) {
      console.error("[Electron] Backend not ready:", err.message);
    }
  }

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  // Kill backend process before quitting
  if (backendProcess) {
    backendProcess.kill();
    backendProcess = null;
  }
  if (process.platform !== "darwin") app.quit();
});

