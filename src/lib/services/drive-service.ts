
// src/lib/services/drive-service.ts
'use client';

import type { ChatSession } from '@/lib/types'; // Assuming ChatSession is defined

const DRIVE_API_BASE_URL = 'https://www.googleapis.com/drive/v3';
const DRIVE_UPLOAD_API_BASE_URL = 'https://www.googleapis.com/upload/drive/v3';
const APP_DATA_FOLDER_NAME = 'DesAInR_AppData'; // Name of the folder in appDataFolder

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime?: string; // Useful for sync logic
  // Add other relevant fields if needed
}

/**
 * Ensures the application-specific folder exists in the user's Google Drive appDataFolder.
 * Creates it if it doesn't exist.
 * @param accessToken Google OAuth2 access token.
 * @returns Promise resolving to the ID of the appDataFolder.
 */
export async function ensureAppFolderExists(accessToken: string): Promise<string | null> {
  if (!accessToken) {
    console.error('DriveService: ensureAppFolderExists called without an access token.');
    return null;
  }
  const functionName = "ensureAppFolderExists";

  try {
    console.log(`DriveService (${functionName}): Checking for app folder '${APP_DATA_FOLDER_NAME}'...`);
    const listResponse = await fetch(`${DRIVE_API_BASE_URL}/files?spaces=appDataFolder&q=name='${APP_DATA_FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder'&fields=files(id,name)`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!listResponse.ok) {
      let errorDetailsMessage = `Status: ${listResponse.status} ${listResponse.statusText}.`;
      try {
        const errorData = await listResponse.json();
        errorDetailsMessage += ` Body: ${JSON.stringify(errorData)}`;
      } catch (e) {
        try {
          const textError = await listResponse.text();
          errorDetailsMessage += ` Body: ${textError}`;
        } catch (finalError) {
          errorDetailsMessage += " Could not parse error body."
        }
      }
      console.error(`DriveService (${functionName}): Error listing appDataFolder content. ${errorDetailsMessage}`);
      throw new Error(`Failed to list appDataFolder content. ${errorDetailsMessage}`);
    }

    const listResult = await listResponse.json();

    if (listResult.files && listResult.files.length > 0) {
      console.log(`DriveService (${functionName}): App folder '${APP_DATA_FOLDER_NAME}' found with ID: ${listResult.files[0].id}`);
      return listResult.files[0].id;
    }

    console.log(`DriveService (${functionName}): App folder '${APP_DATA_FOLDER_NAME}' not found. Creating...`);
    const createFolderResponse = await fetch(`${DRIVE_API_BASE_URL}/files`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: APP_DATA_FOLDER_NAME,
        mimeType: 'application/vnd.google-apps.folder',
        parents: ['appDataFolder'],
      }),
    });

    if (!createFolderResponse.ok) {
      let errorDetailsMessage = `Status: ${createFolderResponse.status} ${createFolderResponse.statusText}.`;
      try {
        const errorData = await createFolderResponse.json();
        errorDetailsMessage += ` Body: ${JSON.stringify(errorData)}`;
      } catch (e) {
        try {
          const textError = await createFolderResponse.text();
          errorDetailsMessage += ` Body: ${textError}`;
        } catch (finalError) {
          errorDetailsMessage += " Could not parse error body."
        }
      }
      console.error(`DriveService (${functionName}): Error creating app folder. ${errorDetailsMessage}`);
      throw new Error(`Failed to create app folder. ${errorDetailsMessage}`);
    }

    const createdFolder: DriveFile = await createFolderResponse.json();
    console.log(`DriveService (${functionName}): App folder '${APP_DATA_FOLDER_NAME}' created successfully with ID: ${createdFolder.id}`);
    return createdFolder.id;

  } catch (error: any) {
    console.error(`DriveService (${functionName}): General exception:`, error.message, error);
    return null;
  }
}


/**
 * Saves or updates a session JSON file in the specified Google Drive folder.
 * @param accessToken Google OAuth2 access token.
 * @param appFolderId The ID of the folder where the session should be saved.
 * @param sessionId The ID of the chat session.
 * @param sessionData The chat session data object to save.
 * @returns Promise resolving to the DriveFile object if successful, or null otherwise.
 */
export async function saveSessionToDrive(
  accessToken: string,
  appFolderId: string,
  sessionId: string,
  sessionData: any
): Promise<DriveFile | null> {
  const functionName = "saveSessionToDrive";
  if (!accessToken || !appFolderId || !sessionId || !sessionData) {
    console.error(`DriveService (${functionName}): Called with missing parameters. Token, folderId, sessionId, or sessionData might be null/undefined.`);
    return null;
  }

  const fileName = `session_${sessionId}.json`;
  
  try {
    console.log(`DriveService (${functionName}): Checking for existing file '${fileName}' in folder '${appFolderId}'.`);
    const listResponse = await fetch(`${DRIVE_API_BASE_URL}/files?spaces=appDataFolder&q=name='${fileName}' and '${appFolderId}' in parents and trashed=false&fields=files(id)`, {
        headers: { 'Authorization': `Bearer ${accessToken}` },
    });

    if (!listResponse.ok) {
        let errorDetailsMessage = `Status: ${listResponse.status} ${listResponse.statusText}.`;
        try { const errorData = await listResponse.json(); errorDetailsMessage += ` Body: ${JSON.stringify(errorData)}`; }
        catch (e) { try { const textError = await listResponse.text(); errorDetailsMessage += ` Body: ${textError}`; } catch (fe) {errorDetailsMessage += " Could not parse error body."} }
        console.error(`DriveService (${functionName}): Error checking for existing session file. ${errorDetailsMessage}`);
        throw new Error(`Failed to check for existing session file. ${errorDetailsMessage}`);
    }
    const listResult = await listResponse.json();
    const existingFileId = listResult.files && listResult.files.length > 0 ? listResult.files[0].id : null;

    const content = JSON.stringify(sessionData);
    const blob = new Blob([content], { type: 'application/json' });

    const fileMetadataForUpload: any = {
        name: fileName,
        mimeType: 'application/json',
    };
    // Only specify parents for new file creation, not for updates.
    if (!existingFileId) {
        fileMetadataForUpload.parents = [appFolderId];
    }

    const formData = new FormData();
    formData.append('metadata', new Blob([JSON.stringify(fileMetadataForUpload)], { type: 'application/json' }));
    formData.append('file', blob);
    
    let url: string;
    let method: string;

    if (existingFileId) {
      url = `${DRIVE_UPLOAD_API_BASE_URL}/files/${existingFileId}?uploadType=multipart`;
      method = 'PATCH';
      console.log(`DriveService (${functionName}): Attempting to update existing session file ${fileName} (ID: ${existingFileId}) in Drive.`);
    } else {
      url = `${DRIVE_UPLOAD_API_BASE_URL}/files?uploadType=multipart`;
      method = 'POST';
      console.log(`DriveService (${functionName}): Attempting to create new session file ${fileName} in Drive folder ${appFolderId}.`);
    }
    
    let response: Response;
    try {
      response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
      });
    } catch (fetchError: any) {
      console.error(`DriveService (${functionName}): fetch() to ${url} (method: ${method}) failed directly. This is often a network, CORS, or browser extension issue. Error:`, fetchError.message, fetchError);
      throw new Error(`Network error during Drive API call (${method} ${url}): ${fetchError.message}`);
    }

    if (!response.ok) {
      let errorDetailsMessage = `Status: ${response.status} ${response.statusText}.`;
      try { const errorData = await response.json(); errorDetailsMessage += ` Body: ${JSON.stringify(errorData)}`; }
      catch (e) { try { const textError = await response.text(); errorDetailsMessage += ` Body: ${textError}`; } catch (fe) {errorDetailsMessage += " Could not parse error body."} }
      console.error(`DriveService (${functionName}): Error ${existingFileId ? 'updating' : 'creating'} session file ${fileName}. ${errorDetailsMessage}`);
      throw new Error(`Failed to ${existingFileId ? 'update' : 'create'} session file in Drive. ${errorDetailsMessage}`);
    }

    const savedFile: DriveFile = await response.json();
    console.log(`DriveService (${functionName}): Session file ${fileName} ${existingFileId ? 'updated' : 'created'} successfully in Drive. ID: ${savedFile.id}`);
    return savedFile;

  } catch (error: any) { 
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`DriveService (${functionName}): Overall exception for ${fileName}:`, errorMessage, error);
    return null;
  }
}


/**
 * Lists all session files (session_*.json) from the app's dedicated folder on Google Drive.
 * @param accessToken Google OAuth2 access token.
 * @param appFolderId The ID of the app's folder on Google Drive.
 * @returns Promise resolving to an array of DriveFile objects or null on error.
 */
export async function listSessionFilesFromDrive(accessToken: string, appFolderId: string): Promise<DriveFile[] | null> {
  const functionName = "listSessionFilesFromDrive";
  if (!accessToken || !appFolderId) {
    console.error(`DriveService (${functionName}): Missing accessToken or appFolderId.`);
    return null;
  }

  console.log(`DriveService (${functionName}): Listing session files from folder ID ${appFolderId}...`);
  const query = `'${appFolderId}' in parents and mimeType='application/json' and name contains 'session_' and trashed=false`;
  const fields = "files(id,name,mimeType,modifiedTime)"; // Add modifiedTime
  const url = `${DRIVE_API_BASE_URL}/files?spaces=appDataFolder&q=${encodeURIComponent(query)}&fields=${encodeURIComponent(fields)}`;

  try {
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      let errorDetailsMessage = `Status: ${response.status} ${response.statusText}.`;
      try { const errorData = await response.json(); errorDetailsMessage += ` Body: ${JSON.stringify(errorData)}`; }
      catch (e) { try { const textError = await response.text(); errorDetailsMessage += ` Body: ${textError}`; } catch (fe) {errorDetailsMessage += " Could not parse error body."} }
      console.error(`DriveService (${functionName}): Error listing files. ${errorDetailsMessage}`);
      throw new Error(`Failed to list files from Drive. ${errorDetailsMessage}`);
    }
    const result = await response.json();
    console.log(`DriveService (${functionName}): Found ${result.files?.length || 0} session files.`);
    return result.files as DriveFile[];
  } catch (error: any) {
    console.error(`DriveService (${functionName}): General exception:`, error.message, error);
    return null;
  }
}

/**
 * Fetches a specific session file content from Google Drive by its file ID.
 * @param accessToken Google OAuth2 access token.
 * @param fileId The Drive ID of the session file.
 * @returns Promise resolving to the parsed ChatSession object or null on error.
 */
export async function getSessionFromDrive(accessToken: string, fileId: string): Promise<ChatSession | null> {
  const functionName = "getSessionFromDrive";
  if (!accessToken || !fileId) {
    console.error(`DriveService (${functionName}): Missing accessToken or fileId.`);
    return null;
  }

  console.log(`DriveService (${functionName}): Fetching session file with ID ${fileId}...`);
  const url = `${DRIVE_API_BASE_URL}/files/${fileId}?alt=media&spaces=appDataFolder`;

  try {
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      let errorDetailsMessage = `Status: ${response.status} ${response.statusText}.`;
      try { const errorData = await response.json(); errorDetailsMessage += ` Body: ${JSON.stringify(errorData)}`; } // Less likely for alt=media to return JSON error body
      catch (e) { try { const textError = await response.text(); errorDetailsMessage += ` Body: ${textError}`; } catch (fe) {errorDetailsMessage += " Could not parse error body."} }
      console.error(`DriveService (${functionName}): Error fetching file content for ${fileId}. ${errorDetailsMessage}`);
      throw new Error(`Failed to fetch file content from Drive for ${fileId}. ${errorDetailsMessage}`);
    }
    const sessionData = await response.json();
    console.log(`DriveService (${functionName}): Successfully fetched and parsed session file ${fileId}.`);
    return sessionData as ChatSession;
  } catch (error: any) {
    console.error(`DriveService (${functionName}): General exception for file ${fileId}:`, error.message, error);
    return null;
  }
}

// Placeholder for future functions
// export async function deleteSessionFromDrive(accessToken: string, fileId: string): Promise<boolean> { ... }
// export async function uploadGeneralFileToDrive(accessToken: string, appFolderId: string, file: File, desiredName?: string): Promise<DriveFile | null> { ... }

