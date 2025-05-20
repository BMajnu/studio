
// src/lib/services/drive-service.ts
'use client';

import type { ChatSession, DriveFile } from '@/lib/types'; 

const DRIVE_API_BASE_URL = 'https://www.googleapis.com/drive/v3';
const DRIVE_UPLOAD_API_BASE_URL = 'https://www.googleapis.com/upload/drive/v3';
const APP_DATA_FOLDER_NAME = 'DesAInR_AppData'; 


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

// Helper to find an existing Drive file by appSessionId (stored in appProperties)
async function findDriveFileByAppSessionId(accessToken: string, appFolderId: string, appSessionId: string): Promise<DriveFile | null> {
  const functionName = "findDriveFileByAppSessionId";
  const fileName = `session_${appSessionId}.json`; // Match by filename as a primary way
  const query = `name='${fileName}' and '${appFolderId}' in parents and trashed=false`;
  const fields = "files(id,name,mimeType,modifiedTime,appProperties)";
  const url = `${DRIVE_API_BASE_URL}/files?spaces=appDataFolder&q=${encodeURIComponent(query)}&fields=${encodeURIComponent(fields)}`;

  try {
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    });
    if (!response.ok) {
      // Log error but don't throw, let the caller decide if it's critical
      console.warn(`DriveService (${functionName}): Error listing files to find existing session by name '${fileName}'. Status: ${response.status}`);
      return null;
    }
    const result = await response.json();
    if (result.files && result.files.length > 0) {
      // If multiple files have the same name (shouldn't happen often with unique session IDs),
      // prefer the one with matching appProperty if available, or take the first one.
      const matchedFile = result.files.find((f: DriveFile) => f.appProperties?.appSessionId === appSessionId) || result.files[0];
      console.log(`DriveService (${functionName}): Found existing Drive file for appSessionId '${appSessionId}' by name. Drive File ID: ${matchedFile.id}`);
      return matchedFile;
    }
  } catch (error: any) {
    console.error(`DriveService (${functionName}): Exception while trying to find file by name for ${appSessionId}:`, error);
  }
  return null;
}


export async function saveSessionToDrive(
  accessToken: string,
  appFolderId: string,
  appSessionId: string, // This is the app's internal session ID
  sessionData: ChatSession
): Promise<DriveFile | null> {
  const functionName = "saveSessionToDrive";
  if (!accessToken || !appFolderId || !appSessionId || !sessionData) {
    console.error(`DriveService (${functionName}): Called with missing parameters. Token: ${!!accessToken}, FolderID: ${appFolderId}, AppSessionID: ${appSessionId}, HasData: ${!!sessionData}`);
    return null;
  }

  // The filename on Drive will include the app's session ID for easier identification.
  const fileNameOnDrive = `session_${appSessionId}.json`;
  
  try {
    console.log(`DriveService (${functionName}): Checking for existing file for appSessionId '${appSessionId}' (filename: '${fileNameOnDrive}') in folder '${appFolderId}'.`);
    const existingDriveFile = await findDriveFileByAppSessionId(accessToken, appFolderId, appSessionId);
    const existingDriveFileId = existingDriveFile?.id;

    // Ensure sessionData includes its own appSessionId and the driveFileId if known
    const dataToSave: ChatSession = {
      ...sessionData,
      id: appSessionId, // Ensure app's session ID is part of the saved data
      driveFileId: existingDriveFileId || sessionData.driveFileId, // Keep existing driveFileId or update if found
    };
    const content = JSON.stringify(dataToSave);
    const blob = new Blob([content], { type: 'application/json' });

    const fileMetadataForUpload: any = {
        name: fileNameOnDrive,
        mimeType: 'application/json',
        appProperties: { // Store app's session ID in appProperties for reliable lookup
          appSessionId: appSessionId,
        }
    };
    // Only set parents if creating a new file
    if (!existingDriveFileId) {
        fileMetadataForUpload.parents = [appFolderId];
    }

    const formData = new FormData();
    formData.append('metadata', new Blob([JSON.stringify(fileMetadataForUpload)], { type: 'application/json' }));
    formData.append('file', blob);
    
    let url: string;
    let method: string;

    if (existingDriveFileId) {
      url = `${DRIVE_UPLOAD_API_BASE_URL}/files/${existingDriveFileId}?uploadType=multipart&supportsAllDrives=true`;
      method = 'PATCH';
      console.log(`DriveService (${functionName}): Attempting to update existing session file ${fileNameOnDrive} (Drive ID: ${existingDriveFileId}) in Drive.`);
    } else {
      url = `${DRIVE_UPLOAD_API_BASE_URL}/files?uploadType=multipart&supportsAllDrives=true`;
      method = 'POST';
      console.log(`DriveService (${functionName}): Attempting to create new session file ${fileNameOnDrive} in Drive folder ${appFolderId}.`);
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
      console.error(`DriveService (${functionName}): fetch() to ${url} (method: ${method}) failed directly. Error:`, fetchError.message, fetchError);
      throw new Error(`Network error during Drive API call (${method} ${url}): ${fetchError.message}`);
    }

    if (!response.ok) {
      let errorDetailsMessage = `Status: ${response.status} ${response.statusText}.`;
      try { 
        const errorData = await response.json(); 
        errorDetailsMessage += ` Body: ${JSON.stringify(errorData)}`; 
      } catch (e) { 
        try { 
          const textError = await response.text(); 
          errorDetailsMessage += ` Body: ${textError}`; 
        } catch (fe) {
          errorDetailsMessage += " Could not parse error body."
        } 
      }
      console.error(`DriveService (${functionName}): Error ${existingDriveFileId ? 'updating' : 'creating'} session file ${fileNameOnDrive}. ${errorDetailsMessage}`);
      throw new Error(`Failed to ${existingDriveFileId ? 'update' : 'create'} session file in Drive. ${errorDetailsMessage}`);
    }

    const savedFile: DriveFile = await response.json();
    // Ensure appProperties are part of the returned file object if possible for consistency
    if (!savedFile.appProperties) {
        savedFile.appProperties = { appSessionId: appSessionId };
    }
    console.log(`DriveService (${functionName}): Session file ${fileNameOnDrive} ${existingDriveFileId ? 'updated' : 'created'} successfully in Drive. ID: ${savedFile.id}`);
    return savedFile;

  } catch (error: any) { 
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`DriveService (${functionName}): Overall exception for ${fileNameOnDrive}:`, errorMessage, error);
    return null;
  }
}


export async function listSessionFilesFromDrive(accessToken: string, appFolderId: string): Promise<DriveFile[] | null> {
  const functionName = "listSessionFilesFromDrive";
  if (!accessToken || !appFolderId) {
    console.error(`DriveService (${functionName}): Missing accessToken or appFolderId. Token: ${!!accessToken}, FolderID: ${appFolderId}`);
    return null;
  }

  console.log(`DriveService (${functionName}): Listing session files from folder ID ${appFolderId}...`);
  const query = `'${appFolderId}' in parents and mimeType='application/json' and name contains 'session_' and trashed=false`;
  // Request appProperties to get our appSessionId
  const fields = "files(id,name,mimeType,modifiedTime,appProperties)"; 
  const url = `${DRIVE_API_BASE_URL}/files?spaces=appDataFolder&q=${encodeURIComponent(query)}&fields=${encodeURIComponent(fields)}&supportsAllDrives=true`;

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

// Fetches a session using its Google Drive file ID
export async function getSessionFromDrive(accessToken: string, driveFileId: string): Promise<ChatSession | null> {
  const functionName = "getSessionFromDrive";
  if (!accessToken || !driveFileId) {
    console.error(`DriveService (${functionName}): Missing accessToken or driveFileId. Token: ${!!accessToken}, DriveFileID: ${driveFileId}`);
    return null;
  }

  console.log(`DriveService (${functionName}): Fetching session file with Drive ID ${driveFileId}...`);
  const url = `${DRIVE_API_BASE_URL}/files/${driveFileId}?alt=media&spaces=appDataFolder&supportsAllDrives=true`;

  try {
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      let errorDetailsMessage = `Status: ${response.status} ${response.statusText}.`;
      try { const errorData = await response.json(); errorDetailsMessage += ` Body: ${JSON.stringify(errorData)}`; } 
      catch (e) { try { const textError = await response.text(); errorDetailsMessage += ` Body: ${textError}`; } catch (fe) {errorDetailsMessage += " Could not parse error body."} }
      console.error(`DriveService (${functionName}): Error fetching file content for Drive ID ${driveFileId}. ${errorDetailsMessage}`);
      // Do not throw here, return null to allow fallback if desired by caller
      return null; 
    }
    const sessionData: ChatSession = await response.json();
    console.log(`DriveService (${functionName}): Successfully fetched and parsed session file with Drive ID ${driveFileId}. App Session ID: ${sessionData.id}`);
    // Ensure the session data has the driveFileId if it was fetched from Drive
    return { ...sessionData, driveFileId: driveFileId };
  } catch (error: any) {
    console.error(`DriveService (${functionName}): General exception for Drive file ID ${driveFileId}:`, error.message, error);
    return null;
  }
}

// Deletes a file using its Google Drive file ID
export async function deleteFileFromDrive(accessToken: string, driveFileId: string): Promise<boolean> {
  const functionName = "deleteFileFromDrive";
  if (!accessToken || !driveFileId) {
    console.error(`DriveService (${functionName}): Missing accessToken or driveFileId. Token: ${!!accessToken}, DriveFileID: ${driveFileId}`);
    return false;
  }

  console.log(`DriveService (${functionName}): Attempting to delete file with Drive ID ${driveFileId} from Drive...`);
  const url = `${DRIVE_API_BASE_URL}/files/${driveFileId}?supportsAllDrives=true`;

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${accessToken}` },
    });

    if (response.ok) { 
      console.log(`DriveService (${functionName}): File with Drive ID ${driveFileId} deleted successfully from Drive.`);
      return true;
    } else {
      let errorDetailsMessage = `Status: ${response.status} ${response.statusText}.`;
      try { const errorData = await response.json(); errorDetailsMessage += ` Body: ${JSON.stringify(errorData)}`; }
      catch (e) { try { const textError = await response.text(); errorDetailsMessage += ` Body: ${textError}`; } catch (fe) {errorDetailsMessage += " Could not parse error body."} }
      console.error(`DriveService (${functionName}): Error deleting file with Drive ID ${driveFileId} from Drive. ${errorDetailsMessage}`);
      return false;
    }
  } catch (error: any) {
    console.error(`DriveService (${functionName}): General exception deleting file with Drive ID ${driveFileId}:`, error.message, error);
    return false;
  }
}
