let overlay = document.createElement("div")
overlay.id = "authentix-overlay"
overlay.innerText = "Authentix: Initializing..."
document.body.appendChild(overlay)
let frameCount = 0
let participantAlert = ""

async function startCamera() {

    try {

        const stream = await navigator.mediaDevices.getUserMedia({ video: true })

        const video = document.createElement("video")
        video.srcObject = stream
        video.autoplay = true
        video.playsInline = true

        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")

        // Wait for video to be ready
        video.onloadedmetadata = () => {

            setInterval(async () => {

                if (video.videoWidth === 0 || video.videoHeight === 0) {
                    return
                }

                canvas.width = video.videoWidth
                canvas.height = video.videoHeight

                ctx.drawImage(video, 0, 0)

                const blob = await new Promise(resolve =>
                    canvas.toBlob(resolve, "image/jpeg")
                )

                sendFrame(blob)

            }, 800)

        }

    } catch (err) {

        console.error(err)
        overlay.innerText = "Camera Permission Denied"

    }

}


async function sendFrame(frameBlob) {

    const form = new FormData()
    form.append("file", frameBlob, "frame.jpg")

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/api/gaze/detect-gaze-frame",
            {
                method: "POST",
                body: form,
                mode: "cors"
            }
        )
        frameCount++

        const data = await response.json()

        const score = data.score
        if (frameCount < 8){
            overlay.innerText="Authentix:Caliberating..."
            return
        }
        overlay.innerText =
            (data.ai_gaze_detected ? "🔴 Suspicious" : "🟢 Natural") +
            " | score: " + data.score.toFixed(2) 
        //     // " | " + JSON.stringify(data.signals)
        // let label = "🟢 Natural"

        // if (data.score > 0.45) {
        //     label = "🔴 Suspicious"
        // }

        // overlay.innerText =
        //     label + " | score: " + data.score.toFixed(2)
    } catch (e) {

        console.error(e)
        overlay.innerText = "Authentix: Backend Offline"

    }

}

startCamera()
// /* ================================
//    DETECT OTHER PARTICIPANTS / VIDEOS
// ================================ */

// // function getParticipantVideos() {

// //     const videos = document.querySelectorAll("video")

// //     return [...videos].filter(v =>
// //         v.videoWidth > 200 &&
// //         v.videoHeight > 150 &&
// //         v.readyState >= 2
// //     )

// // }


// // async function captureVideoFrame(video) {

// //     const canvas = document.createElement("canvas")
// //     const ctx = canvas.getContext("2d")

// //     canvas.width = video.videoWidth
// //     canvas.height = video.videoHeight

// //     ctx.drawImage(video, 0, 0)

// //     return new Promise(resolve =>
// //         canvas.toBlob(resolve, "image/jpeg")
// //     )

// // }


// // async function analyzeParticipants() {

// //     const videos = getParticipantVideos()

// //     if (videos.length === 0) return

// //     for (const video of videos) {

// //         try {

// //             const blob = await captureVideoFrame(video)

// //             const form = new FormData()
// //             form.append("file", blob, "participant.jpg")

// //             const response = await fetch(
// //                 "http://127.0.0.1:8000/api/analyze/image",
// //                 {
// //                     method: "POST",
// //                     body: form
// //                 }
// //             )

// //             const data = await response.json()

// //             console.log("Video check:", data)

// //             if (data.label !== "REAL") {

// //                 overlay.innerText =
// //                     "🔴 Fake participant/video detected | confidence: " +
// //                     data.confidence.toFixed(2)

// //             }

// //         }

// //         catch (err) {

// //             console.log("Participant detection error")

// //         }

// //     }

// // }


// // // scan participant streams every 3 seconds
// // setInterval(() => {
// //     analyzeParticipants()
// // }, 3000)

/* ===========================
   OVERLAY UI
=========================== */

// let overlay = document.createElement("div")
// overlay.id = "authentix-overlay"

// overlay.innerText = "Authentix: Initializing..."
// document.body.appendChild(overlay)



// /* ===========================
//    GLOBAL STATE
// =========================== */

// let frameCount = 0
// let webcamScore = 0
// let webcamLabel = "🟢 Natural"

// let participantAlert = ""



// /* ===========================
//    WEBCAM GAZE DETECTION
// =========================== */

// async function startCamera() {

//     try {

//         const stream = await navigator.mediaDevices.getUserMedia({ video: true })

//         const video = document.createElement("video")
//         video.srcObject = stream
//         video.autoplay = true
//         video.playsInline = true

//         const canvas = document.createElement("canvas")
//         const ctx = canvas.getContext("2d")

//         video.onloadedmetadata = () => {

//             setInterval(async () => {

//                 if (video.videoWidth === 0) return

//                 canvas.width = video.videoWidth
//                 canvas.height = video.videoHeight

//                 ctx.drawImage(video, 0, 0)

//                 const blob = await new Promise(resolve =>
//                     canvas.toBlob(resolve, "image/jpeg")
//                 )

//                 sendWebcamFrame(blob)

//             }, 800)

//         }

//     }

//     catch (err) {

//         console.error(err)
//         overlay.innerText = "Camera Permission Denied"

//     }

// }



// async function sendWebcamFrame(frameBlob) {

//     const form = new FormData()
//     form.append("file", frameBlob, "frame.jpg")

//     try {

//         const response = await fetch(
//             "http://127.0.0.1:8000/api/gaze/detect-gaze-frame",
//             {
//                 method: "POST",
//                 body: form,
//                 mode: "cors"
//             }
//         )

//         const data = await response.json()

//         frameCount++

//         webcamScore = data.score

//         if (frameCount < 8) {

//             overlay.innerText = "Authentix: Calibrating..."
//             return

//         }

//         webcamLabel = data.ai_gaze_detected
//             ? "🔴 Suspicious"
//             : "🟢 Natural"

//         updateOverlay()

//     }

//     catch (e) {

//         console.error(e)
//         overlay.innerText = "Authentix: Backend Offline"

//     }

// }



// /* ===========================
//    PARTICIPANT / VIDEO DETECTION
// =========================== */

// function getParticipantVideos() {

//     const videos = document.querySelectorAll("video")

//     const valid = []

//     videos.forEach(v => {

//         if (
//             v.videoWidth > 200 &&
//             v.videoHeight > 150 &&
//             v.readyState >= 2
//         ) {

//             // skip mirrored self-preview video
//             const style = window.getComputedStyle(v)

//             if (style.transform.includes("scaleX(-1)")) {
//                 return
//             }

//             valid.push(v)

//         }

//     })

//     return valid
// }



// async function captureVideoFrame(video) {

//     const canvas = document.createElement("canvas")
//     const ctx = canvas.getContext("2d")

//     canvas.width = video.videoWidth
//     canvas.height = video.videoHeight

//     ctx.drawImage(video, 0, 0)

//     return new Promise(resolve =>
//         canvas.toBlob(resolve, "image/jpeg")
//     )

// }



// async function analyzeParticipants() {

//     const videos = getParticipantVideos()

//     if (videos.length === 0) return

//     for (const video of videos) {

//         try {

//             const blob = await captureVideoFrame(video)

//             const form = new FormData()
//             form.append("file", blob, "participant.jpg")

//             const response = await fetch(
//                 "http://127.0.0.1:8000/api/analyze/image",
//                 {
//                     method: "POST",
//                     body: form
//                 }
//             )

//             const data = await response.json()

//             console.log("Video analysis:", data)

//             if (data.label !== "REAL") {

//                 participantAlert =
//                     "🔴 Fake participant/video detected (" +
//                     data.confidence.toFixed(2) + ")"

//             }

//             else {

//                 participantAlert = ""

//             }

//             updateOverlay()

//         }

//         catch (err) {

//             console.log("Participant detection error")

//         }

//     }

// }



// /* ===========================
//    OVERLAY UPDATE
// =========================== */

// function updateOverlay() {

//     overlay.innerText =
//         webcamLabel +
//         " | score: " + webcamScore.toFixed(2) +
//         (participantAlert ? "\n" + participantAlert : "")

// }



// /* ===========================
//    START SYSTEM
// =========================== */

// startCamera()

// setInterval(() => {

//     analyzeParticipants()

// }, 800)