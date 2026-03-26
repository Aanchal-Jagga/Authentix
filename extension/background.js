// Authentix Background Service Worker
const API_URL = "http://127.0.0.1:8000/api/analyze/url";

// Create context menu on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "authentix-analyze",
    title: "Analyze with Authentix",
    contexts: ["image"],
  });
});

// Handle context menu click
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "authentix-analyze" && info.srcUrl && tab?.id) {
    // Store loading state
    await chrome.storage.local.set({
      lastResult: { status: "scanning", url: info.srcUrl },
    });

    // Send message to content script to show badge
    chrome.tabs.sendMessage(tab.id, {
      type: "AUTHENTIX_ANALYZE",
      url: info.srcUrl,
    });

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: info.srcUrl }),
      });
      const data = await response.json();

      const result = {
        status: "done",
        url: info.srcUrl,
        label: data.label || "UNKNOWN",
        confidence: data.confidence ?? 0,
        faces_detected: data.faces_detected ?? 0,
        timestamp: Date.now(),
      };

      await chrome.storage.local.set({ lastResult: result });

      // Send result to content script
      chrome.tabs.sendMessage(tab.id, {
        type: "AUTHENTIX_RESULT",
        result,
      });
    } catch (err) {
      const errorResult = {
        status: "error",
        url: info.srcUrl,
        error: err.message || "Backend offline",
        timestamp: Date.now(),
      };
      await chrome.storage.local.set({ lastResult: errorResult });

      chrome.tabs.sendMessage(tab.id, {
        type: "AUTHENTIX_RESULT",
        result: errorResult,
      });
    }
  }
});
