// Stub for optional @genkit-ai/firebase plugin to avoid module-not-found during bundling
// Genkit core conditionally requires this when ENABLE_FIREBASE_MONITORING === "true".
// We alias the module to this file so require() resolves without installing the package.
export function enableFirebaseTelemetry(): void {
  // no-op: telemetry via Firebase is disabled in this project
}

export default { enableFirebaseTelemetry };
