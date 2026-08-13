interface ImportMetaEnv {
  readonly VITE_STORAGE_SECRET_KEY: string;
  readonly VITE_GOOGLE_CLIENT_ID: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
