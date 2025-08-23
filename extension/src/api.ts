import { getIdToken } from './auth';

export async function callExtensionApi(path: string, body?: any) {
  const token = await getIdToken();
  return new Promise<{ ok: boolean; status: number; json?: any; error?: string }>((resolve) => {
    chrome.runtime.sendMessage(
      { type: 'API_CALL', path, token, body },
      (resp: { ok: boolean; status: number; json?: any; error?: string }) => {
        if (!resp) return resolve({ ok: false, status: 0, error: 'No response from background' });
        resolve(resp);
      }
    );
  });
}
