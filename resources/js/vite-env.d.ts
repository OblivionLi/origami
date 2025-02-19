interface ImportMetaEnv {
    readonly VITE_NODE_ENV: string;
    readonly VITE_PORT: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
