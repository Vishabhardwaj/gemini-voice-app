const toggleButton = document.getElementById('toggleButton');
const statusDiv = document.getElementById('status');

let socket;
let mediaRecorder;
let audioContext;
let audioQueue = [];
let isPlaying = false;
let isConversationActive = false;

const startConversation = async () => {
    try {
        statusDiv.textContent = 'Connecting...';
        
        const wsUrl = `ws://${window.location.host}`;
        socket = new WebSocket(wsUrl);

        socket.onopen = async () => {
            statusDiv.textContent = 'Connected. Please speak.';
            isConversationActive = true;
            toggleButton.textContent = 'Stop Conversation';
            toggleButton.classList.add('active');

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
            
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0 && socket.readyState === WebSocket.OPEN) {
                    socket.send(event.data);
                }
            };
            
            mediaRecorder.start(250);
        };

        socket.onmessage = (event) => {
            if (event.data instanceof Blob || event.data instanceof ArrayBuffer) {
                audioQueue.push(event.data);
                if (!isPlaying) {
                    playNextAudioChunk();
                }
            }
        };

        socket.onerror = (error) => {
            console.error('WebSocket Error:', error);
            statusDiv.textContent = 'Connection error. Please refresh.';
            stopConversation();
        };

        socket.onclose = () => {
            console.log('WebSocket connection closed.');
            if (isConversationActive) {
                stopConversation();
            }
        };

    } catch (error) {
        console.error('Error starting conversation:', error);
        statusDiv.textContent = 'Could not access your microphone.';
    }
};

const stopConversation = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
    }
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
    }
    
    audioQueue = [];
    isPlaying = false;
    if (audioContext) {
        audioContext.close().then(() => audioContext = null);
    }
    
    isConversationActive = false;
    statusDiv.textContent = 'Click the button to start the conversation';
    toggleButton.textContent = 'Start Conversation';
    toggleButton.classList.remove('active');
};

const playNextAudioChunk = async () => {
    if (audioQueue.length === 0) {
        isPlaying = false;
        return;
    }

    isPlaying = true;
    const audioData = audioQueue.shift();
    
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    const arrayBuffer = await (audioData instanceof Blob ? audioData.arrayBuffer() : audioData);
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.onended = playNextAudioChunk;
    source.start();
};

toggleButton.addEventListener('click', () => {
    if (!isConversationActive) {
        startConversation();
    } else {
        stopConversation();
    }
});