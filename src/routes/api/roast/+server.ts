import type { RequestHandler } from './$types';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { VITE_GEMINI_API_KEY } from '$env/static/private';

const genAI = new GoogleGenerativeAI(VITE_GEMINI_API_KEY);

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { imageData } = await request.json();
		if (!imageData) {
			return new Response(JSON.stringify({ error: 'No image data provided' }), { status: 400 });
		}

		const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

		const base64Data = imageData.split(',')[1];
		const imagePart = {
			inlineData: {
				data: base64Data,
				mimeType: 'image/jpeg'
			}
		};

		const prompt = 'You are a witty comedian. Write a short, funny, one-sentence roast in Hebrew about the image.';
		
		const result = await model.generateContent([prompt, imagePart]);
		const response = result.response;
		const text = response.text();

		return new Response(JSON.stringify({ roastText: text }), {
			headers: { 'Content-Type': 'application/json' }
		});

	} catch (error) {
		console.error(error);
		return new Response(JSON.stringify({ error: 'Failed to process image' }), { status: 500 });
	}
};