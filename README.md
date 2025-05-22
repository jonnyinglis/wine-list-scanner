# Wine List Scanner

A web application that helps you choose the perfect wine from a restaurant's wine list based on your taste preferences. Simply scan the wine list with your phone's camera, describe your taste preferences, and get personalized recommendations from an AI sommelier.

## Features

- Scan wine lists using your device's camera
- Real-time text extraction using OCR (Optical Character Recognition)
- AI-powered wine recommendations based on your taste profile
- Mobile-friendly interface
- Modern, responsive design

## Prerequisites

- Node.js 18+ installed
- OpenAI API key

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd wine-list-scanner
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your OpenAI API key:
```
OPENAI_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Enter your wine preferences in the taste profile text area (e.g., "I prefer full-bodied red wines with notes of dark fruits and moderate tannins").
2. Click "Start Scanning" to activate your device's camera.
3. Point the camera at the wine list.
4. Click "Capture & Analyze" when the wine list is clearly visible.
5. Wait for the AI to process the image and provide personalized wine recommendations.

## Technologies Used

- Next.js 14
- TypeScript
- Tailwind CSS
- Tesseract.js for OCR
- OpenAI GPT-4 for wine recommendations
- React Webcam for camera access

## License

MIT
