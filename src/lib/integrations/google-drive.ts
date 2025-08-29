/**
 * Google Drive integration utilities for client-side uploads using an OAuth access token.
 * Requires googleAccessToken from AuthContext (Google sign-in with drive.file scope).
 */

export interface DriveFileMeta {
  id: string;
  name?: string;
  webViewLink?: string;
  webContentLink?: string;
}

const DRIVE_API_BASE = 'https://www.googleapis.com/drive/v3';
const DRIVE_UPLOAD_URL = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink,webContentLink';

/**
 * Ensure there is a folder with the given name for this app, returning its ID.
 * With drive.file scope the app can list only files/folders it created.
 */
export async function ensureAppFolder(accessToken: string, folderName = 'DesAInR') : Promise<string> {
  // Try to find existing folder
  const q = encodeURIComponent(`name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`);
  const listUrl = `${DRIVE_API_BASE}/files?q=${q}&fields=files(id,name)`;
  const headers = { Authorization: `Bearer ${accessToken}` } as HeadersInit;

  const listResp = await fetch(listUrl, { headers });
  if (listResp.ok) {
    const data = await listResp.json();
    if (Array.isArray(data.files) && data.files.length > 0) {
      return data.files[0].id as string;
    }
  }

  // Create new folder
  const createResp = await fetch(`${DRIVE_API_BASE}/files?fields=id,name`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify({
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
    }),
  });
  if (!createResp.ok) {
    const msg = await createResp.text();
    throw new Error(`Drive folder create failed: ${createResp.status} ${msg}`);
  }
  const created = await createResp.json();
  return created.id as string;
}

/**
 * Ensure folder but cache the folderId in localStorage to avoid repeated list/create calls.
 * Cache key: `drive_folder_${folderName}`
 */
export async function ensureAppFolderCached(accessToken: string, folderName = 'DesAInR'): Promise<string> {
  try {
    const cacheKey = `drive_folder_${folderName}`;
    const cached = typeof window !== 'undefined' ? localStorage.getItem(cacheKey) : null;
    if (cached) {
      // Validate the cached ID belongs to current account and exists
      try {
        const headers = { Authorization: `Bearer ${accessToken}` } as HeadersInit;
        const check = await fetch(`${DRIVE_API_BASE}/files/${cached}?fields=id`, { headers });
        if (check.ok) return cached;
        // Invalidate bad cache
        if (typeof window !== 'undefined') {
          localStorage.removeItem(cacheKey);
          try {
            if (localStorage.getItem('debugImages') === '1') {
              console.warn('[Images][Drive] invalid folder cache, removed', { cached });
            }
          } catch {}
        }
      } catch {}
    }
  } catch {}
  const id = await ensureAppFolder(accessToken, folderName);
  try {
    if (typeof window !== 'undefined') localStorage.setItem(`drive_folder_${folderName}`, id);
  } catch {}
  return id;
}

function parseDataUri(dataUri: string): { mimeType: string; base64: string } {
  const match = dataUri.match(/^data:(.*?);base64,(.*)$/);
  if (!match) throw new Error('Invalid data URI format');
  return { mimeType: match[1] || 'application/octet-stream', base64: match[2] };
}

function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

/**
 * Upload a data URI image to Google Drive under the optional folderId.
 */
export async function uploadDataUriToDrive(
  accessToken: string,
  dataUri: string,
  filename: string,
  folderId?: string,
  options?: { description?: string; appProperties?: Record<string, string | number | boolean> }
): Promise<DriveFileMeta> {
  const { mimeType, base64 } = parseDataUri(dataUri);
  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelim = `\r\n--${boundary}--`;

  const metadata: any = { name: filename, mimeType };
  if (folderId) metadata.parents = [folderId];
  if (options?.description) metadata.description = options.description;
  if (options?.appProperties) metadata.appProperties = options.appProperties as any;

  const body =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    `Content-Type: ${mimeType}\r\n` +
    'Content-Transfer-Encoding: base64\r\n\r\n' +
    base64 +
    closeDelim;

  let lastErr: Error | null = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    const resp = await fetch(DRIVE_UPLOAD_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body,
    });
    if (resp.ok) {
      const json = (await resp.json()) as DriveFileMeta;
      return json;
    }
    const msg = await resp.text();
    const status = resp.status;
    // Retry on 429 and 5xx
    if (status === 429 || status >= 500) {
      lastErr = new Error(`Drive upload failed (attempt ${attempt + 1}): ${status} ${msg}`);
      await sleep(300 * Math.pow(2, attempt));
      continue;
    } else {
      throw new Error(`Drive upload failed: ${status} ${msg}`);
    }
  }
  throw lastErr || new Error('Drive upload failed after retries');
}

/**
 * Convenience helper to upload multiple images.
 */
export type BatchUploadItem = { dataUri: string; filename: string; description?: string; appProperties?: Record<string, string | number | boolean> };
export type BatchUploadResult = { meta: DriveFileMeta; item: BatchUploadItem };

export async function uploadImagesBatch(
  accessToken: string,
  images: BatchUploadItem[],
  folderId?: string,
  concurrency: number = 4,
): Promise<BatchUploadResult[]> {
  const results: BatchUploadResult[] = [];
  let index = 0;
  const inFlight = new Set<Promise<void>>();

  async function runOne(item: BatchUploadItem) {
    const meta = await uploadDataUriToDrive(accessToken, item.dataUri, item.filename, folderId, {
      description: item.description,
      appProperties: item.appProperties,
    });
    results.push({ meta, item });
  }

  while (index < images.length || inFlight.size > 0) {
    while (index < images.length && inFlight.size < Math.max(1, concurrency)) {
      const item = images[index++];
      const p = runOne(item).catch((e) => {
        try {
          if (typeof window !== 'undefined' && localStorage.getItem('debugImages') === '1') {
            console.error('[Images][Drive] upload failed', { filename: item.filename, err: e });
          }
        } catch {}
      });
      inFlight.add(p);
      p.finally(() => inFlight.delete(p));
    }
    if (inFlight.size > 0) {
      await Promise.race(inFlight);
    }
  }
  return results;
}

// Verbose variant that also returns errors and summary counts
export type BatchUploadError = { item: BatchUploadItem; error: any };
export type BatchUploadOutcome = { results: BatchUploadResult[]; errors: BatchUploadError[]; success: number; total: number };

export async function uploadImagesBatchVerbose(
  accessToken: string,
  images: BatchUploadItem[],
  folderId?: string,
  concurrency: number = 4,
): Promise<BatchUploadOutcome> {
  const results: BatchUploadResult[] = [];
  const errors: BatchUploadError[] = [];
  let index = 0;
  const inFlight = new Set<Promise<void>>();

  async function runOne(item: BatchUploadItem) {
    try {
      const meta = await uploadDataUriToDrive(accessToken, item.dataUri, item.filename, folderId, {
        description: item.description,
        appProperties: item.appProperties,
      });
      results.push({ meta, item });
    } catch (e) {
      errors.push({ item, error: e });
      try {
        if (typeof window !== 'undefined' && localStorage.getItem('debugImages') === '1') {
          console.error('[Images][Drive] upload failed', { filename: item.filename, err: e });
        }
      } catch {}
    }
  }

  while (index < images.length || inFlight.size > 0) {
    while (index < images.length && inFlight.size < Math.max(1, concurrency)) {
      const item = images[index++];
      const p = runOne(item);
      inFlight.add(p);
      p.finally(() => inFlight.delete(p));
    }
    if (inFlight.size > 0) {
      await Promise.race(inFlight);
    }
  }

  const outcome: BatchUploadOutcome = { results, errors, success: results.length, total: images.length };
  try {
    if (typeof window !== 'undefined' && localStorage.getItem('debugImages') === '1') {
      console.debug('[Images][Drive] batch summary', { success: outcome.success, total: outcome.total, failed: outcome.total - outcome.success });
      if (errors.length) console.error('[Images][Drive] errors', errors);
    }
  } catch {}
  return outcome;
}

/**
 * List recent image files in a Drive folder (created by the app), newest first.
 */
export async function listImagesInFolder(
  accessToken: string,
  folderId: string,
  pageSize: number = 25,
): Promise<{ id: string; name: string; mimeType: string; createdTime: string; webViewLink?: string; thumbnailLink?: string; appProperties?: Record<string, any> }[]> {
  const headers = { Authorization: `Bearer ${accessToken}` } as HeadersInit;
  const q = encodeURIComponent(`'${folderId}' in parents and mimeType contains 'image/' and trashed=false`);
  const url = `${DRIVE_API_BASE}/files?q=${q}&orderBy=createdTime desc&pageSize=${pageSize}&fields=files(id,name,mimeType,createdTime,webViewLink,thumbnailLink,appProperties)`;
  const resp = await fetch(url, { headers });
  if (!resp.ok) throw new Error(`Drive list failed: ${resp.status} ${await resp.text()}`);
  const data = await resp.json();
  return (data.files || []) as any[];
}

/**
 * Download a Drive file's content and return it as a data URI.
 */
export async function downloadFileAsDataUri(accessToken: string, fileId: string): Promise<string> {
  const headers = { Authorization: `Bearer ${accessToken}` } as HeadersInit;
  const url = `${DRIVE_API_BASE}/files/${fileId}?alt=media`;
  const resp = await fetch(url, { headers });
  if (!resp.ok) throw new Error(`Drive download failed: ${resp.status} ${await resp.text()}`);
  const blob = await resp.blob();
  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1] || '');
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
  return `data:${blob.type || 'image/png'};base64,${base64}`;
}

/**
 * Convenience: fetch N recent images from Drive folder and return as data URIs with metadata.
 */
export async function fetchRecentImagesDataUrisFromDrive(
  accessToken: string,
  folderId: string,
  limit: number = 10,
): Promise<{ id: string; dataUri: string; name: string; createdTime: string; appProperties?: Record<string, any> }[]> {
  const files = await listImagesInFolder(accessToken, folderId, limit);
  const results: { id: string; dataUri: string; name: string; createdTime: string; appProperties?: Record<string, any> }[] = [];
  for (const f of files) {
    try {
      const dataUri = await downloadFileAsDataUri(accessToken, f.id);
      results.push({ id: f.id, dataUri, name: f.name, createdTime: f.createdTime, appProperties: f.appProperties });
    } catch (e) {
      console.warn('Drive download skipped for file', f.id, e);
    }
  }
  return results;
}
