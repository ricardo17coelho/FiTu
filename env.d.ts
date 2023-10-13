/// <reference types="vite/client" />
interface ImportMetaEnv {
  // see https://vitejs.dev/guide/env-and-mode.html#env-files
  // add .env variables.
  readonly VITE_URL: string;
  readonly VITE_ENVIRONMENT: string;
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_KEY: string;
  readonly VITE_FUT_DB_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
