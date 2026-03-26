const API_URL = "http://127.0.0.1:8000/api/analyze/url";
const scanned = new WeakSet();

function createBadge(text, type) {
  const badge = document.createElement("div");
  badge.className = `authentix-badge ${type}`;
  badge.textContent = text;
  return badge;
}

function getImageUrl(img) {
  return img.currentSrc || img.src;
}

async function analyzeImage(img) {
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

    const url = getImageUrl(img);

    const apiResp = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    const result = await apiResp.json();
    updateBadge(badge, result);
  } catch (err) {
    console.error("Authentix error:", err);
  }
}

function updateBadge(badge, result) {
  const label = (result.label || "UNKNOWN").toUpperCase();
  const confidence = (result.confidence ?? 0).toFixed(2);
  const faces = result.faces_detected ?? 0;

  let badgeText = "";
  let badgeClass = "safe";

  if (label === "DEEPFAKE" || label === "FAKE") {
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

// Listen for messages from background script (context menu)
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "AUTHENTIX_ANALYZE") {
    // Find the image by URL and show scanning badge
    const imgs = document.querySelectorAll("img");
    imgs.forEach((img) => {
      if ((img.currentSrc || img.src) === msg.url && !scanned.has(img)) {
        scanned.add(img);
        const wrapper = document.createElement("span");
        wrapper.className = "authentix-wrapper";
        wrapper.dataset.authentixUrl = msg.url;
        img.parentNode.insertBefore(wrapper, img);
        wrapper.appendChild(img);
        const badge = createBadge("Authentix: Scanning...", "processing");
        wrapper.appendChild(badge);
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

// Auto-scan images on page
function scanImages() {
  document.querySelectorAll("img").forEach((img) => analyzeImage(img));
}

scanImages();
const observer = new MutationObserver(() => scanImages());
observer.observe(document.body, { childList: true, subtree: true });