"use client";

import { useEffect } from "react";
import { auth } from "@/lib/firebase";

// Known extension ID (user-confirmed)
const EXTENSION_ID = "eegcjohemdmfmpchimblddocnhpfkgce";

export default function ExtensionTokenBridge() {
  useEffect(() => {
    const handler = async (event: MessageEvent) => {
      try {
        // Only respond to our own window events
        if (event.source !== window) return;
        const data = event.data as any;
        if (!data || data.type !== "DESAINR_EXTENSION_GET_TOKEN") return;

        // Optional: Validate a shared marker to reduce accidental collisions
        if (data.from !== "desainr-extension") return;

        // Note: event.origin equals current page origin. We can't verify chrome extension origin here.
        // We reduce exposure by only running on our app pages and requiring the custom marker above.

        const user = auth?.currentUser || null;
        if (!user) {
          window.postMessage(
            { type: "DESAINR_WEBAPP_TOKEN", ok: false, error: "not_signed_in" },
            window.origin
          );
          return;
        }
        try {
          const idToken = await user.getIdToken(false);
          window.postMessage(
            { type: "DESAINR_WEBAPP_TOKEN", ok: true, idToken },
            window.origin
          );
        } catch (e: any) {
          window.postMessage(
            { type: "DESAINR_WEBAPP_TOKEN", ok: false, error: e?.message || "token_error" },
            window.origin
          );
        }
      } catch {
        // ignore
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  return null;
}
