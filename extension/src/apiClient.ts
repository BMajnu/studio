type ApiResponse = { ok: boolean; status: number; json?: any; error?: string };

async function getIdToken(): Promise<string | undefined> {
  try {
    const items = await new Promise<any>((resolve) => {
      try {
        chrome.storage?.local.get?.(['desainr.idToken'], (it: any) => resolve(it));
      } catch {
        resolve({});
      }
    });
    return items?.['desainr.idToken'];
  } catch {
    return undefined;
  }
}

async function callApi(path: string, body: any): Promise<ApiResponse> {
  const token = await getIdToken();
  return await new Promise<ApiResponse>((resolve) => {
    try {
      chrome.runtime.sendMessage({ type: 'API_CALL', path, body, token }, (resp: any) => {
        if (!resp) {
          const err = chrome.runtime.lastError?.message || 'no response';
          resolve({ ok: false, status: 0, error: err });
        } else {
          resolve(resp as ApiResponse);
        }
      });
    } catch (e: any) {
      resolve({ ok: false, status: 0, error: e?.message || String(e) });
    }
  });
}

export function rewrite(payload: { selection: string; url: string; task: string; modelId?: string; thinkingMode?: string; }) {
  return callApi('rewrite', payload);
}

export function translateChunks(payload: { selection: string; url: string; targetLang: string; modelId?: string; thinkingMode?: string; }) {
  return callApi('translateChunks', payload);
}

export function actions(payload: { selection: string; clientMessage: string; customInstruction: string; modelId?: string; thinkingMode?: string; }) {
  return callApi('actions', payload);
}

export function translate(payload: { text: string; modelId?: string; thinkingMode?: string; }) {
  return callApi('translate', payload);
}

export function analyzePage(payload: { url: string; title: string; }) {
  return callApi('analyze', payload);
}

export function saveMemo(payload: any) {
  return callApi('saveMemo', payload);
}
