import { NextResponse } from 'next/server';
import { generateImages } from '@/ai/flows/generate-images-flow';
import type { GenerateImagesInput } from '@/ai/flows/generate-images-flow';

export async function POST(request: Request) {
  try {
    const requestData = await request.json();
    
    // Validate required fields
    if (!requestData.prompt) {
      return NextResponse.json(
        { message: 'Prompt is required' },
        { status: 400 }
      );
    }
    
    // Create input for the generateImages function
    const generateImagesInput: GenerateImagesInput = {
      prompt: requestData.prompt,
      numImages: requestData.numImages || 4,
      temperature: typeof requestData.temperature === 'number' ? requestData.temperature : 1,
      userName: requestData.userName || 'User',
      communicationStyleNotes: requestData.communicationStyleNotes || '',
      modelId: requestData.modelId,
      userApiKeys: requestData.userApiKeys,
    };
    
    // Call the generateImages function
    const result = await generateImages(generateImagesInput);

    // NOTE: Remote persistence is now handled client-side after the response to avoid Firestore
    // permission issues on unauthenticated server requests. See image-generation-panel.tsx.

    // Return the generated images
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error generating images:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to generate images' },
      { status: 500 }
    );
  }
} 