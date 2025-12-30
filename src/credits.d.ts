export interface User {
    id: string;
    email: string;
    apiKey: string;
    credits: number;
    totalUsed: number;
    createdAt: string;
    lastUsed: string;
}
export declare class CreditManager {
    private creditsKV;
    private serverUrl;
    private serverAuthKey;
    constructor(creditsKV: any, serverUrl: string, serverAuthKey: string);
    validateAndDeductCredits(apiKey: string, service: string, cost: number): Promise<{
        valid: boolean;
        error?: string;
        userId?: string;
        remainingCredits?: number;
    }>;
    deductCredits(userId: string, apiKey: string, service: string, cost: number): Promise<void>;
    getUserCredits(apiKey: string): Promise<number | null>;
}
export declare function validateAdminKey(expectedKey: string, providedKey: string): Promise<boolean>;
//# sourceMappingURL=credits.d.ts.map