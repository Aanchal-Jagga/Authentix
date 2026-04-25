const scanned = new WeakSet();

// ── Request queue to avoid overwhelming the backend ──
const queue = [];
let activeRequests = 0;
const MAX_CONCURRENT = 2;

function processQueue() {
  while (activeRequests < MAX_CONCURRENT && queue.length > 0) {
    const { img, badge } = queue.shift();
    activeRequests++;

    // Convert image to blob via canvas, then send to background
    imageToBlob(img)
      .then((dataUrl) => {
        chrome.runtime.sendMessage(
          { type: "ANALYZE_IMAGE_BLOB", dataUrl },
          (response) => {
            activeRequests--;
            processQueue();

            if (chrome.runtime.lastError) {
              console.error("Authentix error:", chrome.runtime.lastError.message);
              badge.textContent = "❌ Extension error";
              badge.className = "authentix-badge highrisk";
              return;
            }
            if (response && response.success) {
              updateBadge(badge, response.data);
            } else {
              badge.textContent = `❌ ${(response && response.error) || "Backend offline"}`;
              badge.className = "authentix-badge highrisk";
            }
          }
        );
      })
      .catch((err) => {
        activeRequests--;
        processQueue();
        console.error("Authentix canvas error:", err);
        badge.textContent = "❌ Canvas error";
        badge.className = "authentix-badge highrisk";
      });
  }
}

// ── Convert <img> to data URL via canvas ──

function imageToBlob(img) {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
      resolve(dataUrl);
    } catch (e) {
      // CORS — fallback: try fetching the image directly
      const url = img.currentSrc || img.src;
      if (!url || url.startsWith("data:")) {
        reject(e);
        return;
      }
      fetch(url)
        .then((r) => r.blob())
        .then((blob) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = () => reject(e);
          reader.readAsDataURL(blob);
        })
        .catch(() => reject(e));
    }
  });
}

// ── Helpers ──

function createBadge(text, type) {
  const badge = document.createElement("div");
  badge.className = `authentix-badge ${type}`;
  badge.textContent = text;
  return badge;
}

// ── Analyze a single image ──

function analyzeImage(img) {
  try {
    if (!img || scanned.has(img)) return;
    if (!img.complete) return;
    if (img.naturalWidth < 120 || img.naturalHeight < 120) return;

    scanned.add(img);

    const wrapper = document.createElement("span");
    wrapper.className = "authentix-wrapper";
    img.parentNode.insertBefore(wrapper, img);
    wrapper.appendChild(img);

    const badge = createBadge("Authentix: Scanning...", "processing");
    wrapper.appendChild(badge);

    // Add to queue
    queue.push({ img, badge });
    processQueue();
  } catch (err) {
    console.error("Authentix error:", err);
  }
}

// ── Update badge with result ──

function updateBadge(badge, result) {
  const label = (result.label || "UNKNOWN").toUpperCase();
  const confidence = (result.confidence ?? 0).toFixed(2);
  const faces = result.faces_detected ?? 0;

  let badgeText = "";
  let badgeClass = "safe";

  if (label === "ERROR") {
    badgeText = `❌ ${result.error || "Analysis failed"}`;
    badgeClass = "highrisk";
  } else if (label === "SKIPPED") {
    badgeText = `⏭️ Skipped`;
    badgeClass = "review";
  } else if (label === "DEEPFAKE" || label === "FAKE") {
    badgeText = `🔴 Deepfake (${confidence})`;
    badgeClass = "highrisk";
  } else if (label === "AI_GENERATED") {
    badgeText = `🟠 AI Generated (${confidence})`;
    badgeClass = "review";
  } else if (label === "NO_FACE_DETECTED") {
    badgeText = `⚪ No Face Detected`;
    badgeClass = "review";
  } else {
    badgeText = `🟢 Real (${confidence})`;
    badgeClass = "safe";
  }

  badge.textContent = `${badgeText} | Faces: ${faces}`;
  badge.className = `authentix-badge ${badgeClass}`;
}

// ── Listen for messages from background script (context menu) ──

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "AUTHENTIX_ANALYZE") {
    const imgs = document.querySelectorAll("img");
    imgs.forEach((img) => {
      if ((img.currentSrc || img.src) === msg.url && !scanned.has(img)) {
        analyzeImage(img);
      }
    });
  }

  if (msg.type === "AUTHENTIX_RESULT") {
    const { result } = msg;
    const wrappers = document.querySelectorAll(
      `.authentix-wrapper[data-authentix-url="${result.url}"]`
    );
    wrappers.forEach((wrapper) => {
      const badge = wrapper.querySelector(".authentix-badge");
      if (badge) {
        if (result.status === "error") {
          badge.textContent = `❌ ${result.error}`;
          badge.className = "authentix-badge highrisk";
        } else {
          updateBadge(badge, result);
        }
      }
    });
  }
});

// ── Auto-scan images on page ──

function scanImages() {
  document.querySelectorAll("img").forEach((img) => analyzeImage(img));
}

scanImages();
const observer = new MutationObserver(() => scanImages());
observer.observe(document.body, { childList: true, subtree: true });