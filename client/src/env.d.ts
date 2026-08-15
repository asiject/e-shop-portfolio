interface ImportMetaEnv {
  readonly VITE_STORAGE_SECRET_KEY: string;
  readonly VITE_GOOGLE_CLIENT_ID: string;
  /** true/false. 미설정 시 DEV에서만 데모 로그인 버튼 표시 */
  readonly VITE_ENABLE_DEMO_LOGIN?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
