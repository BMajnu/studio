
// src/lib/services/drive-service.ts
'use client';

const DRIVE_API_BASE_URL = 'https://www.googleapis.com/drive/v3';
const DRIVE_UPLOAD_API_BASE_URL = 'https://www.googleapis.com/upload/drive/v3';
const APP_DATA_FOLDER_NAME = 'DesAInR_AppData'; // Name of the folder in appDataFolder

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
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

  try {
    // 1. Check if the folder already exists in appDataFolder
    const listResponse = await fetch(`${DRIVE_API_BASE_URL}/files?spaces=appDataFolder&q=name='${APP_DATA_FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder'&fields=files(id,name)`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!listResponse.ok) {
      let errorDetailsMessage = "Failed to get error details from Drive API.";
      try {
        const errorData = await listResponse.json();
        errorDetailsMessage = JSON.stringify(errorData);
      } catch (e) {
        try {
          errorDetailsMessage = await listResponse.text();
        } catch (textError) {
          // errorDetailsMessage remains the default
        }
      }
      console.error('DriveService: Error listing appDataFolder content:', listResponse.status, listResponse.statusText, errorDetailsMessage);
      throw new Error(`Failed to list appDataFolder content. Status: ${listResponse.status} ${listResponse.statusText}. Details: ${errorDetailsMessage}`);
    }

    const listResult = await listResponse.json();

    if (listResult.files && listResult.files.length > 0) {
      console.log(`DriveService: App folder '${APP_DATA_FOLDER_NAME}' found with ID: ${listResult.files[0].id}`);
      return listResult.files[0].id;
    }

    // 2. If not, create the folder in appDataFolder
    console.log(`DriveService: App folder '${APP_DATA_FOLDER_NAME}' not found. Creating...`);
    const createFolderResponse = await fetch(`${DRIVE_API_BASE_URL}/files`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: APP_DATA_FOLDER_NAME,
        mimeType: 'application/vnd.google-apps.folder',
        parents: ['appDataFolder'], // Crucial for placing it in the appDataFolder
      }),
    });

    if (!createFolderResponse.ok) {
      let errorDetailsMessage = "Failed to get error details from Drive API.";
      try {
        const errorData = await createFolderResponse.json();
        errorDetailsMessage = JSON.stringify(errorData);
      } catch (e) {
         try {
            errorDetailsMessage = await createFolderResponse.text();
        } catch (textError) {
            // errorDetailsMessage remains the default
        }
      }
      console.error('DriveService: Error creating app folder:', createFolderResponse.status, createFolderResponse.statusText, errorDetailsMessage);
      throw new Error(`Failed to create app folder. Status: ${createFolderResponse.status} ${createFolderResponse.statusText}. Details: ${errorDetailsMessage}`);
    }

    const createdFolder: DriveFile = await createFolderResponse.json();
    console.log(`DriveService: App folder '${APP_DATA_FOLDER_NAME}' created successfully with ID: ${createdFolder.id}`);
    return createdFolder.id;

  } catch (error) {
    console.error('DriveService: Exception in ensureAppFolderExists:', error);
    return null;
  }
}


/**
 * Saves or updates a session JSON file in the specified Google Drive folder.
 * @param accessToken Google OAuth2 access token.
 * @param appFolderId The ID of the folder (ideally the appDataFolder) where the session should be saved.
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
  if (!accessToken || !appFolderId || !sessionId || !sessionData) {
    console.error('DriveService: saveSessionToDrive called with missing parameters. Token or folder ID might be null.');
    return null;
  }

  const fileName = `session_${sessionId}.json`;
  
  try {
    // Check if the file already exists to decide between create or update
    const listResponse = await fetch(`${DRIVE_API_BASE_URL}/files?spaces=appDataFolder&q=name='${fileName}' and '${appFolderId}' in parents and trashed=false&fields=files(id)`, {
        headers: { 'Authorization': `Bearer ${accessToken}` },
    });

    if (!listResponse.ok) {
        let errorDetailsMessage = "Failed to get error details from Drive API when checking for existing file.";
        try {
            const errorData = await listResponse.json();
            errorDetailsMessage = JSON.stringify(errorData);
        } catch (e) {
            try {
                errorDetailsMessage = await listResponse.text();
            } catch (textError) { /* Gulp */ }
        }
        console.error('DriveService: Error checking for existing session file:', listResponse.status, listResponse.statusText, errorDetailsMessage);
        throw new Error(`Failed to check for existing session file. Status: ${listResponse.status} ${listResponse.statusText}. Details: ${errorDetailsMessage}`);
    }
    const listResult = await listResponse.json();
    const existingFileId = listResult.files && listResult.files.length > 0 ? listResult.files[0].id : null;

    const content = JSON.stringify(sessionData);
    const blob = new Blob([content], { type: 'application/json' });

    let url = `${DRIVE_UPLOAD_API_BASE_URL}/files?uploadType=multipart`;
    let method = 'POST';

    const fileMetadataForUpload: any = {
        name: fileName,
        mimeType: 'application/json',
    };
    if (!existingFileId) {
        fileMetadataForUpload.parents = [appFolderId];
    }

    const formData = new FormData();
    formData.append('metadata', new Blob([JSON.stringify(fileMetadataForUpload)], { type: 'application/json' }));
    formData.append('file', blob);

    if (existingFileId) {
      url = `${DRIVE_UPLOAD_API_BASE_URL}/files/${existingFileId}?uploadType=multipart`;
      method = 'PATCH';
      console.log(`DriveService: Attempting to update existing session file ${fileName} (ID: ${existingFileId}) in Drive.`);
    } else {
      console.log(`DriveService: Attempting to create new session file ${fileName} in Drive.`);
    }
    
    let response: Response;
    try {
      response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          // 'Content-Type' is automatically set by browser for FormData
        },
        body: formData,
      });
    } catch (fetchError: any) {
      // This catch block is specifically for "TypeError: Failed to fetch" or other direct fetch errors
      console.error(`DriveService: fetch() to ${url} (method: ${method}) failed directly. This is often a network, CORS, or browser extension issue. Error:`, fetchError.message, fetchError);
      throw new Error(`Network error during Drive API call (${method} ${url}): ${fetchError.message}`);
    }

    if (!response.ok) {
      let errorDetailsMessage = `Failed to get error details from Drive API during ${existingFileId ? 'update' : 'creation'}.`;
      try {
        const errorData = await response.json();
        errorDetailsMessage = JSON.stringify(errorData);
      } catch (e) {
         try {
            errorDetailsMessage = await response.text();
        } catch (textError) { /* Gulp */ }
      }
      console.error(`DriveService: Error ${existingFileId ? 'updating' : 'creating'} session file ${fileName} in Drive:`, response.status, response.statusText, errorDetailsMessage);
      throw new Error(`Failed to ${existingFileId ? 'update' : 'create'} session file in Drive. Status: ${response.status} ${response.statusText}. Details: ${errorDetailsMessage}`);
    }

    const savedFile: DriveFile = await response.json();
    console.log(`DriveService: Session file ${fileName} ${existingFileId ? 'updated' : 'created'} successfully in Drive. ID: ${savedFile.id}`);
    return savedFile;

  } catch (error: any) { 
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`DriveService: Overall exception in saveSessionToDrive for ${fileName}:`, errorMessage, error);
    return null;
  }
}

// Placeholder for future functions
// export async function listSessionsFromDrive(accessToken: string, appFolderId: string): Promise<DriveFile[] | null> { ... }
// export async function getSessionFromDrive(accessToken: string, fileId: string): Promise<any | null> { ... }
// export async function deleteSessionFromDrive(accessToken: string, fileId: string): Promise<boolean> { ... }
// export async function uploadGeneralFileToDrive(accessToken: string, appFolderId: string, file: File, desiredName?: string): Promise<DriveFile | null> { ... }
    