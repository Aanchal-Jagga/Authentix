// const API_URL = "http://127.0.0.1:8000/api/analyze/url";
// const scanned = new WeakSet();

// function createBadge(text, type) {
//   const badge = document.createElement("div");
//   badge.className = `authentix-badge ${type}`;
//   badge.textContent = text;
//   return badge;
// }

// function getImageUrl(img) {
//   return img.currentSrc || img.src;
// }

// async function analyzeImage(img) {
//   try {
//     if (!img || scanned.has(img)) return;
//     if (!img.complete) return;
//     if (img.naturalWidth < 120 || img.naturalHeight < 120) return;

//     scanned.add(img);

//     const wrapper = document.createElement("span");
//     wrapper.className = "authentix-wrapper";
//     img.parentNode.insertBefore(wrapper, img);
//     wrapper.appendChild(img);

//     const badge = createBadge("Authentix: Scanning...", "processing");
//     wrapper.appendChild(badge);

//     const url = getImageUrl(img);

//     const apiResp = await fetch(API_URL, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ url })
//     });

//     const result = await apiResp.json();

//     // ✅ NEW: backend now returns { media: {...}, news: {...} }
//     const media = result.media || {};
//     const news = result.news || {};

//     const mediaLabel = media.label || "UNKNOWN";
//     const mediaConf = media.confidence ?? 0;

//     const newsCategory = news.category || "unknown";
//     const newsConf = news.confidence ?? 0;

//     // ✅ Badge UI text (Media + News)
//     let mediaText = "";
//     let badgeClass = "authentix-badge safe";

//     if (mediaLabel === "DEEPFAKE") {
//       mediaText = `🔴 Deepfake (${mediaConf})`;
//       badgeClass = "authentix-badge highrisk";
//     } else if (mediaLabel === "AI_GENERATED") {
//       mediaText = `🟣 AI Generated (${mediaConf})`;
//       badgeClass = "authentix-badge review";
//     } else {
//       mediaText = `🟢 Real (${mediaConf})`;
//       badgeClass = "authentix-badge safe";
//     }

//     // News label mapping
//     let newsText = "";
//     if (newsCategory === "fake_news") {
//       newsText = `📰 Fake News (${newsConf})`;
//     } else if (newsCategory === "misleading") {
//       newsText = `⚠️ Misleading (${newsConf})`;
//     } else {
//       newsText = `✅ Verified (${newsConf})`;
//     }

//     badge.textContent = `${mediaText} | ${newsText}`;
//     badge.className = badgeClass;

//   } catch (err) {
//     console.error("Authentix error:", err);
//   }
// }

// function scanImages() {
//   document.querySelectorAll("img").forEach((img) => analyzeImage(img));
// }

// scanImages();
// const observer = new MutationObserver(() => scanImages());
// observer.observe(document.body, { childList: true, subtree: true });
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
      body: JSON.stringify({ url })
    });

    const result = await apiResp.json();

    const label = result.label || "UNKNOWN";
    const confidence = (result.confidence ?? 0).toFixed(2);

    const faces = result.faces_detected ?? 0;

    let badgeText = "";
    let badgeClass = "safe";

    if (label === "FAKE") {
      badgeText = `🔴 Deepfake (${confidence})`;
      badgeClass = "highrisk";
    } else if (label === "NO_FACE_DETECTED") {
      badgeText = `⚪ No Face Detected`;
      badgeClass = "review";
    } else {
      badgeText = `🟢 Real (${confidence})`;
      badgeClass = "safe";
    }

    badge.textContent = `${badgeText} | Faces: ${faces}`;
    badge.className = `authentix-badge ${badgeClass}`;

  } catch (err) {
    console.error("Authentix error:", err);
  }
}

function scanImages() {
  document.querySelectorAll("img").forEach((img) => analyzeImage(img));
}

scanImages();

const observer = new MutationObserver(() => scanImages());
observer.observe(document.body, { childList: true, subtree: true });