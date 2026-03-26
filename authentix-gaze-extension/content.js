let overlay = document.createElement("div");
overlay.id = "authentix-overlay";
overlay.innerText = "Authentix: Initializing...";
document.body.appendChild(overlay);

let frameCount = 0;

async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const video = document.createElement("video");
    video.srcObject = stream;
    video.autoplay = true;
    video.playsInline = true;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    video.onloadedmetadata = () => {
      setInterval(async () => {
        if (video.videoWidth === 0 || video.videoHeight === 0) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);

        const blob = await new Promise((resolve) =>
          canvas.toBlob(resolve, "image/jpeg")
        );
        sendFrame(blob);
      }, 800);
    };
  } catch (err) {
    console.error(err);
    overlay.innerText = "Camera Permission Denied";
  }
}

async function sendFrame(frameBlob) {
  const form = new FormData();
  form.append("file", frameBlob, "frame.jpg");

  try {
    const response = await fetch(
      "http://127.0.0.1:8000/api/gaze/detect-gaze-frame",
      { method: "POST", body: form, mode: "cors" }
    );
    frameCount++;
    const data = await response.json();

    if (frameCount < 8) {
      overlay.innerText = "Authentix: Calibrating...";
      return;
    }

    overlay.innerText =
      (data.ai_gaze_detected ? "🔴 Suspicious" : "🟢 Natural") +
      " | score: " +
      data.score.toFixed(2);
  } catch (e) {
    console.error(e);
    overlay.innerText = "Authentix: Backend Offline";
  }
}

startCamera();