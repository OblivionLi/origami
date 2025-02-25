interface ImportMetaEnv {
    readonly VITE_STRIPE_KEY: string;
    readonly VITE_STRIPE_SECRET: string;
    readonly VITE_STRIPE_DESCRIPTION: string;
    readonly VITE_NODE_ENV: string;
    readonly VITE_PORT: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
