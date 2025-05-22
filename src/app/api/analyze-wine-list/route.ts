import { createWorker } from 'tesseract.js';
import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { image, tasteProfile } = await request.json();

    // Convert base64 image to buffer
    const base64Data = image.replace(/^data:image\/jpeg;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Perform OCR on the image
    const worker = await createWorker('eng');
    const { data: { text } } = await worker.recognize(buffer);
    await worker.terminate();

    // Use GPT to analyze the wine list and provide recommendations
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a professional sommelier helping customers choose wines based on their taste preferences. Analyze the wine list and the customer's taste profile to provide personalized recommendations."
        },
        {
          role: "user",
          content: `Here is a wine list:\n${text}\n\nCustomer's taste profile:\n${tasteProfile}\n\nPlease recommend the best wine choices for this customer from the list, explaining why each would suit their taste. If the wine list is unclear or seems incorrect, please mention that in your response.`
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    return NextResponse.json({
      recommendation: completion.choices[0].message.content
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Failed to process the wine list' },
      { status: 500 }
    );
  }
} 