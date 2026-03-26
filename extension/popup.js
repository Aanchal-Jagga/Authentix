// Popup script — reads last result from storage
document.addEventListener("DOMContentLoaded", async () => {
  const content = document.getElementById("content");

  const { lastResult } = await chrome.storage.local.get("lastResult");

  if (!lastResult) return; // keep default empty state

  if (lastResult.status === "scanning") {
    content.innerHTML = `
      <div class="result-card scanning">
        <div class="spinner"></div>
        <p class="status-text">Analyzing image...</p>
      </div>
    `;
    return;
  }

  if (lastResult.status === "error") {
    content.innerHTML = `
      <div class="result-card error">
        <div class="result-icon">❌</div>
        <p class="result-label">Error</p>
        <p class="result-detail">${lastResult.error}</p>
      </div>
    `;
    return;
  }

  // Done
  const label = (lastResult.label || "UNKNOWN").toUpperCase();
  let icon = "✅";
  let badgeClass = "safe";
  let labelText = "REAL";

  if (label === "DEEPFAKE" || label === "FAKE") {
    icon = "🔴";
    badgeClass = "danger";
    labelText = "DEEPFAKE";
  } else if (label === "AI_GENERATED") {
    icon = "🟠";
    badgeClass = "warning";
    labelText = "AI GENERATED";
  } else {
    icon = "🟢";
    badgeClass = "safe";
    labelText = "REAL";
  }

  const conf = ((lastResult.confidence ?? 0) * 100).toFixed(0);

  content.innerHTML = `
    <div class="result-card ${badgeClass}">
      <div class="result-icon">${icon}</div>
      <p class="result-label">${labelText}</p>
      <div class="confidence-bar-container">
        <div class="confidence-bar" style="width: ${conf}%"></div>
      </div>
      <p class="confidence-text">${conf}% Confidence</p>
      <p class="result-detail">Faces: ${lastResult.faces_detected ?? 0}</p>
    </div>
  `;
});
