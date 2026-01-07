const qrcode = require("qrcode");
const os = require("os");
const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
const puppeteer = require("puppeteer");

let whatsappClient;
let isInitializing = false;
let isReady = false;
let retryCount = 0;
let currentQRCode = null;
let connectionStatus = "disconnected"; // "disconnected", "connecting", "qr_ready", "connected"
const MAX_RETRIES = 3;

// Check if running in production/cloud environment
const isProduction =
  process.env.NODE_ENV === "production" || process.env.RENDER === "true";

// Get Chrome/Chromium executable path
async function getChromePath() {
  const platform = os.platform();

  // First, try to use Puppeteer's bundled Chromium (works everywhere including Render)
  try {
    // puppeteer.executablePath() returns the path to bundled Chromium
    const bundledPath = puppeteer.executablePath();
    if (bundledPath) {
      console.log("✅ Using Puppeteer bundled Chromium:", bundledPath);
      return bundledPath;
    }
  } catch (error) {
    console.log(
      "⚠️ Could not get Puppeteer bundled Chromium path:",
      error.message
    );
  }

  // Fallback: For local development on macOS/Windows, use system Chrome
  if (!isProduction) {
    switch (platform) {
      case "darwin":
        console.log("✅ Using system Chrome (macOS)");
        return "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
      case "win32":
        console.log("✅ Using system Chrome (Windows)");
        return "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
    }
  }

  // Last resort: try common Linux paths
  const linuxPaths = [
    "/usr/bin/chromium-browser",
    "/usr/bin/chromium",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/google-chrome",
  ];

  for (const chromePath of linuxPaths) {
    try {
      const fs = require("fs");
      if (fs.existsSync(chromePath)) {
        console.log("✅ Found Chrome at:", chromePath);
        return chromePath;
      }
    } catch (e) {
      // Continue checking
    }
  }

  throw new Error(
    "❌ No Chrome/Chromium executable found. Please ensure Puppeteer is installed correctly."
  );
}

async function startWhatsAppClient() {
  if (isInitializing) return;
  isInitializing = true;
  connectionStatus = "connecting";
  currentQRCode = null;

  try {
    const chromePath = await getChromePath();

    whatsappClient = new Client({
      authStrategy: new LocalAuth({
        dataPath: "./session_data",
        clientId: "maa_computers_client",
      }),
      puppeteer: {
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-accelerated-2d-canvas",
          "--no-first-run",
          "--no-zygote",
          "--disable-gpu",
        ],
        executablePath: chromePath,
        defaultViewport: null,
        timeout: 60000,
      },
      qrMaxRetries: 3,
      restartOnAuthFail: true,
    });

    whatsappClient.on("qr", async (qr) => {
      console.log("📱 QR Code generated, ready for scanning");
      // Generate QR code as data URL for frontend
      try {
        currentQRCode = await qrcode.toDataURL(qr, {
          width: 300,
          margin: 2,
        });
        connectionStatus = "qr_ready";
      } catch (err) {
        console.error("Failed to generate QR data URL:", err);
      }
    });

    whatsappClient.on("authenticated", () => {
      console.log("🔐 WhatsApp authentication successful");
      retryCount = 0;
      currentQRCode = null;
      connectionStatus = "connecting";
    });

    whatsappClient.on("ready", () => {
      console.log("✅ WhatsApp client is ready");
      isReady = true;
      isInitializing = false;
      currentQRCode = null;
      connectionStatus = "connected";
    });

    whatsappClient.on("auth_failure", async (msg) => {
      console.error("❌ WhatsApp authentication failed:", msg);
      isReady = false;
      connectionStatus = "disconnected";
      if (retryCount < MAX_RETRIES) {
        retryCount++;
        console.log(
          `🔄 Retrying authentication (${retryCount}/${MAX_RETRIES})...`
        );
        await restartWhatsAppClient();
      } else {
        console.error(
          "❌ Max retries reached. Please check your WhatsApp connection."
        );
      }
    });

    whatsappClient.on("disconnected", async (reason) => {
      console.log("🚫 WhatsApp disconnected:", reason);
      isReady = false;
      isInitializing = false;
      connectionStatus = "disconnected";
      currentQRCode = null;
      if (retryCount < MAX_RETRIES) {
        retryCount++;
        console.log(
          `🔄 Attempting to reconnect (${retryCount}/${MAX_RETRIES})...`
        );
        await restartWhatsAppClient();
      }
    });

    await whatsappClient.initialize();
  } catch (error) {
    console.error("❌ Error initializing WhatsApp client:", error);
    isInitializing = false;
    isReady = false;
    connectionStatus = "disconnected";
    if (retryCount < MAX_RETRIES) {
      retryCount++;
      console.log(
        `🔄 Retrying initialization (${retryCount}/${MAX_RETRIES})...`
      );
      setTimeout(startWhatsAppClient, 5000);
    }
  }
}

async function restartWhatsAppClient() {
  try {
    isReady = false;
    connectionStatus = "disconnected";
    currentQRCode = null;
    retryCount = 0;
    isInitializing = false;
    if (whatsappClient) {
      await whatsappClient.destroy();
      whatsappClient = null;
    }
    await startWhatsAppClient();
  } catch (error) {
    console.error("❌ Error restarting WhatsApp client:", error);
  }
}

function getWhatsAppClient() {
  if (!whatsappClient || !whatsappClient.pupPage) {
    console.log("⚠️ WhatsApp client not ready");
    return null;
  }
  return whatsappClient;
}

function isWhatsAppReady() {
  return isReady && whatsappClient && whatsappClient.pupPage;
}

function getQRCode() {
  return currentQRCode;
}

function getStatus() {
  return {
    status: connectionStatus,
    isReady: isReady,
    isInitializing: isInitializing,
    hasQR: !!currentQRCode,
  };
}

// Export the functions
module.exports = {
  startWhatsAppClient,
  getWhatsAppClient,
  restartWhatsAppClient,
  isWhatsAppReady,
  getQRCode,
  getStatus,
  MessageMedia,
};
