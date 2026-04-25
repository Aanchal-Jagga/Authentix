// Authentix Background Service Worker
const API_URL_IMAGE = "http://127.0.0.1:8000/api/analyze/image";
const API_URL = "http://127.0.0.1:8000/api/analyze/url";

// Create context menu on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "authentix-analyze",
    title: "Analyze with Authentix",
    contexts: ["image"],
  });
});

// Handle context menu click — still uses URL for single right-click analysis
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "authentix-analyze" && info.srcUrl && tab?.id) {
    await chrome.storage.local.set({
      lastResult: { status: "scanning", url: info.srcUrl },
    });

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

// Handle image blob analysis from content script
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "ANALYZE_IMAGE_BLOB" && msg.dataUrl) {
    // Convert data URL to blob and upload as multipart/form-data
    fetch(msg.dataUrl)
      .then((r) => r.blob())
      .then((blob) => {
        const formData = new FormData();
        formData.append("file", blob, "image.jpg");

        return fetch(API_URL_IMAGE, {
          method: "POST",
          body: formData,
        });
      })
      .then((resp) => resp.json())
      .then((data) => sendResponse({ success: true, data }))
      .catch((err) => sendResponse({ success: false, error: err.message }));

    return true; // keep channel open for async
  }

  // Legacy: URL-based analysis (for context menu fallback)
  if (msg.type === "ANALYZE_IMAGE" && msg.url) {
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: msg.url }),
    })
      .then((resp) => resp.json())
      .then((data) => sendResponse({ success: true, data }))
      .catch((err) => sendResponse({ success: false, error: err.message }));

    return true;
  }
});
