require('dotenv').config();
const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

wss.on('connection', async (ws) => {
    console.log('Client connected');

    try {
        const live = await genAI.getGenerativeModel({
            model: 'gemini-2.5-flash-preview-native-audio-dialog',
            systemInstruction: "You are a friendly and helpful assistant for Revolt Motors. Your knowledge is strictly limited to Revolt Motors' products, services, and company information. Do not answer questions about any other topic. If a user asks about something else, politely decline and steer the conversation back to Revolt Motors.",
        }).startLive();

        ws.on('message', (message) => {
            live.send(message);
        });
        
        live.addEventListener('message', (event) => {
            if (event.audio) {
                const audioBuffer = Buffer.from(event.audio.audio, 'base64');
                ws.send(audioBuffer);
            }
        });

        live.addEventListener('error', (event) => {
            console.error('Gemini API Error:', event.error.message);
            ws.close(1011, event.error.message);
        });
        
        ws.on('close', () => {
            console.log('Client disconnected');
            live.close();
        });

    } catch (error) {
        console.error('Failed to start Gemini Live session:', error);
        ws.close(1011, 'Failed to initialize AI session.');
    }
});

server.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
});