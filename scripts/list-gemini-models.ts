import 'dotenv/config';
import fs from 'fs';
import path from 'path';

async function listModels() {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
        console.error('GOOGLE_GENERATIVE_AI_API_KEY is not set in .env');
        return;
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Available Models:');

        if (data.models) {
            const generationModels = data.models.filter((m: any) => m.supportedGenerationMethods.includes('generateContent'));
            const modelNames = generationModels.map((m: any) => `- ${m.name} (${m.displayName})`).join('\n');
            fs.writeFileSync(path.join(__dirname, 'gemini-models.txt'), modelNames);
            console.log('Model list written to gemini-models.txt');
        } else {
            console.log('No models found in response:', data);
        }

    } catch (error) {
        console.error('Error fetching models:', error);
    }
}

listModels();
