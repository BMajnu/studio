
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

// Helper to find an existing Drive file by appSessionId (filename convention)
async function findDriveFileByAppSessionId(accessToken: string, appFolderId: string, appSessionId: string): Promise<DriveFile | null> {
  const functionName = "findDriveFileByAppSessionId";
  const fileName = `session_${appSessionId}.json`;
  const query = `name='${fileName}' and '${appFolderId}' in parents and trashed=false`;
  const fields = "files(id,name,mimeType,modifiedTime,appProperties)"; // Include appProperties
  const url = `${DRIVE_API_BASE_URL}/files?spaces=appDataFolder&q=${encodeURIComponent(query)}&fields=${encodeURIComponent(fields)}&supportsAllDrives=true`;

  try {
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    });
    if (!response.ok) {
      console.warn(`DriveService (${functionName}): Error listing files to find by name '${fileName}'. Status: ${response.status}`);
      return null;
    }
    const result = await response.json();
    if (result.files && result.files.length > 0) {
      // Prefer match by appProperty if available, otherwise take first file with matching name
      const matchedFile = result.files.find((f: DriveFile) => f.appProperties?.appSessionId === appSessionId) || result.files[0];
      console.log(`DriveService (${functionName}): Found Drive file for appSessionId '${appSessionId}' by name. Drive File ID: ${matchedFile.id}`);
      return matchedFile;
    }
  } catch (error: any) {
    console.error(`DriveService (${functionName}): Exception searching for file '${fileName}':`, error);
  }
  return null;
}


export async function saveSessionToDrive(
  accessToken: string,
  appFolderId: string,
  appSessionId: string, 
  sessionData: ChatSession
): Promise<DriveFile | null> {
  const functionName = "saveSessionToDrive";
  if (!accessToken || !appFolderId || !appSessionId || !sessionData) {
    console.error(`DriveService (${functionName}): Called with missing parameters.`);
    return null;
  }

  const fileNameOnDrive = `session_${appSessionId}.json`;
  
  try {
    console.log(`DriveService (${functionName}): Checking for existing file for appSessionId '${appSessionId}' (filename: '${fileNameOnDrive}') in folder '${appFolderId}'.`);
    const existingDriveFile = await findDriveFileByAppSessionId(accessToken, appFolderId, appSessionId);
    const existingDriveFileId = existingDriveFile?.id;

    const dataToSave: ChatSession = {
      ...sessionData,
      id: appSessionId, 
      driveFileId: existingDriveFileId || sessionData.driveFileId, 
    };
    const content = JSON.stringify(dataToSave);
    const blob = new Blob([content], { type: 'application/json' });

    const fileMetadataForUpload: any = {
        name: fileNameOnDrive,
        mimeType: 'application/json',
        appProperties: { appSessionId: appSessionId }
    };
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
      console.log(`DriveService (${functionName}): Attempting to update session file ${fileNameOnDrive} (Drive ID: ${existingDriveFileId}).`);
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
      const detailedErrorMessage = `Network error or browser issue preventing request to Google Drive. Possible causes: no internet, VPN/proxy, browser extensions (ad-blockers/privacy tools), or restrictive CORS/CSP policies. Please check these and try again. Original error: ${fetchError.message || 'Failed to fetch'}`;
      console.error(`CRITICAL DriveService (${functionName}): The 'fetch' call to ${url} (method: ${method}) failed. This is often a network or browser environment issue. ${detailedErrorMessage}`, fetchError);
      throw new Error(`Google Drive request failed for ${fileNameOnDrive}: ${detailedErrorMessage}`);
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
    if (!savedFile.appProperties) {
        savedFile.appProperties = { appSessionId: appSessionId };
    }
    console.log(`DriveService (${functionName}): Session file ${fileNameOnDrive} ${existingDriveFileId ? 'updated' : 'created'} successfully in Drive. ID: ${savedFile.id}`);
    return savedFile;

  } catch (error: any) { 
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`DriveService (${functionName}): Overall exception for ${fileNameOnDrive}:`, errorMessage, error);
    // Ensure the re-thrown error message is helpful if it bubbles up to the UI
    if (errorMessage.includes("Network error") || errorMessage.includes("Failed to fetch")) {
        throw new Error(errorMessage); // Re-throw the detailed error message
    }
    throw new Error(`An unexpected error occurred while saving session ${fileNameOnDrive} to Drive: ${errorMessage}`);
  }
}


export async function listSessionFilesFromDrive(accessToken: string, appFolderId: string): Promise<DriveFile[] | null> {
  const functionName = "listSessionFilesFromDrive";
  if (!accessToken || !appFolderId) {
    console.error(`DriveService (${functionName}): Missing accessToken or appFolderId.`);
    return null;
  }

  console.log(`DriveService (${functionName}): Listing session files from folder ID ${appFolderId}...`);
  const query = `'${appFolderId}' in parents and mimeType='application/json' and name contains 'session_' and trashed=false`;
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

export async function getSessionFromDrive(accessToken: string, driveFileId: string): Promise<ChatSession | null> {
  const functionName = "getSessionFromDrive";
  if (!accessToken || !driveFileId) {
    console.error(`DriveService (${functionName}): Missing accessToken or driveFileId.`);
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
      console.error(`DriveService (${functionName}): Error fetching file content for ${driveFileId}. ${errorDetailsMessage}`);
      return null; 
    }
    const sessionData: ChatSession = await response.json();
    console.log(`DriveService (${functionName}): Successfully parsed session file with Drive ID ${driveFileId}. App Session ID: ${sessionData.id}`);
    return { ...sessionData, driveFileId: driveFileId };
  } catch (error: any) {
    console.error(`DriveService (${functionName}): General exception for Drive file ID ${driveFileId}:`, error.message, error);
    return null;
  }
}

export async function deleteFileFromDrive(accessToken: string, driveFileId: string): Promise<boolean> {
  const functionName = "deleteFileFromDrive";
  if (!accessToken || !driveFileId) {
    console.error(`DriveService (${functionName}): Missing accessToken or driveFileId.`);
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

