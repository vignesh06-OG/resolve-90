/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DECISION_API_MODE?: "live" | "replay";
  readonly VITE_DECISION_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
