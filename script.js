document.addEventListener("DOMContentLoaded", () => {
    const video = document.getElementById('camera');
    const countdownElement = document.getElementById('countdown');
    const overlay = document.getElementById('overlay');

    let countdown = 5;

    // Access the user's camera
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            video.srcObject = stream;
            video.play();

            const countdownInterval = setInterval(() => {
                countdown--;
                countdownElement.textContent = countdown;

                if (countdown === 0) {
                    clearInterval(countdownInterval);
                    captureImage();
                }
            }, 1000);
        })
        .catch(error => {
            console.error("Error accessing the camera: ", error);
        });

    function captureImage() {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageDataUrl = canvas.toDataURL('image/png');

        video.pause();
        video.srcObject.getTracks().forEach(track => track.stop());

        displayHackedMessage(imageDataUrl);
    }

    function displayHackedMessage(imageDataUrl) {
        overlay.innerHTML = `
            <div id="hacked-message">Your phone is hacked!<br>Fuck You!</div>
            <img src="${imageDataUrl}" alt="Captured Image" style="margin-top: 20px; width: 100%;">
        `;

        if ('vibrate' in navigator) {
            navigator.vibrate([500, 500, 500]);
        }

        const audio = new Audio('scream.mp3');
        audio.play();
    }
});