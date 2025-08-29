declare module 'firebase-admin/app' {
  export type App = any;
  export function initializeApp(options?: any): App;
  export function getApps(): App[];
  export function cert(serviceAccount: any): any;
}

declare module 'firebase-admin/auth' {
  export function getAuth(app?: any): any;
}
