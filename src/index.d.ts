export interface User {
    apiKey: string;
}
export interface Env {
    CREDITS?: KVNamespace;
    CACHE?: KVNamespace;
    SERVER_URL: string;
    SERVER_AUTH_KEY: string;
    ADMIN_KEY: string;
    ENVIRONMENT: string;
}
declare const _default: {
    fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map