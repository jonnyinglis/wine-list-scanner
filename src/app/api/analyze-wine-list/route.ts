import { createWorker } from 'tesseract.js';
import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key is not configured');
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }

    const { image, tasteProfile } = await request.json();

    if (!image || !tasteProfile) {
      return NextResponse.json(
        { error: 'Missing required fields: image and tasteProfile' },
        { status: 400 }
      );
    }

    // Convert base64 image to buffer
    try {
      const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');

      // Perform OCR on the image
      console.log('Starting OCR processing...');
      const worker = await createWorker('eng');
      const { data: { text } } = await worker.recognize(buffer);
      await worker.terminate();
      console.log('OCR text extracted:', text.substring(0, 100) + '...');

      if (!text.trim()) {
        return NextResponse.json(
          { error: 'Could not extract text from the image. Please ensure the image is clear and contains text.' },
          { status: 400 }
        );
      }

      // Use GPT to analyze the wine list and provide recommendations
      console.log('Sending to OpenAI...');
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
      console.error('Error processing image:', error);
      return NextResponse.json(
        { error: 'Error processing image. Please ensure you uploaded a valid image file.' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
} 