/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly OPENAI_API_KEY: string;
  readonly GPT_MODEL_NAME: string;
  readonly PORT: number;
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
