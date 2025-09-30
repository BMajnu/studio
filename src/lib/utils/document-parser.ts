/**
 * Utility functions for parsing document files (PDF, DOCX, DOC)
 * Extracts text content from various document formats for AI processing
 */

import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

/**
 * Extract text content from a PDF file
 * @param file - PDF file to parse
 * @returns Extracted text content
 */
export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    
    // Extract text from each page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n\n';
    }
    
    return fullText.trim();
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error(`Failed to extract text from PDF: ${(error as Error).message}`);
  }
}

/**
 * Extract text content from a DOCX file
 * @param file - DOCX file to parse
 * @returns Extracted text content
 */
export async function extractTextFromDOCX(file: File): Promise<string> {
  try {
    // Dynamic import to avoid bundling issues
    const mammoth = await import('mammoth');
    
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    
    return result.value.trim();
  } catch (error) {
    console.error('Error extracting text from DOCX:', error);
    throw new Error(`Failed to extract text from DOCX: ${(error as Error).message}`);
  }
}

/**
 * Extract text content from a DOC file (legacy Word format)
 * Note: DOC format is more complex and may not be fully supported
 * @param file - DOC file to parse
 * @returns Extracted text content (may be partial)
 */
export async function extractTextFromDOC(file: File): Promise<string> {
  try {
    // For legacy DOC files, we'll try to extract as plain text
    // This is a best-effort approach and may not work for all DOC files
    const arrayBuffer = await file.arrayBuffer();
    const decoder = new TextDecoder('utf-8', { fatal: false });
    const text = decoder.decode(arrayBuffer);
    
    // Clean up the text by removing control characters and binary data
    const cleanText = text
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '') // Remove control chars
      .replace(/[^\x20-\x7E\s\u00A0-\uFFFF]/g, '') // Keep printable chars
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
    
    if (cleanText.length < 50) {
      throw new Error('Extracted text too short - file may be corrupted or binary');
    }
    
    return cleanText;
  } catch (error) {
    console.error('Error extracting text from DOC:', error);
    throw new Error(`Failed to extract text from DOC: ${(error as Error).message}. Consider converting to DOCX format.`);
  }
}

/**
 * Extract text content from a document file based on its type
 * Supports PDF, DOCX, DOC, TXT, and other text formats
 * @param file - Document file to parse
 * @returns Extracted text content
 */
export async function extractTextFromDocument(file: File): Promise<string> {
  const fileType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();
  
  // Handle by MIME type
  if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
    return extractTextFromPDF(file);
  }
  
  if (
    fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    fileName.endsWith('.docx')
  ) {
    return extractTextFromDOCX(file);
  }
  
  if (fileType === 'application/msword' || fileName.endsWith('.doc')) {
    return extractTextFromDOC(file);
  }
  
  // Handle plain text files
  if (
    fileType === 'text/plain' ||
    fileType === 'text/markdown' ||
    fileType === 'application/json' ||
    fileName.endsWith('.txt') ||
    fileName.endsWith('.md') ||
    fileName.endsWith('.json')
  ) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }
  
  throw new Error(`Unsupported document type: ${fileType || 'unknown'} (${fileName})`);
}

/**
 * Check if a file is a supported document type
 * @param file - File to check
 * @returns True if file is a supported document type
 */
export function isSupportedDocumentType(file: File): boolean {
  const fileType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();
  
  const supportedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'text/plain',
    'text/markdown',
    'application/json',
  ];
  
  const supportedExtensions = ['.pdf', '.docx', '.doc', '.txt', '.md', '.json'];
  
  return (
    supportedTypes.includes(fileType) ||
    supportedExtensions.some(ext => fileName.endsWith(ext))
  );
}
