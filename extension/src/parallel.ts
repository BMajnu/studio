let enabled = false;
let observer: MutationObserver | null = null;

export function isParallelModeEnabled() { return enabled; }

export async function enableParallelMode(targetLang: string) {
  if (enabled) return;
  enabled = true;
  try {
    const { translatePageAll } = await import('./pageTranslate');
    await translatePageAll(targetLang);
  } catch {}
  // Optional: Observe DOM for new nodes; minimal stub does not live-translate to avoid heavy workloads.
  try {
    observer = new MutationObserver(() => {});
    observer.observe(document.body, { childList: true, subtree: true });
  } catch {}
}

export function disableParallelMode() {
  enabled = false;
  try { observer?.disconnect(); } catch {}
  observer = null;
}
